import { createClient } from "npm:@supabase/supabase-js@2";
import { JWT } from "npm:google-auth-library@9";
import serviceAccount from "../service-account.json" with { type: "json" };
import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load environment variables from .env file
config();

interface Notification {
  id: string;
  user_id: string;
  body: string;
}

interface WebhookPayload {
  type: "INSERT";
  table: string;
  record: Notification;
  schema: "public";
}

// const supabase = createClient(
//   Deno.env.get(env["NEXT_PUBLIC_SUPABASE_URL"])!,
//   Deno.env.get(
//     env[
//       "SUPABASE_SERVICE_ROLE_KEY"
//     ],
//   )!,
// );

// const supabase = createClient(
//   Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")!,
//   Deno.env.get(
//     "SUPABASE_SERVICE_ROLE_KEY",
//   )!,
// );

const supabase = createClient(
  "https://sstmhwqsclcymdnihufd.supabase.co"!,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzdG1od3FzY2xjeW1kbmlodWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1Mjc0NTgsImV4cCI6MjAzMzEwMzQ1OH0.8UWc8dUJCOdedqZ-lfOJD7QdhdU6Z86CSZ8598_JTcA"!,
);

Deno.serve(async (req) => {
  console.log("DENO SERVE FUNCTION");
  const payload: WebhookPayload = await req.json();

  const { data } = await supabase
    .from("user_public")
    .select("fcm_token")
    .eq("user_id", payload.record.user_id)
    .single();

  const fcmToken = data!.fcm_token as string;

  console.log("FCM TOKEN: ", fcmToken);
  console.log("payload: ", payload);

  const accessToken = await getAccessToken({
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
  });

  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        message: {
          token: fcmToken,
          notification: {
            title: `Notification from Twist`,
            body: payload.record.body,
          },
        },
      }),
    },
  );

  const resData = await res.json();
  if (res.status < 200 || 299 < res.status) {
    throw resData;
  }

  console.log(resData);

  return new Response(JSON.stringify(resData), {
    headers: { "Content-Type": "application/json" },
  });
});

const getAccessToken = ({
  clientEmail,
  privateKey,
}: {
  clientEmail: string;
  privateKey: string;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const jwtClient = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
    });
    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens!.access_token!);
    });
  });
};
