import { useInsightsFilter } from "./useInsightsFilter";
import { selectResourceItems, useInsightDetails as useInsightDetailsApi } from "../state/insightDetailsApi";
import { useSelector } from "react-redux";

export function useInsightDetails() {
  const { filter } = useInsightsFilter();
  const {fetchNextPage, hasNextPage, isLoading, isFetching } = useInsightDetailsApi(filter);
  const data = useSelector((state: any) => selectResourceItems(state, filter));   
  
  return {
    resources: data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching
  }
}