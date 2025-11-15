'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { DateRange } from "react-day-picker";

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalytics } from '@/hooks/useAnalytics';

const PERIODS = [
  {
    value: "day",
    label: "По дням"
  },{
  value: "week",
    label: "По неделям"
  },
  {
    value: "month",
    label: "По месяцам"
  }];

const DEFAULT_KPI_METRICS = [
  {
    label: 'Среднее время тендера',
    value: '—',
  },
  {
    label: 'Среднее время ответа ИИ',
    value: '—',
  },
  {
    label: 'Среднее количество участников',
    value: '—',
  },
  {
    label: 'Средняя оценка ответов ИИ',
    value: '—',
  },
  {
    label: 'Среднее количество исправлений/перез...',
    value: '—',
  },
  {
    label: 'Количество проблемных сессий ИИ',
    value: '—',
  },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='rounded-lg bg-white px-3 py-2 shadow-lg border border-slate-200'>
        <p className='text-sm font-medium text-slate-900'>{payload[0].value} тендеров</p>
      </div>
    );
  }
  return null;
};

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const { data, isLoading, error, refetch } = useAnalytics({
    period,
    dateRange
  });

  const formatDateRange = () => {
    if (!dateRange.from || !dateRange.to) {return "Выберите период";}
    return `${format(dateRange.from, 'dd.MM', { locale: ru })}-${format(dateRange.to, 'dd.MM', { locale: ru })}`;
  };

  const getBarColor = (entry: any, index: number) => {
    if (index % 2 === 0) {
      return '#475569';
    } else {
      return '#94a3b8';
    }
  };

  const chartData = data?.chart || [];
  const kpiMetrics = data?.metrics;
  const summary = data?.metrics || {
    tenders_total: 0,
    tenders_with_winner: 0,
    tenders_without_winner: 0,
  };

  // Маппинг ключей метрик на читаемые названия
  const metricLabels: Record<string, string> = {
    avg_commercial_offers_per_tender: 'Среднее количество коммерческих предложений на тендер',
    avg_days_before_start: 'Среднее количество дней до начала',
    avg_response_time_seconds: 'Среднее время ответа ИИ',
    avg_tender_duration_minutes: 'Среднее время тендера',
    avg_wait_minutes: 'Среднее время ожидания',
    commercial_offers_total: 'Всего коммерческих предложений',
    tenders_total: 'Всего тендеров',
    tenders_without_winner: 'Тендеров без победителя',
    tenders_with_winner: 'Тендеров с победителем',
  };

  // Функция для форматирования значений метрик
  const formatMetricValue = (key: string, value: number | string): string => {
    if (typeof value === 'string') {return value;}
    
    switch (key) {
      case 'avg_response_time_seconds':
        return `${Math.round(value)} сек`;
      case 'avg_tender_duration_minutes':
      case 'avg_wait_minutes':
        const hours = Math.floor(value / 60);
        const minutes = Math.round(value % 60);
        return hours > 0 ? `${hours} ч ${minutes} мин` : `${minutes} мин`;
      case 'avg_days_before_start':
        return `${Math.round(value)} дней`;
      default:
        return value.toLocaleString('ru-RU');
    }
  };

  return (
    <div className='flex w-full flex-col gap-8'>
      <div className='flex  w-full flex-col gap-4 rounded-lg border border-[#E2E8F0] py-6 px-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-xl font-semibold leading-7 tracking-normal text-[#020617]'>{summary.tenders_total} тендеров</h2>
            <div className='mt-3 flex flex-wrap items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='size-3 rounded-full bg-[#334155]' />
                <span className='text-sm font-medium leading-7 tracking-normal text-[#475569]'>{summary.tenders_with_winner} тендеров с победителем</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='size-3 rounded-full bg-[#94A3B8]' />
                <span className='text-sm font-medium leading-7 tracking-normal text-[#475569]'> {summary.tenders_without_winner} тендеров без победителя</span>
              </div>
              {/*<div className='flex items-center gap-2'>*/}
              {/*  <div className='size-3 rounded-full bg-[#CBD5E1]' />*/}
              {/*  <span className='text-sm font-medium leading-7 tracking-normal text-[#475569]'>С ошибками: {summary.withErrors}</span>*/}
              {/*</div>*/}
            </div>
          </div>

        </div>

        {/* KPI Cards with Filters */}
        <div className='flex items-stretch justify-between gap-4 flex-col sm:flex-row lg:flex-row'>
        <div className='flex flex-col justify-between gap-4 p-4'>
            <div className='flex flex-col gap-1'>
              <label className='font-sans text-sm font-medium leading-5 tracking-normal text-[#020617]'>Период</label>
              <Select 
                value={period} 
                onValueChange={(value) => setPeriod(value as 'day' | 'week' | 'month')}
                onOpenChange={(open) => {
                  if (!open) {
                    refetch();
                  }
                }}
              >
                <SelectTrigger className='h-10 w-[172px] rounded-md border border-[#E2E8F0] bg-white px-3 text-sm font-normal leading-5 tracking-normal text-[#020617]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='rounded-md bg-white shadow-lg'>
                  {PERIODS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-1'>
              <label className='font-sans text-sm font-medium leading-5 tracking-normal text-[#020617]'>Даты</label>
              <Popover
                onOpenChange={(open) => {
                  if (!open) {
                    refetch();
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='h-10 w-[172px] rounded-md border border-[#E2E8F0] flex justify-between bg-white px-3 text-sm font-normal text-[#020617]'
                  >
                    {formatDateRange()}
                    <CalendarIcon className='size-4 text-slate-500' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto rounded-3xl border-0 p-0 shadow-xl' align='end'>
                  <Calendar
                    mode='range'
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(date) => setDateRange(date as DateRange)}
                    locale={ru}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 flex-1'>
            {isLoading ? (
              DEFAULT_KPI_METRICS.map((metric, index) => (
                <div
                  key={index}
                  className='p-4'
                >
                  <Skeleton className='h-5 w-48 mb-2' />
                  <Skeleton className='h-7 w-32' />
                </div>
              ))
            ) : error ? (
              <div className='col-span-full flex items-center justify-center py-12'>
                <p className='text-sm text-red-500'>Ошибка загрузки данных: {error.message}</p>
              </div>
            ) : kpiMetrics ? (
              Object.entries(kpiMetrics)
                .filter(([key]) => !key.startsWith('tenders_'))
                .map(([key, value]) => (
                  <div
                    key={key}
                    className='p-4'
                  >
                    <p className='font-sans text-sm font-medium leading-5 tracking-normal text-[#64748B]'>
                      {metricLabels[key] || key}
                    </p>
                    <p className='mt-1 font-sans text-xl font-semibold leading-7 tracking-normal text-[#020617]'>
                      {formatMetricValue(key, value as number)}
                    </p>
                  </div>
                ))
            ) : (
              DEFAULT_KPI_METRICS.map((metric, index) => (
                <div
                  key={index}
                  className='p-4'
                >
                  <p className='font-sans text-sm font-medium leading-5 tracking-normal text-[#64748B]'>{metric.label}</p>
                  <p className='mt-1 font-sans text-xl font-semibold leading-7 tracking-normal text-[#020617]'>
                    {metric.value}
                  </p>
                </div>
              ))
            )}
          </div>
        
        </div>
      </div>

      {/* Chart Section */}
      {chartData.length > 0 && (
        <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
          <div className='relative h-[400px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={chartData}
                margin={{ top: 50, right: 20, left: 20, bottom: 20 }}
              >
                <XAxis
                  dataKey='period_end'
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  interval={0}
                  angle={0}
                  textAnchor='middle'
                  height={30}
                />
                <YAxis
                  domain={[0, Math.max(...chartData.map(d => d.tenders || 0), 15)]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  width={25}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'transparent' }}
                  position={{ y: -10 }}
                />
                <Bar
                  dataKey='tenders'
                  radius={[0, 0, 0, 0]}
                  barSize={20}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarColor(entry, index)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

