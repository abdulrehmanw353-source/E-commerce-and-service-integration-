import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await api.get('/services');
      return data.data?.services ?? data.data ?? data;
    },
    staleTime: 60_000,
  });
}

export function useService(slug) {
  return useQuery({
    queryKey: ['service', slug],
    queryFn: async () => {
      const { data } = await api.get(`/services/${slug}`);
      return data.data?.service ?? data.data ?? data;
    },
    enabled: !!slug,
    staleTime: 60_000,
  });
}

