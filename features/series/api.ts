import { getSeries, getSeriesById } from "@/lib/api/read";

export async function fetchSeriesList() {
  return getSeries();
}

export async function fetchSeriesById(seriesId: string) {
  return getSeriesById(seriesId);
}
