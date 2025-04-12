"use client";
import { useState, useEffect } from "react";
import type React from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart4,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  Download,
  Info,
  PlusCircle,
  Wallet,
  ChartLine,
  PieChart,
  FileEditIcon,
  List,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Investment {
  _id: string;
  type: string;
  amount: number;
  date: string;
  currentValue?: number;
  name?: string;
}

interface StockData {
  name?: string;
  amount: number;
  inv_date: string;
  status: string;
  id: string;
  c: number; // Current price
  d: number;
  dp: number;
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Opening price
  pc: number; // Previous close
  t: number;
}

const months = [
  { name: "All", value: "all" },
  { name: "January", value: 1 },
  { name: "February", value: 2 },
  { name: "March", value: 3 },
  { name: "April", value: 4 },
  { name: "May", value: 5 },
  { name: "June", value: 6 },
  { name: "July", value: 7 },
  { name: "August", value: 8 },
  { name: "September", value: 9 },
  { name: "October", value: 10 },
  { name: "November", value: 11 },
  { name: "December", value: 12 },
];

const years = [
  { name: "All", value: "all" },
  ...Array.from({ length: 5 }, (_, i) => ({
    name: new Date().getFullYear() - i,
    value: new Date().getFullYear() - i,
  })),
];

// Sample historical data for charts
const generateHistoricalData = (stock: StockData) => {
  if (!stock) return [];

  const basePrice = stock.pc || stock.c || 100;
  const volatility = 0.05; // 5% volatility

  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));

    // Random walk with some trend
    const randomFactor = Math.random() * volatility * 2 - volatility;
    const trendFactor = (i / 30) * (stock.c > stock.pc ? 0.1 : -0.1);
    const price = basePrice * (1 + randomFactor + trendFactor);

    return {
      date: date.toLocaleDateString(),
      price: Number.parseFloat(price.toFixed(2)),
    };
  });
};

// Calculate investment performance
const calculatePerformance = (
  investment: Investment,
  stockData: StockData[]
) => {
  if (investment.type !== "stock")
    return { value: investment.amount, change: 0, percentChange: 0 };

  const stock = stockData.find((s) => s.name === investment.name);
  if (!stock || !stock.c)
    return { value: investment.amount, change: 0, percentChange: 0 };

  const investmentDate = new Date(investment.date);
  const daysSinceInvestment = Math.floor(
    (new Date().getTime() - investmentDate.getTime()) / (1000 * 3600 * 24)
  );

  // Simple estimation based on current price vs previous close
  const estimatedGrowthRate = stock.c / stock.pc - 1;
  const annualizedRate = Math.pow(1 + estimatedGrowthRate, 365) - 1;
  const estimatedGrowth =
    Math.pow(1 + annualizedRate, daysSinceInvestment / 365) - 1;

  const currentValue = investment.amount * (1 + estimatedGrowth);
  const change = currentValue - investment.amount;
  const percentChange = (change / investment.amount) * 100;

  return {
    value: Number.parseFloat(currentValue.toFixed(2)),
    change: Number.parseFloat(change.toFixed(2)),
    percentChange: Number.parseFloat(percentChange.toFixed(2)),
  };
};

// Color scheme
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];

