import { useState, useEffect } from 'react';

type SupplierStatus =
  | 'invited'
  | 'uploaded'
  | 'declined'
  | 'confirmed'
  | 'no-response';

export type Supplier = {
  id: string;
  name: string;
  status: SupplierStatus;
  cpAvailable: boolean;
  cpAmount?: number;
  currency?: string;
  participantAction?: string;
  uploadTime?: string;
  comment?: string;
  hasWarning?: boolean;
};

type UseSuppliersParams = {
  auctionChatId: string;
  page?: number;
  pageSize?: number;
  search?: string;
  status?: SupplierStatus;
  eventType: string
};

type UseSuppliersResponse = {
  data: Supplier[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useSuppliers(params: UseSuppliersParams): UseSuppliersResponse {
  const [data, setData] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (params.page) {
        queryParams.append('page', params.page.toString());
      }
      if (params.pageSize) {
        queryParams.append('page_size', params.pageSize.toString());
      }
      if (params.search) {
        queryParams.append('search', params.search);
      }
      if (params.eventType) {
        queryParams.append('event_type', params.eventType);
      }
      if (params.status) {
        queryParams.append('status', params.status);
      }

      const url = `/api/auctions/${params.auctionChatId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url, { method: 'GET' });
      const json = await response.json();
      setData(json.suppliers || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch suppliers'));
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.auctionChatId) {
      fetchSuppliers();
    }
  }, [
    params.auctionChatId,
    params.page,
    params.pageSize,
    params.search,
    params.status,
  ]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchSuppliers,
  };
}

