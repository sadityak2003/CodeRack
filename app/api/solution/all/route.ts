import dbConnect from "@/lib/db";
import Solution from "@/models/Solution";
import { NextResponse } from "next/server";
// Import the User model directly instead of using require()
import "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    
    // Models are automatically loaded when imported
    const solutions = await Solution.find({}).populate("contributor").sort({ createdAt: -1 });

    if (!solutions || solutions.length === 0) {
      return NextResponse.json({ solutions: [] }, { status: 200 });
    }

    return NextResponse.json({ solutions }, { status: 200 });
  }
  catch (error) {
    console.error("Error fetching solutions:", error);
    return NextResponse.json({ error: "Failed to fetch solutions" }, { status: 500 });
  }
}