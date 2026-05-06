import { NextResponse } from "next/server";

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": "https://roadtocode.blog.hirenray.rest/",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders(),
  });
}
export async function GET(req) {
  const res = "ree";
  return NextResponse.json(res);
}
