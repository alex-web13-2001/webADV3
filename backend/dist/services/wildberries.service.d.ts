import { Balance, Campaign, CampaignStats, ClusterRequest, ClusterStats } from '../types';
export declare class WildberriesService {
    private client;
    private analyticsClient;
    constructor(apiKey: string);
    private handleError;
    private getErrorMessage;
    testApiKey(): Promise<Balance>;
    getCampaigns(): Promise<Campaign[]>;
    getCampaignStats(campaignId: number, beginDate: string, endDate: string): Promise<CampaignStats>;
    getClusterStats(data: ClusterRequest): Promise<ClusterStats[]>;
    getSearchReport(data: any): Promise<any>;
}
//# sourceMappingURL=wildberries.service.d.ts.map