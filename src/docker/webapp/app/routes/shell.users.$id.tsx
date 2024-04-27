import {
  json,
  redirect,
  type LinksFunction,
  type LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/node";

import { Form, Link, Outlet, useLoaderData, NavLink } from "@remix-run/react";
import { db, execute, remove, update } from "../../db/orm";
import { users } from "../../db/schema";
import { asc, eq, sql } from "drizzle-orm";
import invariant from "tiny-invariant";
import { authCookie } from "../utils/cookies";
import { useEffect, useState } from "react";
import { index } from "drizzle-orm/mysql-core";
import { serialiseForm } from "../../app/utils/utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, "Missing id param");

  const user = (await db.query.users.findFirst({
    where: eq(users.id, params.id),
  }))!;

  // const skills = purposes;

  // const skills = (
  //   await execute(
  //     sql`select distinct purpose from tickets where purpose != '' order by purpose`
  //   )
  // ).map((t) => t.purpose);

  return json({ user });
};

export default function Component() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="fadein" key={user.id}>
      <Form method="post">
        <h3>Email</h3>
        <input name="email" defaultValue={user.email ?? ""} autoFocus></input>
        <h3>Roles</h3>
        {roles.map((role) => (
          <label key={role} className="px-2">
            <input
              name="roles"
              type="checkbox"
              value={role}
              defaultChecked={user.roles?.includes(role)}
            ></input>{" "}
            {role}
          </label>
        ))}
        <h3>Skills</h3>

        <h3>Action</h3>
        <button>Update</button>
      </Form>
    </div>
  );
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.id, "Missing id param");
  if (request.method == "DELETE") {
    await remove("users", params.id);
    return redirect(`./..`);
  }

  const formData = await request.formData();
  const form = serialiseForm(formData);
  const updated = await update(
    "users",
    { roles: null, skills: null, ...form },
    params.id
  );
  return redirect(`./..`);
};

const roles = ["Verified", "bchoii"];
