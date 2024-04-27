import { redirect } from "@remix-run/node";
import { authCookie } from "./cookies";
import { db } from "../../db/orm";
import { eq } from "drizzle-orm";
import { users } from "../../db/schema";

export async function requireUser(request: Request, role?: string) {
  const loginUrl = "/glogin/index.html";
  const auth = await authCookie.parse(request.headers.get("cookie"));
  if (!auth) throw redirect(loginUrl);

  const user = await db.query.users.findFirst({ where: eq(users.email, auth) });
  if (!user) throw redirect(loginUrl);
  if (!user?.roles?.includes("Verified")) throw redirect(loginUrl);
  if (role && !user?.roles?.includes(role)) throw redirect(loginUrl);

  return user;
}
