import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Клиент для работы с API бэкенда
 */
class ApiClient {
  private client: AxiosInstance;
  private apiKey: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Загрузка API ключа из sessionStorage
    if (typeof window !== 'undefined') {
      this.apiKey = sessionStorage.getItem('wb_api_key');
    }
  }

  /**
   * Установка API ключа
   */
  setApiKey(key: string) {
    this.apiKey = key;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('wb_api_key', key);
    }
  }

  /**
   * Очистка API ключа
   */
  clearApiKey() {
    this.apiKey = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('wb_api_key');
    }
  }

  /**
   * Получение API ключа
   */
  getApiKey(): string | null {
    return this.apiKey;
  }

  /**
   * Получение заголовков с API ключом
   */
  private getHeaders() {
    return {
      ...(this.apiKey && { 'x-api-key': this.apiKey }),
    };
  }

  /**
   * Проверка API ключа через /api/auth/validate
   */
  async validateToken(apiKey: string) {
    const response = await this.client.post(
      '/auth/validate',
      {},
      {
        headers: { 'x-api-key': apiKey },
      }
    );
    return response.data;
  }

  /**
   * Получение баланса
   * GET /api/balance
   */
  async getBalance() {
    const response = await this.client.get('/balance', {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  /**
   * Получение списка кампаний с fullstats
   * POST /api/campaigns/list
   */
  async getCampaignsList(beginDate: string, endDate: string) {
    const response = await this.client.post(
      '/campaigns/list',
      { beginDate, endDate },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  /**
   * Получение обзора кампании с fullstats
   * POST /api/campaigns/:id/overview
   */
  async getCampaignOverview(campaignId: number, beginDate: string, endDate: string) {
    const response = await this.client.post(
      `/campaigns/${campaignId}/overview`,
      { beginDate, endDate },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  /**
   * Получение CPM кластеров для товара
   * POST /api/campaigns/:id/cpm-clusters
   */
  async getCpmClusters(campaignId: number, nmId: number, from: string, to: string) {
    const response = await this.client.post(
      `/campaigns/${campaignId}/cpm-clusters`,
      { nm_id: nmId, from, to },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  /**
   * Получение ключевых фраз для ручной кампании
   * GET /api/campaigns/:id/manual-keywords
   */
  async getManualKeywords(campaignId: number) {
    const response = await this.client.get(`/campaigns/${campaignId}/manual-keywords`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  /**
   * Получение статистики автокампании
   * GET /api/campaigns/:id/auto-stats
   */
  async getAutoStats(campaignId: number) {
    const response = await this.client.get(`/campaigns/${campaignId}/auto-stats`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  // Старые методы для совместимости
  async testApiKey(apiKey: string) {
    return this.validateToken(apiKey);
  }

  async getCampaigns() {
    const response = await this.client.get('/campaigns', {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async getCampaignStats(campaignId: number, beginDate: string, endDate: string) {
    const response = await this.client.get(`/campaigns/${campaignId}/stats`, {
      params: { beginDate, endDate },
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async getClusterStats(campaignId: number, nmId: number, from: string, to: string) {
    const response = await this.client.post(
      `/campaigns/${campaignId}/clusters`,
      { nm_id: nmId, from, to },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async getSearchReport(data: any) {
    const response = await this.client.post('/search-overview', data, {
      headers: this.getHeaders(),
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
