import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";

import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { sitename } from "../utils/constants";
import { requireUser } from "app/utils/auth";

export const loader = async ({ request }: { request: Request }) => {
  const user = await requireUser(request);

  return json({ user });
};

export default function Component() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="fadein">
      Welcome <span className="font-bold">{user.email}</span> to{" "}
      <span className="font-bold">{sitename}</span>.
    </div>
  );
}
