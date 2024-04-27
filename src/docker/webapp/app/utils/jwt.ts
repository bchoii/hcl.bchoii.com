import jwt, { JwtPayload } from "jsonwebtoken";
import { pathToFileURL } from "url";

import settings from "./settings.json";
const { secret } = settings;

export const jwtSign = (payload: object, expiresIn: string | number): string =>
  jwt.sign(payload, secret, { expiresIn });

export const jwtVerify = (token: string) =>
  jwt.verify(token, secret) as JwtPayload;

const main = async () => {
  {
    const signed = jwtSign({ test: "testObject" }, 1);
    console.log(signed);
    console.log(jwtVerify(signed));
    await new Promise((r) => setTimeout(r, 2000));
    try {
      console.log(jwtVerify(signed));
    } catch (error) {
      console.log("token expired");
    }
  }

  try {
    console.log("bad", jwtVerify("bad"));
  } catch (error) {
    console.error("verify bad token:", error);
  }
  console.log("Done.");
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
