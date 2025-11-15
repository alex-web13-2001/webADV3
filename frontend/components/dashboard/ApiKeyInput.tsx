'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { AlertCircle, CheckCircle2, Key } from 'lucide-react';

interface ApiKeyInputProps {
  onSuccess: () => void;
}

export function ApiKeyInput({ onSuccess }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setError('Пожалуйста, введите API ключ');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiClient.testApiKey(apiKey);
      
      if (response.success) {
        apiClient.setApiKey(apiKey);
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 500);
      } else {
        setError(response.message || 'Ошибка проверки ключа');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Неверный API ключ или ошибка сервера';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTestKey();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Key className="h-6 w-6 text-blue-600" />
            <CardTitle>WB Ads Dashboard</CardTitle>
          </div>
          <CardDescription>
            Введите API ключ Wildberries для доступа к аналитике
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Введите API ключ"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>API ключ успешно проверен</span>
              </div>
            )}
          </div>
          <Button
            onClick={handleTestKey}
            disabled={loading || !apiKey.trim()}
            className="w-full"
          >
            {loading ? 'Проверка...' : 'Проверить API ключ'}
          </Button>
          <div className="text-xs text-gray-500 space-y-1">
            <p>💡 Получить API ключ можно в личном кабинете продавца WB</p>
            <p>📚 Документация: <a href="https://dev.wildberries.ru/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">dev.wildberries.ru</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
