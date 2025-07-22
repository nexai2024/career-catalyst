"use client";
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseQueryOptions<T> {
  queryFn: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export function useQuery<T>({
  queryFn,
  onSuccess,
  onError,
  enabled = true,
}: UseQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      setData(result);
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch data',
        variant: 'destructive',
      });
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [queryFn, onSuccess, onError, toast]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [enabled, fetchData]);

  return { data, loading, error, refetch: fetchData };
}
