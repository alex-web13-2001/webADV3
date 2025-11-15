import { Router } from 'express';
import { validateApiKey } from '../middleware/validateApiKey';
import {
  testApiKey,
  getCampaigns,
  getCampaignStats,
  getClusterStats,
  getSearchReport,
} from '../controllers/campaigns.controller';

const router = Router();

// Test API key
router.post('/test-key', validateApiKey, testApiKey);

// Campaigns
router.get('/campaigns', validateApiKey, getCampaigns);

// Campaign stats
router.get('/campaigns/:id/stats', validateApiKey, getCampaignStats);

// Cluster stats
router.post('/campaigns/:id/clusters', validateApiKey, getClusterStats);

// Search report (optional)
router.post('/search-overview', validateApiKey, getSearchReport);

export default router;
