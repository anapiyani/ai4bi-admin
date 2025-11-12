import { useState, useEffect } from 'react';

type AuctionStatus = 'awaiting' | 'in-progress' | 'completed' | 'cancelled';
type AuctionEventType = 'tender' | 'tech_council';

export type Auction = {
  chat_id: string;
  auction_id: string;
  auction_chat_id: string;
  name: string;
  portal_id: string;
  date: string;
  event_type: string;
  chat_status: string;
  region: string | null;
  organizer: string;
};

type UseAuctionsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: AuctionStatus;
  eventType?: AuctionEventType;
  region?: string;
};

type UseAuctionsResponse = {
  data: Auction[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useAuctions(params?: UseAuctionsParams): UseAuctionsResponse {
  const [data, setData] = useState<Auction[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAuctions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (params?.page) {queryParams.append('page', params.page.toString());}
      if (params?.pageSize) {queryParams.append('page_size', params.pageSize.toString());}
      if (params?.search) {queryParams.append('search', params.search);}
      if (params?.status) {queryParams.append('status', params.status);}
      if (params?.eventType) {queryParams.append('event_type', params.eventType);}
      if (params?.region) {queryParams.append('region', params.region);}

      const url = `/api/auctions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url, {method: 'GET'});
      const json = await response.json();
      setData(json.auction_chat_infos || []);
      setTotal(json.total_count || 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch auctions'));
      setData([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [
    params?.page,
    params?.pageSize,
    params?.search,
    params?.status,
    params?.eventType,
    params?.region,
  ]);

  return {
    data,
    total,
    isLoading,
    error,
    refetch: fetchAuctions,
  };
}

