import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const host = request.headers.get("host");
  const ip = request.headers.get("x-forwarded-for");
  const path = params["*"];
  throw new Response(null, { status: 404 });
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const host = request.headers.get("host");
  const ip = request.headers.get("x-forwarded-for");
  const path = params["*"];
  throw new Response(null, { status: 404 });
};
