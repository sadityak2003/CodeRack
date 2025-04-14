import dbConnect from "@/lib/db";
import Solution from "@/models/Solution";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const solutions = await Solution.find({}).populate("contributor");
    
    return new Response(JSON.stringify({ solutions }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch solutions" }), { status: 500 });
  }
}