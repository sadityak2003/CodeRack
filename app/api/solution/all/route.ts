import dbConnect from "@/lib/db";
import Solution from "@/models/Solution";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const solutions = await Solution.find({}).populate("contributor");
    
    return NextResponse.json({ solutions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
}