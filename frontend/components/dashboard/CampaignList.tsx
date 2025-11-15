'use client';

import { Campaign } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

interface CampaignListProps {
  campaigns: Campaign[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const statusLabels: Record<number, { label: string; color: string }> = {
  4: { label: 'Готова к запуску', color: 'bg-blue-100 text-blue-800' },
  7: { label: 'Завершена', color: 'bg-gray-100 text-gray-800' },
  8: { label: 'Отказался', color: 'bg-red-100 text-red-800' },
  9: { label: 'Идут показы', color: 'bg-green-100 text-green-800' },
  11: { label: 'Пауза', color: 'bg-yellow-100 text-yellow-800' },
};

const typeLabels: Record<number, string> = {
  4: 'Кампания в каталоге',
  5: 'Кампания в карточке товара',
  6: 'Кампания в поиске',
  7: 'Кампания в рекомендациях',
  8: 'Автоматическая кампания',
  9: 'Поиск + Каталог',
};

export function CampaignList({ campaigns, selectedId, onSelect }: CampaignListProps) {
  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Кампании не найдены
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {campaigns.map((campaign) => {
        const status = statusLabels[campaign.status] || {
          label: 'Неизвестно',
          color: 'bg-gray-100 text-gray-800',
        };
        const type = typeLabels[campaign.type] || 'Неизвестный тип';

        return (
          <Card
            key={campaign.advertId}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedId === campaign.advertId ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onSelect(campaign.advertId)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{campaign.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{type}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Создана: {formatDate(campaign.createTime)}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                >
                  {status.label}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
