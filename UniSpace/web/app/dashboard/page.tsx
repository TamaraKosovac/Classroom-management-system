import { redirect } from "next/navigation";

export default function DashboardHome() {
  redirect("/dashboard/users");

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700">
        Welcome to UniSpace Admin Dashboard
      </h2>
      <p className="text-gray-500 mt-2">
        Select a section from the sidebar.
      </p>
    </div>
  );
}