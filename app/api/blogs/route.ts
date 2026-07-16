import { NextRequest, NextResponse } from "next/server";
import { getApiAuthHeaders, unauthorizedResponse } from "@/lib/api-auth";
import { getApiUrl } from "@/lib/env";

const API_URL = getApiUrl();

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/blogs`, {
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
        data: [],
      },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const authHeaders = await getApiAuthHeaders(req);

    if (!authHeaders) {
      return unauthorizedResponse();
    }

    const res = await fetch(`${API_URL}/api/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(data),
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
