import User from "@/app/db/schema/user";
import { NextResponse } from "next/server";
import connectDB from "@/app/db/mongo/db";

// Fallback to '*' only for development, but try to use the ENV variable
const allowedOrigin = process.env.CORS_URL ;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400", // Cache preflight for 24 hours
};

// 1. IMPROVED OPTIONS HANDLER
export async function OPTIONS() {
  return NextResponse.json({}, { 
    status: 204, // 204 No Content is standard for OPTIONS
    headers: CORS_HEADERS 
  });
}

export async function GET(req) {
  try {
    // 2. CONNECTION TIMEOUT PREVENTION
    // Ensure DB is connected before proceeding
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Missing credentials" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 3. DATABASE QUERY
    const checkUser = await User.findOne({ uuid: id,}).lean();

    if (checkUser) {
      return NextResponse.json(
        { message: "User verified" },
        { status: 200, headers: CORS_HEADERS }
      );
    } 

    return NextResponse.json(
      { message: "User not verified" },
      { status: 401, headers: CORS_HEADERS }
    );

  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}