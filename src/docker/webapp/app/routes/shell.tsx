import {
  json,
  redirect,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";

import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
} from "@remix-run/react";

import { requireUser } from "../utils/auth";
import { sitename } from "../utils/constants";

export const loader = async ({ request }: { request: Request }) => {
  const user = await requireUser(request);

  return json({ user });
};

export default function Shell() {
  const { user } = useLoaderData<typeof loader>();

  function scrollIntoView(e: HTMLElement) {
    e.scrollIntoView({ inline: "center" });
  }

  return (
    <>
      <div className="grid">
        <nav className="flex flex-nowrap overflow-x-scroll hidescrollbars">
          <NavLink
            onClick={(e) => scrollIntoView(e.currentTarget)}
            className="flex items-baseline text-nowrap min-w-max"
            to="."
            end
          >
            <img className="max-h-[1lh] " src="/assets/logo.png" />
            &nbsp;
            {sitename}
          </NavLink>
          <NavLink
            onClick={(e) => scrollIntoView(e.currentTarget)}
            to="portfolio"
          >
            Portfolio
          </NavLink>
          <NavLink
            onClick={(e) => scrollIntoView(e.currentTarget)}
            to="positions"
          >
            Positions
          </NavLink>
          <NavLink onClick={(e) => scrollIntoView(e.currentTarget)} to="audit">
            Audit
          </NavLink>

          {user.roles?.includes("bchoii") && (
            <NavLink
              onClick={(e) => scrollIntoView(e.currentTarget)}
              to="users"
            >
              Users
            </NavLink>
          )}

          <NavLink
            onClick={(e) => scrollIntoView(e.currentTarget)}
            className="ml-auto"
            to="../logout"
          >
            Logout
          </NavLink>
        </nav>

        <div className="p-4">
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
}
