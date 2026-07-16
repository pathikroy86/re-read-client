import { getApiAuthHeaders, unauthorizedResponse } from "@/lib/api-auth";
import { getApiUrl } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";

const API_URL = getApiUrl();

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeaders = await getApiAuthHeaders(req);

    if (!authHeaders) {
      return unauthorizedResponse();
    }

    const res = await fetch(`${API_URL}/api/cart/${id}`, {
      method: "DELETE",
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
      },
      { status: 200 }
    );
  }
}
