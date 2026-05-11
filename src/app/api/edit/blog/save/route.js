import blog from '@/app/db/schema/blog'
import { NextResponse } from "next/server";
import connectDB from "@/app/db/mongo/db";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://roadtocode.blog.hirenray.rest",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}
export async function POST(request) {
  await connectDB()
  try {
    const body = await request.json();
    const data = body.storedata
    const savedTo = new blog({
      uuid:body.id,
      blog_name: data.blog_name,
      blog_slug: data.blog_slug,
      blog_content:data.blog_content,
      blog_type: data.blog_type,
      blog_author: data.blog_author,
      is_active:true,
      is_aproved:false,
    })
    await savedTo.save()
    // console.log(savedTo)

    if (savedTo) {
      return NextResponse.json(
        { message: "Saved successfully" },
        {
          status: 200,
          headers: CORS_HEADERS,
        },
      );
    }
    return NextResponse.json(
      { message: "Failed to save" },
      {
        status: 400,
        headers: CORS_HEADERS,
      },
    );
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json(
      { message: "Error saving data", error: error.message },
      {
        status: 500,
        headers: CORS_HEADERS,
      },
    );
  }
}
