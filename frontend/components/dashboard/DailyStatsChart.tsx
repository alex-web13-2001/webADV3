'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DayStats } from '@/types';
import { formatDate, formatNumber, formatCurrency } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DailyStatsChartProps {
  days: DayStats[];
}

export function DailyStatsChart({ days }: DailyStatsChartProps) {
  if (!days || days.length === 0) {
    return null;
  }

  // Transform data for the chart
  const chartData = days.map((day) => ({
    date: formatDate(day.date),
    views: day.views,
    clicks: day.clicks,
    ctr: day.ctr,
    sum: day.sum,
  }));

  return (
    <div className="space-y-4">
      {/* Views and Clicks Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Показы и клики по дням</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatNumber(value)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
                name="Показы"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#10b981"
                name="Клики"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CTR Chart */}
      <Card>
        <CardHeader>
          <CardTitle>CTR по дням</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)}%`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="ctr"
                stroke="#8b5cf6"
                name="CTR %"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Spending Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Расходы по дням</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sum"
                stroke="#ef4444"
                name="Расходы"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
