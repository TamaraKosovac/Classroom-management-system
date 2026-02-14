import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Pencil, Plus, Search } from "lucide-react";
import { revalidatePath } from "next/cache";
import DeleteUserButton from "./DeleteUserButton";

async function deleteUser(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/dashboard/users");
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;

  const search = params?.search?.trim() ?? "";

  const users = await prisma.user.findMany({
    where: search
      ? {
          OR: [
            {
              firstName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <form
          method="GET"
          action="/dashboard/users"
          className="relative w-72"
        >
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search users..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 transition bg-white"
          />

          <button type="submit" className="hidden" />
        </form>

        <Link
          href="/dashboard/users/create"
          className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
        >
          <Plus size={16} />
          Add user
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Full Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-700">
                  {user.firstName} {user.lastName}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {user.email}
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 flex gap-3">
                  <Link
                    href={`/dashboard/users/${user.id}/edit`}
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    <Pencil size={18} />
                  </Link>

                  <DeleteUserButton
                    userId={user.id}
                    deleteAction={deleteUser}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="p-6 text-center text-gray-500 text-sm">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}