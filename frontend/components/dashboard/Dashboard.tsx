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
import { apiClient } from '@/lib/api-client';
import { Campaign, CampaignStats, ClusterStats } from '@/types';
import { LogOut, RefreshCw } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [clusters, setClusters] = useState<ClusterStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'clusters'>('overview');
  
  // Date range state
  const [beginDate, setBeginDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [nmId, setNmId] = useState('');

  const loadCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getCampaigns();
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

  const loadStats = async (campaignId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getCampaignStats(campaignId, beginDate, endDate);
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || 'Ошибка загрузки статистики');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  const loadClusters = async (campaignId: number) => {
    if (!nmId) {
      setError('Введите nm_id товара для загрузки кластеров');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getClusterStats(
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

  const handleCampaignSelect = (id: number) => {
    setSelectedCampaignId(id);
    setStats(null);
    setClusters([]);
    setActiveTab('overview');
    loadStats(id);
  };

  const handleTabChange = (tab: 'overview' | 'clusters') => {
    setActiveTab(tab);
    if (tab === 'clusters' && selectedCampaignId && nmId) {
      loadClusters(selectedCampaignId);
    }
  };

  const handleLogout = () => {
    apiClient.clearApiKey();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">WB Ads Dashboard</h1>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Campaigns List */}
          <div className="lg:col-span-1">
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
                {campaigns.length === 0 && !loading && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-4">Загрузите список кампаний</p>
                    <Button onClick={loadCampaigns}>Загрузить кампании</Button>
                  </div>
                )}
                {campaigns.length > 0 && (
                  <CampaignList
                    campaigns={campaigns}
                    selectedId={selectedCampaignId}
                    onSelect={handleCampaignSelect}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {!selectedCampaignId && (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  Выберите кампанию из списка слева
                </CardContent>
              </Card>
            )}

            {selectedCampaignId && (
              <div className="space-y-6">
                {/* Date Range Controls */}
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Начало периода</label>
                        <Input
                          type="date"
                          value={beginDate}
                          onChange={(e) => setBeginDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Конец периода</label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">nm_id товара</label>
                        <Input
                          type="number"
                          placeholder="Введите nm_id"
                          value={nmId}
                          onChange={(e) => setNmId(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        onClick={() => loadStats(selectedCampaignId)}
                        disabled={loading}
                        className="mr-2"
                      >
                        Обновить статистику
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs */}
                <div className="flex gap-2 border-b">
                  <button
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'overview'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => handleTabChange('overview')}
                  >
                    Обзор статистики
                  </button>
                  <button
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'clusters'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => handleTabChange('clusters')}
                  >
                    Поисковые кластеры
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4 text-red-600">{error}</CardContent>
                  </Card>
                )}

                {/* Tab Content */}
                {activeTab === 'overview' && stats && (
                  <div className="space-y-6">
                    <StatsOverview stats={stats} />
                    {stats.days && stats.days.length > 0 && (
                      <DailyStatsChart days={stats.days} />
                    )}
                  </div>
                )}
                {activeTab === 'clusters' && (
                  <div>
                    <ClusterTable clusters={clusters} />
                    <ClusterCharts clusters={clusters} />
                  </div>
                )}

                {loading && (
                  <Card>
                    <CardContent className="p-6 text-center text-gray-500">
                      Загрузка данных...
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
