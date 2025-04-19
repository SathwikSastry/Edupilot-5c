// components/ui/chart.tsx
import type React from "react"

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

export const PieChart: React.FC<ChartProps> = ({ data, index, categories, colors, valueFormatter, className }) => {
  return (
    <div className={className}>
      PieChart Placeholder
      <pre>{JSON.stringify({ data, index, categories, colors, valueFormatter })}</pre>
    </div>
  )
}

export const LineChart: React.FC<ChartProps> = ({ data, index, categories, colors, valueFormatter, className }) => {
  return (
    <div className={className}>
      LineChart Placeholder
      <pre>{JSON.stringify({ data, index, categories, colors, valueFormatter })}</pre>
    </div>
  )
}

export const BarChart: React.FC<ChartProps> = ({ data, index, categories, colors, valueFormatter, className }) => {
  return (
    <div className={className}>
      BarChart Placeholder
      <pre>{JSON.stringify({ data, index, categories, colors, valueFormatter })}</pre>
    </div>
  )
}
