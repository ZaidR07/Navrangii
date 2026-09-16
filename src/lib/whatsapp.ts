import { connectToDB } from "./mongodb";

const WHATSAPP_API_BASE = "https://whatsapper.t-rexinfotech.in/api/public";
const WHATSAPP_COUNTRY_CODE = "91";

/**
 * Fetches WhatsApp credentials (username + device token) from the
 * `general_information` collection, exactly like the campaign sender does.
 */
async function getWhatsAppCredentials() {
  const { db } = await connectToDB();
  const settingsDoc = await db
    .collection("general_information")
    .findOne({ _id: "general_settings" as any });

  const settings = settingsDoc?.data || {};
  return {
    username: settings.whatsappUsername || "",
    deviceToken: settings.whatsappDeviceToken || "",
  };
}

/**
 * Normalises an Indian mobile number to the format expected by the
 * whatsapper API (no `+`, prefixed with the country code 91).
 */
export function formatWhatsAppNumber(input: string): string {
  let number = input.replace(/\s/g, "").replace(/-/g, "");
  if (number.startsWith("+")) {
    number = number.replace(/^\+/, "");
  } else if (!number.startsWith(WHATSAPP_COUNTRY_CODE)) {
    number = `${WHATSAPP_COUNTRY_CODE}${number}`;
  }
  return number;
}

/**
 * Sends a single WhatsApp message via the whatsapper.t-rexinfotech.in API,
 * reusing the same credentials the marketing campaigns use.
 *
 * Returns `{ ok, response }` so callers can decide how to handle failures.
 */
export async function sendWhatsAppMessage(
  mobileNumber: string,
  message: string
): Promise<{ ok: boolean; response: string }> {
  const { username, deviceToken } = await getWhatsAppCredentials();

  if (!username || !deviceToken) {
    throw new Error(
      "WhatsApp credentials not configured. Please set them in Settings > General Settings > WhatsApp Marketing Credentials."
    );
  }

  const formattedNumber = formatWhatsAppNumber(mobileNumber);
  const apiUrl = `${WHATSAPP_API_BASE}/send-msg?username=${username}&number=${formattedNumber}&message=${encodeURIComponent(
    message
  )}&token=${deviceToken}`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const responseText = await response.text();

  return { ok: response.ok, response: responseText };
}
