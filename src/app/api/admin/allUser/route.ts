import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";
import { getAuthenticatedAdmin } from "../../../../lib/adminAuth";

export async function GET() {
  try {
    const authUser = await getAuthenticatedAdmin();

    if (!authUser || !authUser.isAdmin) {
      return NextResponse.json({ message: "Access denied - Admins only." }, { status: 403 });
    }

    const { db } = await connectToDB();

    const users = await db
      .collection("users")
      .aggregate([
        { $match: { isAdmin: false } },
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "customerId",
            as: "orders",
          },
        },
        { $unwind: { path: "$orders", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "distributors",
            localField: "orders.assignedDistributor._id",
            foreignField: "_id",
            as: "orders.assignedDistributor",
          },
        },
        {
          $unwind: {
            path: "$orders.assignedDistributor",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: { path: "$orders.items", preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: "products",
            let: { productId: "$orders.items.product" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$productId"] },
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  description: 1,
                  category: 1,
                  subcategory: 1,
                  fabric: 1,
                  occasion: 1,
                  patternAndPrint: 1,
                  style: 1,
                  options: 1,
                },
              },
            ],
            as: "orders.items.product",
          },
        },
        {
          $addFields: {
            "orders.items.product": {
              $arrayElemAt: ["$orders.items.product", 0],
            },
          },
        },
        {
          $lookup: {
            from: "productVariants",
            let: { variantId: "$orders.items.variant" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$variantId"] },
                },
              },
              {
                $project: {
                  _id: 1,
                  color: 1,
                  thumbnail: 1,
                  gallery: 1,
                },
              },
            ],
            as: "orders.items.variant",
          },
        },
        {
          $addFields: {
            "orders.items.variant": {
              $arrayElemAt: ["$orders.items.variant", 0],
            },
          },
        },
        {
          $group: {
            _id: {
              userId: "$_id",
              orderId: "$orders._id",
            },
            name: { $first: "$name" },
            email: { $first: "$email" },
            phone: { $first: "$phone" },
            isAdmin: { $first: "$isAdmin" },
            createdAt: { $first: "$createdAt" },
            orderId: { $first: "$orders._id" },
            subtotal: { $first: "$orders.subtotal" },
            tax: { $first: "$orders.tax" },
            shipping: { $first: "$orders.shipping" },
            total: { $first: "$orders.total" },
            status: { $first: "$orders.status" },
            paymentMethod: { $first: "$orders.paymentMethod" },
            shippingAddress: { $first: "$orders.shippingAddress" },
            assignedDistributor: { $first: "$orders.assignedDistributor" },
            assignedDate: { $first: "$orders.assignedDate" },
            paymentDetails: { $first: "$orders.paymentDetails" },
            orderCreatedAt: { $first: "$orders.createdAt" },
            items: { $push: "$orders.items" },
          },
        },
        {
          $group: {
            _id: "$_id.userId",
            name: { $first: "$name" },
            email: { $first: "$email" },
            phone: { $first: "$phone" },
            isAdmin: { $first: "$isAdmin" },
            createdAt: { $first: "$createdAt" },
            orders: {
              $push: {
                _id: "$orderId",
                items: "$items",
                subtotal: "$subtotal",
                tax: "$tax",
                shipping: "$shipping",
                total: "$total",
                status: "$status",
                paymentMethod: "$paymentMethod",
                shippingAddress: "$shippingAddress",
                assignedDistributor: "$assignedDistributor",
                assignedDate: "$assignedDate",
                paymentDetails: "$paymentDetails",
                createdAt: "$orderCreatedAt",
              },
            },
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    return NextResponse.json(
      {
        message: "Users fetched successfully",
        users,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in getAllUsers:", error);
    return NextResponse.json(
      {
        message: "Error fetching users",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
