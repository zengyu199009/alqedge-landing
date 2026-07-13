"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { PricePoint } from "@/lib/api";

interface StockPriceChartProps {
  data?: PricePoint[];
}

const RANGE_1Y = 365;
const RANGE_5Y = 1825;

export default function StockPriceChart({ data }: StockPriceChartProps) {
  const [range, setRange] = useState<"1y" | "5y">("1y");

  const filtered = useMemo(() => {
    if (!data || data.length === 0) return [];
    const cutoff = range === "1y" ? RANGE_1Y : RANGE_5Y;
    const now = new Date();
    const limit = new Date(now.getTime() - cutoff * 24 * 60 * 60 * 1000);
    return data.filter((p) => new Date(p.date) >= limit);
  }, [data, range]);

  if (!data || data.length === 0) {
    return (
      <div className="text-gray-500 text-sm py-8 text-center">
        No price data available
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-300">Stock Price</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setRange("1y")}
            className={`px-2 py-0.5 text-xs rounded ${
              range === "1y"
                ? "bg-indigo-600 text-white"
                : "bg-[#1e1e3a] text-gray-400 hover:text-gray-200"
            }`}
          >
            1Y
          </button>
          <button
            onClick={() => setRange("5y")}
            className={`px-2 py-0.5 text-xs rounded ${
              range === "5y"
                ? "bg-indigo-600 text-white"
                : "bg-[#1e1e3a] text-gray-400 hover:text-gray-200"
            }`}
          >
            5Y
          </button>
        </div>
      </div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={filtered} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#1e1e3a" }}
              tickFormatter={(v: string) => {
                const d = new Date(v);
                return `${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`;
              }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#1e1e3a" }}
              tickFormatter={(v: number) => `$${v.toFixed(0)}`}
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
                `$${Number(value).toFixed(2)}`,
                name === "close"
                  ? "Close"
                  : name === "ma50"
                  ? "MA50"
                  : "MA200",
              ]}
              labelFormatter={(label) => {
                const d = new Date(String(label));
                return d.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", color: "#9ca3af" }}
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#818cf8"
              strokeWidth={2}
              dot={false}
              name="close"
            />
            {filtered.some((p) => p.ma50 !== undefined) && (
              <Line
                type="monotone"
                dataKey="ma50"
                stroke="#f59e0b"
                strokeWidth={1.5}
                strokeDasharray="4 2"
                dot={false}
                name="ma50"
              />
            )}
            {filtered.some((p) => p.ma200 !== undefined) && (
              <Line
                type="monotone"
                dataKey="ma200"
                stroke="#10b981"
                strokeWidth={1.5}
                strokeDasharray="4 2"
                dot={false}
                name="ma200"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
