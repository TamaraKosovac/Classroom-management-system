"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function DeleteUserButton({
  userId,
  deleteAction,
}: {
  userId: number;
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const formData = new FormData();
    formData.append("id", String(userId));

    startTransition(async () => {
      const loadingToast = toast.loading("Deleting user...");

      try {
        await deleteAction(formData);

        toast.success("User deleted successfully", {
          id: loadingToast,
        });

        setOpen(false);
      } catch {
        toast.error("Failed to delete user", {
          id: loadingToast,
        });
      }
    });
  }

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
                disabled={isPending}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              >
                No
              </button>

              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}