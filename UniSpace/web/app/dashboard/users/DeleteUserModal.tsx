"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteUserButton({
  userId,
  deleteAction,
}: {
  userId: number;
  deleteAction: (formData: FormData) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-gray-600 hover:text-red-600 transition"
      >
        <Trash2 size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[350px] shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Delete user
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this user?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                 No
              </button>

              <form action={deleteAction}>
                <input type="hidden" name="id" value={userId} />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition"
                >
                  Yes
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}