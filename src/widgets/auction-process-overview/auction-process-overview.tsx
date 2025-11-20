'use client';

import { useEffect } from 'react';
import { Download } from "lucide-react";
import Link from "next/link";

import { useRecording } from "@/hooks/useRecording";
import { Skeleton } from "@/components/ui/skeleton";

export function AuctionProcessOverview({chat_id}: {chat_id: string}) {
  const { data, isLoading, error, refetch } = useRecording(chat_id);

  useEffect(() => {
    if (chat_id) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat_id]);

  const stats = [
    { label: 'Начало и окончание тендера', value: '16:00 - 17:47' },
    { label: 'Время тендера', value: '2 часа 8 минут' },
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) {return '0 Bytes';}
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };


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

      {/* Files List */}
      <div className='rounded-md border border-[#E2E8F0] bg-white p-6 shadow-sm'>
        <h3 className='mb-4 font-sans text-lg font-semibold leading-7 tracking-normal text-[#020617]'>
          Файлы для загрузки
        </h3>
        
        {isLoading ? (
          <div className='flex flex-col gap-3'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='flex items-center justify-between p-4 border border-[#E2E8F0] rounded-md'>
                <div className='flex-1'>
                  <Skeleton className='h-5 w-64 mb-2' />
                  <Skeleton className='h-4 w-48' />
                </div>
                <Skeleton className='h-9 w-32' />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className='text-center py-8'>
            <p className='text-sm text-red-500'>Ошибка загрузки файлов: {error.message}</p>
          </div>
        ) : data && data.length > 0 ? (
          <div className='flex flex-col gap-3'>
            {data.map((recording, index) => (
              <div
                key={`${recording.chat_id}-${index}`}
                className='flex items-center justify-between p-4 border border-[#E2E8F0] rounded-md hover:bg-slate-50 transition-colors'
              >
                <div className='flex-1 min-w-0'>
                  <p className='font-sans text-sm font-medium leading-5 tracking-normal text-[#020617] truncate'>
                    {recording.filename.slice(0, 30)}...
                  </p>
                  <div className='mt-1 flex items-center gap-4 text-xs text-[#64748B]'>
                    <span>{formatFileSize(recording.size)}</span>
                    <span>•</span>
                    <span>{formatDate(recording.last_modified)}</span>
                    {recording.type && (
                      <>
                        <span>•</span>
                        <span>{recording.type === "technical-council" ? "Тех. совет" : "Тендер"}</span>
                      </>
                    )}
                  </div>
                </div>
                <Link
                  href={recording.download_url}
                  className='flex gap-1 items-center ml-4 h-9 gap-2 rounded-md border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#020617] hover:bg-slate-50 disabled:opacity-50'
                >
                  <Download className='size-4' />
                  Скачать
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-8'>
            <p className='text-sm text-[#64748B]'>Файлы не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}

