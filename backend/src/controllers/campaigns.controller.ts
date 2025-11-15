import { Request, Response } from 'express';
import { WildberriesService } from '../services/wildberries.service';
import { ApiResponse } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

export const testApiKey = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const apiKey = (req as any).apiKey;
    const wbService = new WildberriesService(apiKey);

    const balance = await wbService.testApiKey();

    res.json({
      success: true,
      data: balance,
      message: 'API key is valid',
    });
  }
);

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
    const stats = await wbService.getCampaignStats(
      parseInt(id),
      beginDate as string,
      endDate as string
    );

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
