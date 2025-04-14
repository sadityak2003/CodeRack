import dbConnect from "@/lib/db";
import Solution from "@/models/Solution";
import User from "@/models/User"; // You must have this model
import { NextResponse } from "next/server";

// POST /api/solution
export async function POST(req: Request) {
  const {
    email,
    title,
    platform,
    language,
    codeSnippet,
    description,
  } = await req.json();

  try {
    await dbConnect();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create solution with contributor as user._id
    const newSolution = new Solution({
      contributor: user._id,
      email : user.email,
      title,
      platform,
      language,
      codeSnippet,
      description,
    });

    await newSolution.save();

    return new Response(JSON.stringify(newSolution), { status: 201 });
  } catch (err) {
    console.error("Error uploading solution:", err);
    return NextResponse.json({ error: "Failed to upload solution" }, { status: 500 });
  }
}
