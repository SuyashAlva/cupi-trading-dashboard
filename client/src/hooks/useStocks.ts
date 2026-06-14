import { useQuery } from "@tanstack/react-query";
import { fetchStocks } from "../services/marketApi";

/** The supported instrument universe + an initial snapshot (REST, cached). */
export function useStocks() {
  return useQuery({ queryKey: ["stocks"], queryFn: fetchStocks });
}
