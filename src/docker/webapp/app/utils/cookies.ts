import { createCookie, createCookieSessionStorage } from "@remix-run/node";
// import "dotenv/config";

import settings from "./settings.json";

const { secret } = settings;

export const authCookie = createCookie("auth", {
  maxAge: 60 * 60 * 8, // 8 hours
  secure: true,
  httpOnly: true,
  secrets: [secret],
  sameSite: "lax",
  path: "/",
});

export const tokenCookie = createCookie("token", {
  maxAge: 60, // 1 minute
  secure: true,
  httpOnly: true,
  secrets: [secret],
  sameSite: "lax",
  path: "/",
});

// TODO https://www.mattstobbs.com/remix-authentication/
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [secret],
    secure: process.env.NODE_ENV === "production",
  },
});

// export const formCookie = createCookie("formToken", {
//   maxAge: 60, // 60 seconds // form must be completed before expiry
//   secure: true,
//   secrets,
//   sameSite: "lax",
//   path: "/",
//   httpOnly: true,
// });
