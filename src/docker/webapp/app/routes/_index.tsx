import {
  type ActionFunctionArgs,
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Link, NavLink, useLoaderData } from "@remix-run/react";

import { sitename } from "../utils/constants";

export default function Component() {
  return (
    <div className="m-auto">
      <h3>
        <img src="https://hcl.com/wp-content/themes/Hcl/img/logo.png" />
        {sitename}
      </h3>
      <nav>
        <Link
          className="text-neutral-500 px-4 py-2 border rounded backdrop-blur hover:outline"
          to="shell"
          target="_blank"
        >
          Login
        </Link>
      </nav>
    </div>
  );
}
