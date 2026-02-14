"use client";

import { useState, useTransition } from "react";
import { X, Plus } from "lucide-react";

export default function AddUserModal({
  createUserAction,
}: {
  createUserAction: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createUserAction(formData);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
      >
        <Plus size={16} />
        Add user
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
              Add new user
            </h2>

            <form action={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    First name
                  </label>
                  <input
                    name="firstName"
                    placeholder="Enter first name"
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Last name
                  </label>
                  <input
                    name="lastName"
                    placeholder="Enter last name"
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col col-span-2">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    defaultValue="ADMIN"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition"
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
                {isPending ? "Saving..." : "Save"}
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
}