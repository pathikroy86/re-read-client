import "@/lib/dns";
import { getMongoDbName, getMongoUri } from "@/lib/env";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

let client: MongoClient | null = null;

async function connectDB() {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    throw new Error("Please define MONGODB_URI in .env");
  }

  if (!client) {
    client = new MongoClient(mongoUri);
    await client.connect();
  }

  return client.db(getMongoDbName());
}

async function getSessionUser(req: NextRequest) {
  const sessionRes = await fetch(`${req.nextUrl.origin}/api/auth/get-session`, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
    cache: "no-store",
  });

  const session = await sessionRes.json().catch(() => null);
  return session?.user || null;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);

    if (!user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
          data: null,
        },
        { status: 401 }
      );
    }

    const db = await connectDB();
    const profile = await db.collection("userProfiles").findOne({
      email: user.email,
    });

    return NextResponse.json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        name: profile?.name || user.name || "ReRead Reader",
        email: user.email,
        phone: profile?.phone || "",
        location: profile?.location || "",
        bio: profile?.bio || "",
        profileImage: profile?.profileImage || user.image || "",
        updatedAt: profile?.updatedAt || null,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch profile",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser(req);

    if (!user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    const data = await req.json();
    const name = String(data.name || "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Name must be at least 2 characters",
        },
        { status: 400 }
      );
    }

    const profileImage = String(data.profileImage || "");

    if (profileImage.length > 900000) {
      return NextResponse.json(
        {
          success: false,
          message: "Profile image is too large. Please upload a smaller photo.",
        },
        { status: 400 }
      );
    }

    const profile = {
      name,
      email: user.email,
      phone: String(data.phone || "").trim(),
      location: String(data.location || "").trim(),
      bio: String(data.bio || "").trim(),
      profileImage,
      updatedAt: new Date(),
    };

    const db = await connectDB();
    await db.collection("userProfiles").updateOne(
      { email: user.email },
      {
        $set: profile,
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
      },
      { status: 500 }
    );
  }
}
