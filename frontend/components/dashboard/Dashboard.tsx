'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CampaignList } from './CampaignList';
import { StatsOverview } from './StatsOverview';
import { ClusterTable } from './ClusterTable';
import { DailyStatsChart } from './DailyStatsChart';
import { ClusterCharts } from './ClusterCharts';
import { BalanceWidget } from './BalanceWidget';
import { ProductsTable } from './ProductsTable';
import { ProductPositionChart } from './ProductPositionChart';
import { ManualKeywords } from './ManualKeywords';
import { AutoCampaign } from './AutoCampaign';
import { apiClient } from '@/lib/api-client';
import { Campaign, CampaignStats, ClusterStats } from '@/types';
import { LogOut, RefreshCw } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

/**
 * Главный компонент дашборда
 * Объединяет все разделы: авторизация, кампании, статистика, кластеры
 */
export function Dashboard({ onLogout }: DashboardProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [clusters, setClusters] = useState<ClusterStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'clusters' | 'manual' | 'auto'>('overview');
  
  // Состояние для диапазона дат
  const [beginDate, setBeginDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Состояние для выбора товара (nm_id)
  const [nmId, setNmId] = useState('');
  const [availableNmIds, setAvailableNmIds] = useState<number[]>([]);

  /**
   * Загрузка списка кампаний с fullstats
   */
  const loadCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getCampaignsList(beginDate, endDate);
      if (response.success) {
        setCampaigns(response.data || []);
      } else {
        setError(response.message || 'Ошибка загрузки кампаний');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки кампаний');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Загрузка детальной статистики кампании
   */
  const loadStats = async (campaignId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getCampaignOverview(campaignId, beginDate, endDate);
      if (response.success) {
        setStats(response.data);
        
        // Извлекаем доступные nm_id из статистики
        if (response.data.nms && response.data.nms.length > 0) {
          const nmIds = response.data.nms.map((nm: any) => nm.nm_id);
          setAvailableNmIds(nmIds);
          
          // Автоматически выбираем первый nm_id
          if (nmIds.length > 0 && !nmId) {
            setNmId(nmIds[0].toString());
          }
        }
      } else {
        setError(response.message || 'Ошибка загрузки статистики');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Загрузка CPM кластеров для товара
   */
  const loadClusters = async (campaignId: number) => {
    if (!nmId) {
      setError('Выберите nm_id товара для загрузки кластеров');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getCpmClusters(
        campaignId,
        parseInt(nmId),
        beginDate,
        endDate
      );
      if (response.success) {
        setClusters(response.data || []);
      } else {
        setError(response.message || 'Ошибка загрузки кластеров');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки кластеров');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Обработчик выбора кампании
   */
  const handleCampaignSelect = (id: number) => {
    const campaign = campaigns.find((c) => c.advertId === id);
    if (campaign) {
      setSelectedCampaign(campaign);
      setStats(null);
      setClusters([]);
      setActiveTab('overview');
      loadStats(id);
    }
  };

  /**
   * Обработчик смены таба
   */
  const handleTabChange = (tab: 'overview' | 'clusters' | 'manual' | 'auto') => {
    setActiveTab(tab);
    
    if (tab === 'clusters' && selectedCampaign && nmId) {
      loadClusters(selectedCampaign.advertId);
    }
  };

  /**
   * Выход из системы
   */
  const handleLogout = () => {
    apiClient.clearApiKey();
    onLogout();
  };

  /**
   * Определение типа кампании
   * type: 4 - поиск, 5 - каталог, 6 - карточка товара, 7 - поиск + каталог, 8 - авто, 9 - aвтo в поиске и в каталоге
   */
  const getCampaignType = (type: number) => {
    switch (type) {
      case 4: return 'Поиск';
      case 5: return 'Каталог';
      case 6: return 'Карточка';
      case 7: return 'Поиск + Каталог';
      case 8: return 'Авто';
      case 9: return 'Авто (Поиск + Каталог)';
      default: return `Тип ${type}`;
    }
  };

  const isCpmCampaign = selectedCampaign && [4, 5, 6, 7].includes(selectedCampaign.type);
  const isManualCampaign = selectedCampaign && [4, 5, 6, 7].includes(selectedCampaign.type);
  const isAutoCampaign = selectedCampaign && [8, 9].includes(selectedCampaign.type);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">WB Ads Analytics Dashboard</h1>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Баланс и список кампаний */}
          <div className="lg:col-span-1 space-y-6">
            {/* Баланс */}
            <BalanceWidget />

            {/* Список кампаний */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Кампании</CardTitle>
                  <Button size="sm" onClick={loadCampaigns} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Выбор периода */}
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Начало</label>
                    <Input
                      type="date"
                      value={beginDate}
                      onChange={(e) => setBeginDate(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Конец</label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <Button onClick={loadCampaigns} disabled={loading} className="w-full" size="sm">
                    Загрузить кампании
                  </Button>
                </div>

                {campaigns.length === 0 && !loading && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Нет кампаний</p>
                  </div>
                )}
                
                {campaigns.length > 0 && (
                  <CampaignList
                    campaigns={campaigns}
                    selectedId={selectedCampaign?.advertId || null}
                    onSelect={handleCampaignSelect}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Детальная информация о кампании */}
          <div className="lg:col-span-3">
            {!selectedCampaign && (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  Выберите кампанию из списка слева для просмотра детальной статистики
                </CardContent>
              </Card>
            )}

            {selectedCampaign && (
              <div className="space-y-6">
                {/* Информация о кампании */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold mb-1">{selectedCampaign.name}</h2>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>ID: {selectedCampaign.advertId}</span>
                          <span>Тип: {getCampaignType(selectedCampaign.type)}</span>
                          <span>Статус: {selectedCampaign.status === 9 ? 'Активна' : 'Остановлена'}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => loadStats(selectedCampaign.advertId)}
                        disabled={loading}
                        size="sm"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Обновить
                      </Button>
                    </div>

                    {/* Выбор nm_id для CPM кластеров */}
                    {isCpmCampaign && availableNmIds.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">nm_id товара для кластеров:</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={nmId}
                          onChange={(e) => setNmId(e.target.value)}
                        >
                          <option value="">-- Выберите nm_id --</option>
                          {availableNmIds.map((id) => (
                            <option key={id} value={id}>
                              {id}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Табы */}
                <div className="flex gap-2 border-b bg-white p-2 rounded-t-lg">
                  <button
                    className={`px-4 py-2 font-medium transition-colors rounded ${
                      activeTab === 'overview'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => handleTabChange('overview')}
                  >
                    Обзор
                  </button>
                  {isCpmCampaign && (
                    <button
                      className={`px-4 py-2 font-medium transition-colors rounded ${
                        activeTab === 'clusters'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => handleTabChange('clusters')}
                    >
                      CPM Кластеры
                    </button>
                  )}
                  {isManualCampaign && (
                    <button
                      className={`px-4 py-2 font-medium transition-colors rounded ${
                        activeTab === 'manual'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => handleTabChange('manual')}
                    >
                      Ключевые фразы
                    </button>
                  )}
                  {isAutoCampaign && (
                    <button
                      className={`px-4 py-2 font-medium transition-colors rounded ${
                        activeTab === 'auto'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => handleTabChange('auto')}
                    >
                      Автокампания
                    </button>
                  )}
                </div>

                {/* Сообщения об ошибках */}
                {error && (
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4 text-red-600">{error}</CardContent>
                  </Card>
                )}

                {/* Индикатор загрузки */}
                {loading && (
                  <Card>
                    <CardContent className="p-6 text-center text-gray-500">
                      Загрузка данных...
                    </CardContent>
                  </Card>
                )}

                {/* Контент табов */}
                {!loading && (
                  <>
                    {/* Таб "Обзор" */}
                    {activeTab === 'overview' && stats && (
                      <div className="space-y-6">
                        <StatsOverview stats={stats} />
                        
                        {stats.days && stats.days.length > 0 && (
                          <DailyStatsChart days={stats.days} />
                        )}

                        {stats.nms && stats.nms.length > 0 && (
                          <>
                            <ProductPositionChart 
                              days={stats.days || []} 
                              products={stats.nms} 
                            />
                            <ProductsTable products={stats.nms} />
                          </>
                        )}
                      </div>
                    )}

                    {/* Таб "CPM Кластеры" */}
                    {activeTab === 'clusters' && (
                      <div className="space-y-6">
                        {!nmId && (
                          <Card className="border-yellow-200 bg-yellow-50">
                            <CardContent className="p-4 text-yellow-800">
                              Выберите nm_id товара выше для загрузки кластеров
                            </CardContent>
                          </Card>
                        )}
                        {nmId && clusters.length === 0 && !loading && (
                          <Card>
                            <CardContent className="p-6 text-center">
                              <p className="text-gray-500 mb-4">Кластеры не загружены</p>
                              <Button onClick={() => loadClusters(selectedCampaign.advertId)}>
                                Загрузить кластеры
                              </Button>
                            </CardContent>
                          </Card>
                        )}
                        {clusters.length > 0 && (
                          <>
                            <ClusterTable clusters={clusters} />
                            <ClusterCharts clusters={clusters} />
                          </>
                        )}
                      </div>
                    )}

                    {/* Таб "Ключевые фразы" */}
                    {activeTab === 'manual' && (
                      <ManualKeywords campaignId={selectedCampaign.advertId} />
                    )}

                    {/* Таб "Автокампания" */}
                    {activeTab === 'auto' && (
                      <AutoCampaign campaignId={selectedCampaign.advertId} />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
