"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import type { RsiPoint, MacdPoint } from "@/lib/api";

interface TechnicalChartProps {
  rsi?: RsiPoint[];
  macd?: MacdPoint[];
}

export default function TechnicalChart({ rsi, macd }: TechnicalChartProps) {
  const hasRsi = rsi && rsi.length > 0;
  const hasMacd = macd && macd.length > 0;

  if (!hasRsi && !hasMacd) {
    return (
      <div className="text-gray-500 text-sm py-8 text-center">
        No technical indicator data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* RSI */}
      {hasRsi && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            RSI (Relative Strength Index)
          </h4>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={rsi}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: "#1e1e3a" }}
                  tickFormatter={(v: string) => {
                    const d = new Date(v);
                    return `${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`;
                  }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: "#1e1e3a" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1e3a",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#e5e7eb",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [Number(value).toFixed(1), "RSI"]}
                  labelFormatter={(label) => {
                    const d = new Date(String(label));
                    return d.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                {/* Overbought / Oversold lines */}
                <ReferenceLine
                  y={70}
                  stroke="#ef4444"
                  strokeDasharray="4 2"
                  strokeWidth={1}
                />
                <ReferenceLine
                  y={30}
                  stroke="#34d399"
                  strokeDasharray="4 2"
                  strokeWidth={1}
                />
                <Line
                  type="monotone"
                  dataKey="rsi"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  dot={false}
                  name="RSI"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-1 text-xs text-gray-500">
            <span>
              Overbought: <span className="text-red-400">&gt;70</span>
            </span>
            <span>
              Oversold: <span className="text-emerald-400">&lt;30</span>
            </span>
          </div>
        </div>
      )}

      {/* MACD */}
      {hasMacd && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            MACD (Moving Average Convergence Divergence)
          </h4>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={macd}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: "#1e1e3a" }}
                  tickFormatter={(v: string) => {
                    const d = new Date(v);
                    return `${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`;
                  }}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: "#1e1e3a" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1e3a",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#e5e7eb",
                    fontSize: "12px",
                  }}
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
                {/* MACD Histogram */}
                <Bar
                  dataKey="histogram"
                  fill="#818cf8"
                  name="Histogram"
                  opacity={0.6}
                />
                {/* DIF line */}
                <Line
                  type="monotone"
                  dataKey="dif"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  dot={false}
                  name="DIF"
                />
                {/* DEA line */}
                <Line
                  type="monotone"
                  dataKey="dea"
                  stroke="#34d399"
                  strokeWidth={1.5}
                  dot={false}
                  name="DEA"
                />
                {/* Zero line */}
                <ReferenceLine y={0} stroke="#4b5563" strokeWidth={1} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
