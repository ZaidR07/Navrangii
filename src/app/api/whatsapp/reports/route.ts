import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const { db } = await connectToDB();

    // Build query
    const query: any = {};

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.sentTime = {
        $gte: startDate.toISOString(),
        $lte: endDate.toISOString(),
      };
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { campaignName: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { jobId: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch reports sorted by most recent first
    const reports = await db
      .collection("whatsapp_reports")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({
      success: true,
      reports: reports.map((report) => ({
        _id: report._id.toString(),
        jobId: report.jobId,
        campaignName: report.campaignName,
        channel: report.channel,
        message: report.message,
        mobileNumber: report.mobileNumber,
        status: report.status,
        sentTime: report.sentTime,
        errorMessage: report.errorMessage,
        createdAt: report.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reports",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
