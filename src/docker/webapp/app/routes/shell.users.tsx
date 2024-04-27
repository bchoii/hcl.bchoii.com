import {
  ActionFunctionArgs,
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { FormEvent, RefObject, useEffect } from "react";
import { Popup } from "../utils/Popup";

import { execute, remove } from "../../db/orm";
import { User, users } from "../../db/schema";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { sql } from "drizzle-orm";

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const sql_ = q
    ? sql`select * from ${users} where users::text ilike ${`%${q}%`}
    order by ${users.updated} desc limit 2000`
    : sql`select * from ${users} order by ${users.updated} desc limit 2000`;

  const list = (await execute(sql_)) as unknown as User[];

  return json({ list });
};

export default function Component() {
  const { list } = useLoaderData<typeof loader>();

  return (
    <div className="fadein">
      <Form>
        <input placeholder="Search..." name="q" type="search"></input>
      </Form>
      <div>{list.length} record(s)</div>
      <table className="striped numbered scroll">
        <thead>
          <tr>
            <th></th>
            <th>Action</th>
            <th>Updated</th>
            <th>Email</th>
            <th>Roles</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => (
            <tr key={item.id}>
              <td></td>
              <td>
                <Form
                  method="delete"
                  action={`${item.id}`}
                  navigate={false}
                  onSubmit={(event) => {
                    const response = confirm(
                      "Confirm you want to delete this record. This action is not reversible."
                    );
                    if (!response) event.preventDefault();
                  }}
                >
                  <button>Delete</button>
                </Form>
              </td>
              <td>{item.updated.slice(0, 16)}</td>
              <td>
                <Link to={item.id}>{item.email}</Link>
              </td>
              <td>{item.roles}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Outlet></Outlet>
    </div>
  );
}
