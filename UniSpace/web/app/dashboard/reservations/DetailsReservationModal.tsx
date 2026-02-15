"use client";

import { useState } from "react";
import {
  X,
  User,
  School,
  CalendarDays,
  Clock,
  Info,
  FileText,
} from "lucide-react";
import Image from "next/image";

type Props = {
  reservation: {
    id: number;
    date: Date;
    startTime: Date;
    endTime: Date;
    purpose?: string | null;
    user: {
      firstName: string;
      lastName: string;
      email?: string;
    };
    classroom: {
      name: string;
      building?: string;
      image?: string | null; 
    };
  };
};

export default function DetailsReservationModal({ reservation }: Props) {
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

            <h2 className="text-lg font-semibold mb-6 text-gray-800 text-left">
              Reservation details
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <User size={18} className="text-gray-500" />
                <span>
                  {reservation.user.firstName}{" "}
                  {reservation.user.lastName}
                </span>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <School size={18} className="text-gray-500" />
                <span>{reservation.classroom.name}</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <CalendarDays size={18} className="text-gray-500" />
                <span>
                  {new Date(reservation.date).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <Clock size={18} className="text-gray-500" />
                <span>
                  {new Date(reservation.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(reservation.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {reservation.purpose && (
              <div className="mt-5 flex items-start gap-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                <FileText size={18} className="text-gray-500 mt-0.5" />
                <span>{reservation.purpose}</span>
              </div>
            )}

            {reservation.classroom.image && (
              <div className="mt-6">
                <Image
                  src={reservation.classroom.image}
                  alt="Classroom"
                  width={600}
                  height={300}
                  className="w-full h-48 object-cover rounded-lg"
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