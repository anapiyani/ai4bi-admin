'use client';

import { useCallback } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function UserProfile() {
  const { user, logout } = useAuth();
  const handleLogout = useCallback(() => {
    logout?.();
  }, [logout]);

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          className={cn(
            'flex items-center gap-[75px]',
            'px-5 py-3 text-left  transition '
          )}
        >
          <div>
            <p className='font-sans text-base font-semibold leading-6 tracking-normal text-[#020617]'>
              {user.first_name + " " + user.last_name}
            </p>
            <p className='font-sans text-xs font-normal leading-4 tracking-normal align-middle text-[#64748B]'>
              {user.email}
            </p>
          </div>
          <ChevronDown size={18} className='text-slate-500' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        sideOffset={12}
        className='w-[156px] rounded-md border border-[#E2E8F0] bg-white p-2 shadow-md'
      >
        <DropdownMenuItem
          onClick={handleLogout}
          className='flex items-center gap-1 rounded-md px-4 py-3 font-sans text-sm font-normal leading-5 tracking-normal text-[#020617] hover:bg-white'
        >
          <LogOut size={16} className='text-[#020617]' />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

