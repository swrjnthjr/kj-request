import { NextRequest, NextResponse } from "next/server";

// In-memory fallback. For production, use a DB or persistent store.
let isRequestOpen = true;

export async function GET() {
  return NextResponse.json({ open: isRequestOpen });
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
    isRequestOpen = open;
    return NextResponse.json({ open: isRequestOpen });
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
