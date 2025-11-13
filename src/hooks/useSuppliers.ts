import { useState, useEffect } from 'react';

type SupplierStatus =
  'AuctionPlanning' | 'AuctionActive' | 'AuctionFinished' | 'AuctionEnd' | 'TechCouncilPlanning' | 'TechCouncilActive' | 'TechCouncilEnd' | 'TechCouncilFinished';

type AuctionEventStatus = 'tender' | 'tech' | 'tech_council';

type AuctionType = "default" | "tms"

export type CommercialOffer = {
  advance: string;
  amount_materials: number;
  amount_work: number;
  auction_id: string;
  bespoke_deadline: string;
  biin: string;
  comments: string;
  commercial_offer_id: string;
  commercial_offer_name: string;
  email: string[];
  final_rating: number;
  guarantee: string;
  info: string;
  is_fixed: boolean;
  kontragent_guid: string;
  lot_id: string;
  nds_materials: boolean;
  nds_work: boolean;
  phone_number: string[];
  price_after: number;
  rating: number;
  rating_advance: number;
  rating_deadline: number;
  rating_price: number;
  recommended_winner: boolean;
  reserver_winner: boolean;
  studied_VKU: boolean;
  total_price: number;
}

export type LotState = "start";

export type Lot = {
  auction_id: string;
  auction_type: AuctionType;
  commercial_offers: CommercialOffer[];
  history_depth: number;
  lot_guid: string;
  lot_id: string;
  lot_name: string;
  lot_number: number;
  portal_id: string;
  starting_price: number;
  state: LotState;
  step_amount: number;
}
export type Protocol = {
  application_created_at: string | null;
  auction_constructive: string;
  auction_division: string;
  auction_id: string;
  auction_organizator: string;
  auction_region: string | null;
  auction_update_scheduled: boolean;
  comments: string;
  commercial_offer_history: object[];
  created_at: string;
  current_lot_number: number;
  date: string;
  doc_guid: string;
  lots: Lot[];
  name: string;
  portal_id: string;
  project_name: string;
}
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
export type SupplierResponse = {
  auction_chat_id: string;
  auction_id: string;
  chat_id: string;
  chat_status: SupplierStatus;
  date: string;
  event_type: AuctionEventStatus;
  name: string;
  organizer: string;
  portal_id: string;
  protocol: Protocol;
  region: string;
}

type UseSuppliersParams = {
  auctionChatId: string;
  page?: number;
  pageSize?: number;
  search?: string;
  status?: SupplierStatus;
  eventType: string
};

type UseSuppliersResponse = {
  data: SupplierResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useSuppliers(params: UseSuppliersParams): UseSuppliersResponse {
  const [data, setData] = useState<SupplierResponse | null>(null);
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
      console.log(json);
      json.protocol.lots = json.protocol.lots.sort((a: Lot, b:Lot) => a.lot_number - b.lot_number);
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch suppliers'));
      setData(null);
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

