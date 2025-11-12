import { Header } from '@/components/layout/Header';

import { AuctionDetailContent } from './auction-detail-content';

interface AuctionDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function AuctionDetailPage({ params }: AuctionDetailPageProps) {
  const { slug } = await params;
  return (
    <div className='flex min-h-screen flex-col bg-white'>
      <Header />
      <main className='flex w-full flex-1 px-8 py-8'>
        <AuctionDetailContent auctionChatId={slug} />
      </main>
    </div>
  );
}

