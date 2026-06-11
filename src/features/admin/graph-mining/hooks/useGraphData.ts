import { useQuery } from '@tanstack/react-query'
import { graphMiningApi } from '../api'

export function useCourseMetrics() {
  return useQuery({
    queryKey: ['admin', 'graph-mining', 'metrics'],
    queryFn: graphMiningApi.getCourseMetrics,
    staleTime: 1000 * 60 * 10, // cache for 10 minutes since this analysis is static
  })
}

export function useDeptPrerequisites() {
  return useQuery({
    queryKey: ['admin', 'graph-mining', 'departments'],
    queryFn: graphMiningApi.getDeptPrerequisites,
    staleTime: 1000 * 60 * 10,
  })
}
