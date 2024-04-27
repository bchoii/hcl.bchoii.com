import {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import { Form, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { useRef } from "react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  // invariant(params.id, "Missing id param");
  // return json({ id: params.id });
  return null;
};

export default function Component() {
  // const { id } = useLoaderData<typeof loader>();
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
      <pre>{JSON.stringify({ portfolio: "XXX" })}</pre>{" "}
    </div>
  );
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  return null;
};
