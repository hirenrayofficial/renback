import connectDB from "@/app/db/mongo/db";
import User from "@/app/db/schema/user";
import { NextResponse } from "next/server";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";

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

export async function POST(req, res) {
  await connectDB();
  const body = await req.json();
  const email = body.email;
  const password = body.pass;
  const name = "Unknown";
  const role = "editor";

  // const savdUser = new User({
  //   uuid: v4(),
  //   user_name: name,
  //   user_email: email,
  //   user_pass: password,
  //   user_role: role,
  // });
  // await savdUser.save();

  const savdUser = await User.findOne({ user_email: email });
  if (!savdUser) {
    return NextResponse.json(
      { message: " user login unsuccess" },
      {
        status: 500,
        headers: CORS_HEADERS,
      },
    );
  }
  const checkPass = savdUser.user_pass === password;
  if (!checkPass) {
    return NextResponse.json(
      { message: " user pasword invalied" },
      {
        status: 500,
        headers: CORS_HEADERS,
      },
    );
  }
  const token = jwt.sign({ id: savdUser.uuid }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return NextResponse.json(
    { message: " user login done", token: token, id: savdUser.uuid,name:savdUser.user_name },
    {
      status: 200,
      headers: CORS_HEADERS,
    },
  );
}
