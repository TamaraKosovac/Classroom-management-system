import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { verifyAdmin } from "@/lib/auth";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdmin(request);

    const { id } = await context.params;
    const classroomId = Number(id);

    const body = await request.json();
    const { name, building, floor, capacity, image, description } = body;

    const updateData: Prisma.ClassroomUpdateInput = {};

    if (name !== undefined) updateData.name = name;
    if (building !== undefined) updateData.building = building;
    if (floor !== undefined) updateData.floor = Number(floor);
    if (capacity !== undefined) updateData.capacity = Number(capacity);
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;

    const updatedClassroom = await prisma.classroom.update({
      where: { id: classroomId },
      data: updateData,
    });

    return NextResponse.json(updatedClassroom, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message === "Forbidden") {
        return NextResponse.json(
          { error: "Forbidden - Admins only" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdmin(request);

    const { id } = await context.params;
    const classroomId = Number(id);

    await prisma.classroom.delete({
      where: { id: classroomId },
    });

    return NextResponse.json(
      { message: "Classroom deleted successfully" },
      { status: 200 }
    );

  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message === "Forbidden") {
        return NextResponse.json(
          { error: "Forbidden - Admins only" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}