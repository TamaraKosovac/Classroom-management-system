"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Pencil, X } from "lucide-react";
import { Role } from "@prisma/client";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
};

export default function EditUserModal({
  user,
  updateAction,
}: {
  user: User;
  updateAction: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const loadingToast = toast.loading("Updating user...");

      try {
        await updateAction(formData);

        toast.success("User updated successfully", {
          id: loadingToast,
        });

        setOpen(false);
      } catch {
        toast.error("Failed to update user", {
          id: loadingToast,
        });
      }
    });
  }

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

            <h2 className="text-lg font-semibold mb-6">
              Edit user
            </h2>

            <form action={handleSubmit} className="space-y-6">
              <input type="hidden" name="id" value={user.id} />

              <div className="grid grid-cols-2 gap-6">

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    First name
                  </label>
                  <input
                    name="firstName"
                    defaultValue={user.firstName}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Last name
                  </label>
                  <input
                    name="lastName"
                    defaultValue={user.lastName}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col col-span-2">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col col-span-2">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    defaultValue={user.role}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="NASTAVNIK">NASTAVNIK</option>
                  </select>
                </div>

              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gray-700 text-white py-2.5 rounded-lg text-sm hover:bg-gray-800 transition disabled:opacity-50"
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