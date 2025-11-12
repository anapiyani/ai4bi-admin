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

const PERIODS = ['По дням', 'По неделям', 'По месяцам'];

const mockChartData = [
  { date: '20.05', value: 15, highlighted: false },
  { date: '21.05', value: 12, highlighted: true },
  { date: '22.05', value: 15, highlighted: false },
  { date: '23.05', value: 11, highlighted: false },
  { date: '24.05', value: 13, highlighted: false },
  { date: '25.05', value: 15, highlighted: false },
  { date: '26.05', value: 11, highlighted: false },
  { date: '27.05', value: 15, highlighted: false },
  { date: '28.05', value: 15, highlighted: false },
  { date: '29.05', value: 11, highlighted: false },
  { date: '30.05', value: 15, highlighted: false },
  { date: '31.05', value: 11, highlighted: false },
  { date: '01.06', value: 15, highlighted: false },
  { date: '02.06', value: 11, highlighted: false },
  { date: '03.06', value: 13, highlighted: false },
  { date: '04.06', value: 15, highlighted: false },
  { date: '05.06', value: 15, highlighted: false },
  { date: '06.06', value: 11, highlighted: false },
];

const kpiMetrics = [
  {
    label: 'Среднее время тендера',
    value: '2 часа 8 минут',
  },
  {
    label: 'Среднее время ответа ИИ',
    value: '2 минуты',
  },
  {
    label: 'Среднее количество участников',
    value: '1900',
  },
  {
    label: 'Средняя оценка ответов ИИ',
    value: '70% удовлетворительно',
  },
  {
    label: 'Среднее количество исправлений/перез...',
    value: '30',
  },
  {
    label: 'Количество проблемных сессий ИИ',
    value: '5',
  },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='rounded-lg bg-white px-3 py-2 shadow-lg border border-slate-200'>
        <p className='text-sm font-medium text-slate-900'>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState('По дням');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(2025, 4, 20),
    to: new Date(2025, 5, 20),
  });

  const formatDateRange = () => {
    if (!dateRange.from || !dateRange.to) {return '20.05-20.06';}
    return `${format(dateRange.from, 'dd.MM', { locale: ru })}-${format(dateRange.to, 'dd.MM', { locale: ru })}`;
  };

  const getBarColor = (entry: any, index: number) => {
    // Чередование цветов: темно-синий/серый и светло-синий/серый
    // Согласно скриншоту: темно-синий/серый и светло-синий/серый чередуются
    if (index % 2 === 0) {
      // Темно-синий/серый (четные индексы: 0, 2, 4...)
      return '#475569'; // slate-600 - темно-серый с синеватым оттенком
    } else {
      // Светло-синий/серый (нечетные индексы: 1, 3, 5...)
      return '#94a3b8'; // slate-400 - светло-серый с синеватым оттенком
    }
  };

  return (
    <div className='flex w-full flex-col gap-8'>
      {/* Stats Section */}
      <div className='flex  w-full flex-col gap-4 rounded-lg border border-[#E2E8F0] py-6 px-8'>
        {/* Total Tenders and Status */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-xl font-semibold leading-7 tracking-normal text-[#020617]'>295 тендеров</h2>
            <div className='mt-3 flex flex-wrap items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='size-3 rounded-full bg-[#334155]' />
                <span className='text-sm font-medium leading-7 tracking-normal text-[#475569]'>Завершены: 280</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='size-3 rounded-full bg-[#94A3B8]' />
                <span className='text-sm font-medium leading-7 tracking-normal text-[#475569]'>Отменены: 10</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='size-3 rounded-full bg-[#CBD5E1]' />
                <span className='text-sm font-medium leading-7 tracking-normal text-[#475569]'>С ошибками: 5</span>
              </div>
            </div>
          </div>

        </div>

        {/* KPI Cards with Filters */}
        <div className='flex items-stretch justify-between gap-4 flex-col sm:flex-row lg:flex-row'>
        <div className='flex flex-col justify-between gap-4 p-4'>
            <div className='flex flex-col gap-1'>
              <label className='font-sans text-sm font-medium leading-5 tracking-normal text-[#020617]'>Период</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className='h-10 w-[140px] rounded-md border border-[#E2E8F0] bg-white px-3 text-sm font-normal leading-5 tracking-normal text-[#020617]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='rounded-md bg-white shadow-lg'>
                  {PERIODS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-1'>
              <label className='font-sans text-sm font-medium leading-5 tracking-normal text-[#020617]'>Даты</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='h-10 w-[140px] rounded-md border border-[#E2E8F0] flex justify-between bg-white px-3 text-sm font-normal text-[#020617]'
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
                    onSelect={(range) => {
                      setDateRange({
                        from: range?.from,
                        to: range?.to,
                      });
                    }}
                    locale={ru}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 flex-1'>
            {kpiMetrics.map((metric, index) => (
              <div
                key={index}
                className='p-4'
              >
                <p className='font-sans text-sm font-medium leading-5 tracking-normal text-[#64748B]'>{metric.label}</p>
                <p className='mt-1 font-sans text-xl font-semibold leading-7 tracking-normal text-[#020617]'>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        
        </div>
      </div>

      {/* Chart Section */}
      <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
        <div className='relative h-[400px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={mockChartData}
              margin={{ top: 50, right: 20, left: 20, bottom: 20 }}
            >
              <XAxis
                dataKey='date'
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                interval={0}
                angle={0}
                textAnchor='middle'
                height={30}
              />
              <YAxis
                domain={[0, 15]}
                ticks={[0, 5, 10, 15]}
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
                dataKey='value'
                radius={[0, 0, 0, 0]}
                barSize={20}
              >
                {mockChartData.map((entry, index) => (
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
    </div>
  );
}

