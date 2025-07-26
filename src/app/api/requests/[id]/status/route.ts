import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SongRequest from "@/models/SongRequest";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status || (status !== "Pending" && status !== "Taken")) {
      return NextResponse.json(
        { success: false, error: "Invalid status provided" },
        { status: 400 }
      );
    }

    const updatedRequest = await SongRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return NextResponse.json(
        { success: false, error: "Server Error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: updatedRequest });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}
