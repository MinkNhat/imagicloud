/* eslint-disable camelcase */
import { createClerkClient } from "@clerk/backend";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import User from "@/lib/database/models/user.model";


export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Tạo clerk client để có thể chỉnh sửa metadata   
  const clerkClient = createClerkClient({ secretKey: SIGNING_SECRET });

  // Lấy header được gửi lên từ Clerk
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // nếu header thiếu thông tin
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Lấy thông tin payload từ body
  const payload = await req.json();
  const body = JSON.stringify(payload);
  console.log("payload: ", payload);

  // tạo svix instance và event để verify webhook
  const wh = new Webhook(SIGNING_SECRET);
  let evt: WebhookEvent;

  // verify webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // lấy id và type event
  const { id } = evt.data;
  const eventType = evt.type;

  // =======CREATE
  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

    const user = {
      // toán tử ! để bỏ qua lỗi kiểm tra null   
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name!,
      lastName: last_name!,
      photo: image_url,
    };

    // const existingUser = await User.findOne({ clerkId: id });

    // if (existingUser) {
    //   return NextResponse.json({ message: "User already exists" });
    // }

    const newUser = await createUser(user);
    console.log("newUser: ", newUser);

    // Set public metadata -> gộp id user từ db vào metadata của clerk
    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    return NextResponse.json({ message: "OK", user: newUser });
  }

  // =========UPDATE
  if (eventType === "user.updated") {
    const { id, image_url, first_name, last_name, username } = evt.data;

    const user = {
      firstName: first_name!,
      lastName: last_name!,
      username: username!,
      photo: image_url,
    };

    const updatedUser = await updateUser(id, user);

    return NextResponse.json({ message: "OK", user: updatedUser });
  }

  // =========DELETE
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    const deletedUser = await deleteUser(id!);

    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}