'use client';

import { NmStats } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductsTableProps {
  products: NmStats[];
}

/**
 * Компонент таблицы товаров с метриками из fullstats
 * Отображает детальную статистику по каждому товару в кампании
 */
export function ProductsTable({ products }: ProductsTableProps) {
  /**
   * Форматирование числа с разделителями
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

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Товары в кампании</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Нет данных о товарах
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Товары в кампании</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">nm_id</th>
                <th className="text-left p-2 font-medium">Название</th>
                <th className="text-right p-2 font-medium">Показы</th>
                <th className="text-right p-2 font-medium">Клики</th>
                <th className="text-right p-2 font-medium">CTR</th>
                <th className="text-right p-2 font-medium">Расходы</th>
                <th className="text-right p-2 font-medium">CPC</th>
                <th className="text-right p-2 font-medium">Заказы</th>
                <th className="text-right p-2 font-medium">CR</th>
                <th className="text-right p-2 font-medium">ATB</th>
                <th className="text-right p-2 font-medium">Выручка</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-mono">{product.nm_id}</td>
                  <td className="p-2 max-w-xs truncate" title={product.name}>
                    {product.name || '-'}
                  </td>
                  <td className="p-2 text-right">{formatNumber(product.views)}</td>
                  <td className="p-2 text-right">{formatNumber(product.clicks)}</td>
                  <td className="p-2 text-right">{formatPercent(product.ctr)}</td>
                  <td className="p-2 text-right">{formatCurrency(product.sum)}</td>
                  <td className="p-2 text-right">{formatCurrency(product.cpc)}</td>
                  <td className="p-2 text-right">{formatNumber(product.orders)}</td>
                  <td className="p-2 text-right">{formatPercent(product.cr)}</td>
                  <td className="p-2 text-right">{formatNumber(product.atbs)}</td>
                  <td className="p-2 text-right">{formatCurrency(product.sum_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
