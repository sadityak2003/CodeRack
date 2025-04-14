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
  await dbConnect();

  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const user = await User.findOne({ email });

  return NextResponse.json({ user });
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
