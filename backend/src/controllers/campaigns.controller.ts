import { Request, Response } from 'express';
import { WildberriesService } from '../services/wildberries.service';
import { ApiResponse } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Проверка API ключа через получение баланса
 * POST /api/auth/validate
 */
export const validateToken = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const apiKey = (req as any).apiKey;
    const wbService = new WildberriesService(apiKey);

    const balance = await wbService.getBalance();

    res.json({
      success: true,
      data: balance,
      message: 'API key is valid',
    });
  }
);

/**
 * Получение баланса рекламного кабинета
 * GET /api/balance
 */
export const getBalance = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const apiKey = (req as any).apiKey;
    const wbService = new WildberriesService(apiKey);

    const balance = await wbService.getBalance();

    res.json({
      success: true,
      data: balance,
    });
  }
);

/**
 * Получение списка кампаний с метриками из fullstats
 * POST /api/campaigns/list
 */
export const getCampaignsList = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const apiKey = (req as any).apiKey;
    const { beginDate, endDate } = req.body;

    if (!beginDate || !endDate) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: 'beginDate and endDate are required',
      });
    }

    const wbService = new WildberriesService(apiKey);

    // Получаем список кампаний
    const campaigns = await wbService.getCampaigns();

    // Получаем статистику для всех кампаний
    const campaignIds = campaigns.map((c) => c.advertId);
    let fullstatsData: any[] = [];

    if (campaignIds.length > 0) {
      fullstatsData = await wbService.getFullStats(campaignIds, beginDate, endDate);
    }

    // Объединяем данные кампаний со статистикой
    const campaignsWithStats = campaigns.map((campaign) => {
      const statsData = fullstatsData.find((s) => s.advertId === campaign.advertId);
      const stats = statsData ? wbService.parseCampaignStats(statsData) : null;

      return {
        ...campaign,
        stats: stats || {
          views: 0,
          clicks: 0,
          ctr: 0,
          cpc: 0,
          sum: 0,
          orders: 0,
        },
      };
    });

    res.json({
      success: true,
      data: campaignsWithStats,
    });
  }
);

/**
 * Получение детального обзора кампании с fullstats
 * POST /api/campaigns/:id/overview
 */
export const getCampaignOverview = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const apiKey = (req as any).apiKey;
    const { id } = req.params;
    const { beginDate, endDate } = req.body;

    if (!beginDate || !endDate) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: 'beginDate and endDate are required',
      });
    }

    const wbService = new WildberriesService(apiKey);

    // Получаем fullstats для кампании
    const fullstatsData = await wbService.getFullStats(
      [parseInt(id)],
      beginDate,
      endDate
    );

    if (!fullstatsData || fullstatsData.length === 0) {
      return res.json({
        success: true,
        data: {
          views: 0,
          clicks: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
          sum: 0,
          atbs: 0,
          orders: 0,
          cr: 0,
          sum_price: 0,
          days: [],
          nms: [],
        },
      });
    }

    // Парсим данные fullstats
    const stats = wbService.parseCampaignStats(fullstatsData[0]);

    res.json({
      success: true,
      data: stats,
    });
  }
);

/**
 * Получение CPM кластеров для товара
 * POST /api/campaigns/:id/cpm-clusters
 */
