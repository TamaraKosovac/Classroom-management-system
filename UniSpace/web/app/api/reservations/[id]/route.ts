import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyToken(request);

    if (decoded.role === "STUDENT") {
      return NextResponse.json(
        { error: "Students cannot modify reservations" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const reservationId = Number(id);

    const existingReservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!existingReservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    if (
      decoded.role === "NASTAVNIK" &&
      existingReservation.userId !== decoded.userId
    ) {
      return NextResponse.json(
        { error: "You can only modify your own reservations" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { date, startTime, endTime, purpose } = body;

    const reservationDate = date
      ? new Date(date)
      : existingReservation.date;

    const start = startTime
      ? new Date(startTime)
      : existingReservation.startTime;

    const end = endTime
      ? new Date(endTime)
      : existingReservation.endTime;

    const conflict = await prisma.reservation.findFirst({
      where: {
        classroomId: existingReservation.classroomId,
        id: { not: reservationId },
        date: reservationDate,
        OR: [
          {
            startTime: { lt: end },
            endTime: { gt: start },
          },
        ],
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Time slot already reserved" },
        { status: 400 }
      );
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        date: reservationDate,
        startTime: start,
        endTime: end,
        purpose,
      },
    });

    return NextResponse.json(updatedReservation, { status: 200 });

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

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyToken(request);

    if (decoded.role === "STUDENT") {
      return NextResponse.json(
        { error: "Students cannot delete reservations" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const reservationId = Number(id);

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    if (
      decoded.role === "NASTAVNIK" &&
      reservation.userId !== decoded.userId
    ) {
      return NextResponse.json(
        { error: "You can only delete your own reservations" },
        { status: 403 }
      );
    }

    await prisma.reservation.delete({
      where: { id: reservationId },
    });

    return NextResponse.json(
      { message: "Reservation deleted successfully" },
      { status: 200 }
    );

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