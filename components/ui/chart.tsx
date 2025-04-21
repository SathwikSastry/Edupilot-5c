"use client"

import type React from "react"
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts"

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

const COLORS = {
  blue: "#3b82f6",
  green: "#22c55e",
  red: "#ef4444",
  yellow: "#eab308",
  purple: "#8b5cf6",
  pink: "#ec4899",
  indigo: "#6366f1",
  gray: "#6b7280",
}

const CustomTooltip = ({
  active,
  payload,
  label,
  valueFormatter,
}: TooltipProps<any, any> & { valueFormatter?: (value: number) => string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {valueFormatter ? valueFormatter(entry.value) : entry.value}
          </p>
        ))}
      </div>
    )
  }

  return null
}

export const LineChart: React.FC<ChartProps> = ({ data, index, categories, colors, valueFormatter, className }) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey={index} />
          <YAxis />
          <Tooltip content={(props) => <CustomTooltip {...props} valueFormatter={valueFormatter} />} />
          <Legend />
          {categories.map((category, i) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={COLORS[colors[i] as keyof typeof COLORS] || COLORS.blue}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export const BarChart: React.FC<ChartProps> = ({ data, index, categories, colors, valueFormatter, className }) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey={index} />
          <YAxis />
          <Tooltip content={(props) => <CustomTooltip {...props} valueFormatter={valueFormatter} />} />
          <Legend />
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={COLORS[colors[i] as keyof typeof COLORS] || COLORS.blue}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const PieChart: React.FC<ChartProps> = ({ data, index, categories, colors, valueFormatter, className }) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <Tooltip content={(props) => <CustomTooltip {...props} valueFormatter={valueFormatter} />} />
          <Legend />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey={categories[0]}
            nameKey={index}
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[colors[i % colors.length] as keyof typeof COLORS] || COLORS.blue} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}

export const ChartContainer: React.FC<
  React.PropsWithChildren<{
    config: Record<string, { label: string; color: string }>
    className?: string
  }>
> = ({ children, config, className }) => {
  return <div className={className}>{children}</div>
}

export const ChartTooltip: React.FC = () => null

export const ChartTooltipContent: React.FC = () => null
