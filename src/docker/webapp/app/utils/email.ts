import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

export const sendEmail = async (
  from: string,
  to: string,
  subject: string,
  content: string
) => {
  const client = new SESv2Client({
    region: process.env.AWS_DEFAULT_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  const input = {
    FromEmailAddress: from,
    Destination: { ToAddresses: [to] },
    Content: {
      Simple: {
        Subject: { Data: subject },
        Body: { Text: { Data: content } },
      },
    },
  };
  const command = new SendEmailCommand(input);
  try {
    const response = await client.send(command);
  } catch (error) {
    // @aws-sdk\client-sesv2 BadRequestException: Invalid email address
  }
};
