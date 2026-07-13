"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Label,
} from "recharts";
import type { PEPoint } from "@/lib/api";

interface PEChartProps {
  data?: PEPoint[];
  currentPE?: number;
  pe5yAvg?: number;
}

export default function PEChart({ data, currentPE, pe5yAvg }: PEChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-gray-500 text-sm py-8 text-center">
        No PE ratio data available
      </div>
    );
  }

  const avg = pe5yAvg ?? data.reduce((s, p) => s + p.pe_ratio, 0) / data.length;

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-300 mb-3">
        P/E Ratio History (5Y)
      </h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
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
              tickFormatter={(v: number) => `${v.toFixed(1)}x`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e1e3a",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#e5e7eb",
                fontSize: "12px",
              }}
              formatter={(value) => [`${Number(value).toFixed(2)}x`, "P/E"]}
              labelFormatter={(label) => {
                const d = new Date(String(label));
                return d.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                });
              }}
            />
            {/* 5-year average line */}
            <ReferenceLine
              y={avg}
              stroke="#f59e0b"
              strokeDasharray="6 3"
              strokeWidth={1.5}
            >
              <Label
                value={`Avg ${avg.toFixed(1)}x`}
                position="right"
                fill="#f59e0b"
                fontSize={11}
              />
            </ReferenceLine>
            {/* Current PE annotation */}
            {currentPE !== undefined && (
              <ReferenceLine
                y={currentPE}
                stroke="#ef4444"
                strokeWidth={1.5}
              >
                <Label
                  value={`Current ${currentPE.toFixed(1)}x`}
                  position="left"
                  fill="#ef4444"
                  fontSize={11}
                />
              </ReferenceLine>
            )}
            <Line
              type="monotone"
              dataKey="pe_ratio"
              stroke="#818cf8"
              strokeWidth={2}
              dot={false}
              name="P/E"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-2 text-xs text-gray-500">
        {currentPE !== undefined && (
          <span>
            Current: <span className="text-red-400">{currentPE.toFixed(2)}x</span>
          </span>
        )}
        <span>
          5Y Avg: <span className="text-amber-400">{avg.toFixed(2)}x</span>
        </span>
      </div>
    </div>
  );
}
