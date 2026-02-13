import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const classrooms = await prisma.classroom.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(classrooms, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    verifyAdmin(request);

    const body = await request.json();
    const { name, building, floor, capacity, image, description } = body;

    if (!name || !building || floor === undefined || !capacity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const classroom = await prisma.classroom.create({
      data: {
        name,
        building,
        floor: Number(floor),
        capacity: Number(capacity),
        image,
        description,
      },
    });

    return NextResponse.json(classroom, { status: 201 });

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