"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";


type LineData = {
  month: string;
  reservations: number;
};

type BarData = {
  name: string;
  reservations: number;
};

type PieData = {
  name: string;
  value: number;
};

type DayData = {
  day: string;
  reservations: number;
};

type TopUsersData = {
  name: string;
  reservations: number;
};

type ComparisonData = {
  month: string;
  reservations: number;
  users: number;
};

type DistributionData = {
  name: string;
  value: number;
};

const COLORS = ["#111827", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB"];

export default function AnalyticsCharts({
  lineData = [],
  barData = [],
  pieData = [],
  dayData = [],
  topUsersData = [],
  comparisonData = [],
  distributionData = [],
}: {
  lineData?: LineData[];
  barData?: BarData[];
  pieData?: PieData[];
  dayData?: DayData[];
  topUsersData?: TopUsersData[];
  comparisonData?: ComparisonData[];
  distributionData?: DistributionData[];
}) {
  return (
    <div className="h-full overflow-y-auto space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {barData.length > 0 && (
          <ChartCard title="Top reserved classrooms">
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="reservations" fill="#111827" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartCard>
        )}

        {pieData.length > 0 && (
          <ChartCard title="Reservations by user role">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartCard>
        )}

        {dayData.length > 0 && (
          <ChartCard title="Reservations by day of week">
            <BarChart layout="vertical" data={dayData}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="day" />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="reservations" fill="#374151" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartCard>
        )}

        {lineData.length > 1 && (
          <ChartCard title="Monthly reservation trend">
            <LineChart data={lineData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="reservations"
                stroke="#111827"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ChartCard>
        )}

        {topUsersData.length > 0 && (
          <ChartCard title="Top active users">
            <BarChart layout="vertical" data={topUsersData}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="reservations" fill="#111827" />
            </BarChart>
          </ChartCard>
        )}

        {comparisonData.length > 0 && (
          <ChartCard title="Users vs reservations comparison">
            <LineChart data={comparisonData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="reservations"
                stroke="#111827"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#6B7280"
                strokeWidth={2}
              />
            </LineChart>
          </ChartCard>
        )}

        {distributionData.length > 0 && (
          <ChartCard title="Reservation distribution">
            <PieChart>
              <Pie data={distributionData} dataKey="value" nameKey="name" outerRadius={100}>
                {distributionData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartCard>
        )}

      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[360px]">
      <h3 className="text-md font-semibold text-gray-700 mb-4">
        {title}
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}
