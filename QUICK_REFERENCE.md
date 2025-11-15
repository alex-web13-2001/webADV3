# ⚡ Quick Reference

## 🚀 Start Development

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

Open: http://localhost:3000

## 📁 File Locations

| What | Where |
|------|-------|
| Backend API routes | `backend/src/routes/api.routes.ts` |
| WB API service | `backend/src/services/wildberries.service.ts` |
| Frontend main page | `frontend/app/page.tsx` |
| Dashboard component | `frontend/components/dashboard/Dashboard.tsx` |
| API client | `frontend/lib/api-client.ts` |
| Backend config | `backend/.env` |
| Frontend config | `frontend/.env.local` |

## 🔑 API Endpoints

```bash
# Test connection
GET http://localhost:4000/health

# Test API key
POST http://localhost:4000/api/test-key
Header: x-api-key: YOUR_KEY

# Get campaigns
GET http://localhost:4000/api/campaigns
Header: x-api-key: YOUR_KEY

# Get campaign stats
GET http://localhost:4000/api/campaigns/:id/stats?beginDate=2025-01-01&endDate=2025-01-10
Header: x-api-key: YOUR_KEY

# Get cluster stats
POST http://localhost:4000/api/campaigns/:id/clusters
Header: x-api-key: YOUR_KEY
Body: {"from":"2025-01-01","to":"2025-01-10","nm_id":123456}
```

## 🔧 Common Tasks

### Add new UI component
```bash
# Create in frontend/components/ui/
touch frontend/components/ui/my-component.tsx
```

### Add new API endpoint
1. Add route in `backend/src/routes/api.routes.ts`
2. Add controller in `backend/src/controllers/`
3. Add service method in `backend/src/services/wildberries.service.ts`

### Rebuild after changes
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### View logs
```bash
# Docker logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🐛 Debug

### Check ports
```bash
lsof -i :3000  # Frontend
lsof -i :4000  # Backend
```

### Test backend API
```bash
curl http://localhost:4000/health
```

### Check environment
```bash
# Backend
cat backend/.env

# Frontend
cat frontend/.env.local
```

### View build output
```bash
# Backend
ls -la backend/dist/

# Frontend
ls -la frontend/.next/
```

## 📊 TypeScript Types

### Campaign
```typescript
interface Campaign {
  advertId: number;
  name: string;
  status: number;
  type: number;
  createTime: string;
}
```

### CampaignStats
```typescript
interface CampaignStats {
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  sum: number;
  orders: number;
  days?: DayStats[];
}
```

### ClusterStats
```typescript
interface ClusterStats {
  norm_query: string;
  avg_pos: number;
  clicks: number;
  views: number;
  ctr: number;
  cpc: number;
  sum: number;
  orders: number;
}
```

## 🎨 Tailwind Classes

### Common patterns
```tsx
// Card
<div className="rounded-lg border bg-white shadow-sm p-6">

// Button primary
<button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">

// Input
<input className="border border-gray-300 rounded-md px-3 py-2 w-full" />

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

## 🔐 Security Notes

- ✅ API keys stored in sessionStorage only
- ✅ No API keys in code or git
- ✅ Rate limiting enabled (100 req/min)
- ✅ CORS configured for localhost:3000
- ✅ Helmet security headers enabled
- ⚠️ Use HTTPS in production

## 📦 Dependencies

### Backend key packages
- express - Web framework
- axios - HTTP client
- helmet - Security
- cors - CORS handling
- typescript - Type safety

### Frontend key packages
- next - React framework
- react - UI library
- axios - HTTP client
- recharts - Charts
- tailwindcss - Styling
- lucide-react - Icons

## 🐳 Docker

### Build images
```bash
docker-compose build
```

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Restart service
```bash
docker-compose restart backend
docker-compose restart frontend
```

## 💡 Tips

1. **API Key**: Get from WB seller cabinet → API settings
2. **nm_id**: Find in product URL on wildberries.ru
3. **Date format**: Use YYYY-MM-DD for all dates
4. **Max period**: Recommend ≤30 days for fast loading
5. **Session**: API key cleared on tab close
6. **Refresh**: Use "Refresh" button to update data

## 🔗 Links

- [WB API Docs](https://dev.wildberries.ru/)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Recharts Docs](https://recharts.org/)

## ❓ Need Help?

1. Check GETTING_STARTED.md
2. Check PROJECT_CONFIG.md
3. Open issue on GitHub
4. Check browser console (F12)
5. Check backend logs
