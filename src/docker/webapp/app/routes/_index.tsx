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
    <Link className="m-auto" to="shell" target="_blank">
      <img src="https://hcl.com/wp-content/themes/Hcl/img/logo.png" />
      {sitename}
    </Link>
  );
}
