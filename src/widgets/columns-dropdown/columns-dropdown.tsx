'use client';

import { Check, ChevronDown } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { useColumns, DEFAULT_COLUMNS } from './columns-context';

export function ColumnsDropdown() {
  const { selectedColumns, toggleColumn } = useColumns();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='flex h-10 w-[246px] items-center gap-[6px] rounded-md border border-[#E2E8F0] bg-white py-2 px-3 font-sans text-sm font-medium leading-5 tracking-normal text-center align-middle text-[#0F172A] hover:bg-slate-50'>
          Показать/спрятать колонны
          <ChevronDown size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[169px] rounded-md border border-[#E2E8F0] bg-white p-1 shadow-md'>
        {DEFAULT_COLUMNS.map((column) => (
          <DropdownMenuItem
            key={column.id}
            onSelect={(event) => {
              event.preventDefault();
              toggleColumn(column.id);
            }}
            className='flex items-center justify-start rounded-md px-4 py-2 text-sm font-normal text-[#020617] transition hover:bg-[#eef3fb] leading-5 tracking-normal'
          >
             {selectedColumns.includes(column.id) && (
              <Check size={16} className='text-[#020617]' />
            )}
            {column.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

