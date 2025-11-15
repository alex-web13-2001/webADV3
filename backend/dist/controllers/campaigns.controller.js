"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchReport = exports.getClusterStats = exports.getCampaignStats = exports.getCampaigns = exports.testApiKey = void 0;
const wildberries_service_1 = require("../services/wildberries.service");
const errorHandler_1 = require("../middleware/errorHandler");
exports.testApiKey = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const apiKey = req.apiKey;
    const wbService = new wildberries_service_1.WildberriesService(apiKey);
    const balance = await wbService.testApiKey();
    res.json({
        success: true,
        data: balance,
        message: 'API key is valid',
    });
});
exports.getCampaigns = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const apiKey = req.apiKey;
    const wbService = new wildberries_service_1.WildberriesService(apiKey);
    const campaigns = await wbService.getCampaigns();
    res.json({
        success: true,
        data: campaigns,
    });
});
exports.getCampaignStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const apiKey = req.apiKey;
    const { id } = req.params;
    const { beginDate, endDate } = req.query;
    if (!beginDate || !endDate) {
        return res.status(400).json({
            success: false,
            code: 400,
            message: 'beginDate and endDate are required',
        });
    }
    const wbService = new wildberries_service_1.WildberriesService(apiKey);
    const stats = await wbService.getCampaignStats(parseInt(id), beginDate, endDate);
    res.json({
        success: true,
        data: stats,
    });
});
exports.getClusterStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const apiKey = req.apiKey;
    const { id } = req.params;
    const { from, to, nm_id } = req.body;
    if (!from || !to || !nm_id) {
        return res.status(400).json({
            success: false,
            code: 400,
            message: 'from, to, and nm_id are required',
        });
    }
    const wbService = new wildberries_service_1.WildberriesService(apiKey);
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
});
exports.getSearchReport = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const apiKey = req.apiKey;
    const wbService = new wildberries_service_1.WildberriesService(apiKey);
    const report = await wbService.getSearchReport(req.body);
    res.json({
        success: true,
        data: report,
    });
});
//# sourceMappingURL=campaigns.controller.js.map