import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Solution from "@/models/Solution";

export async function GET(req: NextRequest) {
  await dbConnect();

  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const user = await User.findOne({ email });

  const solutions = await Solution.find({ contributor: user?._id }).populate('contributor', 'name email avatarUrl');

  return NextResponse.json({ user, solutions });
}
