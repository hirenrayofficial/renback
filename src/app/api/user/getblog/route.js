import connectDB from "@/app/db/mongo/db";
import blog from "@/app/db/schema/blog";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://roadtocode.blog.hirenray.rest",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const getSlug = await blog.findOne({ blog_slug: slug });
    return NextResponse.json(
      { message: "Get blog done", getSlug },
      {
        status: 200,
        headers: CORS_HEADERS,
      },
    );
  } else {
    const getallblog = await blog.find().limit(6);

    const getFirstImage = (contentArray) => {
      if (!Array.isArray(contentArray)) return null;

      for (const block of contentArray) {
        if (block.ops && Array.isArray(block.ops)) {
          const imageOp = block.ops.find((op) => op.insert && op.insert.image);
          if (imageOp) return imageOp.insert.image;
        }
      }
      return null;
    };

    const blogsWithImages = getallblog.map((item) => ({
      _id: item._id,
      blog_name: item.blog_name,
      blog_slug: item.blog_slug,
      blog_author: item.blog_author,
      createdAt: item.createdAt,
      featured_image: getFirstImage(item.blog_content),
    }));

    return NextResponse.json(
      { message: "Get blog done", blogs: blogsWithImages },
      {
        status: 200,
        headers: CORS_HEADERS,
      },
    );
  }
}

export async function DELETE(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const deleteBlog = await blog.findByIdAndDelete(id);
  if (!deleteBlog) {
    return NextResponse.json(
      { message: "delete unsuccess" },
      {
        status: 500,
        headers: CORS_HEADERS,
      },
    );
  }
  return NextResponse.json(
    { message: " blog delete  done" },
    {
      status: 200,
      headers: CORS_HEADERS,
    },
  );
}
