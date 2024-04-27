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
      Welcome <span className="font-bold">{user.email}</span> .
      <Link
        className="block relative"
        to="https://www.hcltech.com/events/hackathon"
      >
        <img
          className="absolute"
          src="https://www.hcltech.com/sites/default/files/images/event/bjb-hackathon/1440x500.webp"
        ></img>
        <div className="absolute text-white p-10">
          <span className="text-5xl">
            Calling all experts :<br></br>Hackathon alert
          </span>
          <br></br>
          <br></br>
          <p>
            One opportunity. Limitless possibilities.
            <br></br>
            April 27, 2024
          </p>
        </div>
      </Link>
    </div>
  );
}
