import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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

    // Load API key from sessionStorage on client
    if (typeof window !== 'undefined') {
      this.apiKey = sessionStorage.getItem('wb_api_key');
    }
  }

  setApiKey(key: string) {
    this.apiKey = key;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('wb_api_key', key);
    }
  }

  clearApiKey() {
    this.apiKey = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('wb_api_key');
    }
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  private getHeaders() {
    return {
      ...(this.apiKey && { 'x-api-key': this.apiKey }),
    };
  }

  async testApiKey(apiKey: string) {
    const response = await this.client.post(
      '/test-key',
      {},
      {
        headers: { 'x-api-key': apiKey },
      }
    );
    return response.data;
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
