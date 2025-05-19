import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Solution from "@/models/Solution";

export async function GET(
  req: NextRequest
) {
  try {
    await dbConnect();
    
    const solution = req.nextUrl.searchParams.get("id");
    
    if (!solution) {
      return NextResponse.json({ error: "Solution not found" }, { status: 404 });
    }
    
    return NextResponse.json(solution);
  } catch (error) {
    console.error("Error fetching solution:", error);
    return NextResponse.json({ error: "Failed to fetch solution" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
   { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id } = params;
    const data = await req.json();
    const updated = await Solution.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return NextResponse.json({ status: 400 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating solution:", error);
    return NextResponse.json({ error: "Failed to update solution" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await dbConnect();
    await Solution.findByIdAndDelete(id);
    return NextResponse.json({ message: "Solution deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting solution:", error);
    return NextResponse.json({ error: "Failed to delete solution" }, { status: 500 });
  }
}