"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Pencil, X } from "lucide-react";

type Reservation = {
  id: number;
  userId: number;
  classroomId: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  purpose?: string | null;
};

type Props = {
  reservation: Reservation;
  users: {
    id: number;
    firstName: string;
    lastName: string;
  }[];
  classrooms: {
    id: number;
    name: string;
  }[];
  updateAction: (formData: FormData) => Promise<void>;
};

export default function EditReservationModal({
  reservation,
  users,
  classrooms,
  updateAction,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const loadingToast = toast.loading("Updating reservation...");

      try {
        await updateAction(formData);

        toast.success("Reservation updated successfully", {
          id: loadingToast,
        });

        setOpen(false);
      } catch {
        toast.error("Failed to update reservation", {
          id: loadingToast,
        });
      }
    });
  }

  const formatDate = (date: Date) =>
    new Date(date).toISOString().split("T")[0];

  const formatTime = (date: Date) =>
    new Date(date).toISOString().substring(11, 16);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-gray-600 hover:text-blue-600 transition"
      >
        <Pencil size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8 relative">

            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold mb-6 text-left">
              Edit reservation
            </h2>

            <form action={handleSubmit} className="space-y-6">
              <input type="hidden" name="id" value={reservation.id} />

              <div className="grid grid-cols-2 gap-6">

                <div className="flex flex-col items-start w-full">
                  <label className="text-sm font-medium text-gray-600 mb-2 text-left w-full">
                    User
                  </label>
                  <select
                    name="userId"
                    defaultValue={reservation.userId}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.firstName} {u.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col items-start w-full">
                  <label className="text-sm font-medium text-gray-600 mb-2 text-left w-full">
                    Classroom
                  </label>
                  <select
                    name="classroomId"
                    defaultValue={reservation.classroomId}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  >
                    {classrooms.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col items-start w-full">
                  <label className="text-sm font-medium text-gray-600 mb-2 text-left w-full">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={formatDate(reservation.date)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col items-start w-full">
                  <label className="text-sm font-medium text-gray-600 mb-2 text-left w-full">
                    Purpose
                  </label>
                  <input
                    type="text"
                    name="purpose"
                    defaultValue={reservation.purpose ?? ""}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col items-start w-full">
                  <label className="text-sm font-medium text-gray-600 mb-2 text-left w-full">
                    Start time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    defaultValue={formatTime(reservation.startTime)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col items-start w-full">
                  <label className="text-sm font-medium text-gray-600 mb-2 text-left w-full">
                    End time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    defaultValue={formatTime(reservation.endTime)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  />
                </div>

              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gray-700 text-white py-2.5 rounded-lg text-sm 
                           hover:bg-gray-800 transition disabled:opacity-50"
              >
                {isPending ? "Updating..." : "Save changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}