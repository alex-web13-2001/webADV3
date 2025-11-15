'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ManualKeyword } from '@/types';
import { apiClient } from '@/lib/api-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RefreshCw } from 'lucide-react';

interface ManualKeywordsProps {
  campaignId: number;
}

/**
 * Компонент для отображения ключевых фраз ручной кампании
 * Включает таблицу и график ТОП-20 фраз по кликам
 */
export function ManualKeywords({ campaignId }: ManualKeywordsProps) {
  const [keywords, setKeywords] = useState<ManualKeyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Загрузка ключевых фраз из API
   */
  const loadKeywords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getManualKeywords(campaignId);
      if (response.success) {
        setKeywords(response.data || []);
      } else {
        setError(response.message || 'Ошибка загрузки ключевых фраз');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки ключевых фраз');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Форматирование числа
   */
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(num));
  };

  /**
   * Форматирование процента
   */
  const formatPercent = (num: number) => {
    return `${num.toFixed(2)}%`;
  };

  /**
   * Форматирование суммы
   */
  const formatCurrency = (num: number) => {
    return `${formatNumber(num)} ₽`;
  };

  // ТОП-20 фраз по кликам для графика
  const top20Keywords = [...keywords]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 20);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Ключевые фразы ручной кампании</CardTitle>
            <Button
              size="sm"
              onClick={loadKeywords}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Загрузить фразы
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-sm text-red-600 mb-4">{error}</div>
          )}

          {loading && (
            <div className="text-center py-8 text-gray-500">
              Загрузка ключевых фраз...
            </div>
          )}

          {!loading && keywords.length === 0 && !error && (
            <div className="text-center py-8 text-gray-500">
              Нажмите "Загрузить фразы" для получения данных
            </div>
          )}

          {!loading && keywords.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Ключевая фраза</th>
                    <th className="text-right p-2 font-medium">Показы</th>
                    <th className="text-right p-2 font-medium">Клики</th>
                    <th className="text-right p-2 font-medium">CTR</th>
                    <th className="text-right p-2 font-medium">CPC</th>
                    <th className="text-right p-2 font-medium">Заказы</th>
                    <th className="text-right p-2 font-medium">Расходы</th>
                    <th className="text-center p-2 font-medium">Минус</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((keyword, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">{keyword.keyword}</td>
                      <td className="p-2 text-right">{formatNumber(keyword.views)}</td>
                      <td className="p-2 text-right">{formatNumber(keyword.clicks)}</td>
                      <td className="p-2 text-right">{formatPercent(keyword.ctr)}</td>
                      <td className="p-2 text-right">{formatCurrency(keyword.cpc)}</td>
                      <td className="p-2 text-right">{formatNumber(keyword.orders)}</td>
                      <td className="p-2 text-right">{formatCurrency(keyword.sum)}</td>
                      <td className="p-2 text-center">
                        {keyword.minus ? (
                          <span className="text-red-600">✓</span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {top20Keywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>ТОП-20 фраз по кликам</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={top20Keywords}
                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="keyword"
                  angle={-45}
                  textAnchor="end"
                  height={150}
                  interval={0}
                  tick={{ fontSize: 11 }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatNumber(value)}
                  labelStyle={{ color: '#000' }}
                />
                <Bar dataKey="clicks" name="Клики">
                  {top20Keywords.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#3b82f6" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
