// pages/api/profile.ts (or app/api/profile/route.ts for App Router)
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Solution from "@/models/Solution";

export async function GET(req: NextRequest) {
  try {
    await dbConnect(); // Ensure DB connection

    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Missing email parameter" },
        { status: 400 }
      );
    }

    // Fetch user and solutions concurrently on the backend
    const [user, solutions] = await Promise.all([
      User.findOne({ email }).maxTimeMS(10000), // Using the new email index
      // IMPORTANT: After fetching the user, use user._id to query solutions
      // This ensures the solution query uses the 'contributor' index efficiently.
      // We'll populate contributor to get its name/email/avatar for SolutionCard
      // If user is null, we can't query solutions by ID, so handle that.
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Now, fetch solutions using the found user's _id
    const userSolutions = await Solution.find({ contributor: user._id })
      .populate('contributor', 'name email avatarUrl') // Use the contributor index
      .maxTimeMS(20000); // Add a timeout for this query too

    return NextResponse.json({ user, solutions: userSolutions });

  } catch (error) {
    console.error("Error in GET /api/profile:", error);
    // Differentiate between timeout errors and other errors
    if (error instanceof Error && error.message.includes("timeout")) {
        return NextResponse.json(
            { error: "Database query timed out" },
            { status: 504 } // Gateway Timeout
        );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}