import {
  redirect,
  type ActionFunctionArgs,
  type LinksFunction,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { authCookie } from "../utils/cookies";

export default function Login() {
  const actionData = useActionData<typeof action>();
  console.log({ actionData });
  const [searchParams] = useSearchParams();
  return (
    <div className="m-auto">
      <h3>
        <a href="/">
          <img src="/assets/logo.png" />
          Login
        </a>
      </h3>
      <Form method="post">
        <input name="username" placeholder="Username"></input>
        <div className="error">{actionData?.error}</div>
        <button>Login</button>
      </Form>
    </div>
  );
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get("username");
  if (username) {
    return redirect("/shell", {
      headers: { "Set-Cookie": await authCookie.serialize(username) },
    });
  }
  return json({ error: "Username cannot be empty" });
};
