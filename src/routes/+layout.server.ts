import { dev } from "$app/environment";
import { inject } from "@vercel/analytics";
import type { LayoutServerLoad } from "./$types";

inject({ mode: dev ? "development" : "production" });

export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
  return {
    session: await getSession(),
  };
};
