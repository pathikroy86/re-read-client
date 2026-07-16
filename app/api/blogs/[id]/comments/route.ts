import { NextRequest, NextResponse } from "next/server";
import { getApiAuthHeaders, unauthorizedResponse } from "@/lib/api-auth";
import { getApiUrl } from "@/lib/env";

const API_URL = getApiUrl();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const authHeaders = await getApiAuthHeaders(req);

    if (!authHeaders) {
      return unauthorizedResponse();
    }

    const res = await fetch(`${API_URL}/api/blogs/${id}/comments`, {
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
