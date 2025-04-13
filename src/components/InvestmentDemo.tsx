"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function InvestmentDemo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const portfolioData = [
    { name: "Jan", value: 10000 },
    { name: "Feb", value: 10400 },
    { name: "Mar", value: 10200 },
    { name: "Apr", value: 10800 },
    { name: "May", value: 11200 },
    { name: "Jun", value: 12000 },
  ];

  const allocationData = [
    { name: "Stocks", value: 60 },
    { name: "Bonds", value: 15 },
    { name: "Real Estate", value: 10 },
    { name: "Crypto", value: 5 },
    { name: "Cash", value: 10 },
  ];

  const investments = [
    { name: "AAPL", price: 182.63, change: 1.25, changePercent: 0.69 },
    { name: "MSFT", price: 415.28, change: -2.31, changePercent: -0.55 },
    { name: "AMZN", price: 178.75, change: 3.42, changePercent: 1.95 },
    { name: "GOOGL", price: 164.32, change: 0.87, changePercent: 0.53 },
  ];

  return (
    <div className="p-6 bg-background h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Investment Portfolio</h3>
        <span className="text-sm text-muted-foreground">June 2024</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Portfolio Value
              </span>
              <div className="flex flex-col sm:flex-row items-baseline">
                <span className="text-2xl font-bold">₹12,000</span>
                <span className="text-xs text-green-500 ml-0 sm:ml-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  20%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Monthly Return
              </span>
              <div className="flex flex-col sm:flex-row items-baseline">
                <span className="text-2xl font-bold">₹800</span>
                <span className="text-xs text-green-500 ml-0 sm:ml-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  7.1%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Portfolio Performance</CardTitle>
          <CardDescription>6-month history</CardDescription>
        </CardHeader>
        <CardContent className="p-0 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={portfolioData}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip formatter={(value) => [`₹${value}`, "Value"]} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorValue)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {allocationData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investments.map((investment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="font-medium">{investment.name}</div>
                  <div className="flex items-center gap-3">
                    <div>₹{investment.price}</div>
                    <div
                      className={`flex items-center ${
                        investment.change >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {investment.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {investment.change >= 0 ? "+" : ""}
                      {investment.changePercent}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
