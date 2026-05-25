import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api/queryKeys'
import { systemApi } from '@/shared/api/services'

export function useApiHealth() {
  return useQuery({
    queryKey: queryKeys.system.health(),
    queryFn: systemApi.getHealth,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 2,
    retry: 1,
  })
}
