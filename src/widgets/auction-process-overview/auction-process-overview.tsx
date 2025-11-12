'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  Volume2,
  Download,
  Maximize,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export function AuctionProcessOverview() {
  const [isPlaying, setIsPlaying] = useState(false);

  const stats = [
    { label: 'Начало и окончание тендера', value: '16:00 - 17:47' },
    { label: 'Время тендера', value: '2 часа 8 минут' },
    { label: 'Время работы бота', value: '1 час 40 минут' },
    { label: 'Запросов Wake Word', value: '28 раз' },
  ];

  const events = [
    {
      time: '00:00',
      type: 'system',
      title: 'Начало аукциона',
    },
    {
      time: '00:21',
      type: 'system',
      title: 'ИИ-бот «Арай» подключен',
    },
    {
      time: '00:23',
      type: 'bot',
      title: 'ИИ-бот «Арай»',
      message: 'Consectetur adipiscing elit, sed do eiusmod tempor',
    },
    {
      time: '00:24',
      type: 'state',
      title: 'State',
    },
    {
      time: '00:26',
      type: 'bot',
      title: 'ИИ-бот «Арай»',
      message: 'Consectetur adipiscing elit, sed do eiusmod tempor',
    },
    {
      time: '00:29',
      type: 'wake-word',
      title: 'Имя Фамилия',
      subtitle: 'Wake Word',
    },
    {
      time: '00:29',
      type: 'wake-word',
      title: 'Имя Фамилия',
      subtitle: 'Wake Word',
    },
    {
      time: '00:30',
      type: 'bot',
      title: 'ИИ-бот «Арай»',
      message: 'Consectetur adipiscing elit, sed do eiusmod tempor',
    },
    {
      time: '00:41',
      type: 'error',
      title: 'Error',
      message: 'This is the alert description to shows some information.',
    },
  ];

  return (
    <div className='flex w-full flex-col gap-6'>
      {/* Stats Grid */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-md border border-[#E2E8F0] bg-white p-6 shadow-sm'>
        {stats.map((stat, index) => (
          <div
            key={index}
            className=''
          >
            <p className='font-sans text-sm font-medium leading-5 tracking-normal text-[#64748B]'>{stat.label}</p>
            <p className='mt-1 font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]'>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className='grid gap-6' style={{ gridTemplateColumns: '1fr 352px' }}>
        {/* Video Player */}
        <div>
          <div className='flex flex-1 flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-900 p-6 shadow-sm'>
            {/* Video Area */}
            <div className='relative aspect-video w-full rounded-2xl bg-slate-800'>

              {/* Event/Label Button */}
              <Button
                variant='outline'
                className='absolute right-4 top-4 h-9 rounded-xl border-slate-700 bg-slate-800/50 px-4 text-sm font-medium text-white backdrop-blur-sm hover:bg-slate-700/50'
              >
                Событие или метка
              </Button>
            </div>

            {/* Video Controls */}
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                size='icon'
                className='size-10 rounded-xl hover:bg-slate-800'
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className='size-5 text-white' />
                ) : (
                  <Play className='size-5 text-white' />
                )}
              </Button>

              <Button variant='ghost' size='icon' className='size-10 rounded-xl hover:bg-slate-800'>
                <Volume2 className='size-5 text-white' />
              </Button>

              <div className='flex flex-1 items-center gap-2'>
                <span className='text-sm font-medium text-white'>20:58</span>
                <span className='text-sm text-slate-400'>/</span>
                <span className='text-sm text-slate-400'>58:20</span>
                <span className='ml-2 text-xs text-slate-400'>Событие или метка</span>
              </div>

              {/* Progress Bar */}
              <div className='relative flex-1'>
                <div className='h-2 w-full rounded-full bg-slate-700'>
                  <div className='h-full w-1/3 rounded-full bg-blue-500' />
                </div>
                {/* Event markers */}
                <div className='absolute left-0 top-0 flex h-2 w-full items-center'>
                  {[0, 0.2, 0.4, 0.6, 0.8, 1].map((position) => (
                    <div
                      key={position}
                      className='absolute h-4 w-0.5 -translate-x-1/2 bg-slate-500'
                      style={{ left: `${position * 100}%` }}
                    />
                  ))}
                </div>
              </div>

              <Button variant='ghost' size='icon' className='size-10 rounded-xl hover:bg-slate-800'>
                <Download className='size-5 text-white' />
              </Button>

              <Button variant='ghost' size='icon' className='size-10 rounded-xl hover:bg-slate-800'>
                <Maximize className='size-5 text-white' />
              </Button>
            </div>
          </div>
        </div>

        {/* Events Panel - 1 column */}
        <div className='w-[352px] h-full '>
          <div className='flexflex-col rounded-md bg-white'>
            <Tabs defaultValue='events' className='flex flex-col'>
              <div className='border-b border-slate-200 rounded-md  border-b border-slate-200 p-1 bg-[#eef3fb] '>
                <TabsList className='h-9 w-full'>
                  <TabsTrigger
                    value='events'
                    className='text-[#64748B] h-8 gap-2 rounded-sm px-3 py-1.5 text-sm font-medium data-[state=active]:rounded-none data-[state=active]:h-8  data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm'
                  >
                    Системные события
                  </TabsTrigger>
                  <TabsTrigger
                    value='transcript'
                    className='text-[#64748B] h-8 gap-2 rounded-sm px-3 py-1.5 text-sm font-medium data-[state=active]:rounded-none data-[state=active]:h-8  data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm'
                  >
                    Аудио транскрипт
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value='events' className='flex-1 overflow-y-auto p-4 bg-[#F8FAFC] rounded-md min-h-0'>
                <div className='space-y-4'>
                  {events.map((event, index) => (
                    <div
                      key={index}
                      className={cn(
                        'px-2',
                        event.type === 'error'
                          ? 'border-red-200 '
                          : 'border-slate-200'
                      )}
                    >
                      <div className='flex items-stretch gap-3'>
                        <div className='flex flex-col items-center'>
                          <span className='font-sans text-sm font-normal leading-5 tracking-normal text-[#64748B] my-auto'>{event.time}
                          </span>
                          {(event.message || event.type === "wake-word") && (
                            <div className='mt-2 flex-1 w-px bg-[#E2E8F0]'/>
                          )}
                        </div>
                        <div className={cn(event.type === "state" && 'w-fit', event.type === "wake-word" && 'w-fit', event.type === 'error' && 'w-fit')}>
                          <div className={cn('flex items-center gap-2', event.type === "state" && 'py-[6px] px-2 border border-[#E2E8F0] rounded-full shadow-sm', event.type === "error" && 'py-[6px] px-2 border border-[#FECACA] rounded-full bg-[#FEF2F2] shadow-sm w-fit')}>
                            {
                              event.type === "state" && (
                                <span className='text-xs text-slate-500'>
                                  <Image src="/icons/indifferent-square.svg" alt="indifferent-square" width={16} height={16} />
                                  </span>
                              )
                            }
                             {event.type === 'error' && (
                              <AlertTriangle className='size-4 text-red-500' />
                            )}
                          
                            <span
                              className={cn(
                                'font-sans text-xs font-semibold leading-5 tracking-normal text-[#64748B]',
                                event.type === 'error' && 'text-red-900'
                              )}
                            >
                              {event.title}
                            </span>
                            <span className='flex items-center gap-2'>
                            {event.type === 'bot' && (
                                <>
                                 <div className="p-1 bg-white shadow-sm rounded-md">
                                   <ThumbsUp className='size-4 text-[#2563EB] ' />
                                  </div>
                                  <div className="p-1 bg-white shadow-sm rounded-md">
                                  <ThumbsDown className='size-4 text-[#2563EB]' />
                                  </div>
                                </>
                              )}
                            </span>
                          
                          </div>
                    
                          {event.subtitle && (
                            <div className={cn("", event.type === "wake-word" && 'w-fit flex items-center mt-1 bg-[#BFDBFE] text-xs text-[#2563EB] px-2 py-[6px] gap-[2px] font-semibold border border-[#BFDBFE] rounded-full shadow-sm', event.type === "wake-word" && 'bg-[#BFDBFE] text-[#2563EB]')}>
                              {event.type === "wake-word" && (
                                <span className='text-xs text-slate-500'>
                                  <AlertCircle className='size-4 text-[#2563EB]' />
                                </span>
                              )}
                              {event.subtitle}
                            </div>
                          )}
                          {event.message && (
                            <div className='mt-2'>
                              <div className={cn("flex-1 rounded-md bg-white px-4 py-2 shadow-sm border-l border-[#64748B]", event.type === "error" && "border-none bg-transparent shadow-none ")}>
                                <p
                                  className={cn(
                                    'font-sans text-sm font-normal leading-5 tracking-normal',
                                    event.type === 'error' ? 'text-[#DC2626]' : 'text-[#0F172A]'
                                  )}
                                >
                                  {event.message}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='sticky bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none' />
              </TabsContent>

              <TabsContent value='transcript' className='flex-1 overflow-y-auto p-4'>
                <div className='space-y-4'>
                  <p className='text-sm text-slate-500'>Транскрипт аудио будет здесь</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

