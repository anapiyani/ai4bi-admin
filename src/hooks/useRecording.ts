import { useState } from 'react';

export type RecordingData = {
  chat_id: string;
  download_url: string;
  filename: string;
  last_modified: string;
  room_name:string;
  size: number;
  type: string;
};

type UseRecordingResponse = {
  data: RecordingData[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<RecordingData[] | undefined>;
};

export function useRecording(chatId: string): UseRecordingResponse {
  const [data, setData] = useState<RecordingData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecording = async () => {
    if (!chatId) {
      setIsLoading(false);
      setData(null);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const url = `/api/recordings/export/${chatId}`;
      const response = await fetch(url, { method: 'GET' });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recording: ${response.statusText}`);
      }

      const json = await response.json();
      setData(json.recordings);
      return json.recordings;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch recording');
      setError(error);
      setData(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchRecording,
  };
}

