export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const search = params?.search?.trim() ?? "";

  const reservations = await prisma.reservation.findMany({
    where: search
      ? {
          OR: [
            {
              user: {
                firstName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              user: {
                lastName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              classroom: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          ],
        }
      : undefined,
    include: {
      user: true,
      classroom: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <form
          method="GET"
          action="/dashboard/reservations"
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
            placeholder="Search reservations..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 transition bg-white"
          />

          <button type="submit" className="hidden" />
        </form>

        <Link
          href="/dashboard/reservations/create"
          className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
        >
          <Plus size={16} />
          Add reservation
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Classroom</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Created</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {reservations.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-700">
                  {res.user.firstName} {res.user.lastName}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {res.classroom.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {new Date(res.date).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {new Date(res.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(res.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {new Date(res.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reservations.length === 0 && (
          <div className="p-6 text-center text-gray-500 text-sm">
            No reservations found.
          </div>
        )}
      </div>
    </div>
  );
}