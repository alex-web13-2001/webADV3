'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/utils';
import { CampaignStats } from '@/types';
import { TrendingUp, MousePointerClick, Eye, DollarSign, ShoppingCart } from 'lucide-react';

interface StatsOverviewProps {
  stats: CampaignStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const metrics = [
    {
      title: 'Показы',
      value: formatNumber(stats.views),
      icon: Eye,
      color: 'text-blue-600',
    },
    {
      title: 'Клики',
      value: formatNumber(stats.clicks),
      icon: MousePointerClick,
      color: 'text-green-600',
    },
    {
      title: 'CTR',
      value: formatPercent(stats.ctr),
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      title: 'CPC',
      value: formatCurrency(stats.cpc),
      icon: DollarSign,
      color: 'text-orange-600',
    },
    {
      title: 'Расходы',
      value: formatCurrency(stats.sum),
      icon: DollarSign,
      color: 'text-red-600',
    },
    {
      title: 'Заказы',
      value: formatNumber(stats.orders),
      icon: ShoppingCart,
      color: 'text-indigo-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
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
