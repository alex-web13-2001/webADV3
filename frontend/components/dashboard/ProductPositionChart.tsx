'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DayStats, NmStats } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ProductPositionChartProps {
  days: DayStats[];
  products: NmStats[];
}

/**
 * Компонент графика средней позиции товаров по дням
 * Позволяет выбрать товар для отображения его позиции
 */
export function ProductPositionChart({ days, products }: ProductPositionChartProps) {
  const [selectedNmId, setSelectedNmId] = useState<number | null>(null);

  // Подготовка данных для графика
  const chartData = days.map((day) => {
    const dataPoint: any = {
      date: day.date,
      dateFormatted: format(new Date(day.date), 'd MMM', { locale: ru }),
    };

    // Если выбран товар, находим его позицию в этот день
    if (selectedNmId && day.apps) {
      day.apps.forEach((app) => {
        if (app.nms) {
          app.nms.forEach((nm) => {
            if (nm.nmId === selectedNmId) {
              dataPoint.avgPosition = nm.avgPosition || 0;
            }
          });
        }
      });
    }

    return dataPoint;
  });

  // Если нет товаров, не показываем компонент
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Средняя позиция товара</CardTitle>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Выберите товар:</label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedNmId || ''}
            onChange={(e) => setSelectedNmId(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">-- Выберите nm_id --</option>
            {products.map((product) => (
              <option key={product.nm_id} value={product.nm_id}>
                {product.nm_id} - {product.name || 'Без названия'}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {!selectedNmId && (
          <div className="text-center py-8 text-gray-500">
            Выберите товар для отображения графика позиций
          </div>
        )}

        {selectedNmId && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="dateFormatted"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                reversed
                label={{ value: 'Позиция', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                labelFormatter={(label) => `Дата: ${label}`}
                formatter={(value: any) => [`Позиция ${value}`, '']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgPosition"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Средняя позиция"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
