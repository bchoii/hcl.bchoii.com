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

  return (
    <>
      {/* <div>
        <div
          className="sticky top-0"
          style={{
            maxHeight: "100vh",
            overflowY: "auto",
            scrollbarColor: "transparent transparent",
            scrollbarWidth: "thin",
          }}
        ></div>
      </div> */}

      <div className="grid">
        <nav className="">
          <NavLink to="." end className="flex items-baseline">
            <img
              className="max-h-[1lh]"
              src="https://hcl.com/wp-content/themes/Hcl/img/logo.png"
            />
            &nbsp;
            {sitename}
          </NavLink>
          <NavLink to="portfolio">Portfolio</NavLink>
          <NavLink to="positions">Positions</NavLink>
          <NavLink to="audit">Audit</NavLink>

          {user.roles?.includes("bchoii") && (
            <NavLink to="users">Users</NavLink>
          )}

          <NavLink to="../logout" className="ml-auto">
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
