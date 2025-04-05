"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { handleError } from "../utils";
import { connectToDatabase } from "../database/mongoose";
import Transaction from "../database/models/transaction.model";
import { updateCredits } from "./user.actions";
import mongoose from "mongoose";
import User from "../database/models/user.model";

export async function checkoutCredits(transaction: CheckoutTransactionParams) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const amount = transaction.amount * 100; 

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: amount,
                    product_data: {
                        name: transaction.plan,
                    },
                },
                quantity: 1,
            }
        ],
        metadata: {
            plan: transaction.plan,
            credits: transaction.credits,
            buyerId: transaction.buyerId,
        },
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    })

    redirect(session.url!);
}

export async function createTransaction(transaction: CreateTransactionParams) {
    try {
        await connectToDatabase();

        const newTransaction = await Transaction.create({
            ...transaction,
            buyer: transaction.buyerId,
        })

        await updateCredits(transaction.buyerId, transaction.credits);

        return JSON.parse(JSON.stringify(newTransaction));
    } catch(error) {
        handleError(error);
    }
}

// export async function createTransaction(transaction: CreateTransactionParams) {
//     try {
//         await connectToDatabase();
        
//         console.log("Đang tạo giao dịch với dữ liệu:", JSON.stringify(transaction));
        
//         // Kiểm tra xem có stripeId không
//         if (!transaction.stripeId) {
//             console.error("Thiếu stripeId trong dữ liệu transaction");
//             throw new Error("stripeId là bắt buộc");
//         }
        
//         // Kiểm tra xem đã tồn tại transaction với stripeId này chưa
//         const existingTransaction = await Transaction.findOne({ stripeId: transaction.stripeId });
//         if (existingTransaction) {
//             console.log("Transaction với stripeId này đã tồn tại:", transaction.stripeId);
//             return JSON.parse(JSON.stringify(existingTransaction));
//         }
        
//         // Tìm user để lấy ObjectId
//         let buyer = null;
        
//         // Kiểm tra nếu buyerId là ObjectId hợp lệ
//         if (mongoose.isValidObjectId(transaction.buyerId)) {
//             // Tìm user bằng _id
//             const userById = await User.findById(transaction.buyerId);
//             if (userById) {
//                 buyer = userById._id;
//                 console.log("Đã tìm thấy user bằng _id:", buyer);
//             }
//         }
        
//         // Nếu không tìm thấy bằng _id, thử tìm bằng clerkId
//         if (!buyer) {
//             const userByClerkId = await User.findOne({ clerkId: transaction.buyerId });
//             if (userByClerkId) {
//                 buyer = userByClerkId._id;
//                 console.log("Đã tìm thấy user bằng clerkId:", buyer);
//             }
//         }
        
//         if (!buyer) {
//             console.error("Không thể tìm thấy user với ID:", transaction.buyerId);
//             throw new Error("User not found");
//         }
        
//         // Tạo đối tượng transaction để lưu vào MongoDB
//         const transactionData = {
//             stripeId: transaction.stripeId,
//             amount: transaction.amount,
//             plan: transaction.plan || "Unknown Plan",
//             credits: transaction.credits,
//             buyer: buyer,
//             createdAt: transaction.createdAt || new Date()
//         };
        
//         console.log("Đang lưu transaction vào MongoDB:", JSON.stringify(transactionData));
        
//         // Lưu transaction vào MongoDB
//         const newTransaction = await Transaction.create(transactionData);
        
//         if (!newTransaction) {
//             console.error("Không thể tạo transaction");
//             throw new Error("Failed to create transaction");
//         }
        
//         console.log("Đã tạo transaction thành công, ID:", newTransaction._id);
        
//         // Cập nhật credits cho người dùng - sử dụng _id của user
//         try {
//             // Nếu đã tìm thấy user, cập nhật trực tiếp creditBalance
//             const updatedUser = await User.findByIdAndUpdate(
//                 buyer,
//                 { $inc: { creditBalance: transaction.credits } },
//                 { new: true }
//             );
            
//             console.log("Đã cập nhật credits cho người dùng:", 
//                 updatedUser ? updatedUser.creditBalance : "không thành công");
//         } catch (creditError) {
//             console.error("Lỗi khi cập nhật credits, nhưng transaction đã được tạo:", creditError);
//         }
        
//         return JSON.parse(JSON.stringify(newTransaction));
//     } catch (error) {
//         console.error("Lỗi trong createTransaction:", error);
//         handleError(error);
//         throw error;
//     }
// }