import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/env";

const API_URL = getApiUrl();

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
