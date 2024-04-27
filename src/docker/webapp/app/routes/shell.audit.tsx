import {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const findAll = await fetch(
    "https://a7ed-116-86-52-194.ngrok-free.app/v1/api/pms/audit/findAll"
  ).then((r) => r.json());
  // invariant(params.id, "Missing id param");
  // return json({ id: params.id });
  return { findAll };
};

export default function Component() {
  const { findAll } = useLoaderData<typeof loader>();

  return (
    <div className="fadein">
      <input type="search" placeholder="Search..."></input>
      <table>
        <tr>
          <th></th>
          <th>Transaction Ref</th>
          <th>Instrument Id</th>
          <th>Instrument Name</th>
          <th>Trade Type</th>
          <th>Audit Date</th>
        </tr>
        <tr>
          <td></td>
          <td>Placeholder</td>
          <td>Placeholder</td>
          <td>Placeholder</td>
          <td>Buy / Sell</td>
          <td>Placeholder</td>
        </tr>
      </table>
      <pre>{JSON.stringify(findAll, null, 2)}</pre>
    </div>
  );
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  return null;
};
