import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

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
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              building: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
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

        <Link
          href="/dashboard/classrooms/create"
          className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
        >
          <Plus size={16} />
          Add classroom
        </Link>
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