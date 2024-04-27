import {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// http://localhost:5173/shell/positions?transactionRef=12345

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);

  const url =
    "http://62b2-116-86-52-194.ngrok-free.app/PositionServices/getAllPositions?" +
    // "http://62b2-116-86-52-194.ngrok-free.app/PositionServices/getPosition?" +
    searchParams.toString();

  const findAll = await fetch(url).then((r) => r.json());
  return { url, findAll };
};

export default function Component() {
  const { url, findAll } = useLoaderData<typeof loader>();

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
          <th>Trade Type</th>
          <th>Unit</th>
          <th>Action</th>
        </tr>
        {findAll.map((r) => (
          <tr>
            <td></td>
            <td>{r.transaction_ref}</td>
            <td>{r.instrument_Id}</td>
            <td></td>
            <td></td>
            <td>{/* Bond / Digital Asset / Real Estate */}</td>
            <td>{r.trade_type}</td>
            <td>{r.unit}</td>
            <td>
              <button onClick={placeholder}> - </button>
            </td>
          </tr>
        ))}
      </table>
      <pre>{JSON.stringify({ url, findAll }, null, 2)}</pre>
    </div>
  );
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  return null;
};
