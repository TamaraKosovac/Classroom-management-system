"use client";

import { useState } from "react";
import { Info, X, User, Mail, Shield, Calendar } from "lucide-react";
import Image from "next/image";
import { User as PrismaUser } from "@prisma/client";

type Props = {
  user: PrismaUser;
};

export default function DetailsUserModal({ user }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-gray-600 hover:text-gray-800 transition"
      >
        <Info size={18} />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold mb-6 text-gray-800">
              User details
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">

              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <User size={18} className="text-gray-500" />
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <Mail size={18} className="text-gray-500" />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <Shield size={18} className="text-gray-500" />
                <span>{user.role}</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <Calendar size={18} className="text-gray-500" />
                <span>
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>

            </div>

            {user.image && (
              <div className="mt-5">
                <Image
                  src={user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                  width={600}
                  height={400}
                  className="rounded-lg object-contain w-full max-h-96"
                  unoptimized
                />
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}