import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import mongoose from "mongoose";

type UserWithId = User & { _id: string };

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid?: string }> }
) {
  const { messageid } = await params; // ✅ unwrap params Promise
  const messageId = messageid;

  if (!messageId || messageId === "undefined") {
    return Response.json(
      { success: false, message: "No messageid provided" },
      { status: 400 }
    );
  }

  if (!mongoose.isValidObjectId(messageId)) {
    return Response.json(
      { success: false, message: "Invalid messageid" },
      { status: 400 }
    );
  }

  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const user = session.user as UserWithId;

  // Optional but helpful: ensure _id exists in session
  if (!user?._id || !mongoose.isValidObjectId(user._id)) {
    return Response.json(
      { success: false, message: "Invalid session user id" },
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found or could not be deleted" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting message in route:", error);
    return Response.json(
      { success: false, message: "An error occurred while deleting the message" },
      { status: 500 }
    );
  }
}