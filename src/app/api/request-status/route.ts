import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import RequestStatus from "@/models/RequestStatus";

// In-memory fallback for development
let isRequestOpen = true;

export async function GET() {
  try {
    await dbConnect();
    const latest = await RequestStatus.findOne().sort({ updatedAt: -1 });
    if (latest) {
      isRequestOpen = latest.open;
      return NextResponse.json({ open: latest.open });
    }
    // If no DB doc, fallback to in-memory (default open)
    return NextResponse.json({ open: isRequestOpen });
  } catch (e) {
    // DB error fallback
    return NextResponse.json({ open: isRequestOpen, warning: "DB unavailable, using fallback." });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { open } = await req.json();
    if (typeof open !== "boolean") {
      return NextResponse.json(
        { error: "'open' must be a boolean." },
        { status: 400 }
      );
    }
    try {
      await dbConnect();
      // Upsert: update if exists, else create
      const latest = await RequestStatus.findOne().sort({ updatedAt: -1 });
      if (latest) {
        latest.open = open;
        latest.updatedAt = new Date();
        await latest.save();
      } else {
        await RequestStatus.create({ open });
      }
      isRequestOpen = open;
      return NextResponse.json({ open });
    } catch (dbErr) {
      // DB error fallback
      isRequestOpen = open;
      return NextResponse.json({ open, warning: "DB unavailable, using fallback." });
    }
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
