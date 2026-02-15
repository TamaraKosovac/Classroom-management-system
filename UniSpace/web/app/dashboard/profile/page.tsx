import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs/promises";
import EditProfileModal from "./EditProfileModal";

type JwtPayload = {
  userId: number;
  role: string;
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
  } catch {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) redirect("/login");

  async function updateProfile(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw new Error("Unauthorized");

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
    } catch {
      throw new Error("Invalid token");
    }

    const firstName = formData.get("firstName") as string | null;
    const lastName = formData.get("lastName") as string | null;
    const email = formData.get("email") as string | null;
    const currentPassword = formData.get("currentPassword") as string | null;
    const newPassword = formData.get("newPassword") as string | null;
    const imageFile = formData.get("image") as File | null;

    if (!firstName || !lastName || !email) {
      throw new Error("Missing required fields");
    }

    const updateData: Prisma.UserUpdateInput = {
      firstName,
      lastName,
      email,
    };

    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        throw new Error("Both password fields are required");
      }

      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const userInDb = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!userInDb) throw new Error("User not found");

      const passwordMatch = await bcrypt.compare(
        currentPassword,
        userInDb.password
      );

      if (!passwordMatch) {
        throw new Error("Current password is incorrect");
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(
        process.cwd(),
        "public/uploads/users"
      );

      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${decoded.userId}-${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);

      updateData.image = `/uploads/users/${fileName}`;
    }

    await prisma.user.update({
      where: { id: decoded.userId },
      data: updateData,
    });

    revalidatePath("/dashboard/profile");
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            My Profile
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account settings
          </p>
        </div>

        <EditProfileModal
          user={user}
          updateAction={updateProfile}
        />
      </div>
    </div>
  );
}