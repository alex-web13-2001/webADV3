import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './utils/config';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes/api.routes';

const app: Application = express();

/**
 * Настройка безопасности
 * Helmet защищает приложение от распространенных веб-уязвимостей
 */
app.use(helmet());

/**
 * Настройка CORS
 * Разрешаем запросы только с фронтенд-приложения
 */
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

/**
 * Ограничение частоты запросов
 * Защита от DDoS и брутфорса
 */
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    code: 429,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

/**
 * Парсинг тела запроса
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Health check endpoint
 * Проверка работоспособности сервера
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'WB Ads Dashboard API is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API маршруты
 */
app.use('/api', apiRoutes);

/**
 * Обработчик 404 ошибок
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    code: 404,
    message: 'Route not found',
  });
});

/**
 * Глобальный обработчик ошибок
 * Должен быть последним middleware
 */
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🌐 Frontend URL: ${config.frontendUrl}`);
});

export default app;
