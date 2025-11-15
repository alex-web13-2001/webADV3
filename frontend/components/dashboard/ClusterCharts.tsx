'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClusterStats } from '@/types';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';

interface ClusterChartsProps {
  clusters: ClusterStats[];
}

/**
 * Компонент с графиками для анализа CPM кластеров
 * Включает ТОП-10 по кликам, CTR vs позиция, Bid vs CTR
 */
export function ClusterCharts({ clusters }: ClusterChartsProps) {
  if (!clusters || clusters.length === 0) {
    return null;
  }

  // ТОП-10 кластеров по кликам
  const topClustersByClicks = [...clusters]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10)
    .map((c) => ({
      name: c.norm_query.length > 20 ? c.norm_query.substring(0, 20) + '...' : c.norm_query,
      fullName: c.norm_query,
      clicks: c.clicks,
      ctr: c.ctr,
    }));

  // Данные для scatter chart CTR vs позиция
  const ctrVsPositionData = clusters
    .filter((c) => c.avg_pos > 0)
    .map((c) => ({
      name: c.norm_query,
      position: c.avg_pos,
      ctr: c.ctr,
      clicks: c.clicks,
    }));

  // Данные для scatter chart Bid vs CTR
  const bidVsCtrData = clusters
    .filter((c) => c.bid && c.bid > 0)
    .map((c) => ({
      name: c.norm_query,
      bid: c.bid,
      ctr: c.ctr,
      clicks: c.clicks,
    }));

  return (
    <div className="space-y-6 mt-6">
      {/* ТОП-10 кластеров по кликам */}
      <Card>
        <CardHeader>
          <CardTitle>ТОП-10 кластеров по кликам</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topClustersByClicks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={150}
                tick={{ fontSize: 11 }}
              />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'clicks') return [formatNumber(value), 'Клики'];
                  if (name === 'ctr') return [formatPercent(value), 'CTR'];
                  return [value, name];
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.fullName;
                  }
                  return label;
                }}
              />
              <Legend />
              <Bar dataKey="clicks" fill="#3b82f6" name="Клики" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CTR vs позиция */}
      {ctrVsPositionData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>CTR vs Позиция</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Зависимость CTR от средней позиции в поиске
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="position"
                  name="Позиция"
                  reversed
                  label={{ value: 'Позиция', position: 'insideBottom', offset: -10 }}
                />
                <YAxis
                  type="number"
                  dataKey="ctr"
                  name="CTR"
                  label={{ value: 'CTR %', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis type="number" dataKey="clicks" range={[50, 500]} name="Клики" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value: any, name: string) => {
                    if (name === 'CTR') return [formatPercent(value), name];
                    if (name === 'Клики') return [formatNumber(value), name];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Поисковая фраза`}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg">
                          <p className="font-semibold mb-2 max-w-xs break-words">{data.name}</p>
                          <p className="text-sm">Позиция: {data.position}</p>
                          <p className="text-sm">CTR: {formatPercent(data.ctr)}</p>
                          <p className="text-sm">Клики: {formatNumber(data.clicks)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Кластеры" data={ctrVsPositionData} fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Bid vs CTR */}
      {bidVsCtrData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ставка vs CTR</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Зависимость CTR от размера ставки
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="bid"
                  name="Ставка"
                  label={{ value: 'Ставка (₽)', position: 'insideBottom', offset: -10 }}
                />
                <YAxis
                  type="number"
                  dataKey="ctr"
                  name="CTR"
                  label={{ value: 'CTR %', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis type="number" dataKey="clicks" range={[50, 500]} name="Клики" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg">
                          <p className="font-semibold mb-2 max-w-xs break-words">{data.name}</p>
                          <p className="text-sm">Ставка: {formatCurrency(data.bid)}</p>
                          <p className="text-sm">CTR: {formatPercent(data.ctr)}</p>
                          <p className="text-sm">Клики: {formatNumber(data.clicks)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Кластеры" data={bidVsCtrData} fill="#10b981" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
