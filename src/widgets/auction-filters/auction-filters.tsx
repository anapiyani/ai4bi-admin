'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon} from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const REGIONS = [
  'Астана',
  'Алматы',
  'Шымкент',
  'Караганда',
  'Тараз',
  'Өскемен',
  'Павлодар',
  'Ақтөбе',
  'Семей',
  'Көкшетау',
];

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

type AuctionFiltersProps = {
  search?: string;
  region?: string;
  eventType?: string;
  status?: string;
  dateRange?: DateRange;
  onSearchChange?: (value: string) => void;
  onRegionChange?: (value: string | undefined) => void;
  onEventTypeChange?: (value: string) => void;
  onStatusChange?: (value: string | undefined) => void;
  onDateRangeChange?: (value: DateRange | undefined) => void;
  onSearch?: () => void;
};

export function AuctionFilters({
  search,
  region,
  status,
  dateRange,
  onSearchChange,
  onRegionChange,
  onStatusChange,
  onDateRangeChange,
  onSearch,
}: AuctionFiltersProps) {
  const formatDateRange = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) {
      return 'Дата';
    }
    return `${format(dateRange.from, 'dd.MM', { locale: ru })}-${format(dateRange.to, 'dd.MM', { locale: ru })}`;
  }, [dateRange]);

  return (
    <section className='flex w-full max-w-6xl flex-wrap items-center gap-3 rounded-3xl bg-white p-4 items-stretch'>
      <Input
        placeholder='Поиск'
        value={search || ''}
        onChange={(e) => onSearchChange?.(e.target.value)}
        className='h-10 w-[340px] gap-2 rounded-md border border-[#E2E8F0] bg-white py-2 px-3 font-sans text-sm font-normal leading-5 tracking-normal align-middle text-[#64748B] placeholder:text-slate-500'
      />

      <Select onValueChange={onRegionChange} value={region}>
        <SelectTrigger className='!h-10 w-[95px] rounded-md border-[#E2E8F0] bg-white px-3 text-sm font-normal leading-5 tracking-normal align-middle text-[#64748B]'>
          <SelectValue placeholder='Регион' />
        </SelectTrigger>
        <SelectContent className='rounded-2xl bg-white shadow-lg'>
          {REGIONS.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={onStatusChange} value={status}>
        <SelectTrigger className='!h-10 w-[94px] rounded-md border-[#E2E8F0] bg-white px-3 text-sm font-normal leading-5 tracking-normal align-middle text-[#64748B]'>
          <SelectValue placeholder='Статус' />
        </SelectTrigger>
        <SelectContent className='rounded-2xl bg-white shadow-lg'>
          {STATUS_OPTIONS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='ghost'
            className={cn(
              '!h-10 w-[148px] rounded-md border border-[#E2E8F0] flex justify-between bg-white px-3 text-sm font-normal text-[#64748B]',
              (!dateRange?.from || !dateRange?.to) && 'text-slate-500'
            )}
          >
            {formatDateRange}
            <CalendarIcon className='mr-2 size-4 text-slate-500' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto rounded-3xl border-0 p-0 shadow-xl'>
          <Calendar
            mode='range'
            selected={{
              from: dateRange?.from,
              to: dateRange?.to,
            }}
            onSelect={(date) => onDateRangeChange?.(date as DateRange)}
            locale={ru}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Button 
        onClick={onSearch}
        className='cursor-pointer h-10 w-[82px] gap-1.5 rounded-md bg-[#F1F5F9] py-2 px-4 font-sans text-sm font-medium leading-5 tracking-normal text-center align-middle text-[#0F172A] hover:bg-[#F1F5F9]'
      >
        Искать
      </Button>
    </section>
  );
}

