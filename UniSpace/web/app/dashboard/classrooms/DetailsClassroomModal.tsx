"use client";

import { useState } from "react";
import {
  Info,
  X,
  School,
  Building2,
  Layers,
  Users,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { Classroom } from "@prisma/client";

type Props = {
  classroom: Classroom;
};

export default function DetailsClassroomModal({ classroom }: Props) {
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
              Classroom details
            </h2>

            {/* GRID – 2 per row */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <School size={18} className="text-gray-500" />
                <span>{classroom.name}</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <Building2 size={18} className="text-gray-500" />
                <span>{classroom.building}</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <Layers size={18} className="text-gray-500" />
                <span>Floor {classroom.floor}</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <Users size={18} className="text-gray-500" />
                <span>{classroom.capacity} seats</span>
              </div>
            </div>

            {classroom.description && (
              <div className="mt-5 flex items-start gap-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                <FileText size={18} className="text-gray-500 mt-0.5" />
                <span>{classroom.description}</span>
              </div>
            )}

            {classroom.image && (
              <div className="mt-5">
                <Image
                  src={classroom.image}
                  alt={classroom.name}
                  width={600}
                  height={300}
                  className="rounded-lg object-cover w-full h-48"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}