import {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  defer,
  json,
} from "@remix-run/node";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

// http://localhost:5173/shell/audit?pageNumber=1&pageSize=15
// http://localhost:5173/shell/audit

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);

  const url =
    "https://47bb-222-164-77-44.ngrok-free.app/v1/api/pms/audit/findAll?" +
    searchParams.toString();

  const findAll = fetch(url).then((r) => r.json());
  return defer({ url, findAll });
};

export default function Component() {
  const { url, findAll } = useLoaderData<typeof loader>();

  return (
    <div className="fadein">
      <input type="search" placeholder="Search..."></input>
      <Suspense fallback={<>Loading from Backend</>}>
        <Await resolve={findAll}>
          {(findAll) => (
            <>
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
                Page {findAll.number + 1} of {findAll.totalPages}{" "}
                {!findAll.first && (
                  <Link
                    className="button"
                    to={`?pageSize=${
                      findAll.pageable.pageSize ?? 1
                    }&pageNumber=${findAll.pageable.pageNumber ?? 1}`}
                  >
                    Prev
                  </Link>
                )}{" "}
                {!findAll.last && (
                  <Link
                    className="button"
                    to={`?pageSize=${
                      findAll.pageable.pageSize ?? 1
                    }&pageNumber=${(findAll.pageable.pageNumber ?? 1) + 2}`}
                  >
                    Next
                  </Link>
                )}
              </div>
              <pre>{JSON.stringify({ url, findAll }, null, 2)}</pre>
            </>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  return null;
};
