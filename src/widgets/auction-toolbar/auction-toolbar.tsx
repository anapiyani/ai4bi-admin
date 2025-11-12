'use client';

import { AuctionFilters } from '@/widgets/auction-filters';
import { ColumnsDropdown } from '@/widgets/columns-dropdown';

export function AuctionToolbar() {
  return (
    <div className='flex w-full flex-wrap items-center justify-between gap-4'>
      <AuctionFilters />
      <ColumnsDropdown />
    </div>
  );
}

