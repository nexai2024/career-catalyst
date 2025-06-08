import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { z } from "zod";

import { prisma } from "@/lib/db";

const SelectedTeamSchema = z.object({
  created_at_millis: z.number(),
  id: z.string(),
  display_name: z.string(),
  profile_image_url: z.string().nullish(),
});

const UserIDSchema = z.string().describe("The unique identifier of this user");

const UserCreatedEventPayloadSchema = z.object({
  id: UserIDSchema,
  primary_email_verified: z
    .boolean()
    .describe(
      "Whether the primary email has been verified to belong to this user",
    ),
    primary_email_auth_enabled: z
    .boolean()
    .describe(
      "Whether the primary email has been verified to belong to this user",
    ),
  signed_up_at_millis: z
    .number()
    .describe(
      "The time the user signed up (the number of milliseconds since epoch, January 1, 1970, UTC)",
    ),
    last_active_at_millis: z
    .number()
    .describe(
      "The time the user signed up (the number of milliseconds since epoch, January 1, 1970, UTC)",
    ),
    is_anonymous: z
    .boolean()
    .describe("Whether the user signed up anonymously"),
  has_password: z
    .boolean()
    .describe("Whether the user has a password associated with their account"),
  primary_email: z.string().nullish().describe("Primary email"),
  display_name: z
    .string()
    .nullish()
    .describe(
      "Human-readable user display name. This is not a unique identifier.",
    ),
  selected_team: SelectedTeamSchema.nullish(),
  selected_team_id: z
    .string()
    .nullish()
    .describe("ID of the team currently selected by the user"),
  profile_image_url: z
    .string()
    .nullish()
    .describe(
      "URL of the profile image for user. Can be a Base64 encoded image. Please compress and crop to a square before passing in.",
    ),
  client_metadata: z
    .record(z.string(), z.any())
    .nullish()
    .describe(
      "Client metadata. Used as a data store, accessible from the client side. Do not store information that should not be exposed to the client.",
    ),
    cliemt_read_only_metadata: z
    .record(z.string(), z.any())
    .nullish()
    .describe(
        "Client read-only metadata. Used as a data store, accessible from the client side. Do not store information that should not be exposed to the client.",
        ),
  server_metadata: z
    .record(z.string(), z.any())
    .nullish()
    .describe(
      "Server metadata. Used as a data store, only accessible from the server side. You can store secret information related to the user here.",
    ),
});

const UserUpdatedEventPayloadSchema = UserCreatedEventPayloadSchema;

const UserDeletedEventPayloadSchema = z.object({
  id: UserIDSchema,
});

const StackAuthEventPayloadSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("user.created"),
    data: UserCreatedEventPayloadSchema,
  }),
  z.object({
    type: z.literal("user.updated"),
    data: UserUpdatedEventPayloadSchema,
  }),
  z.object({
    type: z.literal("user.deleted"),
    data: UserDeletedEventPayloadSchema,
  }),
]);

const SVIX_WEBHOOK_SIGNING_SECRET = process.env.SVIX_WEBHOOK_SIGNING_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key, parent) => {
    headers[key] = value;
  });

  const wh = new Webhook(SVIX_WEBHOOK_SIGNING_SECRET);

  let payload: any = {};

  try {
    payload = wh.verify(body, headers);
  } catch (e) {
    return NextResponse.json(
      { error: `Unable to verify webhook: ${(e as Error).message}` },
      { status: 500 },
    );
  }

  const parsedPayload = StackAuthEventPayloadSchema.parse(payload);

  if (parsedPayload.type === "user.created") {
    const data = parsedPayload.data;

    const newUser = await prisma?.user.create({
        data: {
            authid: data.id,
            name: data.display_name,
            email: data.primary_email || ""
        },
        });
    
  } 
  

  return NextResponse.json({ message: "Webhook received" });
}
