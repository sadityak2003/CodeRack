import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Solution from "@/models/Solution";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id } = await params;
    const solution = await Solution.findById(id);
    if (!solution) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(solution);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id } = await params;
    const data = await req.json();
    const updated = await Solution.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return NextResponse.json({ error: 'Update failed' }, { status: 400 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

  // DELETE
  export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      await dbConnect();
      await Solution.findByIdAndDelete(id);
      return new Response(JSON.stringify({ message: "Solution deleted" }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to delete solution" }), { status: 500 });
    }
  }