export default function Investments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [stockData, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stocksError, setStocksError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Form states
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter states
  const [selectedMonth, setSelectedMonth] = useState<string | number>("all");
  const [selectedYear, setSelectedYear] = useState<string | number>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  // Fetch investments data
  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/investments");
      const data = await response.json();
      setInvestments(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching investments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stock data
  const fetchStockData = async () => {
    try {
      setLoadingStocks(true);
      const response = await fetch("/api/stocks");
      if (!response.ok) throw new Error("Error fetching stock data");
      const data = await response.json();
      setStocks(data);
      setStocksError(null);
    } catch (err: any) {
      setStocksError(err.message);
    } finally {
      setLoadingStocks(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchInvestments();
    fetchStockData();
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchInvestments(), fetchStockData()]);
    setTimeout(() => setRefreshing(false), 800); // Minimum refresh animation time
  };

  // Filter investments
  const filteredInvestments = investments.filter((investment) => {
    const investmentDate = new Date(investment.date);

    // Filter by month and year
    const matchesMonth =
      selectedMonth === "all" ||
      investmentDate.getMonth() + 1 === Number(selectedMonth);
    const matchesYear =
      selectedYear === "all" ||
      investmentDate.getFullYear() === Number(selectedYear);

    // Filter by search term
    const matchesSearch =
      searchTerm === "" ||
      investment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (investment.name &&
        investment.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesMonth && matchesYear && matchesSearch;
  });

  // Calculate portfolio statistics
  const portfolioStats = {
    totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
    totalStocks: investments.filter((inv) => inv.type === "stock").length,
    totalOtherInvestments: investments.filter((inv) => inv.type !== "stock")
      .length,
    estimatedValue: investments.reduce((sum, inv) => {
      const performance = calculatePerformance(inv, stockData);
      return sum + performance.value;
    }, 0),
  };

  // Group investments by type for pie chart
  const investmentsByType = investments.reduce(
    (acc: Record<string, number>, inv) => {
      acc[inv.type] = (acc[inv.type] || 0) + inv.amount;
      return acc;
    },
    {}
  );

  const pieChartData = Object.entries(investmentsByType).map(
    ([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    })
  );

  // Handle add investment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newInvestment = {
      type: type.toLowerCase(),
      amount: Number.parseFloat(amount),
      date,
      name: type === "stock" ? name.toUpperCase() : undefined,
    };

    try {
      const response = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvestment),
      });

      if (response.ok) {
        setShowAddForm(false);
        setType("");
        setName("");
        setAmount("");
        setDate("");
        await fetchInvestments();
        if (type === "stock") await fetchStockData();

        toast({
          description: "Investment added successfully!",
          className: "bg-neutral-900 border-neutral-900 text-white",
        });
      }
    } catch (error) {
      console.error("Error adding investment:", error);
    }
  };

  // Handle delete investment
  const handleDeleteInvestment = async (id: string) => {
    try {
      const response = await fetch(`/api/investments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id),
      });

      if (response.ok) {
        await fetchInvestments();
        await fetchStockData();
        toast({
          description: "Investment deleted successfully!",
          className: "bg-neutral-900 border-neutral-900 text-white",
        });
      }
    } catch (error: any) {
      console.error("Error deleting investment:", error);
    }
  };

  // Confirmation dialog for deletion
  const [investmentToDelete, setInvestmentToDelete] = useState<string | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const confirmDelete = (id: string) => {
    setInvestmentToDelete(id);
    setShowDeleteDialog(true);
  };

  const executeDelete = async () => {
    if (investmentToDelete) {
      await handleDeleteInvestment(investmentToDelete);
      setShowDeleteDialog(false);
      setInvestmentToDelete(null);
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded"></div>
        ))}
      </div>
      <div className="h-64 bg-gray-200 rounded"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-7xl pt-32 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              Investment Portfolio
            </h1>
            <p className="text-gray-500 mt-1">
              Track and manage your investments
            </p>
          </div>

          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </Button>

            <Button
              onClick={() => setShowAddForm(true)}
              className="flex items-center bg-gradient-to-r from-yellow-600 to-amber-600"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Investment
            </Button>
          </div>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="rounded-xl border bg-card text-card-foreground overflow-hidden border-none shadow-md bg-gradient-to-r from-yellow-50 to-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Invested
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <>
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-4 w-28" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      ₹{portfolioStats.totalInvested.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Across {investments.length} investments
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="rounded-xl border bg-card text-card-foreground overflow-hidden border-none shadow-md bg-gradient-to-r from-yellow-50 to-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Estimated Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <>
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-4 w-28" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      ₹{portfolioStats.estimatedValue.toLocaleString()}
                    </div>
                    <div className="flex items-center mt-1">
                      {portfolioStats.estimatedValue >
                      portfolioStats.totalInvested ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-xs text-green-500">
                            +
                            {(
                              ((portfolioStats.estimatedValue -
                                portfolioStats.totalInvested) /
                                portfolioStats.totalInvested) *
                              100
                            ).toFixed(2)}
                            %
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-xs text-red-500">
                            {(
                              ((portfolioStats.estimatedValue -
                                portfolioStats.totalInvested) /
                                portfolioStats.totalInvested) *
                              100
                            ).toFixed(2)}
                            %
                          </span>
                        </>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="rounded-xl border bg-card text-card-foreground overflow-hidden border-none shadow-md bg-gradient-to-r from-yellow-50 to-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Stock Investments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <>
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-4 w-28" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {portfolioStats.totalStocks}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {(
                        (portfolioStats.totalStocks / investments.length) *
                          100 || 0
                      ).toFixed(0)}
                      % of portfolio
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="rounded-xl border bg-card text-card-foreground overflow-hidden border-none shadow-md bg-gradient-to-r from-yellow-50 to-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Other Investments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <>
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-4 w-28" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {portfolioStats.totalOtherInvestments}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {(
                        (portfolioStats.totalOtherInvestments /
                          investments.length) *
                          100 || 0
                      ).toFixed(0)}
                      % of portfolio
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search investments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value.toString()}>
                    {year.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSelectedMonth("all");
                setSelectedYear("all");
                setSearchTerm("");
              }}
            >
              <Filter className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      {loading || loadingStocks ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-800">
          Error: {error}
        </div>
      ) : (
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4 bg-slate-200/75 flex-wrap h-full gap-2 justify-start">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-900"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="stocks"
              className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-900"
            >
              <ChartLine className="mr-2 h-4 w-4" />
              Stocks
            </TabsTrigger>
            <TabsTrigger
              value="other"
              className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-900"
            >
              <List className="mr-2 h-4 w-4" />
              Other Investments
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-900"
            >
              <FileEditIcon className="mr-2 h-4 w-4" />
              Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Portfolio Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Distribution</CardTitle>
                <CardDescription>
                  Breakdown of your investments by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Investments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Investments</CardTitle>
                <CardDescription>
                  Your most recent investment activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInvestments.slice(0, 5).map((investment) => {
                    const performance = calculatePerformance(
                      investment,
                      stockData
                    );
                    return (
                      <motion.div
                        key={investment._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex items-center">
                          <div className="bg-gray-100 p-2 rounded-full mr-4">
                            {investment.type === "stock" ? (
                              <BarChart4 className="h-5 w-5 text-blue-600" />
                            ) : (
                              <DollarSign className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {investment.name ||
                                investment.type.charAt(0).toUpperCase() +
                                  investment.type.slice(1)}
                            </h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(investment.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            ₹{investment.amount.toLocaleString()}
                          </div>
                          {investment.type === "stock" && (
                            <div
                              className={`text-sm ${
                                performance.percentChange >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {performance.percentChange >= 0 ? "+" : ""}
                              {performance.percentChange}%
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setActiveTab(
                      filteredInvestments[0]?.type === "stock"
                        ? "stocks"
                        : "other"
                    )
                  }
                >
                  View All Investments
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="stocks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Portfolio</CardTitle>
                <CardDescription>
                  Your stock investments and their performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {loadingStocks ? (
                    <p>Loading stock data...</p>
                  ) : stocksError ? (
                    <p className="text-red-500">Error: {stocksError}</p>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {stockData.map((stock, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`rounded-xl overflow-hidden border ${
                              stock.dp > 0
                                ? "border-green-100"
                                : "border-red-100"
                            }`}
                          >
                            <div
                              className={`p-4 ${
                                stock.dp > 0
                                  ? "bg-gradient-to-r from-green-50 to-teal-50"
                                  : "bg-gradient-to-r from-red-50 to-orange-50"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="text-lg font-bold">
                                    {stock.name}
                                  </h3>
                                  <div className="flex items-center">
                                    <Badge
                                      variant={
                                        stock.dp > 0 ? "default" : "destructive"
                                      }
                                      className="mr-2"
                                    >
                                      {stock.status}
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                      {new Date(
                                        stock.inv_date
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold">
                                    ₹{stock.amount.toLocaleString()}
                                  </div>
                                  <div
                                    className={`flex items-center ${
                                      stock.dp > 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {stock.dp > 0 ? (
                                      <TrendingUp className="h-4 w-4 mr-1" />
                                    ) : (
                                      <TrendingDown className="h-4 w-4 mr-1" />
                                    )}
                                    <span>
                                      {stock.dp > 0 ? "+" : ""}
                                      {(stock.dp || 0).toFixed(2)}%
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Stock Price Chart */}
                              <div className="h-32 mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart
                                    data={generateHistoricalData(stock)}
                                  >
                                    <defs>
                                      <linearGradient
                                        id={`colorPrice${index}`}
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                      >
                                        <stop
                                          offset="5%"
                                          stopColor={
                                            stock.dp > 0 ? "#10B981" : "#EF4444"
                                          }
                                          stopOpacity={0.8}
                                        />
                                        <stop
                                          offset="95%"
                                          stopColor={
                                            stock.dp > 0 ? "#10B981" : "#EF4444"
                                          }
                                          stopOpacity={0}
                                        />
                                      </linearGradient>
                                    </defs>
                                    <Area
                                      type="monotone"
                                      dataKey="price"
                                      stroke={
                                        stock.dp > 0 ? "#10B981" : "#EF4444"
                                      }
                                      fillOpacity={1}
                                      fill={`url(#colorPrice${index})`}
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>

                              {/* Stock Details */}
                              <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                                <div>
                                  <span className="text-gray-500">
                                    Current Price:
                                  </span>
                                  <span className="ml-2 font-medium">
                                    ${stock.c}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">
                                    Previous Close:
                                  </span>
                                  <span className="ml-2 font-medium">
                                    ${stock.pc}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">
                                    Day High:
                                  </span>
                                  <span className="ml-2 font-medium">
                                    ${stock.h}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">
                                    Day Low:
                                  </span>
                                  <span className="ml-2 font-medium">
                                    ${stock.l}
                                  </span>
                                </div>
                              </div>

                              <div className="flex justify-between mt-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-blue-600"
                                  asChild
                                >
                                  <Link
                                    href={`https://www.google.com/search?q=${stock.name}+stock`}
                                    target="_blank"
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Details
                                  </Link>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600"
                                  onClick={() => confirmDelete(stock.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {stockData.length === 0 && (
                        <div className="text-center py-10">
                          <BarChart4 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No Stocks Found
                          </h3>
                          <p className="text-gray-500 mb-4">
                            You haven't added any stock investments yet.
                          </p>
                          <Button onClick={() => setShowAddForm(true)}>
                            Add Your First Stock
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="other" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Other Investments</CardTitle>
                <CardDescription>Your non-stock investments</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredInvestments.filter((inv) => inv.type !== "stock")
                  .length > 0 ? (
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-amber-100/50 border-b">
                          <th className="px-6 py-3 text-left font-medium text-gray-500">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">
                            Date
                          </th>
                          <th className="px-6 py-3 text-right font-medium text-gray-500">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInvestments
                          .filter((inv) => inv.type !== "stock")
                          .map((investment, index) => (
                            <motion.tr
                              key={investment._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 font-medium capitalize">
                                {investment.type}
                              </td>
                              <td className="px-6 py-4">
                                ₹{investment.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4">
                                {new Date(investment.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 h-8"
                                  onClick={() => confirmDelete(investment._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </motion.tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No Other Investments
                    </h3>
                    <p className="text-gray-500 mb-4">
                      You haven't added any non-stock investments yet.
                    </p>
                    <Button onClick={() => setShowAddForm(true)}>
                      Add Your First Investment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Performance</CardTitle>
                <CardDescription>
                  Analysis of your investment portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.entries(investmentsByType).map(
                        ([type, amount]) => ({
                          type,
                          invested: amount,
                          current: investments
                            .filter((inv) => inv.type === type)
                            .reduce((sum, inv) => {
                              const perf = calculatePerformance(inv, stockData);
                              return sum + perf.value;
                            }, 0),
                        })
                      )}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          `₹${value.toLocaleString()}`,
                          "",
                        ]}
                      />
                      <Legend />
                      <Bar
                        dataKey="invested"
                        name="Invested Amount"
                        fill="#8884d8"
                      />
                      <Bar
                        dataKey="current"
                        name="Current Value"
                        fill="#82ca9d"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Investment Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">
                            Portfolio Diversity
                          </h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Your portfolio is spread across{" "}
                            {Object.keys(investmentsByType).length} different
                            investment types.
                            {Object.keys(investmentsByType).length < 3
                              ? " Consider diversifying further to reduce risk."
                              : " Good job on maintaining a diverse portfolio!"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800">
                            Performance Overview
                          </h4>
                          <p className="text-sm text-green-700 mt-1">
                            {portfolioStats.estimatedValue >
                            portfolioStats.totalInvested
                              ? `Your portfolio has gained ${(
                                  ((portfolioStats.estimatedValue -
                                    portfolioStats.totalInvested) /
                                    portfolioStats.totalInvested) *
                                  100
                                ).toFixed(2)}% overall.`
                              : `Your portfolio is down ${Math.abs(
                                  ((portfolioStats.estimatedValue -
                                    portfolioStats.totalInvested) /
                                    portfolioStats.totalInvested) *
                                    100
                                ).toFixed(2)}% overall.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Add Investment Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Investment</DialogTitle>
            <DialogDescription>
              Enter the details of your investment below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Investment Type</Label>
                <Input
                  id="type"
                  placeholder="e.g., stock, gold, mutual fund"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                />
              </div>

              {type.toLowerCase() === "stock" && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Stock Symbol</Label>
                  <Input
                    id="name"
                    placeholder="e.g., AAPL, MSFT"
                    value={name}
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Enter the stock symbol for US exchanges (NYSE, NASDAQ)
                  </p>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Investment amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date">Investment Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Investment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this investment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={executeDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
