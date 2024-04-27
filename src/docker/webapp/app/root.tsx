import { json, type LinksFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { authCookie } from "./utils/cookies";
import { NavigationStatus } from "./utils/NavigationStatus";
import tailwindCss from "./tailwind.css?url";
import stylesCss from "./styles.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindCss },
  { rel: "stylesheet", href: stylesCss },
];

export const loader = async ({ request }: { request: Request }) => {
  // console.log("request.url", request.url);
  // console.log("x-forwarded-for", request.headers.get("x-forwarded-for"));
  const cookieHeader = request.headers.get("cookie");
  const auth = await authCookie.parse(cookieHeader);
  return json({ auth });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link rel="manifest" href="/app.webmanifest"></link>
        <link rel="stylesheet" href="/styles.css"></link>
      </head>
      <body>
        {children}
        {/* <Suspense>{children}</Suspense> */}
        {/* <ClientOnly fallback={<>Loading...</>}>
          {() => <>{children}</>}
        </ClientOnly> */}
        <ScrollRestoration />
        <Scripts />
        <NavigationStatus></NavigationStatus>
        <div className="background"></div>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export const mapError = (error: unknown) =>
  isRouteErrorResponse(error)
    ? ["Route Error", error.status, error.statusText, error.data]
    : error instanceof Error
    ? ["Error", error.message, error.stack]
    : ["Unknown error"];

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html>
      <head>
        <title>Error</title>
        <Meta />
        <Links />
      </head>
      <body>
        {mapError(error).map((e) => (
          <pre key={e} className="error">
            {e}
          </pre>
        ))}
        <Scripts />
      </body>
    </html>
  );
}
