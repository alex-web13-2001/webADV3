export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  code?: number;
  message?: string;
}

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

export interface CampaignStats {
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  sum: number;
  atbs: number;
  orders: number;
  days?: DayStats[];
  boosterStats?: BoosterStats[];
}

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
}

export interface BoosterStats {
  nm_id: number;
  name: string;
  avgPosition: number;
}

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
}

export interface Balance {
  bonus: number;
  net: number;
}
