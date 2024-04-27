import { OAuth2Client, TokenPayload } from "google-auth-library";

const client = new OAuth2Client(process.env.CLIENT_ID);

export async function verifyCredentials(idToken: string) {
  const ticket = await client.verifyIdToken({ idToken });
  const payload = ticket.getPayload();
  //   const userid = payload["sub"];
  return payload as TokenPayload;
}
