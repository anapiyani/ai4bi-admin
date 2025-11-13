'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Lot } from "@/hooks/useSuppliers";

interface ChangeLotProps {
  options: Lot[];
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function ChangeLot({ options, value, onChange, className }: ChangeLotProps) {
  return (
    <section>
      <div className="font-sans text-sm font-normal leading-5 tracking-normal text-[#020617]">
        Лоты:
      </div>
    <div className={cn('inline-flex items-center gap-1 rounded-md bg-slate-200 p-1', className)}>
      {options.map((option, key) => {
        const isActive = value === key;
        return (
          <Button
            key={key}
            variant={isActive ? 'default' : 'ghost'}
            onClick={() => onChange(key)}
            className={cn(
              'h-8 rounded-sm px-3 py-1 text-sm font-medium transition-colors',
              isActive
                ? 'bg-white text-[#020617] shadow-sm hover:bg-white'
                : 'text-[#64748B] hover:bg-transparent hover:text-[#020617]'
            )}
          >
            {option.lot_name}
          </Button>
        );
      })}
    </div>
    </section>
  );
}

