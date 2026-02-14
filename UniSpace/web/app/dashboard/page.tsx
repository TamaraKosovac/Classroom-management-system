"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p className="mt-4 text-gray-600">
        Dashboard
      </p>
    </div>
  );
}