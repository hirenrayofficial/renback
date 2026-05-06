import connectDB from "@/app/db/mongo/db";
import blog from "@/app/db/schema/blog";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://roadtocode.blog.hirenray.rest/",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

export async function GET(request) {
  await connectDB();
  const getallblog = blog.find();
  if (!getallblog) {
    return NextResponse.json(
      { message: "Server error" },
      {
        status: 500,
        headers: CORS_HEADERS,
      },
    );
  }
  return NextResponse.json({
    status: 200,
    headers: CORS_HEADERS,
    data: getallblog,
  });
}
