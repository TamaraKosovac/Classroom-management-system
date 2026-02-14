"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  School,
  CalendarDays,
  LogOut,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setShowLogoutModal(false);
    router.replace("/login");
  };

  const linkStyle = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      pathname === path
        ? "bg-gray-200 text-gray-900 font-medium"
        : "hover:bg-gray-100 text-gray-700"
    }`;

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
            <Link href="/dashboard/users" className={linkStyle("/dashboard/users")}>
              <Users size={18} />
              <span>Manage users</span>
            </Link>

            <Link href="/dashboard/classrooms" className={linkStyle("/dashboard/classrooms")}>
              <School size={18} />
              <span>Manage classrooms</span>
            </Link>

            <Link href="/dashboard/reservations" className={linkStyle("/dashboard/reservations")}>
              <CalendarDays size={18} />
              <span>Manage reservations</span>
            </Link>
          </nav>
        </div>

        <div className="px-3 pb-6">
          <div
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer transition"
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

        <div className="p-8">{children}</div>
      </main>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[350px] shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Logout confirmation
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                No
              </button>

              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}