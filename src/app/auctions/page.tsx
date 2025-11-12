import { Header } from '@/components/layout/Header';
import { AuctionToolbar } from '@/widgets/auction-toolbar';
import { AuctionsTable } from '@/widgets/auctions-table';
import { ColumnsProvider } from '@/widgets/columns-dropdown/columns-context';

const Auctions = () => {
  return (
    <ColumnsProvider>
      <div className='flex min-h-screen flex-col bg-white'>
        <Header />
        <main className='flex w-full flex-1 px-8 py-8'>
          <div className='flex w-full flex-col gap-4'>
            <AuctionToolbar />
            <AuctionsTable />
          </div>
        </main>
      </div>
    </ColumnsProvider>
  );
};

export default Auctions;