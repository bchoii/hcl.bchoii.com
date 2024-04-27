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

  function placeholder() {
    alert("Placeholder");
  }

  return (
    <div className="fadein">
      <input type="search" placeholder="Search..."></input>
      <table>
        <tr>
          <th></th>
          <th>Transaction Ref</th>
          <th>Instrument Id</th>
          <th>Instrument Name</th>
          <th>Instrument Value</th>
          <th>Instrument Type</th>
          <th>Action</th>
        </tr>
        <tr>
          <td></td>
          <td>Placeholder</td>
          <td>Placeholder</td>
          <td>Placeholder</td>
          <td>Placeholder</td>
          <td>Bond / Digital Asset / Real Estate</td>

          <td>
            <button onClick={placeholder}> - </button>
          </td>
        </tr>
      </table>
      <pre>{JSON.stringify({ position: "XXX" })}</pre>{" "}
    </div>
  );
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  return null;
};
