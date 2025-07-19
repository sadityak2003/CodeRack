import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Solution from "@/models/Solution";

export async function POST(req: NextRequest) {
  await dbConnect();
  const {
    name,
    email,
    avatarUrl,
    description,
    leetcode,
    gfg,
    github,
    linkedin,
  } = await req.json();

  if (!email)
    return NextResponse.json({ error: "Email is required" }, { status: 400 });

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name,
      email,
      avatarUrl,
      description,
      leetcode,
      gfg,
      github,
      linkedin,
    });
  }

  return NextResponse.json({ user });
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    console.log("Database connected"); // Debug log

    const email = req.nextUrl.searchParams.get("email");
    console.log("Fetching user for email:", email); // Debug log

    if (!email) {
      return NextResponse.json(
        { error: "Missing email parameter" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).maxTimeMS(10000); // 10s timeout

    console.log("User found:", user ? user.email : "none"); // Debug log
    const solutions = await Solution.find({ contributor: user?._id }).populate('contributor', 'name email avatarUrl');

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user, solutions });
  } catch (error) {
    console.error("Error in GET /api/user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Edit user profile
export async function PUT(req: NextRequest) {
  await dbConnect();

  const { email, name, avatarUrl, description, leetcode, gfg, github, linkedin } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const updatedUser = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name,
        avatarUrl,
        description,
        leetcode,
        gfg,
        github,
        linkedin,
      },
    },
    { new: true }
  );

  if (!updatedUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user: updatedUser });
}
