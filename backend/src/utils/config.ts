import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  wbApiBaseUrl: process.env.WB_API_BASE_URL || 'https://advert-api.wildberries.ru',
  wbAnalyticsApiBaseUrl: process.env.WB_ANALYTICS_API_BASE_URL || 'https://analytics-api.wildberries.ru',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
};
