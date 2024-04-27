import {
  type ActionFunctionArgs,
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
  redirect,
  createCookie,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { verifyCredentials } from "./glogin/gauth";
import { authCookie } from "../utils/cookies";
import { create, db } from "../../db/orm";
import { eq } from "drizzle-orm";
import { User, users } from "../../db/schema";

export default function Component() {
  const actionData = useActionData<typeof action>();
  return <div className="error m-auto">{actionData}</div>;
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const host = request.headers.get("host");
  const ip = request.headers.get("x-forwarded-for");

  const form = Object.fromEntries((await request.formData()).entries());
  const cookies = Object.fromEntries(
    request.headers
      .get("cookie")
      ?.split("; ")
      .map((p) => p.split("="))!
  );

  if (form.g_csrf_token != cookies.g_csrf_token) {
    throw new Response("Bad g_csrf_token", { status: 500 });
  }

  const credentials = await verifyCredentials(form.credential as string);
  const { email } = credentials;

  const user = ((await db.query.users.findFirst({
    where: eq(users.email, email!),
  })) ??
    (await create("users", {
      email,
      roles:
        email == "bchoii@gmail.com" //
          ? ["Verified"] //
          : ["Verified"], // default roles
      host,
      ip,
    }))) as User;

  if (user.roles?.includes("Verified")) {
    const headers = { "Set-Cookie": await authCookie.serialize(email) };
    if (user.roles?.includes("Verified")) {
      return redirect("../shell", { headers });
    }
    return redirect("../", { headers });
  }

  return json("Unverified account. Please contact admin to verify your email.");
};
