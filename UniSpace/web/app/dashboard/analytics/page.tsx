import { prisma } from "@/lib/prisma";
import AnalyticsCharts from "./AnalyticsCharts";

export default async function AnalyticsPage() {
  const totalUsers = await prisma.user.count();
  const totalClassrooms = await prisma.classroom.count();
  const totalReservations = await prisma.reservation.count();

  const reservations = await prisma.reservation.findMany({
    select: {
      createdAt: true,
      userId: true,
      classroomId: true,
    },
  });

  const users = await prisma.user.findMany({
    select: { id: true, role: true, firstName: true },
  });

  const classrooms = await prisma.classroom.findMany();

  const monthlyMap: Record<string, number> = {};

  reservations.forEach((r) => {
    const month = new Date(r.createdAt).toLocaleString("default", {
      month: "short",
    });
    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });

  const lineData = Object.entries(monthlyMap).map(([month, count]) => ({
    month,
    reservations: count,
  }));

  const classroomStats = await prisma.reservation.groupBy({
    by: ["classroomId"],
    _count: { classroomId: true },
    orderBy: { _count: { classroomId: "desc" } },
    take: 5,
  });

  const barData = classroomStats.map((stat) => {
    const classroom = classrooms.find((c) => c.id === stat.classroomId);
    return {
      name: classroom?.name ?? "Unknown",
      reservations: stat._count.classroomId,
    };
  });

  const roleMap: Record<string, number> = {};

  reservations.forEach((r) => {
    const user = users.find((u) => u.id === r.userId);
    const role = user?.role ?? "Unknown";
    roleMap[role] = (roleMap[role] || 0) + 1;
  });

  const pieData = Object.entries(roleMap).map(([role, value]) => ({
    name: role,
    value,
  }));

  const dayMap: Record<string, number> = {};

  reservations.forEach((r) => {
    const day = new Date(r.createdAt).toLocaleString("default", {
      weekday: "short",
    });
    dayMap[day] = (dayMap[day] || 0) + 1;
  });

  const dayData = Object.entries(dayMap).map(([day, count]) => ({
    day,
    reservations: count,
  }));

  const userMap: Record<number, number> = {};

  reservations.forEach((r) => {
    userMap[r.userId] = (userMap[r.userId] || 0) + 1;
  });

  const topUsersData = Object.entries(userMap)
    .map(([userId, count]) => {
      const user = users.find((u) => u.id === Number(userId));
      return {
        name: user?.firstName ?? "Unknown",
        reservations: count,
      };
    })
    .sort((a, b) => b.reservations - a.reservations)
    .slice(0, 5);

  const comparisonData = lineData.map((m) => ({
    month: m.month,
    reservations: m.reservations,
    users: totalUsers,
  }));

  const distributionData = [
    { name: "Users", value: totalUsers },
    { name: "Classrooms", value: totalClassrooms },
    { name: "Reservations", value: totalReservations },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 overflow-y-auto">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Users" value={totalUsers} />
          <StatCard title="Total Classrooms" value={totalClassrooms} />
          <StatCard title="Total Reservations" value={totalReservations} />
        </div>

        <AnalyticsCharts
          lineData={lineData}
          barData={barData}
          pieData={pieData}
          dayData={dayData}
          topUsersData={topUsersData}
          comparisonData={comparisonData}
          distributionData={distributionData}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-semibold text-gray-800 mt-2">
        {value}
      </h3>
    </div>
  );
}