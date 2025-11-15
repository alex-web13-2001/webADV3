'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { Balance } from '@/types';
import { Wallet, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Компонент виджета баланса рекламного кабинета
 * Отображает основной баланс, бонусы и общую сумму
 */
export function BalanceWidget() {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Загрузка баланса из API
   */
  const loadBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getBalance();
      if (response.success) {
        setBalance(response.data);
      } else {
        setError(response.message || 'Ошибка загрузки баланса');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки баланса');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBalance();
  }, []);

  /**
   * Форматирование суммы в рубли
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const totalBalance = balance ? balance.net + balance.bonus : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Баланс</CardTitle>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={loadBalance}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-sm text-red-600 mb-4">{error}</div>
        )}
        {balance && (
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Общий баланс</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalBalance)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t">
              <div>
                <div className="text-xs text-gray-500">Основной</div>
                <div className="text-lg font-semibold text-gray-700">
                  {formatCurrency(balance.net)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Бонусы</div>
                <div className="text-lg font-semibold text-green-600">
                  {formatCurrency(balance.bonus)}
                </div>
              </div>
            </div>
          </div>
        )}
        {loading && !balance && (
          <div className="text-center py-4 text-gray-500">
            Загрузка баланса...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
