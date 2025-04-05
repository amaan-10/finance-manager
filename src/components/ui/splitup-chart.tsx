import type * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  data: any[];
  dataKey: string;
  categories: string[];
  colors: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
  children?: React.ReactNode;
}

export function BarChartComponent({
  data,
  dataKey,
  categories,
  colors,
  valueFormatter,
  className,
  children,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300} className={className}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={dataKey} />
        <YAxis tickFormatter={valueFormatter} />
        <Tooltip
          formatter={(value) =>
            valueFormatter ? [valueFormatter(value as number)] : [value]
          }
        />
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={colors[i % colors.length]}
          />
        ))}
        {children}
      </BarChart>
    </ResponsiveContainer>
  );
}
export { BarChart };
