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

    const now = new Date();

    if (existingReservation.startTime < now) {
      return NextResponse.json(
        { error: "Cannot modify past reservations" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { classroomId, date, startTime, endTime, purpose } = body;

    const newClassroomId =
      classroomId ?? existingReservation.classroomId;

    const reservationDate = date
      ? new Date(date)
      : existingReservation.date;

    const start = startTime
      ? new Date(startTime)
      : existingReservation.startTime;

    const end = endTime
      ? new Date(endTime)
      : existingReservation.endTime;

    if (start >= end) {
      return NextResponse.json(
        { error: "Start time must be before end time" },
        { status: 400 }
      );
    }

    if (start < now) {
      return NextResponse.json(
        { error: "Cannot set reservation in the past" },
        { status: 400 }
      );
    }

    const openingTime = new Date(start);
    openingTime.setHours(8, 0, 0, 0);

    const closingTime = new Date(start);
    closingTime.setHours(20, 0, 0, 0);

    if (start < openingTime || end > closingTime) {
      return NextResponse.json(
        { error: "Reservations allowed only between 08:00 and 20:00" },
        { status: 400 }
      );
    }

    const conflict = await prisma.reservation.findFirst({
      where: {
        classroomId: newClassroomId,
        id: { not: reservationId },
        date: reservationDate,
        startTime: { lt: end },
        endTime: { gt: start },
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
        classroomId: newClassroomId,
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

    const now = new Date();

    if (reservation.startTime < now) {
      return NextResponse.json(
        { error: "Cannot delete past reservations" },
        { status: 400 }
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