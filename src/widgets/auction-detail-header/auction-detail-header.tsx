'use client';

import { Bell, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuctionDetailHeaderProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function AuctionDetailHeader({
  value = 'about',
  onValueChange,
}: AuctionDetailHeaderProps) {
  return (
    <div className='flex  gap-[10px] items-center justify-between'>
      <Tabs value={value} onValueChange={onValueChange} className='w-full bg-[#eef3fb] rounded-md'>
        <TabsList className='h-10 rounded-xl bg-[#eef3fb] p-1'>
          <TabsTrigger
            value='about'
            className='text-[#64748B] h-8 gap-2 rounded-sm px-3 py-1.5 text-sm font-medium data-[state=active]:rounded-none data-[state=active]:h-8  data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm'
          >
            О тендере
          </TabsTrigger>
          <TabsTrigger
            value='overview'
            className='text-[#64748B] h-8 gap-2 rounded-sm px-3 py-1.5 text-sm font-medium data-[state=active]:rounded-none data-[state=active]:h-8  data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm'
          >
            Обзор процесса
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            className='h-10 rounded-md border-slate-200 !bg-white px-4 text-sm font-medium text-slate-700 shadow-sm'
          >
            <Bell className='mr-2 size-4' />
            Выслать уведомление
            <ChevronDown className='ml-2 size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className='w-48 rounded-md border-0 bg-white p-2 shadow-lg'
        >
          <DropdownMenuItem className='rounded-xl px-4 py-2 text-sm font-medium text-slate-900 hover:bg-[#eef3fb]'>
            Email
          </DropdownMenuItem>
          <DropdownMenuItem className='rounded-xl px-4 py-2 text-sm font-medium text-slate-900 hover:bg-[#eef3fb]'>
            SMS
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

