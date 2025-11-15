'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClusterStats } from '@/types';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ClusterChartsProps {
  clusters: ClusterStats[];
}

export function ClusterCharts({ clusters }: ClusterChartsProps) {
  if (!clusters || clusters.length === 0) {
    return null;
  }

  // Get top 10 clusters by clicks
  const topClusters = [...clusters]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  const ctrData = topClusters.map((c) => ({
    name: c.norm_query.length > 20 ? c.norm_query.substring(0, 20) + '...' : c.norm_query,
    fullName: c.norm_query,
    ctr: c.ctr,
  }));

  const spendingData = topClusters.map((c) => ({
    name: c.norm_query.length > 20 ? c.norm_query.substring(0, 20) + '...' : c.norm_query,
    fullName: c.norm_query,
    sum: c.sum,
  }));

  return (
    <div className="space-y-4 mt-6">
      {/* Top CTR Chart */}
      <Card>
        <CardHeader>
          <CardTitle>ТОП-10 фраз по CTR</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={ctrData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip
                formatter={(value: number) => formatPercent(value)}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.fullName;
                  }
                  return label;
                }}
              />
              <Legend />
              <Bar dataKey="ctr" fill="#8b5cf6" name="CTR %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Spending Chart */}
      <Card>
        <CardHeader>
          <CardTitle>ТОП-10 фраз по расходам</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={spendingData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.fullName;
                  }
                  return label;
                }}
              />
              <Legend />
              <Bar dataKey="sum" fill="#ef4444" name="Расходы" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
