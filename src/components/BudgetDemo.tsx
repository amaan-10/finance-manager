"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, ArrowDownRight, AlertCircle } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function BudgetDemo() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setProgress(78), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const budgetData = [
    { name: "Housing", value: 1200 },
    { name: "Food", value: 450 },
    { name: "Transport", value: 300 },
    { name: "Entertainment", value: 250 },
    { name: "Savings", value: 500 },
  ];

  const spendingData = [
    { month: "Jan", amount: 2500 },
    { month: "Feb", amount: 2300 },
    { month: "Mar", amount: 2400 },
    { month: "Apr", amount: 2100 },
    { month: "May", amount: 2200 },
    { month: "Jun", amount: 2000 },
  ];

  const budgetAlerts = [
    { category: "Entertainment", spent: 230, budget: 250, percent: 92 },
    { category: "Food", spent: 420, budget: 450, percent: 93 },
  ];

  return (
    <div className="p-6  bg-background h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Budget Dashboard</h3>
        <span className="text-sm text-muted-foreground">June 2024</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Monthly Budget
              </span>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">₹2,700</span>
                <span className="text-xs text-green-500 ml-2 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  5%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Spent So Far
              </span>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">₹2,100</span>
                <span className="text-xs text-red-500 ml-2 flex items-center">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  78%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Monthly Progress</CardTitle>
          <CardDescription>Budget spent: 78%</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span>₹2,700</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Budget Allocation</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {budgetData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Spending Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={spendingData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Budget Alerts</CardTitle>
          <CardDescription>Categories approaching limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetAlerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-center"
              >
                <div className="mr-4 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{alert.category}</span>
                    <span className="text-sm">
                      ₹{alert.spent} / ₹{alert.budget}
                    </span>
                  </div>
                  <Progress value={alert.percent} className="h-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
