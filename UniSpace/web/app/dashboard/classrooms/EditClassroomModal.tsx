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

                <input name="name" defaultValue={classroom.name} className="border rounded-lg px-3 py-2 text-sm" />
                <input name="building" defaultValue={classroom.building} className="border rounded-lg px-3 py-2 text-sm" />
                <input type="number" name="floor" defaultValue={classroom.floor} className="border rounded-lg px-3 py-2 text-sm" />
                <input type="number" name="capacity" defaultValue={classroom.capacity} className="border rounded-lg px-3 py-2 text-sm" />

                <div className="col-span-2">
                  <label className="block text-sm mb-2">Image</label>

                  {preview && (
                    <Image
                      src={preview}
                      alt="Preview"
                      width={300}
                      height={160}
                      className="h-40 object-cover rounded-lg mb-4"
                      unoptimized
                    />
                  )}

                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>

              </div>

              <textarea
                name="description"
                defaultValue={classroom.description ?? ""}
                rows={4}
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gray-700 text-white py-2.5 rounded-lg text-sm hover:bg-gray-800 transition"
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