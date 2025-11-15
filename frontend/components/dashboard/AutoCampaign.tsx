'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AutoCampaignData, AutoCampaignCluster, AvailableNm } from '@/types';
import { apiClient } from '@/lib/api-client';
import { RefreshCw } from 'lucide-react';

interface AutoCampaignProps {
  campaignId: number;
}

/**
 * Компонент для отображения статистики автокампании
 * Включает кластеры, минус-фразы и доступные товары
 */
export function AutoCampaign({ campaignId }: AutoCampaignProps) {
  const [data, setData] = useState<AutoCampaignData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Загрузка статистики автокампании из API
   */
  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getAutoStats(campaignId);
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message || 'Ошибка загрузки статистики');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  const minusClusters = data?.clusters.filter((c) => c.is_minus_cluster) || [];
  const regularClusters = data?.clusters.filter((c) => !c.is_minus_cluster) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Статистика автокампании</CardTitle>
            <Button
              size="sm"
              onClick={loadStats}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Загрузить статистику
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-sm text-red-600 mb-4">{error}</div>
          )}

          {loading && (
            <div className="text-center py-8 text-gray-500">
              Загрузка статистики...
            </div>
          )}

          {!loading && !data && !error && (
            <div className="text-center py-8 text-gray-500">
              Нажмите "Загрузить статистику" для получения данных
            </div>
          )}
        </CardContent>
      </Card>

      {/* Обычные кластеры */}
      {regularClusters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Кластеры</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Кластер</th>
                    <th className="text-right p-2 font-medium">Количество</th>
                    <th className="text-left p-2 font-medium">Ключевые слова</th>
                  </tr>
                </thead>
                <tbody>
                  {regularClusters.map((cluster, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">{cluster.cluster}</td>
                      <td className="p-2 text-right">{cluster.count}</td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-1">
                          {cluster.keywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Минус-фразы */}
      {minusClusters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Минус-фразы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Кластер</th>
                    <th className="text-right p-2 font-medium">Количество</th>
                    <th className="text-left p-2 font-medium">Ключевые слова</th>
                  </tr>
                </thead>
                <tbody>
                  {minusClusters.map((cluster, index) => (
                    <tr key={index} className="border-b hover:bg-red-50">
                      <td className="p-2 text-red-600">{cluster.cluster}</td>
                      <td className="p-2 text-right">{cluster.count}</td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-1">
                          {cluster.keywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Доступные товары для добавления */}
      {data?.availableNms && data.availableNms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Доступные товары для добавления</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">nm_id</th>
                    <th className="text-left p-2 font-medium">Название</th>
                  </tr>
                </thead>
                <tbody>
                  {data.availableNms.map((nm, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono">{nm.nm_id}</td>
                      <td className="p-2">{nm.name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
