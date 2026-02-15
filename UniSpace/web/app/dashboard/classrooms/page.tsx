import { prisma } from "@/lib/prisma";
import { Search } from "lucide-react";
import { revalidatePath } from "next/cache";
import AddClassroomModal from "./AddClassroomModal";
import EditClassroomModal from "./EditClassroomModal";
import DeleteClassroomModal from "./DeleteClassroomModal";
import DetailsClassroomModal from "./DetailsClassroomModal";
import fs from "fs";
import path from "path";


async function createClassroom(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const building = formData.get("building") as string;
  const floor = Number(formData.get("floor"));
  const capacity = Number(formData.get("capacity"));
  const description = formData.get("description") as string;
  const image = formData.get("image") as File | null;

  if (!name || !building || isNaN(floor) || isNaN(capacity)) return;

  let imagePath = "";

  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads/classrooms");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${image.name}`;
    const fullPath = path.join(uploadDir, fileName);

    fs.writeFileSync(fullPath, buffer);

    imagePath = `/uploads/classrooms/${fileName}`;
  }

  await prisma.classroom.create({
    data: {
      name,
      building,
      floor,
      capacity,
      description,
      image: imagePath,
    },
  });

  revalidatePath("/dashboard/classrooms");
}


async function updateClassroom(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;
  const building = formData.get("building") as string;
  const floor = Number(formData.get("floor"));
  const capacity = Number(formData.get("capacity"));
  const description = formData.get("description") as string;
  const image = formData.get("image") as File | null;

  if (!id || !name || !building || isNaN(floor) || isNaN(capacity)) return;

  const existing = await prisma.classroom.findUnique({
    where: { id },
  });

  let imagePath = existing?.image ?? "";

  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads/classrooms");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${image.name}`;
    const fullPath = path.join(uploadDir, fileName);

    fs.writeFileSync(fullPath, buffer);

    imagePath = `/uploads/classrooms/${fileName}`;
  }

  await prisma.classroom.update({
    where: { id },
    data: {
      name,
      building,
      floor,
      capacity,
      description,
      image: imagePath,
    },
  });

  revalidatePath("/dashboard/classrooms");
}


async function deleteClassroom(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  if (!id) return;

  const existing = await prisma.classroom.findUnique({
    where: { id },
  });

  if (existing?.image) {
    const filePath = path.join(process.cwd(), "public", existing.image);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await prisma.classroom.delete({
    where: { id },
  });

  revalidatePath("/dashboard/classrooms");
}


export default async function ClassroomsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const search = params?.search?.trim() ?? "";

  const classrooms = await prisma.classroom.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { building: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <form
          method="GET"
          action="/dashboard/classrooms"
          className="relative w-72"
        >
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search classrooms..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 transition bg-white"
          />

          <button type="submit" className="hidden" />
        </form>

        <AddClassroomModal createAction={createClassroom} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Building</th>
              <th className="px-6 py-3">Floor</th>
              <th className="px-6 py-3">Capacity</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {classrooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-700">
                  {room.name}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {room.building}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {room.floor}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {room.capacity}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(room.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 flex items-center gap-3">
                  <DetailsClassroomModal classroom={room} />
                  <EditClassroomModal
                    classroom={room}
                    updateAction={updateClassroom}
                  />
                  <DeleteClassroomModal
                    classroomId={room.id}
                    deleteAction={deleteClassroom}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {classrooms.length === 0 && (
          <div className="p-6 text-center text-gray-500 text-sm">
            No classrooms found.
          </div>
        )}
      </div>
    </div>
  );
}