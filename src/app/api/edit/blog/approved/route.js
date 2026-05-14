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
  const apType = searchParams.get("apType");
  console.log(apType)
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
    let approved;
    if (apType === "public") {
      approved = await blog.findByIdAndUpdate(
        blogid, // 1st arg: The ID
        { $set: { is_aproved: false } }, // 2nd arg: The update
        { new: true }, // 3rd arg: Options
      );
    } else if (apType === "unpublic") {
      approved = await blog.findByIdAndUpdate(
        blogid, // 1st arg: The ID
        { $set: { is_aproved: true } }, // 2nd arg: The update
        { new: true }, // 3rd arg: Options
      );
    }
    console.log(approved)
    return NextResponse.json(
      {
        message: "Blogs Approved successfully",
      },
      {
        status: 200, // 200 = OK
        headers: CORS_HEADERS,
      },
    );
  } else {
    return NextResponse.json(
      { message: "Blog not Aproved" },
      { status: 404, headers: CORS_HEADERS }, // 404 = Not Found
    );
  }
}
