import blog from "@/app/db/schema/blog";
import User from "@/app/db/schema/user";
import { NextResponse } from "next/server";
import connectDB from "@/app/db/mongo/db";

const url = process.env.CORS_URL;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": `${url}`,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // 1. Validate ID existence
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400, headers: CORS_HEADERS } // 400 = Bad Request
      );
    }

    // 2. Find User
    const findUser = await User.findOne({ uuid: id });
    if (!findUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404, headers: CORS_HEADERS } // 404 = Not Found
      );
    }

    let getBlog;

    // 3. Admin Logic: See all pending blogs
    if (findUser.user_role === "admin") {
      getBlog = await blog.find({ is_aproved: false });
    } 
    // 4. Editor Logic: See only their own blogs
    else {
      getBlog = await blog.find({ author_id: findUser.uuid });
    }

    // 5. Success Return
    return NextResponse.json(
      { 
        message: "Blogs fetched successfully", 
        blog: getBlog 
      },
      {
        status: 200, // 200 = OK
        headers: CORS_HEADERS,
      }
    );

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}