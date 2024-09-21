import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
  return {
    notifications: [],
    ongoingMatches: [],
    matchQueue: [],
    quickQueue: [],
  };
};
