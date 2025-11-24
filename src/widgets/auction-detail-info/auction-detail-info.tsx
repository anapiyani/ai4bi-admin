'use client';

import { useState } from 'react';
import {
  ArrowDownToLine,
  CheckCircle,
  Clock,
  Radio,
  XCircle,
} from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { downloadFile } from '@/shared/lib/download-file';

const EVENT_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'tender', label: 'Тендер' },
  { value: 'tech', label: 'Тех. совет' },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'awaiting':
      return {
        bgColor: 'bg-[#FFFFFF]',
        textColor: 'text-[#020617]',
        icon: Clock,
      };
    case 'in-progress':
      return {
        bgColor: 'bg-[#EFF6FF]',
        textColor: 'text-[#1D4ED8]',
        icon: Radio,
      };
    case 'completed':
      return {
        bgColor: 'bg-[#F0FDF4]',
        textColor: 'text-[#15803D]',
        icon: CheckCircle,
      };
    case 'cancelled':
      return {
        bgColor: 'bg-[#FEF2F2]',
        textColor: 'text-[#DC2626]',
        icon: XCircle,
      };
    default:
      return {
        bgColor: 'bg-[#FFFFFF]',
        textColor: 'text-[#020617]',
        icon: null,
      };
  }
};

type AuctionStatus = 'AuctionPlanning' | 'AuctionActive' | 'AuctionFinished' | 'AuctionEnd' | 'TechCouncilPlanning' | 'TechCouncilActive' | 'TechCouncilEnd' | 'TechCouncilFinished';

const STATUS_OPTIONS: {
  value: AuctionStatus;
  label: string;
  color: string;
  icon?: 'play' | 'pause';
}[] = [
  {
    value: 'AuctionPlanning',
    label: 'Тендер ожидает начала',
    color: 'bg-[#E6F0FF] text-[#1D4ED8]',
    icon: 'pause',
  },
  {
    value: 'AuctionActive',
    label: 'Тендер в процессе',
    color: 'bg-[#E8EDFF] text-[#4338CA]',
    icon: 'play',
  },
  {
    value: 'AuctionFinished',
    label: 'Тендер завершен',
    color: 'bg-[#E6F9EB] text-[#047857]',
  },
  {
    value: 'AuctionEnd',
    label: 'Тендер отменен',
    color: 'bg-[#FEEAEA] text-[#DC2626]',
  },
  {
    value: 'TechCouncilPlanning',
    label: 'Тех совет ожидает начала',
    color: 'bg-[#E6F0FF] text-[#1D4ED8]',
    icon: 'pause',
  },
  {
    value: 'TechCouncilActive',
    label: 'Тех совет в процессе',
    color: 'bg-[#E8EDFF] text-[#4338CA]',
    icon: 'play',
  },
  {
    value: 'TechCouncilEnd',
    label: 'Тех совет отменен',
    color: 'bg-[#FEEAEA] text-[#DC2626]',
  },
  {
    value: 'TechCouncilFinished',
    label: 'Тех совет завершен',
    color: 'bg-[#E6F9EB] text-[#047857]',
  },
];

interface AuctionDetailInfoProps {
  title: string;
  date: string;
  eventType?: string;
  status?: string;
  region?: string;
  organizer?: string;
  chat_id: string;
  auction_id: string;
  event: string;
  setEvent: (eventType: string) => void;
}

export function AuctionDetailInfo({
  title,
  date,
  eventType,
  status,
  region,
  organizer,
  chat_id,
  auction_id,
  setEvent
}: AuctionDetailInfoProps) {
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [selectedRegion] = useState(region);

  const statusConfig = getStatusConfig(selectedStatus as string);
  const StatusIcon = statusConfig.icon;

  const handleExportTechProtocol = async () => {
    try {
      await downloadFile(`/api/tech_protocol/export/${chat_id}`);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  }

  const handleExportAuction = async () => {
    try {
      await downloadFile(`/api/auctions/export/${auction_id}`);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  }
  return (
    <div className='flex h-[182px] w-full flex-col gap-4 rounded-lg border border-[#E2E8F0] py-6 px-8'>
      <div>
        <h1 className='text-2xl font-semibold text-slate-900'>{title}</h1>
        <p className='mt-1 text-sm text-slate-500'>{date}</p>
      </div>

      <div className='flex flex-wrap items-start  gap-9'>
        <div className='flex flex-col justify-center gap-1'>
          <span className='text-sm font-medium text-slate-600'>Тип мероприятия:</span>
          <Select value={eventType} onValueChange={setEvent}>
            <SelectTrigger
              className={cn(
                'flex h-7 w-[156px] items-center justify-between gap-[10px] rounded border border-[#E2E8F0] py-1 px-2 text-sm font-medium text-slate-700',
                eventType === 'tender'
                  ? 'bg-[#F0FDF4]'
                  : 'bg-[#E0F2FE]'
              )}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='rounded-md border border-[#E2E8F0] bg-white shadow-md'>
              {EVENT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col justify-center gap-1'>
          <span className='text-sm font-medium text-slate-600'>Статус:</span>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger
              className={cn(
                'flex  w-[200px] items-center justify-between gap-[10px] rounded border border-[#E2E8F0] py-1 px-2 text-sm font-medium text-slate-700',
                statusConfig.bgColor
              )}
            >
              <div className={`flex items-center gap-2 ${statusConfig.textColor}`}>
                {StatusIcon && (
                  <StatusIcon size={16} className={statusConfig.textColor} />
                )}
                <SelectValue className={statusConfig.textColor} />
              </div>
            </SelectTrigger>
            <SelectContent className='rounded-md border border-[#E2E8F0] bg-white shadow-md'>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col justify-center gap-1'>
          <span className='text-sm font-medium text-[#64748B]'>Регион:</span>
          <div className="font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]">
            {selectedRegion ?? "Не назначено"}
          </div>
        </div>

        <div className='flex flex-col justify-center gap-1'>
          <span className='text-sm font-medium text-[#64748B]'>Организатор:</span>
          <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>
            {organizer}
          </span>
        </div>

        <div className='h-12 w-px bg-[#E2E8F0]' />

        <div className='flex gap-9'>
          <div className='flex h-16 w-[183px] flex-col gap-1 p-0 cursor-pointer' onClick={handleExportTechProtocol}>
            <h3 className='text-sm font-semibold text-[#64748B]'>Протокол тех. совета</h3>
            <div className='flex items-center gap-3'>
              <div className='flex p-[10px] items-center justify-center rounded bg-[#F1F5F9]'>
                <ArrowDownToLine className='size-4 text-slate-600' />
              </div>
              <div className='flex flex-col'>
                <span className='text-sm font-semibold text-slate-900'>{title.slice(0, 26)}...</span>
                {/* <span className='text-xs text-slate-500'>100 KB | Nov 24, 20:08</span> */}
              </div>
            </div>
          </div>

          <div 
            className='flex h-16 w-[183px] flex-col gap-1 p-0 cursor-pointer' 
            onClick={handleExportAuction}
          >
            <h3 className='text-sm font-semibold text-[#64748B]'>Протокол тендера</h3>
            <div className='flex items-center gap-3'>
              <div className='flex p-[10px] items-center justify-center rounded bg-[#F1F5F9]'>
                <ArrowDownToLine className='size-4 text-slate-600' />
              </div>
              <div className='flex flex-col'>
                <span className='text-sm font-semibold text-slate-900'>{title.slice(0, 26)}...</span>
                {/* <span className='text-xs text-slate-500'>100 KB | Nov 24, 20:08</span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

