import { Router } from 'express';
import { validateApiKey } from '../middleware/validateApiKey';
import {
  validateToken,
  getBalance,
  getCampaignsList,
  getCampaignOverview,
  getCpmClusters,
  getManualKeywords,
  getAutoStats,
  testApiKey,
  getCampaigns,
  getCampaignStats,
  getClusterStats,
  getSearchReport,
} from '../controllers/campaigns.controller';

const router = Router();

/**
 * Маршруты API для работы с рекламными кампаниями Wildberries
 */

// Авторизация
router.post('/auth/validate', validateApiKey, validateToken);

// Баланс
router.get('/balance', validateApiKey, getBalance);

// Список кампаний с fullstats
router.post('/campaigns/list', validateApiKey, getCampaignsList);

// Обзор кампании с fullstats
router.post('/campaigns/:id/overview', validateApiKey, getCampaignOverview);

// CPM кластеры для товара
router.post('/campaigns/:id/cpm-clusters', validateApiKey, getCpmClusters);

// Ключевые фразы для ручной кампании
router.get('/campaigns/:id/manual-keywords', validateApiKey, getManualKeywords);

// Статистика автокампании
router.get('/campaigns/:id/auto-stats', validateApiKey, getAutoStats);

// Старые endpoint'ы для совместимости
router.post('/test-key', validateApiKey, testApiKey);
router.get('/campaigns', validateApiKey, getCampaigns);
router.get('/campaigns/:id/stats', validateApiKey, getCampaignStats);
router.post('/campaigns/:id/clusters', validateApiKey, getClusterStats);
router.post('/search-overview', validateApiKey, getSearchReport);

export default router;
