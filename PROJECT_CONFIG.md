# Конфигурация проекта

## Структура репозитория

```
webADV3/
├── backend/                      # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/         # API контроллеры
│   │   │   └── campaigns.controller.ts
│   │   ├── middleware/          # Express middleware
│   │   │   ├── errorHandler.ts
│   │   │   └── validateApiKey.ts
│   │   ├── routes/              # API маршруты
│   │   │   └── api.routes.ts
│   │   ├── services/            # Бизнес-логика
│   │   │   └── wildberries.service.ts
│   │   ├── types/               # TypeScript типы
│   │   │   └── index.ts
│   │   ├── utils/               # Утилиты
│   │   │   └── config.ts
│   │   └── server.ts            # Точка входа
│   ├── .env.example             # Пример конфигурации
│   ├── .eslintrc.json          # ESLint конфигурация
│   ├── tsconfig.json           # TypeScript конфигурация
│   ├── Dockerfile              # Docker образ
│   └── package.json            # Зависимости
│
├── frontend/                    # Frontend (Next.js 14 + TypeScript)
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── dashboard/          # Dashboard компоненты
│   │   │   ├── ApiKeyInput.tsx
│   │   │   ├── CampaignList.tsx
│   │   │   ├── ClusterCharts.tsx
│   │   │   ├── ClusterTable.tsx
│   │   │   ├── DailyStatsChart.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── StatsOverview.tsx
│   │   └── ui/                 # UI компоненты
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── input.tsx
│   ├── lib/                    # Утилиты и API клиент
│   │   ├── api-client.ts
│   │   └── utils.ts
│   ├── types/                  # TypeScript типы
│   │   └── index.ts
│   ├── .env.local.example      # Пример конфигурации
│   ├── Dockerfile              # Docker образ
│   └── package.json            # Зависимости
│
├── docker-compose.yml          # Docker Compose конфигурация
├── .gitignore                  # Git ignore правила
├── README.md                   # Основная документация
└── GETTING_STARTED.md          # Руководство по началу работы
```

## Технологический стек

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.3
- **HTTP Client**: Axios 1.6
- **Security**: Helmet, CORS
- **Rate Limiting**: express-rate-limit
- **Development**: ts-node-dev

### Frontend
- **Framework**: Next.js 16.0 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Infrastructure
- **Container**: Docker
- **Orchestration**: Docker Compose

## API Endpoints

### Backend API (Port 4000)

#### Health Check
```
GET /health
Response: { success: true, message: "...", timestamp: "..." }
```

#### Test API Key
```
POST /api/test-key
Headers: x-api-key: <WB_API_KEY>
Response: { success: true, data: { bonus, net } }
```

#### Get Campaigns
```
GET /api/campaigns
Headers: x-api-key: <WB_API_KEY>
Response: { success: true, data: Campaign[] }
```

#### Get Campaign Stats
```
GET /api/campaigns/:id/stats?beginDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Headers: x-api-key: <WB_API_KEY>
Response: { success: true, data: CampaignStats }
```

#### Get Cluster Stats
```
POST /api/campaigns/:id/clusters
Headers: x-api-key: <WB_API_KEY>
Body: { from: "YYYY-MM-DD", to: "YYYY-MM-DD", nm_id: number }
Response: { success: true, data: ClusterStats[] }
```

#### Search Overview (Optional)
```
POST /api/search-overview
Headers: x-api-key: <WB_API_KEY>
Body: <search-report-params>
Response: { success: true, data: any }
```

## Environment Variables

### Backend (.env)
```bash
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
WB_API_BASE_URL=https://advert-api.wildberries.ru
WB_ANALYTICS_API_BASE_URL=https://analytics-api.wildberries.ru
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Команды разработки

### Backend
```bash
npm install        # Установка зависимостей
npm run dev        # Запуск в режиме разработки
npm run build      # Сборка TypeScript
npm start          # Запуск production версии
npm run lint       # Проверка кода ESLint
```

### Frontend
```bash
npm install        # Установка зависимостей
npm run dev        # Запуск в режиме разработки
npm run build      # Сборка production версии
npm start          # Запуск production версии
npm run lint       # Проверка кода ESLint
```

### Docker
```bash
docker-compose up           # Запуск всех сервисов
docker-compose up -d        # Запуск в фоновом режиме
docker-compose down         # Остановка сервисов
docker-compose logs -f      # Просмотр логов
```

## Порты

- **Frontend**: 3000
- **Backend**: 4000

## Безопасность

### Backend
- Helmet для защиты HTTP заголовков
- CORS с ограничением источников
- Rate limiting для защиты от DDoS
- Валидация API ключа
- Централизованная обработка ошибок
- Не сохраняет API ключи на сервере

### Frontend
- API ключ хранится в sessionStorage (только текущая сессия)
- HTTPS рекомендуется для production
- XSS защита через React
- CSRF защита через SameSite cookies

## Интеграция с Wildberries API

### Используемые эндпоинты WB:

1. **GET /adv/v1/balance** - Проверка API ключа
2. **GET /adv/v1/promotion/adverts** - Список кампаний
3. **GET /adv/v3/fullstats** - Статистика кампаний
4. **POST /adv/v0/normquery/stats** - Статистика поисковых кластеров
5. **POST /api/v2/search-report/report** - Поисковая аналитика (опционально)

### Документация WB API:
https://dev.wildberries.ru/

## Мониторинг и логирование

### Backend
- Console логи для development
- HTTP запросы логируются Express
- Ошибки логируются с полным контекстом

### Frontend
- Console логи в браузере
- Error boundaries для React компонентов
- Network requests visible in DevTools

## Производительность

### Backend
- Асинхронная обработка запросов
- Connection pooling в Axios
- Rate limiting для защиты
- Timeout 30 секунд для WB API

### Frontend
- Server-side rendering (SSR) в Next.js
- Code splitting автоматически
- Lazy loading для графиков
- Оптимизированные изображения

## Тестирование

### Ручное тестирование
1. Запустите backend и frontend
2. Откройте http://localhost:3000
3. Введите тестовый API ключ
4. Проверьте все функции

### API тестирование
```bash
# Health check
curl http://localhost:4000/health

# Test API key (замените YOUR_KEY)
curl -X POST http://localhost:4000/api/test-key \
  -H "x-api-key: YOUR_KEY"
```

## Деплой

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### Production (Docker)
```bash
docker-compose up -d
```

### Production (Manual)
```bash
# Backend
cd backend
npm install --production
npm run build
npm start

# Frontend
cd frontend
npm install --production
npm run build
npm start
```

## Troubleshooting

### Проблема: Backend не запускается
**Решение**: Проверьте, что порт 4000 свободен

### Проблема: Frontend не подключается к backend
**Решение**: Проверьте NEXT_PUBLIC_API_URL в .env.local

### Проблема: Invalid API key
**Решение**: 
1. Проверьте права доступа ключа
2. Убедитесь что ключ активен
3. Попробуйте создать новый ключ

### Проблема: CORS errors
**Решение**: Проверьте FRONTEND_URL в backend/.env

## Поддержка

- **Repository**: https://github.com/alex-web13-2001/webADV3
- **Issues**: https://github.com/alex-web13-2001/webADV3/issues
- **WB API Docs**: https://dev.wildberries.ru/

## Лицензия

MIT
