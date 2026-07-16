import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

type TSessionUser = {
  name: string;
  email: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error("Please define JWT_SECRET or BETTER_AUTH_SECRET in .env");
  }

  return new TextEncoder().encode(secret);
}

export async function getApiAuthHeaders(req: NextRequest) {
  const sessionRes = await fetch(`${req.nextUrl.origin}/api/auth/get-session`, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
    cache: "no-store",
  });

  const session = await sessionRes.json().catch(() => null);
  const user: TSessionUser | undefined = session?.user;

  if (!user?.email) {
    return null;
  }

  const token = await new SignJWT({
    name: user.name,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.email)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getJwtSecret());

  return {
    Authorization: `Bearer ${token}`,
  };
}

export function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      message: "Please login first",
    },
    { status: 401 }
  );
}
