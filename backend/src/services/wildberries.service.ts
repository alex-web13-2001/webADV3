import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '../utils/config';
import { AppError } from '../middleware/errorHandler';
import {
  Balance,
  Campaign,
  CampaignStats,
  ClusterRequest,
  ClusterStats,
} from '../types';

export class WildberriesService {
  private client: AxiosInstance;
  private analyticsClient: AxiosInstance;

  constructor(apiKey: string) {
    this.client = axios.create({
      baseURL: config.wbApiBaseUrl,
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.analyticsClient = axios.create({
      baseURL: config.wbAnalyticsApiBaseUrl,
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      const message = this.getErrorMessage(status, axiosError);
      throw new AppError(status, message);
    }
    throw new AppError(500, 'Unexpected error occurred');
  }

  private getErrorMessage(status: number, error: AxiosError): string {
    switch (status) {
      case 401:
        return 'Invalid API key';
      case 429:
        return 'Too many requests. Please try again later';
      case 400:
        return 'Invalid request parameters';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Wildberries API error';
      default:
        return error.message || 'Unknown error';
    }
  }

  async testApiKey(): Promise<Balance> {
    try {
      const response = await this.client.get<Balance>('/adv/v1/balance');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getCampaigns(): Promise<Campaign[]> {
    try {
      const response = await this.client.get<Campaign[]>('/adv/v1/promotion/adverts');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getCampaignStats(
    campaignId: number,
    beginDate: string,
    endDate: string
  ): Promise<CampaignStats> {
    try {
      const response = await this.client.get<CampaignStats[]>('/adv/v3/fullstats', {
        params: {
          ids: campaignId.toString(),
          beginDate,
          endDate,
        },
      });
      
      // WB API returns array, we need first element
      return response.data[0] || {
        views: 0,
        clicks: 0,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        sum: 0,
        atbs: 0,
        orders: 0,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async getClusterStats(data: ClusterRequest): Promise<ClusterStats[]> {
    try {
      const response = await this.client.post<any>('/adv/v0/normquery/stats', data);
      
      // Extract cluster stats from response
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
              });
            });
          }
        });
      }
      
      return clusters;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getSearchReport(data: any): Promise<any> {
    try {
      const response = await this.analyticsClient.post('/api/v2/search-report/report', data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}
