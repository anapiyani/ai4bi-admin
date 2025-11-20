'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ArrowLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { AuctionDetailHeader } from '@/widgets/auction-detail-header';
import { AuctionDetailInfo } from '@/widgets/auction-detail-info';
import { AuctionSuppliersTable } from '@/widgets/auction-suppliers-table';
import { AuctionProcessOverview } from '@/widgets/auction-process-overview';
import { useSuppliers } from "@/hooks/useSuppliers";
import { ChangeLot } from "@/features/change-supplier-lot";

import { Button } from '../../../components/ui/button'

interface AuctionDetailContentProps {
  auctionChatId: string;
}

const formatDateTime = (date: string) => {
  try {
    const d = new Date(date);
    return format(d, 'dd.MM.yyyy, HH:mm', { locale: ru });
  } catch {
    return date;
  }
};

export function AuctionDetailContent({ auctionChatId }: AuctionDetailContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('about');
  const [event, setEvent] = useState('tender');
  const [lot, setLot] = useState<number>(0);
  const { data: auctionData, isLoading, error } = useSuppliers(
    {
      auctionChatId: auctionChatId,
      eventType: event,
    },
  );

  return (
    <div className='flex w-full flex-col gap-8'>
      <AuctionDetailHeader value={activeTab} onValueChange={setActiveTab} />

      {activeTab === 'about' && (
        <>
          {isLoading ? (
            <div className='text-center py-8'>Загрузка...</div>
          ) : error ? (
            <div className='text-center py-8 text-red-500'>Ошибка загрузки данных</div>
          ) : auctionData ? (
            <>
              <Button variant='outline' className='h-10 rounded-md border-slate-200 !bg-white px-4 text-sm font-medium text-slate-700 shadow-sm w-1/12' onClick={() => router.back()}>
                <ArrowLeftIcon className='size-4' />
                Назад
              </Button>
              <AuctionDetailInfo
                title={auctionData.name}
                date={formatDateTime(auctionData.date)}
                eventType={auctionData.event_type}
                status={auctionData.chat_status}
                region={auctionData.region || undefined}
                organizer={auctionData.organizer}
                chat_id={auctionData.chat_id}
                auction_id={auctionData.auction_id}
                setEvent={setEvent}
                event={event}
              />
              <ChangeLot options={auctionData.protocol.lots} value={lot} onChange={setLot} />
              <AuctionSuppliersTable auctionChatId={auctionChatId} event={event} lot={lot}/>
            </>
          ) : null}
        </>
      )}

      {activeTab === 'overview' && auctionData && <AuctionProcessOverview chat_id={auctionData.chat_id}/>}
    </div>
  );
}

