"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  PieChartIcon,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function SpendingAnalyticsDemo() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const categoryData = [
    { name: "Food & Dining", value: 850, color: "#0088FE", change: 5 },
    { name: "Shopping", value: 620, color: "#00C49F", change: -8 },
    { name: "Transportation", value: 380, color: "#FFBB28", change: 2 },
    { name: "Entertainment", value: 290, color: "#FF8042", change: 12 },
    { name: "Utilities", value: 420, color: "#8884d8", change: -3 },
  ];

  const monthlyData = [
    { month: "Jan", amount: 5200 },
    { month: "Feb", amount: 6300 },
    { month: "Mar", amount: 5400 },
    { month: "Apr", amount: 6200 },
    { month: "May", amount: 5756 },
    { month: "Jun", amount: 6571 },
  ];

  const recentTransactions = [
    {
      id: 1,
      merchant: "Starbucks",
      category: "Food & Dining",
      amount: 575,
      date: "Today",
    },
    {
      id: 2,
      merchant: "Amazon",
      category: "Shopping",
      amount: 3499,
      date: "Yesterday",
    },
    {
      id: 3,
      merchant: "Uber",
      category: "Transportation",
      amount: 125,
      date: "Jun 10",
    },
    {
      id: 4,
      merchant: "Netflix",
      category: "Entertainment",
      amount: 1499,
      date: "Jun 8",
    },
    {
      id: 5,
      merchant: "Grocery Store",
      category: "Food & Dining",
      amount: 873,
      date: "Jun 7",
    },
  ];

  const getCategoryColor = (category: any) => {
    const found = categoryData.find((item) => item.name === category);
    return found ? found.color : "#cccccc";
  };

  const handlePieClick = (data: any) => {
    setActiveCategory(activeCategory === data.name ? null : data.name);
  };

  return (
    <div className="p-6 bg-background h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg sm:text-xl font-bold">Spending Analytics</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Last 30 days</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 h-full">
            <div className="flex justify-between items-stretch h-full flex-col">
              <span className="text-sm text-muted-foreground">Total Spent</span>
              <div className="flex flex-col sm:flex-row items-baseline">
                <span className="text-2xl font-bold">₹6,571</span>
                <span className="text-xs text-red-500 ml-0 sm:ml-2 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  8%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Avg. Daily Spend
              </span>
              <div className="flex flex-col sm:flex-row items-baseline">
                <span className="text-2xl font-bold">₹219.03</span>
                <span className="text-xs text-green-500 ml-0 sm:ml-2 flex items-center">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  3%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="mb-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="categories" className="flex items-center gap-1">
            <PieChartIcon className="h-4 w-4" />
            <span>Categories</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>Trends</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span>Transactions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Spending by Category</CardTitle>
              <CardDescription>
                Click on a category to highlight
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        animationDuration={1000}
                        onClick={handlePieClick}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            opacity={
                              activeCategory && activeCategory !== entry.name
                                ? 0.3
                                : 1
                            }
                            stroke={
                              activeCategory === entry.name ? "#fff" : "none"
                            }
                            strokeWidth={activeCategory === entry.name ? 2 : 0}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    {categoryData.map((category, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                          activeCategory === category.name
                            ? "bg-muted"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => handlePieClick(category)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span>{category.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">₹{category.value}</span>
                          <span
                            className={`text-xs ${
                              category.change > 0
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {category.change > 0 ? "+" : ""}
                            {category.change}%
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Monthly Spending Trend
              </CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                  <Bar
                    dataKey="amount"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent Transactions</CardTitle>
              <CardDescription>Your latest spending activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: `${getCategoryColor(
                            transaction.category
                          )}20`,
                        }}
                      >
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: getCategoryColor(
                              transaction.category
                            ),
                          }}
                        ></div>
                      </div>
                      <div>
                        <div className="font-medium">
                          {transaction.merchant}
                        </div>
                        <div className="text-xs text-muted-foreground flex flex-wrap gap-y-0 items-center gap-2">
                          <span>{transaction.date}</span>
                          <span>•</span>
                          <span>{transaction.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-xs sm:text-base">
                      -₹{transaction.amount.toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
