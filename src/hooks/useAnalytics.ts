import { useState } from 'react';
import { DateRange } from "react-day-picker";

export type ChartDataPoint = {
  period_end: string;
  tenders: number;
  period_start: string;
};

export type KPIMetric = {
  avg_commercial_offers_per_tender: number;
  avg_days_before_start: number;
  avg_response_time_seconds: number;
  avg_tender_duration_minutes: number;
  avg_wait_minutes: number;
  commercial_offers_total: number;
  tenders_total: number;
  tenders_without_winner: number;
  tenders_with_winner: number;
};

export type AnalyticsSummary = {
  tenders_total: number,
  tenders_with_winner: number,
  tenders_without_winner: number,
};

export type AnalyticsData = {
  period: AnalyticsSummary;
  metrics: KPIMetric;
  chart: ChartDataPoint[];
};

type Period = 'day' | 'week' | 'month';

type UseAnalyticsParams = {
  period?: Period;
  dateRange?: DateRange;
};

type UseAnalyticsResponse = {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useAnalytics(params?: UseAnalyticsParams): UseAnalyticsResponse {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isValidDateRange = (): boolean => {
    if (!params?.period || !params?.dateRange?.from || !params?.dateRange?.to) {
      return false;
    }
    // Проверяем, что дата начала не больше даты окончания
    const fromTime = params.dateRange.from.getTime();
    const toTime = params.dateRange.to.getTime();
    return fromTime <= toTime;
  };

  const fetchAnalytics = async () => {
    if (!isValidDateRange()) {
      setIsLoading(false);
      setData(null);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (params?.period) {
        queryParams.append('aggregation', params.period);
      }
      if (params?.dateRange?.from) {
        queryParams.append('start_date', formatDate(params.dateRange.from));
      }
      if (params?.dateRange?.to) {
        queryParams.append('end_date', formatDate(params.dateRange.to));
      }

      const url = `/api/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url, { method: 'GET' });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      const json = await response.json();
      console.log(json);
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchAnalytics,
  };
}

