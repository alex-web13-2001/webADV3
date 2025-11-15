"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WildberriesService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../utils/config");
const errorHandler_1 = require("../middleware/errorHandler");
class WildberriesService {
    constructor(apiKey) {
        this.client = axios_1.default.create({
            baseURL: config_1.config.wbApiBaseUrl,
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        });
        this.analyticsClient = axios_1.default.create({
            baseURL: config_1.config.wbAnalyticsApiBaseUrl,
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        });
    }
    handleError(error) {
        if (axios_1.default.isAxiosError(error)) {
            const axiosError = error;
            const status = axiosError.response?.status || 500;
            const message = this.getErrorMessage(status, axiosError);
            throw new errorHandler_1.AppError(status, message);
        }
        throw new errorHandler_1.AppError(500, 'Unexpected error occurred');
    }
    getErrorMessage(status, error) {
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
    async testApiKey() {
        try {
            const response = await this.client.get('/adv/v1/balance');
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async getCampaigns() {
        try {
            const response = await this.client.get('/adv/v1/promotion/adverts');
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async getCampaignStats(campaignId, beginDate, endDate) {
        try {
            const response = await this.client.get('/adv/v3/fullstats', {
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
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async getClusterStats(data) {
        try {
            const response = await this.client.post('/adv/v0/normquery/stats', data);
            // Extract cluster stats from response
            const clusters = [];
            if (response.data && Array.isArray(response.data)) {
                response.data.forEach((item) => {
                    if (item.words && Array.isArray(item.words)) {
                        item.words.forEach((word) => {
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
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async getSearchReport(data) {
        try {
            const response = await this.analyticsClient.post('/api/v2/search-report/report', data);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
}
exports.WildberriesService = WildberriesService;
//# sourceMappingURL=wildberries.service.js.map