export const getCpmClusters = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const apiKey = (req as any).apiKey;
    const { id } = req.params;
    const { from, to, nm_id } = req.body;

    if (!from || !to || !nm_id) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: 'from, to, and nm_id are required',
      });
    }

    const wbService = new WildberriesService(apiKey);

    // Получаем статистику кластеров
    const clusterStats = await wbService.getClusterStats({
      from,
      to,
      items: [
        {
          advert_id: parseInt(id),
          nm_id: parseInt(nm_id),
        },
      ],
    });

    // Получаем ставки для кластеров
    let bidsData: any = {};
    try {
      const bidsResponse = await wbService.getClusterBids({
        from,
        to,
        items: [
          {
            advert_id: parseInt(id),
            nm_id: parseInt(nm_id),
          },
        ],
      });
      
      // Преобразуем массив ставок в объект для быстрого поиска
      if (Array.isArray(bidsResponse)) {
        bidsResponse.forEach((item: any) => {
          if (item.words && Array.isArray(item.words)) {
            item.words.forEach((word: any) => {
              const normQuery = word.normquery || word.keyword;
              if (normQuery) {
                bidsData[normQuery] = word.bid || 0;
              }
            });
          }
        });
      }
    } catch (error) {
      // Ставки опциональны, продолжаем без них
      console.error('Error fetching bids:', error);
    }

    // Получаем минус-фразы
    let minusData: Set<string> = new Set();
    try {
      const minusResponse = await wbService.getClusterMinus({
        from,
        to,
        items: [
          {
            advert_id: parseInt(id),
            nm_id: parseInt(nm_id),
          },
        ],
      });

      // Преобразуем массив минус-фраз в Set
      if (Array.isArray(minusResponse)) {
        minusResponse.forEach((item: any) => {
          if (item.words && Array.isArray(item.words)) {
            item.words.forEach((word: any) => {
              const normQuery = word.normquery || word.keyword;
              if (normQuery && word.minus) {
                minusData.add(normQuery);
              }
            });
          }
        });
      }
    } catch (error) {
      // Минус-фразы опциональны, продолжаем без них
      console.error('Error fetching minus words:', error);
    }

    // Объединяем данные
    const clustersWithBids = clusterStats.map((cluster) => ({
      ...cluster,
      bid: bidsData[cluster.norm_query] || 0,
      minus: minusData.has(cluster.norm_query),
    }));

    res.json({
      success: true,
      data: clustersWithBids,
    });
  }
);

/**
 * Получение ключевых фраз для ручной кампании
 * GET /api/campaigns/:id/manual-keywords
 */
export const getManualKeywords = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const apiKey = (req as any).apiKey;
    const { id } = req.params;

    const wbService = new WildberriesService(apiKey);

    const keywords = await wbService.getManualKeywords(parseInt(id));

    res.json({
      success: true,
      data: keywords,
    });
  }
);

/**
 * Получение статистики автокампании
 * GET /api/campaigns/:id/auto-stats
 */
export const getAutoStats = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const apiKey = (req as any).apiKey;
    const { id } = req.params;

    const wbService = new WildberriesService(apiKey);

    // Получаем кластеры автокампании
    const clusters = await wbService.getAutoStats(parseInt(id));

    // Получаем доступные NM для добавления
    let availableNms: any[] = [];
    try {
      availableNms = await wbService.getAvailableNms(parseInt(id));
    } catch (error) {
      // Доступные NM опциональны
      console.error('Error fetching available NMs:', error);
    }

    res.json({
      success: true,
      data: {
        clusters,
        availableNms,
      },
    });
  }
);

// Старые endpoint'ы для совместимости
export const testApiKey = validateToken;

export const getCampaigns = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const apiKey = (req as any).apiKey;
    const wbService = new WildberriesService(apiKey);

    const campaigns = await wbService.getCampaigns();

    res.json({
      success: true,
      data: campaigns,
    });
  }
);

export const getCampaignStats = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const apiKey = (req as any).apiKey;
    const { id } = req.params;
    const { beginDate, endDate } = req.query;

    if (!beginDate || !endDate) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: 'beginDate and endDate are required',
      });
    }

    const wbService = new WildberriesService(apiKey);
    
    const fullstatsData = await wbService.getFullStats(
      [parseInt(id)],
      beginDate as string,
      endDate as string
    );

    const stats = fullstatsData.length > 0 
      ? wbService.parseCampaignStats(fullstatsData[0])
      : {
          views: 0,
          clicks: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
          sum: 0,
          atbs: 0,
          orders: 0,
        };

    res.json({
      success: true,
      data: stats,
    });
  }
);

export const getClusterStats = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const apiKey = (req as any).apiKey;
    const { id } = req.params;
    const { from, to, nm_id } = req.body;

    if (!from || !to || !nm_id) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: 'from, to, and nm_id are required',
      });
    }

    const wbService = new WildberriesService(apiKey);
    const clusters = await wbService.getClusterStats({
      from,
      to,
      items: [
        {
          advert_id: parseInt(id),
          nm_id: parseInt(nm_id),
        },
      ],
    });

    res.json({
      success: true,
      data: clusters,
    });
  }
);

export const getSearchReport = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const apiKey = (req as any).apiKey;
    const wbService = new WildberriesService(apiKey);

    const report = await wbService.getSearchReport(req.body);

    res.json({
      success: true,
      data: report,
    });
  }
);
