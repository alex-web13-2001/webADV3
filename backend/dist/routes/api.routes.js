"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateApiKey_1 = require("../middleware/validateApiKey");
const campaigns_controller_1 = require("../controllers/campaigns.controller");
const router = (0, express_1.Router)();
// Test API key
router.post('/test-key', validateApiKey_1.validateApiKey, campaigns_controller_1.testApiKey);
// Campaigns
router.get('/campaigns', validateApiKey_1.validateApiKey, campaigns_controller_1.getCampaigns);
// Campaign stats
router.get('/campaigns/:id/stats', validateApiKey_1.validateApiKey, campaigns_controller_1.getCampaignStats);
// Cluster stats
router.post('/campaigns/:id/clusters', validateApiKey_1.validateApiKey, campaigns_controller_1.getClusterStats);
// Search report (optional)
router.post('/search-overview', validateApiKey_1.validateApiKey, campaigns_controller_1.getSearchReport);
exports.default = router;
//# sourceMappingURL=api.routes.js.map