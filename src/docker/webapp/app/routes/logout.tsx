import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { authCookie } from "../utils/cookies";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  return redirect("/", {
    headers: { "Set-Cookie": await authCookie.serialize("", { maxAge: -1 }) },
  });
};
