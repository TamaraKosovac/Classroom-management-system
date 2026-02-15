"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Pencil, X } from "lucide-react";
import Image from "next/image";

type Classroom = {
  id: number;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  description: string | null;
  image: string | null;
};

export default function EditClassroomModal({
  classroom,
  updateAction,
}: {
  classroom: Classroom;
  updateAction: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    classroom.image ?? null
  );
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const loadingToast = toast.loading("Updating classroom...");

      try {
        await updateAction(formData);

        toast.success("Classroom updated successfully", {
          id: loadingToast,
        });

        setOpen(false);
      } catch {
        toast.error("Failed to update classroom", {
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
              Edit classroom
            </h2>

            <form action={handleSubmit} className="space-y-6">
              <input type="hidden" name="id" value={classroom.id} />

              <div className="grid grid-cols-2 gap-6">

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Name
                  </label>
                  <input
                    name="name"
                    defaultValue={classroom.name}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Building
                  </label>
                  <input
                    name="building"
                    defaultValue={classroom.building}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Floor
                  </label>
                  <input
                    type="number"
                    name="floor"
                    defaultValue={classroom.floor}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    defaultValue={classroom.capacity}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Image
                  </label>

                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-500 transition">

                    {preview ? (
                      <div className="relative">
                        <Image
                          src={preview}
                          alt="Preview"
                          width={300}
                          height={160}
                          className="h-40 w-auto object-cover rounded-lg"
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

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={classroom.description ?? ""}
                  rows={4}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
                             focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                />
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