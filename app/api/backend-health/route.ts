import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/health`, {
      cache: "no-store",
    });

    const result = await res.json();
    return NextResponse.json(result, { status: res.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Express backend is not reachable",
      },
      { status: 200 }
    );
  }
}
