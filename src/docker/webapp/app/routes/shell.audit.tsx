import {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// http://localhost:5173/shell/audit?pageNumber=1&pageSize=15
// http://localhost:5173/shell/audit

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  console.log("searchParams", searchParams);
  console.log(searchParams.toString());

  const pageNumber = searchParams.get("pageNumber");
  const pageSize = searchParams.get("pageSize");
  console.log("pageNumber", pageNumber);
  console.log("pageSize", pageSize);

  const url =
    "https://a7ed-116-86-52-194.ngrok-free.app/v1/api/pms/audit/findAll?" +
    searchParams.toString();

  const findAll = await fetch(url).then((r) => r.json());
  console.log("findAll", findAll);
  // invariant(params.id, "Missing id param");
  // return json({ id: params.id });
  return { url, findAll };
};

export default function Component() {
  const { url, findAll } = useLoaderData<typeof loader>();

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
        {findAll?.content?.map((r) => (
          <tr>
            <td></td>
            <td>{r.transactionRef}</td>
            <td>{r.instrumentId}</td>
            <td>{r.instrumentName}</td>
            <td>{r.tradeType}</td>
            <td>{r.auditDate}</td>
          </tr>
        ))}
      </table>
      <div>
        {!findAll.first && (
          <a
            href={`?pageSize=${findAll.pageable.pageSize ?? 1}&pageNumber=${
              findAll.pageable.pageNumber ?? 1
            }`}
          >
            Prev
          </a>
        )}{" "}
        {!findAll.last && (
          <a
            href={`?pageSize=${findAll.pageable.pageSize ?? 1}&pageNumber=${
              (findAll.pageable.pageNumber ?? 1) + 2
            }`}
          >
            Next
          </a>
        )}
      </div>
      <pre>{JSON.stringify({ url, findAll }, null, 2)}</pre>
    </div>
  );
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  return null;
};
