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

const STATUS_OPTIONS = [
  { value: 'awaiting', label: 'Ожидает начала' },
  { value: 'in-progress', label: 'В процессе' },
  { value: 'completed', label: 'Завершен' },
  { value: 'cancelled', label: 'Отменен' },
];

const REGIONS = ['Астана', 'Алматы', 'Шымкент', 'Москва', 'Санкт-Петербург'];

interface AuctionDetailInfoProps {
  title: string;
  date: string;
  eventType?: string;
  status?: string;
  region?: string;
  organizer?: string;
  event: string;
  setEvent: (eventType: string) => void;
}

export function AuctionDetailInfo({
  title,
  date,
  eventType = 'tender',
  status = 'awaiting',
  region = 'Астана',
  organizer = 'Т. Аспанбек',
  setEvent
}: AuctionDetailInfoProps) {
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [selectedRegion, setSelectedRegion] = useState(region);

  const statusConfig = getStatusConfig(selectedStatus);
  const StatusIcon = statusConfig.icon;

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
                'flex h-7 w-[172px] items-center justify-between gap-[10px] rounded border border-[#E2E8F0] py-1 px-2 text-sm font-medium text-slate-700',
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
          <span className='text-sm font-medium text-slate-600'>Регион:</span>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className='flex h-7 w-[156px] items-center justify-between gap-[10px] rounded border border-[#E2E8F0] bg-white py-1 px-2 text-sm font-medium text-slate-700'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='rounded-md border border-[#E2E8F0] bg-white shadow-md'>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col justify-center gap-1'>
          <span className='text-sm font-medium text-[#64748B]'>Организатор:</span>
          <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>
            {organizer}
          </span>
        </div>

        <div className='h-12 w-px bg-[#E2E8F0]' />

        <div className='flex gap-9'>
          <div className='flex h-16 w-[183px] flex-col gap-1 p-0'>
            <h3 className='text-sm font-semibold text-[#64748B]'>Протокол тех. совета</h3>
            <div className='flex items-center gap-3'>
              <div className='flex p-[10px] items-center justify-center rounded bg-[#F1F5F9]'>
                <ArrowDownToLine className='size-4 text-slate-600' />
              </div>
              <div className='flex flex-col'>
                <span className='text-sm font-semibold text-slate-900'>File name</span>
                <span className='text-xs text-slate-500'>100 KB | Nov 24, 20:08</span>
              </div>
            </div>
          </div>

          <div className='flex h-16 w-[183px] flex-col gap-1 p-0'>
            <h3 className='text-sm font-semibold text-[#64748B]'>Протокол тех. совета</h3>
            <div className='flex items-center gap-3'>
              <div className='flex p-[10px] items-center justify-center rounded bg-[#F1F5F9]'>
                <ArrowDownToLine className='size-4 text-slate-600' />
              </div>
              <div className='flex flex-col'>
                <span className='text-sm font-semibold text-slate-900'>File name</span>
                <span className='text-xs text-slate-500'>100 KB | Nov 24, 20:08</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

