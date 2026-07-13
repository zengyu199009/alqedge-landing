"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { FinancialYear } from "@/lib/api";

interface RevenueChartProps {
  data?: FinancialYear[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-gray-500 text-sm py-8 text-center">
        No financial data available
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-300 mb-3">
        Revenue &amp; Net Income (5Y)
      </h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis
              dataKey="year"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#1e1e3a" }}
              tickFormatter={(v: number) => `${v}`}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#1e1e3a" }}
              tickFormatter={(v: number) => {
                if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
                if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(0)}M`;
                if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
                return `$${v}`;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e1e3a",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#e5e7eb",
                fontSize: "12px",
              }}
              formatter={(value, name) => [
                `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
                name === "revenue" ? "Revenue" : "Net Income",
              ]}
              labelFormatter={(label) => `Year ${String(label)}`}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", color: "#9ca3af" }}
            />
            <Bar
              dataKey="revenue"
              fill="#818cf8"
              name="revenue"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="net_income"
              fill="#34d399"
              name="net_income"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
