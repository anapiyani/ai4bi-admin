'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon} from 'lucide-react';

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

const REGIONS = ['Москва', 'Санкт-Петербург', 'Новосибирск'];
const EVENT_TYPES = ['Онлайн', 'Офлайн', 'Гибрид'];
const STATUSES = ['Открыт', 'Закрыт', 'Черновик'];

export function AuctionFilters() {
  const [region, setRegion] = useState<string>();
  const [eventType, setEventType] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [date, setDate] = useState<Date>();

  const formattedDate = useMemo(
    () => (date ? format(date, 'dd MMMM yyyy', { locale: ru }) : 'Дата'),
    [date]
  );

  return (
    <section className='flex w-full max-w-6xl flex-wrap items-center gap-3 rounded-3xl bg-white p-4 items-stretch'>
      <Input
        placeholder='Поиск'
        className='h-10 w-[340px] gap-2 rounded-md border border-[#E2E8F0] bg-white py-2 px-3 font-sans text-sm font-normal leading-5 tracking-normal align-middle text-[#64748B] placeholder:text-slate-500'
      />

      <Select onValueChange={setRegion} value={region}>
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

      <Select onValueChange={setEventType} value={eventType}>
        <SelectTrigger className='!h-10 w-[167px] rounded-md border-[#E2E8F0] bg-white px-3 text-sm font-normal leading-5 tracking-normal align-middle text-[#64748B]'>
          <SelectValue placeholder='Тип мероприятия' />
        </SelectTrigger>
        <SelectContent className='rounded-2xl bg-white shadow-lg'>
          {EVENT_TYPES.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={setStatus} value={status}>
        <SelectTrigger className='!h-10 w-[94px] rounded-md border-[#E2E8F0] bg-white px-3 text-sm font-normal leading-5 tracking-normal align-middle text-[#64748B]'>
          <SelectValue placeholder='Статус' />
        </SelectTrigger>
        <SelectContent className='rounded-2xl bg-white shadow-lg'>
          {STATUSES.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
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
              !date && 'text-slate-500'
            )}
          >
            {formattedDate}
            <CalendarIcon className='mr-2 size-4 text-slate-500' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto rounded-3xl border-0 p-0 shadow-xl'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={setDate}
            locale={ru}
          />
        </PopoverContent>
      </Popover>

      <Button className='h-10 w-[82px] gap-1.5 rounded-md bg-[#F1F5F9] py-2 px-4 font-sans text-sm font-medium leading-5 tracking-normal text-center align-middle text-[#0F172A] hover:bg-[#F1F5F9]'>
        Искать
      </Button>
    </section>
  );
}

