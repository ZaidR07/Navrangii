import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

const WHATSAPP_API_BASE = "https://whatsapper.t-rexinfotech.in/api/public";
const WHATSAPP_COUNTRY_CODE = "91";
const INTERVAL_SECONDS = 3; // Hardcoded 3-second interval

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDB();

    // Fetch WhatsApp credentials from database
    const settingsDoc = await db
      .collection("general_information")
      .findOne({ _id: "general_settings" as any });

    const settings = settingsDoc?.data || {};
    const WHATSAPP_USERNAME = settings.whatsappUsername || "";
    const WHATSAPP_DEVICE_TOKEN = settings.whatsappDeviceToken || "";

    if (!WHATSAPP_USERNAME || !WHATSAPP_DEVICE_TOKEN) {
      return NextResponse.json(
        { success: false, message: "WhatsApp credentials not configured. Please set them in Settings > General Settings > WhatsApp Marketing Credentials." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      campaignName,
      mobileNumbers,
      message,
    } = body;

    // Validation
    if (!campaignName || !mobileNumbers || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!Array.isArray(mobileNumbers) || mobileNumbers.length === 0) {
      return NextResponse.json(
        { success: false, message: "No mobile numbers provided" },
        { status: 400 }
      );
    }

    const jobId = `JOB-${Date.now()}`;
    const results = [];
    let sentCount = 0;
    let failedCount = 0;

    // Process each number
    for (let i = 0; i < mobileNumbers.length; i++) {
      const number = mobileNumbers[i];
      
      // Format number with country code if needed
      let formattedNumber = number.replace(/\s/g, "");
      if (!formattedNumber.startsWith("+")) {
        if (!formattedNumber.startsWith(WHATSAPP_COUNTRY_CODE)) {
          formattedNumber = `${WHATSAPP_COUNTRY_CODE}${formattedNumber}`;
        }
      }
      formattedNumber = formattedNumber.replace(/^\+/, "");

      // Prepare API URL using env credentials
      const apiUrl = `${WHATSAPP_API_BASE}/send-msg?username=${WHATSAPP_USERNAME}&number=${formattedNumber}&message=${encodeURIComponent(message)}&token=${WHATSAPP_DEVICE_TOKEN}`;

      try {
        // Send message via WhatsApp API
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        const responseData = await response.text();

        // Store report in database
        const report = {
          jobId,
          campaignName,
          channel: "WhatsApp",
          mobileNumber: formattedNumber,
          message,
          status: response.ok ? "sent" : "failed",
          sentTime: new Date().toISOString(),
          errorMessage: response.ok ? null : responseData,
          createdAt: new Date(),
        };

        await db.collection("whatsapp_reports").insertOne(report);

        results.push({
          number: formattedNumber,
          status: response.ok ? "sent" : "failed",
          response: responseData,
        });

        if (response.ok) {
          sentCount++;
        } else {
          failedCount++;
        }
      } catch (error) {
        // Store failed report
        const report = {
          jobId,
          campaignName,
          channel: "WhatsApp",
          mobileNumber: formattedNumber,
          message,
          status: "failed",
          sentTime: new Date().toISOString(),
          errorMessage: error instanceof Error ? error.message : "Unknown error",
          createdAt: new Date(),
        };

        await db.collection("whatsapp_reports").insertOne(report);

        results.push({
          number: formattedNumber,
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
        failedCount++;
      }

      // Wait for 3-second interval (if not the last message)
      if (i < mobileNumbers.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, INTERVAL_SECONDS * 1000));
      }
    }

    return NextResponse.json({
      success: true,
      jobId,
      sent: sentCount,
      failed: failedCount,
      total: mobileNumbers.length,
      results,
    });
  } catch (error) {
    console.error("Error in send-campaign:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process campaign",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
