// Конфигурация WB API
export interface WBConfig {
  apiKey: string;
}

// Базовый ответ API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  code?: number;
  status?: number;
  endpoint?: string;
  message?: string;
}

// Баланс рекламного кабинета
export interface Balance {
  bonus: number;
  net: number;
}

// Рекламная кампания
export interface Campaign {
  advertId: number;
  name: string;
  status: number;
  type: number;
  createTime: string;
  changeTime?: string;
  endTime?: string;
  searchPluseState?: number;
}

// Статистика кампании из fullstats
export interface CampaignStats {
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  sum: number;
  atbs: number;
  orders: number;
  cr?: number;
  sum_price?: number;
  days?: DayStats[];
  boosterStats?: BoosterStats[];
  nms?: NmStats[];
}

// Статистика по дням
export interface DayStats {
  date: string;
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  sum: number;
  atbs: number;
  orders: number;
  cr: number;
  shks: number;
  sum_price: number;
  apps?: AppStats[];
}

// Статистика приложений в день
export interface AppStats {
  appType: number;
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  sum: number;
  atbs: number;
  orders: number;
  cr: number;
  shks: number;
  sum_price: number;
  nms?: NmDayStats[];
}

// Статистика товара в день
export interface NmDayStats {
  nmId: number;
  name: string;
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  sum: number;
  atbs: number;
  orders: number;
  cr: number;
  shks: number;
  sum_price: number;
  avgPosition?: number;
}

// Общая статистика товара
export interface NmStats {
  nm_id: number;
  name: string;
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  sum: number;
  atbs: number;
  orders: number;
  cr: number;
  sum_price: number;
  avgPosition?: number;
}

// Статистика бустера (позиции товаров)
export interface BoosterStats {
  nm_id: number;
  name: string;
  avgPosition: number;
}

// Статистика кластеров для CPM
export interface ClusterStats {
  norm_query: string;
  avg_pos: number;
  clicks: number;
  views: number;
  ctr: number;
  cpc: number;
  cpm: number;
  sum: number;
  orders: number;
  atbs?: number;
  bid?: number;
  minus?: boolean;
}

// Запрос кластеров
export interface ClusterItem {
  advert_id: number;
  nm_id: number;
}

export interface ClusterRequest {
  from: string;
  to: string;
  items: ClusterItem[];
}

// Ключевые фразы ручной кампании
export interface ManualKeyword {
  keyword: string;
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  orders: number;
  sum: number;
  minus?: boolean;
}

// Статистика автокампании
export interface AutoCampaignCluster {
  cluster: string;
  count: number;
  keywords: string[];
  is_minus_cluster?: boolean;
}

// Доступные NM для добавления в автокампанию
export interface AvailableNm {
  nm_id: number;
  name?: string;
}
