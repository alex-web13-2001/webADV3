'use client';

import { ClusterStats } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/utils';

interface ClusterTableProps {
  clusters: ClusterStats[];
}

/**
 * Компонент таблицы поисковых кластеров для CPM кампаний
 * Отображает детальную статистику по каждому кластеру включая ставки и минус-фразы
 */
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

  // Сортировка по кликам (топовые первые)
  const sortedClusters = [...clusters].sort((a, b) => b.clicks - a.clicks);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Поисковые кластеры CPM</CardTitle>
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
                <th className="text-right p-2 font-medium text-sm">CPM</th>
                <th className="text-right p-2 font-medium text-sm">Расходы</th>
                <th className="text-right p-2 font-medium text-sm">Поз.</th>
                <th className="text-right p-2 font-medium text-sm">ATB</th>
                <th className="text-right p-2 font-medium text-sm">Заказы</th>
                <th className="text-right p-2 font-medium text-sm">Ставка</th>
                <th className="text-center p-2 font-medium text-sm">Минус</th>
              </tr>
            </thead>
            <tbody>
              {sortedClusters.map((cluster, index) => (
                <tr
                  key={index}
                  className={`border-b hover:bg-gray-50 ${cluster.minus ? 'bg-red-50' : ''}`}
                >
                  <td className="p-2 text-sm">{cluster.norm_query}</td>
                  <td className="p-2 text-sm text-right">{formatNumber(cluster.views)}</td>
                  <td className="p-2 text-sm text-right">{formatNumber(cluster.clicks)}</td>
                  <td className="p-2 text-sm text-right">{formatPercent(cluster.ctr)}</td>
                  <td className="p-2 text-sm text-right">{formatCurrency(cluster.cpc)}</td>
                  <td className="p-2 text-sm text-right">{formatCurrency(cluster.cpm)}</td>
                  <td className="p-2 text-sm text-right">{formatCurrency(cluster.sum)}</td>
                  <td className="p-2 text-sm text-right">{cluster.avg_pos.toFixed(1)}</td>
                  <td className="p-2 text-sm text-right">{formatNumber(cluster.atbs || 0)}</td>
                  <td className="p-2 text-sm text-right">{formatNumber(cluster.orders)}</td>
                  <td className="p-2 text-sm text-right">
                    {cluster.bid ? formatCurrency(cluster.bid) : '-'}
                  </td>
                  <td className="p-2 text-center">
                    {cluster.minus ? (
                      <span className="text-red-600 font-bold">✓</span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
