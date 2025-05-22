import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Solution from "@/models/Solution";

interface RouteParams {
  params: { id: string };
}

export async function GET(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await dbConnect();
    const { id } = params;

    const solution = await Solution.findById(id);
    if (!solution) {
      return NextResponse.json({ error: "Solution not found" }, { status: 404 });
    }

    return NextResponse.json(solution);
  } catch (error) {
    console.error("Error fetching solution:", error);
    return NextResponse.json(
      { error: "Failed to fetch solution" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await dbConnect();
    const { id } = params;
    const data = await request.json();
    
    const updated = await Solution.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Solution not found" }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating solution:", error);
    return NextResponse.json(
      { error: "Failed to update solution" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await dbConnect();
    const { id } = params;
    
    await Solution.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Solution deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting solution:", error);
    return NextResponse.json(
      { error: "Failed to delete solution" },
      { status: 500 }
    );
  }
}