"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { X, Plus } from "lucide-react";
import Image from "next/image";

export default function AddUserModal({
  createUserAction,
}: {
  createUserAction: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const loadingToast = toast.loading("Creating user...");

      try {
        await createUserAction(formData);

        toast.success("User successfully created", {
          id: loadingToast,
        });

        setPreview(null);
        setOpen(false);
      } catch {
        toast.error("Failed to create user", {
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
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
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
                    defaultValue="ADMIN"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="NASTAVNIK">NASTAVNIK</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Avatar
                  </label>

                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-500 transition">

                    {preview ? (
                      <div className="relative">
                        <Image
                          src={preview}
                          alt="Preview"
                          width={150}
                          height={150}
                          className="h-32 w-32 object-cover rounded-full"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => setPreview(null)}
                          className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Click to upload avatar
                      </span>
                    )}

                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
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