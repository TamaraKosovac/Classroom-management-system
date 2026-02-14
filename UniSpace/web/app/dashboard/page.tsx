"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Users,
  School,
  CalendarDays,
  LogOut,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [active, setActive] = useState("users");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#e9ecef]">

      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">

        <div>
          <div className="flex gap-3 px-6 py-6 border-b border-gray-200">
            <Image
              src="/logo.png"
              alt="UniSpace Logo"
              width={32}
              height={32}
            />

            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-gray-700">
                UniSpace
              </h2>
              <span className="text-xs text-gray-500">
                Reserve. Manage. Simplify.
              </span>
            </div>
          </div>

          <nav className="mt-12 flex flex-col px-3 space-y-1">

            <div
              onClick={() => setActive("users")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
                ${active === "users"
                  ? "bg-gray-200 text-gray-900 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              <Users size={18} />
              <span>Manage users</span>
            </div>

            <div
              onClick={() => setActive("classrooms")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
                ${active === "classrooms"
                  ? "bg-gray-200 text-gray-900 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              <School size={18} />
              <span>Manage classrooms</span>
            </div>

            <div
              onClick={() => setActive("reservations")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
                ${active === "reservations"
                  ? "bg-gray-200 text-gray-900 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              <CalendarDays size={18} />
              <span>Manage reservations</span>
            </div>

          </nav>
        </div>

        <div className="px-3 pb-6">
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 cursor-pointer transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </div>
        </div>

      </aside>

      <main className="flex-1 flex flex-col">

        <header className="bg-white px-8 min-h-[90px] border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-700">
            Admin dashboard
          </h1>

          <Image
            src="/admin.png"
            alt="Admin"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        </header>

        <div className="p-8">
          <p className="text-gray-600">
            Welcome to the admin dashboard.
          </p>
        </div>

      </main>
    </div>
  );
}