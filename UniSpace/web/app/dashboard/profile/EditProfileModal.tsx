"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Pencil, X } from "lucide-react";
import Image from "next/image";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image?: string | null;
};

export default function EditProfileModal({
  user,
  updateAction,
}: {
  user: User;
  updateAction: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(user.image ?? null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const loadingToast = toast.loading("Saving changes...");

      try {
        await updateAction(formData);

        toast.success("Profile updated successfully", {
          id: loadingToast,
        });

        setOpen(false);
      } catch (error: unknown) {
        let message = "Update failed";
        if (error instanceof Error) message = error.message;

        toast.error(message, { id: loadingToast });
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
      >
        <Pencil size={16} />
        Edit profile
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
              Edit profile
            </h2>

            <form action={handleSubmit} className="space-y-6">

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

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Current password
                  </label>
                    <div className="relative">
                      <input
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Leave empty if not changing"
                        className="border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 transition w-full"
                      />

                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition"
                      >
                        {showCurrentPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.584 10.587a2 2 0 002.828 2.828M9.88 5.09A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.293 5.063M6.228 6.228A9.956 9.956 0 002.458 12c.63 2.106 1.978 3.918 3.77 5.228" />
                          </svg>
                        )}
                      </button>
                    </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    New password
                  </label>
                    <div className="relative">
                      <input
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Leave empty if not changing"
                        className="border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 transition w-full"
                      />

                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition"
                      >
                        {showNewPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.584 10.587a2 2 0 002.828 2.828M9.88 5.09A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.293 5.063M6.228 6.228A9.956 9.956 0 002.458 12c.63 2.106 1.978 3.918 3.77 5.228" />
                          </svg>
                        )}
                      </button>
                    </div>
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Profile image
                  </label>

                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-500 transition">

                    {preview ? (
                      <div className="relative">
                        <Image
                          src={preview}
                          alt="Preview"
                          width={160}
                          height={160}
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
                        Click to upload or drag image here
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
                {isPending ? "Saving..." : "Save changes"}
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
}