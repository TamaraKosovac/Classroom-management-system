import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Search } from "lucide-react";
import AddReservationModal from "./AddReservationModal";
import DetailsReservationModal from "./DetailsReservationModal";
import EditReservationModal from "./EditReservationModal";
import DeleteReservationModal from "./DeleteReservationModal";

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const search = params?.search?.trim() ?? "";

  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
    orderBy: { firstName: "asc" },
  });

  const classrooms = await prisma.classroom.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  async function createReservation(formData: FormData) {
    "use server";

    const userId = Number(formData.get("userId"));
    const classroomId = Number(formData.get("classroomId"));
    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const purpose = formData.get("purpose") as string; 

    if (!userId || !classroomId || !date || !startTime || !endTime) return;

    await prisma.reservation.create({
      data: {
        userId,
        classroomId,
        date: new Date(date),
        startTime: new Date(`${date}T${startTime}`),
        endTime: new Date(`${date}T${endTime}`),
        purpose: purpose || null, 
      },
    });

    revalidatePath("/dashboard/reservations");
  }

  async function updateReservation(formData: FormData) {
    "use server";

    const id = Number(formData.get("id"));
    const userId = Number(formData.get("userId"));
    const classroomId = Number(formData.get("classroomId"));
    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const purpose = formData.get("purpose") as string; 

    if (!id || !userId || !classroomId || !date || !startTime || !endTime)
      return;

    await prisma.reservation.update({
      where: { id },
      data: {
        userId,
        classroomId,
        date: new Date(date),
        startTime: new Date(`${date}T${startTime}`),
        endTime: new Date(`${date}T${endTime}`),
        purpose: purpose || null, // ✅ DODANO
      },
    });

    revalidatePath("/dashboard/reservations");
  }

  async function deleteReservation(formData: FormData) {
    "use server";

    const id = Number(formData.get("id"));
    if (!id) return;

    await prisma.reservation.delete({
      where: { id },
    });

    revalidatePath("/dashboard/reservations");
  }

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

        <AddReservationModal
          createAction={createReservation}
          users={users}
          classrooms={classrooms}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Classroom</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3 text-center"></th>
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

                <td className="px-6 py-4 text-center space-x-3">
                  <DetailsReservationModal reservation={res} />
                  <EditReservationModal
                    reservation={res}
                    users={users}
                    classrooms={classrooms}
                    updateAction={updateReservation}
                  />
                  <DeleteReservationModal
                    reservationId={res.id}
                    deleteAction={deleteReservation}
                  />
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