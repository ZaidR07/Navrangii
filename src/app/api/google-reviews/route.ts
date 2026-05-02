import { NextRequest, NextResponse } from "next/server";

// Google Places API endpoint
const GOOGLE_PLACES_API_URL = "https://maps.googleapis.com/maps/api/place/details/json";

interface GoogleReview {
  author_name: string;
  author_url: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export async function GET(req: NextRequest) {
  try {
    const placeId = process.env.GOOGLE_PLACE_ID;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!placeId || !apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Google Places API not configured",
          reviews: [],
        },
        { status: 500 }
      );
    }

    // Fetch from Google Places API
    const url = `${GOOGLE_PLACES_API_URL}?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "OK") {
      return NextResponse.json(
        {
          success: false,
          message: data.status || "Failed to fetch reviews",
          reviews: [],
        },
        { status: 400 }
      );
    }

    // Transform Google reviews to our format
    const reviews = (data.result?.reviews || []).map((review: GoogleReview, index: number) => ({
      id: index + 1,
      name: review.author_name,
      location: review.relative_time_description,
      rating: review.rating,
      review: review.text,
      product: "Verified Purchase", // Google reviews don't have product info
      avatar: review.profile_photo_url,
      time: review.time,
    }));

    return NextResponse.json({
      success: true,
      reviews,
      totalRating: data.result?.rating || 0,
      totalReviews: data.result?.user_ratings_total || 0,
    });
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reviews",
        reviews: [],
      },
      { status: 500 }
    );
  }
}
