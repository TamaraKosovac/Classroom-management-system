"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Plus, X } from "lucide-react";

type UserOption = {
  id: number;
  firstName: string;
  lastName: string;
};

type ClassroomOption = {
  id: number;
  name: string;
};

export default function AddReservationModal({
  createAction,
  users,
  classrooms,
}: {
  createAction: (formData: FormData) => Promise<void>;
  users: UserOption[];
  classrooms: ClassroomOption[];
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const loadingToast = toast.loading("Creating reservation...");

      try {
        await createAction(formData);

        toast.success("Reservation created successfully", {
          id: loadingToast,
        });

        setOpen(false);
      } catch {
        toast.error("Failed to create reservation", {
          id: loadingToast,
        });
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
      >
        <Plus size={16} />
        Add reservation
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

            <h2 className="text-lg font-semibold mb-6">
              Add reservation
            </h2>

            <form
              key={open ? "open" : "closed"}
              action={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    User
                  </label>
                  <select
                    name="userId"
                    defaultValue={users[0]?.id}
                    required
                    className="border border-gray-300 rounded-lg pl-2 pr-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Classroom
                  </label>
                  <select
                    name="classroomId"
                    defaultValue={classrooms[0]?.id}
                    required
                    className="border border-gray-300 rounded-lg pl-2 pr-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  >
                    {classrooms.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Purpose
                  </label>
                  <input
                    type="text"
                    name="purpose"
                    placeholder="Enter purpose"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Start time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    End time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
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
                {isPending ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}