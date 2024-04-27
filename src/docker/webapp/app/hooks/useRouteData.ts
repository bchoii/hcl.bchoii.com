// https://jankraus.net/2022/04/16/access-remix-route-data-in-other-routes/

import { useMatches } from "@remix-run/react";

export const useRouteData = <T>(routeId: string): T | undefined => {
  const matches = useMatches();
  const data = matches.find((match) => match.id === routeId)?.data;

  return data as T | undefined;
};
