/* eslint-disable camelcase */

// import { createTransaction } from "@/lib/actions/transaction.actions";
// import { NextResponse } from "next/server";
// import stripe from "stripe";

// export async function POST(request: Request) {
//   const body = await request.text();

//   const sig = request.headers.get("stripe-signature") as string;
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
//   } catch (err) {
//     return NextResponse.json({ message: "Webhook error", error: err });
//   }

//   // Get the ID and type
//   const eventType = event.type;

//   // CREATE
//   if (eventType === "checkout.session.completed") {
//     const { id, amount_total, metadata } = event.data.object;

//     const transaction = {
//       stripeId: id,
//       amount: amount_total ? amount_total / 100 : 0,
//       plan: metadata?.plan || "",
//       credits: Number(metadata?.credits) || 0,
//       buyerId: metadata?.buyerId || "",
//       createdAt: new Date(),
//     };

//     const newTransaction = await createTransaction(transaction);
    
//     return NextResponse.json({ message: "OK", transaction: newTransaction });
//   }

//   return new Response("", { status: 200 });
// }


/* eslint-disable camelcase */

import { createTransaction } from "@/lib/actions/transaction.actions";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/database/mongoose";
import User from "@/lib/database/models/user.model";
import Transaction from "@/lib/database/models/transaction.model";


export async function POST(request: Request) {
  console.log("WEBHOOK: Nhận request webhook từ Stripe");
  
  try {
    const body = await request.text();

    const sig = request.headers.get("stripe-signature") as string;
    if (!sig) {
      console.error("WEBHOOK: Thiếu header stripe-signature");
      return NextResponse.json({ message: "Webhook error: Missing signature" }, { status: 400 });
    }
    
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    if (!endpointSecret) {
      console.error("WEBHOOK: Thiếu biến môi trường STRIPE_WEBHOOK_SECRET");
      return NextResponse.json({ message: "Webhook error: Missing webhook secret" }, { status: 500 });
    }

    // Khởi tạo Stripe đúng cách
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
    if (!stripeSecretKey) {
      console.error("WEBHOOK: Thiếu biến môi trường STRIPE_SECRET_KEY");
      return NextResponse.json({ message: "Webhook error: Missing Stripe secret key" }, { status: 500 });
    }
    
    const stripeInstance = new Stripe(stripeSecretKey);
    
    let event;
    try {
      event = stripeInstance.webhooks.constructEvent(body, sig, endpointSecret);
      console.log(`WEBHOOK: Đã xác thực webhook với loại: ${event.type}`);
    } catch (err) {
      console.error("WEBHOOK: Lỗi xác thực webhook:");
      return NextResponse.json({ message: "Webhook error" }, { status: 400 });
    }

    // Get the ID and type
    const eventType = event.type;

    // Chỉ xử lý checkout.session.completed
    if (eventType === "checkout.session.completed") {
      console.log("WEBHOOK: Nhận được sự kiện checkout.session.completed");
      
      const { id, amount_total, metadata } = event.data.object;
      
      // Kiểm tra dữ liệu hợp lệ
      if (!id) {
        console.error("WEBHOOK: Thiếu id trong dữ liệu session");
        return NextResponse.json({ message: "Invalid session data: missing id" }, { status: 400 });
      }
      
      if (!metadata || !metadata.buyerId || !metadata.credits) {
        console.error("WEBHOOK: Thiếu metadata trong dữ liệu session", metadata);
        return NextResponse.json({ message: "Invalid session data: missing metadata" }, { status: 400 });
      }

      const transaction = {
        stripeId: id,
        amount: amount_total ? amount_total / 100 : 0,
        plan: metadata?.plan || "",
        credits: Number(metadata?.credits) || 0,
        buyerId: metadata?.buyerId || "",
        createdAt: new Date(),
      };
      
      console.log("WEBHOOK: Đang gọi createTransaction với dữ liệu:", JSON.stringify(transaction));
      
      try {
        const newTransaction = await createTransaction(transaction);
        console.log("WEBHOOK: createTransaction thành công:", newTransaction ? "success" : "failed");
        
        return NextResponse.json({ message: "OK", transaction: newTransaction });
      } catch (transactionError) {
        console.error("WEBHOOK: Lỗi khi tạo transaction:", 
          
        );
        
        return NextResponse.json(
          { message: "Transaction creation error" }, 
          { status: 500 }
        );
      }
    } else {
      console.log(`WEBHOOK: Bỏ qua sự kiện không phải checkout.session.completed: ${eventType}`);
    }

    return new Response("", { status: 200 });
  } catch (error) {
    console.error("WEBHOOK: Lỗi không xử lý được:", );
    return NextResponse.json({ message: "Webhook error" }, { status: 500 });
  }
}

