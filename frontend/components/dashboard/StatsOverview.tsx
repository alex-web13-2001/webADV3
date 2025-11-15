'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/utils';
import { CampaignStats } from '@/types';
import { TrendingUp, MousePointerClick, Eye, DollarSign, ShoppingCart, Target, TrendingDown } from 'lucide-react';

interface StatsOverviewProps {
  stats: CampaignStats;
}

/**
 * Компонент обзора статистики кампании
 * Отображает основные KPI метрики в виде плашек
 */
export function StatsOverview({ stats }: StatsOverviewProps) {
  const metrics = [
    {
      title: 'Показы',
      value: formatNumber(stats.views),
      icon: Eye,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Клики',
      value: formatNumber(stats.clicks),
      icon: MousePointerClick,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'CTR',
      value: formatPercent(stats.ctr),
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'CPC',
      value: formatCurrency(stats.cpc),
      icon: DollarSign,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      title: 'CPM',
      value: formatCurrency(stats.cpm),
      icon: Target,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    },
    {
      title: 'Расходы',
      value: formatCurrency(stats.sum),
      icon: DollarSign,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      title: 'Заказы',
      value: formatNumber(stats.orders),
      icon: ShoppingCart,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Выручка',
      value: formatCurrency(stats.sum_price || 0),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'ATB (добавления в корзину)',
      value: formatNumber(stats.atbs),
      icon: ShoppingCart,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
    },
    {
      title: 'CR (конверсия)',
      value: formatPercent(stats.cr || 0),
      icon: TrendingDown,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={`${metric.bg} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
