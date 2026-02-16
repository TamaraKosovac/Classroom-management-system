import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import fs from "fs";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const decoded = verifyToken(request);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const decoded = verifyToken(request);
    const formData = await request.formData();

    const firstName = formData.get("firstName") as string | null;
    const lastName = formData.get("lastName") as string | null;
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;
    const image = formData.get("image") as File | null;

    const data: Prisma.UserUpdateInput = {};

    if (firstName?.trim()) {
      data.firstName = firstName;
    }

    if (lastName?.trim()) {
      data.lastName = lastName;
    }

    if (email?.trim()) {
      data.email = email;
    }

    if (password?.trim()) {
      data.password = await bcrypt.hash(password, 10);
    }

    if (image && image.size > 0) {
      const uploadDir = path.join(process.cwd(), "public/uploads/users");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { image: true },
      });

      if (existingUser?.image) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          existingUser.image
        );

        if (fs.existsSync(oldImagePath)) {
          await unlink(oldImagePath);
        }
      }

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${image.name}`;
      const fullPath = path.join(uploadDir, fileName);

      await writeFile(fullPath, buffer);

      data.image = `/uploads/users/${fileName}`;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("REAL ERROR:", error.message);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}