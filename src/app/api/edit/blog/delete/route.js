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

export async function POST(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const blogid = searchParams.get("blogID");
  if (!id) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400, headers: CORS_HEADERS }, // 400 = Bad Request
    );
  }

  // 2. Find User
  const findUser = await User.findOne({ uuid: id });
  if (!findUser) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404, headers: CORS_HEADERS }, // 404 = Not Found
    );
  }
  if (findUser.user_role === "admin") {
    const blogdelete = await blog.findByIdAndDelete(blogid);
    return NextResponse.json(
      {
        message: "Blogs delete successfully",
      },
      {
        status: 200, // 200 = OK
        headers: CORS_HEADERS,
      },
    );
  } else {
    return NextResponse.json(
      { message: "Blog not Deleted" },
      { status: 404, headers: CORS_HEADERS }, // 404 = Not Found
    );
  }
}
