import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '../utils/config';
import { AppError } from '../middleware/errorHandler';
import {
  Balance,
  Campaign,
  CampaignStats,
  ClusterRequest,
  ClusterStats,
  ManualKeyword,
  AutoCampaignCluster,
  AvailableNm,
  DayStats,
  NmStats,
  AppStats,
  NmDayStats,
} from '../types';

/**
 * Сервис для работы с API Wildberries
 * Обеспечивает взаимодействие со всеми необходимыми endpoint'ами WB API
 */
export class WildberriesService {
  private client: AxiosInstance;
  private analyticsClient: AxiosInstance;

  constructor(apiKey: string) {
    // Клиент для рекламного API
    this.client = axios.create({
      baseURL: config.wbApiBaseUrl,
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Клиент для аналитического API
    this.analyticsClient = axios.create({
      baseURL: config.wbAnalyticsApiBaseUrl,
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Обработка ошибок от WB API
   * Возвращает ошибку в унифицированном формате
   */
  private handleError(error: any, endpoint?: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      const message = this.getErrorMessage(status, axiosError);
      
      // Формируем объект ошибки согласно ТЗ
      const errorData: any = {
        success: false,
        status,
        message,
      };
      
      if (endpoint) {
        errorData.endpoint = endpoint;
      }
      
      throw new AppError(status, message, errorData);
    }
    throw new AppError(500, 'Unexpected error occurred');
  }

  /**
   * Получение сообщения об ошибке на основе статус-кода
   */
  private getErrorMessage(status: number, error: AxiosError): string {
    const responseData = error.response?.data as any;
    
    // Если WB API вернул свое сообщение
    if (responseData?.message) {
      return responseData.message;
    }
    
    switch (status) {
      case 401:
        return 'unauthorized: token is malformed';
      case 429:
        return 'Too many requests. Please try again later';
      case 400:
        return 'Invalid request parameters';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Wildberries API error';
      default:
        return error.message || 'Unknown error';
    }
  }

  /**
   * Проверка токена через получение баланса
   * GET /adv/v1/balance
   */
  async getBalance(): Promise<Balance> {
    try {
      const response = await this.client.get<Balance>('/adv/v1/balance');
      return response.data;
    } catch (error) {
      this.handleError(error, '/adv/v1/balance');
    }
  }

  /**
   * Получение списка всех рекламных кампаний
   * Сначала GET /adv/v1/promotion/count для получения ID
   * Затем POST /adv/v1/promotion/adverts для получения деталей
   */
  async getCampaigns(): Promise<Campaign[]> {
    try {
      // Шаг 1: Получаем список ID всех кампаний
      const countResponse = await this.client.get('/adv/v1/promotion/count');
      const ids = countResponse.data || [];
      
      if (ids.length === 0) {
        return [];
      }
      
      // Шаг 2: Разбиваем ID на чанки по 50 (лимит API)
      const chunks: number[][] = [];
      for (let i = 0; i < ids.length; i += 50) {
        chunks.push(ids.slice(i, i + 50));
      }
      
      // Шаг 3: Получаем детали для каждого чанка
      const allCampaigns: Campaign[] = [];
      for (const chunk of chunks) {
        const response = await this.client.post<Campaign[]>(
          '/adv/v1/promotion/adverts',
          chunk,
          {
            params: {
              status: -1,        // Все статусы
              type: 8,           // Все типы (или нужный тип)
              order: 'create',   // Сортировка по дате создания
              direction: 'desc'  // От новых к старым
            }
          }
        );
        
        if (response.data && Array.isArray(response.data)) {
          allCampaigns.push(...response.data);
        }
      }
      
      return allCampaigns;
    } catch (error) {
      this.handleError(error, '/adv/v1/promotion/adverts');
    }
  }

  /**
   * Получение полной статистики кампании
   * GET /adv/v3/fullstats
   * Возвращает детальную статистику с разбивкой по дням и товарам
   */
  async getFullStats(
    campaignIds: number[],
    beginDate: string,
    endDate: string
  ): Promise<any[]> {
    try {
      const response = await this.client.get('/adv/v3/fullstats', {
        params: {
          ids: campaignIds.join(','),
          beginDate,
          endDate,
        },
      });
      return response.data || [];
    } catch (error) {
      this.handleError(error, '/adv/v3/fullstats');
    }
  }

  /**
   * Обработка данных fullstats для получения агрегированной статистики
   * Извлекает nm_id из структуры days[].apps[].nms[]
   */
  parseCampaignStats(fullstatsData: any): CampaignStats {
    const stats: CampaignStats = {
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
    };

    if (!fullstatsData || !fullstatsData.days) {
      return stats;
    }

    // Агрегированные данные по товарам
    const nmMap = new Map<number, NmStats>();

    // Обработка данных по дням
    fullstatsData.days.forEach((day: any) => {
      const dayStats: DayStats = {
        date: day.date || '',
        views: day.views || 0,
        clicks: day.clicks || 0,
        ctr: day.ctr || 0,
        cpc: day.cpc || 0,
        cpm: day.cpm || 0,
        sum: day.sum || 0,
        atbs: day.atbs || 0,
        orders: day.orders || 0,
        cr: day.cr || 0,
        shks: day.shks || 0,
        sum_price: day.sum_price || 0,
        apps: day.apps || [],
      };

      stats.days!.push(dayStats);

      // Агрегация общих метрик
      stats.views += dayStats.views;
      stats.clicks += dayStats.clicks;
      stats.sum += dayStats.sum;
      stats.atbs += dayStats.atbs;
      stats.orders += dayStats.orders;
      stats.sum_price! += dayStats.sum_price;

      // Обработка товаров из apps[].nms[]
      if (day.apps && Array.isArray(day.apps)) {
        day.apps.forEach((app: any) => {
          if (app.nms && Array.isArray(app.nms)) {
            app.nms.forEach((nm: any) => {
              const nmId = nm.nmId || nm.nm_id;
              if (!nmId) return;

              if (!nmMap.has(nmId)) {
                nmMap.set(nmId, {
                  nm_id: nmId,
                  name: nm.name || '',
                  views: 0,
                  clicks: 0,
                  ctr: 0,
                  cpc: 0,
                  sum: 0,
                  atbs: 0,
                  orders: 0,
                  cr: 0,
                  sum_price: 0,
                  avgPosition: 0,
                });
              }

              const nmStats = nmMap.get(nmId)!;
              nmStats.views += nm.views || 0;
              nmStats.clicks += nm.clicks || 0;
              nmStats.sum += nm.sum || 0;
              nmStats.atbs += nm.atbs || 0;
              nmStats.orders += nm.orders || 0;
              nmStats.sum_price += nm.sum_price || 0;
            });
          }
        });
      }
    });

    // Расчет средних значений
    const daysCount = stats.days!.length || 1;
    stats.ctr = stats.views > 0 ? (stats.clicks / stats.views) * 100 : 0;
    stats.cpc = stats.clicks > 0 ? stats.sum / stats.clicks : 0;
    stats.cpm = stats.views > 0 ? (stats.sum / stats.views) * 1000 : 0;
    stats.cr = stats.clicks > 0 ? (stats.orders / stats.clicks) * 100 : 0;

    // Расчет метрик для товаров
    nmMap.forEach((nmStats) => {
      nmStats.ctr = nmStats.views > 0 ? (nmStats.clicks / nmStats.views) * 100 : 0;
      nmStats.cpc = nmStats.clicks > 0 ? nmStats.sum / nmStats.clicks : 0;
      nmStats.cr = nmStats.clicks > 0 ? (nmStats.orders / nmStats.clicks) * 100 : 0;
    });

    stats.nms = Array.from(nmMap.values());

    return stats;
  }

  /**
   * Получение статистики по поисковым кластерам CPM
   * POST /adv/v0/normquery/stats
   */
  async getClusterStats(data: ClusterRequest): Promise<ClusterStats[]> {
    try {
      const response = await this.client.post<any>('/adv/v0/normquery/stats', data);
      
      const clusters: ClusterStats[] = [];
      
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((item: any) => {
          if (item.words && Array.isArray(item.words)) {
            item.words.forEach((word: any) => {
              clusters.push({
                norm_query: word.normquery || word.keyword || '',
                avg_pos: word.avgPosition || word.avg_pos || 0,
                clicks: word.clicks || 0,
                views: word.views || 0,
                ctr: word.ctr || 0,
                cpc: word.cpc || 0,
                cpm: word.cpm || 0,
                sum: word.sum || 0,
                orders: word.orders || 0,
                atbs: word.atbs || 0,
              });
            });
          }
        });
      }
      
      return clusters;
    } catch (error) {
      this.handleError(error, '/adv/v0/normquery/stats');
    }
  }

  /**
   * Получение ставок для кластеров
   * POST /adv/v0/normquery/get-bids
   */
  async getClusterBids(data: ClusterRequest): Promise<any> {
    try {
      const response = await this.client.post('/adv/v0/normquery/get-bids', data);
      return response.data;
    } catch (error) {
      this.handleError(error, '/adv/v0/normquery/get-bids');
    }
  }

  /**
   * Получение минус-фраз для кластеров
   * POST /adv/v0/normquery/get-minus
   */
  async getClusterMinus(data: ClusterRequest): Promise<any> {
    try {
      const response = await this.client.post('/adv/v0/normquery/get-minus', data);
      return response.data;
    } catch (error) {
      this.handleError(error, '/adv/v0/normquery/get-minus');
    }
  }

  /**
   * Получение ключевых фраз для ручной кампании
   * GET /adv/v1/stat/words
   */
  async getManualKeywords(campaignId: number): Promise<ManualKeyword[]> {
    try {
      const response = await this.client.get(`/adv/v1/stat/words`, {
        params: { id: campaignId },
      });

      const keywords: ManualKeyword[] = [];
      const data = response.data;

      if (data && Array.isArray(data)) {
        data.forEach((item: any) => {
          keywords.push({
            keyword: item.keyword || item.word || '',
            views: item.views || 0,
            clicks: item.clicks || 0,
            ctr: item.ctr || 0,
            cpc: item.cpc || 0,
            orders: item.orders || 0,
            sum: item.sum || 0,
            minus: item.minus || false,
          });
        });
      }

      return keywords;
    } catch (error) {
      this.handleError(error, '/adv/v1/stat/words');
    }
  }

  /**
   * Получение статистики по кластерам автокампании
   * GET /adv/v2/auto/stat-words
   */
  async getAutoStats(campaignId: number): Promise<AutoCampaignCluster[]> {
    try {
      const response = await this.client.get(`/adv/v2/auto/stat-words`, {
        params: { id: campaignId },
      });

      const clusters: AutoCampaignCluster[] = [];
      const data = response.data;

      if (data && Array.isArray(data)) {
        data.forEach((item: any) => {
          clusters.push({
            cluster: item.cluster || '',
            count: item.count || 0,
            keywords: item.keywords || [],
            is_minus_cluster: item.is_minus_cluster || false,
          });
        });
      }

      return clusters;
    } catch (error) {
      this.handleError(error, '/adv/v2/auto/stat-words');
    }
  }

  /**
   * Получение доступных NM для добавления в автокампанию
   * GET /adv/v1/auto/getnmtoadd
   */
  async getAvailableNms(campaignId: number): Promise<AvailableNm[]> {
    try {
      const response = await this.client.get(`/adv/v1/auto/getnmtoadd`, {
        params: { id: campaignId },
      });

      const nms: AvailableNm[] = [];
      const data = response.data;

      if (data && Array.isArray(data)) {
        data.forEach((item: any) => {
          nms.push({
            nm_id: item.nm_id || item.nmId,
            name: item.name || '',
          });
        });
      }

      return nms;
    } catch (error) {
      this.handleError(error, '/adv/v1/auto/getnmtoadd');
    }
  }

  /**
   * Получение отчета по поиску (опционально)
   */
  async getSearchReport(data: any): Promise<any> {
    try {
      const response = await this.analyticsClient.post('/api/v2/search-report/report', data);
      return response.data;
    } catch (error) {
      this.handleError(error, '/api/v2/search-report/report');
    }
  }
}
