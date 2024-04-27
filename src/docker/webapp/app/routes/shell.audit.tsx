import {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  json,
} from "@remix-run/node";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  // invariant(params.id, "Missing id param");
  // return json({ id: params.id });
  return null;
};

export default function Component() {
  // const { id } = useLoaderData<typeof loader>();

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
      <pre>{JSON.stringify({ audit: "XXX" })}</pre>{" "}
    </div>
  );
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  return null;
};
