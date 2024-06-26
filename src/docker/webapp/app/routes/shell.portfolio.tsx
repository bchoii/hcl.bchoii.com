import {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  defer,
  json,
} from "@remix-run/node";
import { Await, Form, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { Suspense, useRef } from "react";

// http://localhost:5173/shell/portfolio

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);

  const url =
    "http://62b2-116-86-52-194.ngrok-free.app/api/portfolios?" +
    searchParams.toString();

  const findAll = fetch(url).then((r) => r.json());
  return defer({ url, findAll });
};

export default function Component() {
  const { url, findAll } = useLoaderData<typeof loader>();
  const dialog = useRef<HTMLDialogElement>(null);

  function showDialog() {
    dialog.current?.showModal();
  }

  function closeDialog() {
    dialog.current?.close();
  }

  return (
    <div className="fadein">
      <div className="flex">
        <input type="search" placeholder="Search..."></input>
        <button onClick={showDialog} className="ml-auto">
          Add Trade
        </button>
      </div>

      <Suspense fallback={<>Loading...</>}>
        <Await resolve={findAll}>
          {(findAll) => (
            <>
              <table>
                <tr>
                  <th></th>
                  <th>Customer Name ⌄</th>
                  <th>Portfolio Number ⌃</th>
                  <th>Portfolio Value</th>
                  <th>Current Performance</th>
                  <th>Investment Strategy</th>
                </tr>
                <tr>
                  <td></td>
                  <td>Placeholder</td>
                  <td>Placeholder</td>
                  <td>$43,213</td>
                  <td className="bg-green-100">23.4%</td>
                  <td>
                    <span className="bg-green-100">Safe</span> /{" "}
                    <span className="bg-orange-100">Moderate</span> /{" "}
                    <span className="bg-red-100">Risky</span>
                  </td>
                </tr>
              </table>
            </>
          )}
        </Await>
      </Suspense>

      <dialog ref={dialog}>
        <div className="grid gap-2">
          <div
            className="grid grid-cols-2 gap-2"
            style={{ gridTemplateColumns: "auto 1fr" }}
          >
            Instruments
            <select>
              <option></option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
            Buy / Sell
            <div>
              <label>
                <input type="radio"></input> Buy
              </label>
              <label>
                <input type="radio"></input> Sell
              </label>
            </div>
            Units
            <input type="number" defaultValue={0}></input>
          </div>

          <table>
            <tr>
              <th></th>
              <th>Current Portfolio Value</th>
              <th>New Portfolio Value</th>
              <th>% Difference</th>
            </tr>
            <tr>
              <td></td>
              <td>Placeholder</td>
              <td>Placeholder</td>
              <td className="bg-green-200">Placeholder ↑</td>
            </tr>
            <tr>
              <td></td>
              <td>Placeholder</td>
              <td>Placeholder</td>
              <td className="bg-red-200">Placeholder ↓</td>
            </tr>
          </table>

          <div className="flex justify-end p-2">
            <button onClick={closeDialog}>Cancel</button>
            <button>Submit</button>
          </div>
        </div>
      </dialog>
      <pre>{JSON.stringify({ url, findAll }, null, 2)}</pre>
    </div>
  );
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  return null;
};

import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
