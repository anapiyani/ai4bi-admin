'use client';

import { useState } from "react";
import { Header } from '@/components/layout/Header';
import { AuctionToolbar } from '@/widgets/auction-toolbar';
import { AuctionsTable } from '@/widgets/auctions-table';
import { ColumnsProvider } from '@/widgets/columns-dropdown/columns-context';
import { AuctionFiltersState } from '@/widgets/auction-toolbar';

const Auctions = () => {
  const [filters, setFilters] = useState<AuctionFiltersState>({});
  const [searchKey, setSearchKey] = useState(0);
  
  const handleParamsChange = (newFilters: AuctionFiltersState) => {
    setFilters({ ...newFilters });
    setSearchKey((prev) => prev + 1); // Увеличиваем ключ для сброса пагинации
  };
  return (
    <ColumnsProvider>
      <div className='flex min-h-screen flex-col bg-white'>
        <Header />
        <main className='flex w-full flex-1 px-8 py-8'>
          <div className='flex w-full flex-col gap-4'>
            <AuctionToolbar onParamsChange={handleParamsChange} />
            <AuctionsTable filters={filters} searchKey={searchKey} />
          </div>
        </main>
      </div>
    </ColumnsProvider>
  );
};

export default Auctions;