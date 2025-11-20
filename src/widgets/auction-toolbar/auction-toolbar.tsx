'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';

import { AuctionFilters } from '@/widgets/auction-filters';
import { ColumnsDropdown } from '@/widgets/columns-dropdown';

export type AuctionFiltersState = {
  search?: string;
  region?: string;
  status?: string;
  dateRange?: DateRange;
};

type AuctionToolbarProps = {
  onParamsChange?: (filters: AuctionFiltersState) => void;
};

export function AuctionToolbar({ onParamsChange }: AuctionToolbarProps) {
  const [filters, setFilters] = useState<AuctionFiltersState>({});

  const handleSearch = () => {
    if (onParamsChange) {
      onParamsChange(filters);
    }
  };

  const handleClear = () => {
    setFilters({
      search: '',
      region: '',
      status: '',
      dateRange: undefined,
    });
    if (onParamsChange) {
      onParamsChange({
        search: '',
        region: '',
        status: '',
        dateRange: undefined,
      });
    }
  };

  return (
    <>
      <div className='flex w-full flex-wrap items-center justify-between gap-4'>
        <AuctionFilters
          search={filters.search}
          region={filters.region}
          status={filters.status}
          dateRange={filters.dateRange}
          onSearchChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
          onRegionChange={(value: string | undefined) => setFilters((prev) => ({ ...prev, region: value }))}
          onStatusChange={(value: string | undefined) => setFilters((prev) => ({ ...prev, status: value }))}
          onDateRangeChange={(value) => setFilters((prev) => ({ ...prev, dateRange: value }))}
          onSearch={handleSearch}
          onClear={handleClear}
        />
        <ColumnsDropdown />
      </div>
    </>
  );
}

