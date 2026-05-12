import { NextResponse } from "next/server";

const url = process.env.CORS_URL

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

export async function GET(request) {
  return NextResponse.json(
    { message: "Admin API is running" },
    {
      status: 200,
      headers: CORS_HEADERS,
    }
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    return NextResponse.json(
      { message: "Data received", data: body },
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error processing request", error: error.message },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}