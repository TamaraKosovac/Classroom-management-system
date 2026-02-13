import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        classroom: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reservations, { status: 200 });

  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const decoded = verifyToken(request);

    if (decoded.role === "STUDENT") {
      return NextResponse.json(
        { error: "Students cannot create reservations" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { classroomId, date, startTime, endTime, purpose } = body;

    if (!classroomId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const classroom = await prisma.classroom.findUnique({
      where: { id: Number(classroomId) },
    });

    if (!classroom) {
      return NextResponse.json(
        { error: "Classroom not found" },
        { status: 404 }
      );
    }

    const reservationDate = new Date(date);
    const start = new Date(startTime);
    const end = new Date(endTime);

    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        classroomId: Number(classroomId),
        date: reservationDate,
        OR: [
          {
            startTime: { lt: end },
            endTime: { gt: start },
          },
        ],
      },
    });

    if (conflictingReservation) {
      return NextResponse.json(
        { error: "Time slot already reserved" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        classroomId: Number(classroomId),
        userId: decoded.userId,
        date: reservationDate,
        startTime: start,
        endTime: end,
        purpose,
      },
    });

    return NextResponse.json(reservation, { status: 201 });

  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}