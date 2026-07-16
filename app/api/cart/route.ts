import { getApiAuthHeaders, unauthorizedResponse } from "@/lib/api-auth";
import { getApiUrl } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";

const API_URL = getApiUrl();

export async function GET(req: NextRequest) {
  try {
    const authHeaders = await getApiAuthHeaders(req);

    if (!authHeaders) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
          data: [],
        },
        { status: 401 }
      );
    }

    const res = await fetch(`${API_URL}/api/cart`, {
      cache: "no-store",
      headers: authHeaders,
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

    const res = await fetch(`${API_URL}/api/cart`, {
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
