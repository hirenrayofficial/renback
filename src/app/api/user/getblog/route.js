import connectDB from "@/app/db/mongo/db";
import blog from "@/app/db/schema/blog";
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

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

// export async function GET(req) {
//   await connectDB();
//   const { searchParams } = new URL(req.url);
//   const slug = searchParams.get("slug");

//   if (slug) {
//     const getSlug = await blog
//       .findOne({ blog_slug: slug, is_active: true })
//       .select("_id blog_name blog_content blog_slug blog_author createdAt blog_type");

//     return NextResponse.json(
//       { message: "Get blog done", getSlug },
//       {
//         status: 200,
//         headers: CORS_HEADERS,
//       },
//     );
//   } else {
//     const getallblog = await blog.find({ is_active: true,is_aproved:true }).limit(6);

//     const getFirstImage = (contentArray) => {
//       if (!Array.isArray(contentArray)) return null;

//       for (const block of contentArray) {
//         if (block.ops && Array.isArray(block.ops)) {
//           const imageOp = block.ops.find((op) => op.insert && op.insert.image);
//           if (imageOp) return imageOp.insert.image;
//         }
//       }
//       return null;
//     };

//     const blogsWithImages = getallblog.map((item) => ({
//       _id: item._id,
//       blog_name: item.blog_name,
//       blog_slug: item.blog_slug,
//       blog_author: item.blog_author,
//       blog_type: item.blog_type,
//       createdAt: item.createdAt,
//       featured_image: getFirstImage(item.blog_content),
//     }));

//     return NextResponse.json(
//       { message: "Get blog done", blogs: blogsWithImages },
//       {
//         status: 200,
//         headers: CORS_HEADERS,
//       },
//     );
//   }
// }

const getFirstImage = (contentArray) => {
  if (!Array.isArray(contentArray)) return null;
  for (const block of contentArray) {
    if (block.ops) {
      const imageOp = block.ops.find((op) => op.insert && op.insert.image);
      if (imageOp) return imageOp.insert.image;
    }
  }
  return null;
};
export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  // Define a cache key based on whether it's a specific slug or the list
  const cacheKey = slug ? `blog:${slug}` : "blogs:recent";

  try {
    // 1. Try to fetch from Redis first
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return NextResponse.json(
        { message: "Get blog done (cached)", ...cachedData },
        { status: 200, headers: CORS_HEADERS },
      );
    }

    // 2. If not in cache, fetch from MongoDB
    if (slug) {
      const getSlug = await blog.findOne({ blog_slug: slug, is_active: true });

      if (!getSlug)
        return NextResponse.json(
          { message: "Not found" },
          { status: 404, headers: CORS_HEADERS },
        );

      const responseData = { getSlug };

      // 3. Store in Redis for 1 hour (3600 seconds)
      await redis.set(cacheKey, responseData, { ex: 60 });

      return NextResponse.json(
        { message: "Get blog done", ...responseData },
        { status: 200, headers: CORS_HEADERS },
      );
    } else {
      const getallblog = await blog.find({ is_active: true,is_aproved:true }).limit(6);

      const blogsWithImages = getallblog.map((item) => ({
        _id: item._id,
        blog_name: item.blog_name,
        blog_slug: item.blog_slug,
        blog_author: item.blog_author,
        blog_type: item.blog_type,
        createdAt: item.createdAt,
        featured_image: getFirstImage(item.blog_content),
      }));

      const responseData = { blogs: blogsWithImages };

      // Store the list in Redis
      await redis.set(cacheKey, responseData, { ex: 60 });

      return NextResponse.json(
        { message: "Get blog done", ...responseData },
        { status: 200, headers: CORS_HEADERS },
      );
    }
  } catch (error) {
    console.error("Redis Error:", error);
    // Fallback: If Redis fails, you might still want to return DB results
    // rather than crashing the whole request.
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
