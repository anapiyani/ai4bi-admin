import { useState, useEffect } from 'react';

import { type Auction } from './useAuctions';

type UseAuctionResponse = {
  data: Auction | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useAuction(auctionChatId: string): UseAuctionResponse {
  const [data, setData] = useState<Auction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAuction = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const url = `/api/auctions/${auctionChatId}`;
      const response = await fetch(url, { method: 'GET' });
      const json = await response.json();
      setData(json.auction_chat_info || json || null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch auction'));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auctionChatId) {
      fetchAuction();
    }
  }, [auctionChatId]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchAuction,
  };
}

