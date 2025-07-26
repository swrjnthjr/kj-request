import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SongRequest from "@/models/SongRequest";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { name, song, artist, message } = body;

    if (!name || !song || !artist) {
      return NextResponse.json(
        { success: false, error: "Name, song, and artist are required" },
        { status: 400 }
      );
    }

    const newRequest = await SongRequest.create({
      name,
      song,
      artist,
      message,
    });
    return NextResponse.json(
      { success: true, data: newRequest },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    const filter: { createdAt?: { $gte: Date; $lt: Date } } = {};
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.createdAt = { $gte: startDate, $lt: endDate };
    }

    const requests = await SongRequest.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(
      { success: true, data: requests },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
