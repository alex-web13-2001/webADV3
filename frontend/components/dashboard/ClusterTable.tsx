'use client';

import { ClusterStats } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/utils';

interface ClusterTableProps {
  clusters: ClusterStats[];
}

export function ClusterTable({ clusters }: ClusterTableProps) {
  if (clusters.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Нет данных по поисковым кластерам
        </CardContent>
      </Card>
    );
  }

  // Sort by clicks (top performers first)
  const sortedClusters = [...clusters].sort((a, b) => b.clicks - a.clicks);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Поисковые кластеры</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium text-sm">Поисковая фраза</th>
                <th className="text-right p-2 font-medium text-sm">Показы</th>
                <th className="text-right p-2 font-medium text-sm">Клики</th>
                <th className="text-right p-2 font-medium text-sm">CTR</th>
                <th className="text-right p-2 font-medium text-sm">CPC</th>
                <th className="text-right p-2 font-medium text-sm">Расходы</th>
                <th className="text-right p-2 font-medium text-sm">Средняя поз.</th>
                <th className="text-right p-2 font-medium text-sm">Заказы</th>
              </tr>
            </thead>
            <tbody>
              {sortedClusters.map((cluster, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2 text-sm">{cluster.norm_query}</td>
                  <td className="p-2 text-sm text-right">{formatNumber(cluster.views)}</td>
                  <td className="p-2 text-sm text-right">{formatNumber(cluster.clicks)}</td>
                  <td className="p-2 text-sm text-right">{formatPercent(cluster.ctr)}</td>
                  <td className="p-2 text-sm text-right">{formatCurrency(cluster.cpc)}</td>
                  <td className="p-2 text-sm text-right">{formatCurrency(cluster.sum)}</td>
                  <td className="p-2 text-sm text-right">{cluster.avg_pos.toFixed(1)}</td>
                  <td className="p-2 text-sm text-right">{formatNumber(cluster.orders)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
