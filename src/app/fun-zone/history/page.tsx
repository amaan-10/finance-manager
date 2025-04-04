"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Award,
  Calendar,
  Download,
  Filter,
  Gift,
  History,
  Info,
  Search,
  Share2,
  SlidersHorizontal,
  Star,
  Trophy,
  TrendingUp,
  Zap,
  icons,
  LucideIcon,
} from "lucide-react";
import { format, subDays, isAfter, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types
type TransactionType = "earned" | "spent" | "all";
type TransactionCategory =
  | "challenge"
  | "achievement"
  | "streak"
  | "referral"
  | "reward"
  | "gift-card"
  | "cashback"
  | "bonus"
  | "all";

type Transaction = {
  id: string;
  date: string;
  points: number;
  type: "earned" | "spent";
  category: TransactionCategory;
  title: string;
  description?: string;
  icon: string;
};

type PointsStats = {
  name: string;
  currentPoints: number;
  totalEarned: number;
  totalSpent: number;
  lastMonthEarned?: number;
  lastMonthSpent?: number;
  thisMonthEarned: number;
  thisMonthSpent: number;
  lastUpdatedMonth: number;
  rank: number;
  savingsGoal: number;
  currentSavings: number;
  challengesCompleted: number;
  challengesInProgress: number;
  rewardsRedeemed: number;
  streakDays: number;
  nextRewardPoints: number;
};

// Monthly points data for chart
const monthlyPointsData = [
  { month: "Nov", earned: 2500, spent: 1000 },
  { month: "Dec", earned: 3200, spent: 2200 },
  { month: "Jan", earned: 4100, spent: 1800 },
  { month: "Feb", earned: 3800, spent: 2700 },
  { month: "Mar", earned: 4250, spent: 2500 },
  { month: "Apr", earned: 3750, spent: 1000 },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const cardHoverVariants = {
  hover: {
    y: -5,
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const getLucideIcon = (iconName: string): LucideIcon | null => {
  return icons[iconName as keyof typeof icons] || null;
};

export default function PointsHistoryPage() {
  const [pointsStats, setPointsStats] = useState<PointsStats>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user-stats")
      .then((res) => res.json())
      .then((data) => {
        setPointsStats(data);
        const normalizedTransactions = data.recentActivity.map(
          (transaction: Transaction) => ({
            ...transaction,
            points: Math.abs(transaction.points), // Ensure points are positive
          })
        );
        setTransactions(normalizedTransactions);
        setLoading(false);
      });
  }, []);

  console.log(transactions);

  const [activeTab, setActiveTab] = useState<TransactionType>("all");
  const [categoryFilter, setCategoryFilter] =
    useState<TransactionCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [chartData, setChartData] = useState<
    { height: number; value: number }[]
  >([]);

  // Initialize chart data animation
  useEffect(() => {
    const maxValue = Math.max(
      ...monthlyPointsData.map((d) => Math.max(d.earned, d.spent))
    );
    const newChartData = monthlyPointsData.map((month) => ({
      height: 0,
      value: (month.earned / maxValue) * 150,
    }));

    setChartData(newChartData);

    // Animate chart bars after a delay
    const timer = setTimeout(() => {
      setChartData(
        monthlyPointsData.map((month) => ({
          height: (month.earned / maxValue) * 150,
          value: (month.earned / maxValue) * 150,
        }))
      );
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Filter transactions based on active tab, category, search, and date range
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        // Filter by tab (transaction type)
        const typeFilter =
          activeTab === "all" || transaction.type === activeTab;

        // Filter by category
        const catFilter =
          categoryFilter === "all" || transaction.category === categoryFilter;

        // Filter by search
        const searchFilter =
          transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (transaction.description &&
            transaction.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()));

        // Filter by date range
        const dateFilter =
          (!dateRange.from ||
            isAfter(parseISO(transaction.date), dateRange.from)) &&
          (!dateRange.to || !isAfter(parseISO(transaction.date), dateRange.to));

        return typeFilter && catFilter && searchFilter && dateFilter;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeTab, categoryFilter, searchQuery, dateRange]);

  // Get category color
  const getCategoryColor = (category: TransactionCategory) => {
    switch (category) {
      case "challenge":
        return "bg-blue-100 text-blue-700";
      case "achievement":
        return "bg-purple-100 text-purple-700";
      case "streak":
        return "bg-amber-100 text-amber-700";
      case "referral":
        return "bg-pink-100 text-pink-700";
      case "reward":
        return "bg-emerald-100 text-emerald-700";
      case "gift-card":
        return "bg-purple-100 text-purple-700";
      case "cashback":
        return "bg-green-100 text-green-700";
      case "bonus":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Get transaction type color
  const getTransactionTypeColor = (type: "earned" | "spent") => {
    return type === "earned" ? "text-emerald-600" : "text-red-600";
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy • h:mm a");
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-[75vh]">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <motion.div
            className="container mx-auto py-8 max-w-7xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <motion.div
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Points History
                </h1>
                <p className="text-slate-500 mt-1">
                  Track your points earning and spending activity
                </p>
              </div>
              <div className="flex items-center gap-4">
                <motion.div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-2 rounded-lg shadow-sm">
                  <Star className="h-5 w-5 text-emerald-500" />
                  <div>
                    <div className="text-sm text-slate-600">
                      Current Balance
                    </div>
                    <motion.div
                      className="font-bold text-emerald-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      {pointsStats?.currentPoints.toLocaleString()} points
                    </motion.div>
                  </div>
                </motion.div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>

            {/* Points Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="mb-8 bg-gradient-to-r from-white to-gray-50 border shadow-sm overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>Points Summary</CardTitle>
                  <CardDescription>
                    Overview of your points activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <div className="p-3 bg-emerald-100 rounded-full">
                        <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">
                          Total Earned
                        </div>
                        <div className="text-2xl font-bold text-emerald-700">
                          {pointsStats?.totalEarned.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          <span className="text-emerald-600">
                            +{pointsStats?.thisMonthEarned.toLocaleString()}
                          </span>{" "}
                          this month
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <div className="p-3 bg-red-100 rounded-full">
                        <ArrowDownLeft className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">
                          Total Spent
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          {pointsStats?.totalSpent.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          <span className="text-red-600">
                            -{pointsStats?.thisMonthSpent.toLocaleString()}
                          </span>{" "}
                          this month
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <div className="p-3 bg-blue-100 rounded-full">
                        <History className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Net Change</div>
                        <div className="text-2xl font-bold text-blue-700">
                          {(
                            (pointsStats?.totalEarned || 0) -
                            (pointsStats?.totalSpent || 0)
                          ).toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          <span className="text-blue-700">
                            {(
                              (pointsStats?.thisMonthEarned || 0) -
                              (pointsStats?.thisMonthSpent || 0)
                            ).toLocaleString()}
                          </span>{" "}
                          this month
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Points Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Points Activity</CardTitle>
                    <Tabs defaultValue="6months" className="w-auto">
                      <TabsList>
                        <TabsTrigger value="6months">6 Months</TabsTrigger>
                        <TabsTrigger value="3months">3 Months</TabsTrigger>
                        <TabsTrigger value="1month">1 Month</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full flex flex-col">
                    <div className="flex-1 flex items-end justify-between gap-2 pt-4 relative">
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-slate-500 py-2">
                        <div>5000</div>
                        <div>2500</div>
                        <div>0</div>
                      </div>

                      {/* Chart grid lines */}
                      <div className="absolute left-12 right-0 top-0 bottom-0 flex flex-col justify-between">
                        <div className="border-b border-slate-100 w-full h-0"></div>
                        <div className="border-b border-slate-100 w-full h-0"></div>
                        <div className="border-b border-slate-200 w-full h-0"></div>
                      </div>

                      {/* Chart bars */}
                      <div className="absolute left-12 right-0 bottom-0 flex justify-between items-end h-full px-4">
                        {monthlyPointsData.map((month, index) => (
                          <div
                            key={month.month}
                            className="flex flex-col items-center gap-1 w-full"
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="relative w-full max-w-[40px] flex justify-center">
                                    {/* Earned bar */}
                                    <motion.div
                                      className="w-8 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-md z-10"
                                      initial={{ height: 0 }}
                                      animate={{
                                        height: chartData[index]?.height || 0,
                                      }}
                                      transition={{
                                        delay: 0.2 + index * 0.1,
                                        duration: 0.8,
                                        ease: "easeOut",
                                      }}
                                    />

                                    {/* Spent bar */}
                                    <motion.div
                                      className="absolute bottom-0 left-10 w-8 bg-gradient-to-t from-red-400 to-red-300 rounded-t-md z-10"
                                      initial={{ height: 0 }}
                                      animate={{
                                        height:
                                          (month.spent /
                                            Math.max(
                                              ...monthlyPointsData.map((d) =>
                                                Math.max(d.earned, d.spent)
                                              )
                                            )) *
                                          150,
                                      }}
                                      transition={{
                                        delay: 0.4 + index * 0.1,
                                        duration: 0.8,
                                        ease: "easeOut",
                                      }}
                                    />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-xs">
                                    <div className="font-medium">
                                      {month.month}
                                    </div>
                                    <div className="flex items-center text-emerald-600">
                                      <ArrowUpRight className="h-3 w-3 mr-1" />
                                      Earned: {month.earned.toLocaleString()}
                                    </div>
                                    <div className="flex items-center text-red-600">
                                      <ArrowDownLeft className="h-3 w-3 mr-1" />
                                      Spent: {month.spent.toLocaleString()}
                                    </div>
                                    <div className="pt-1 border-t mt-1">
                                      Net:{" "}
                                      {(
                                        month.earned - month.spent
                                      ).toLocaleString()}
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* X-axis labels */}
                    <div className="h-8 flex gap-[166px] pl-[165px]">
                      {monthlyPointsData.map((month) => (
                        <div
                          key={month.month}
                          className="text-xs font-medium text-slate-500"
                        >
                          {month.month}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                        <span className="text-xs text-slate-500">Earned</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-sm bg-red-400"></div>
                        <span className="text-xs text-slate-500">Spent</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Filters and Search */}
            <motion.div
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Tabs
                defaultValue="all"
                className="w-full md:w-auto"
                onValueChange={(value) =>
                  setActiveTab(value as TransactionType)
                }
              >
                <TabsList className="flex gap-2 w-auto mx-auto">
                  <TabsTrigger value="all">All Transactions</TabsTrigger>
                  <TabsTrigger value="earned">Earned</TabsTrigger>
                  <TabsTrigger value="spent">Spent</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={{
                        from: dateRange.from,
                        to: dateRange.to,
                      }}
                      onSelect={(range) =>
                        setDateRange({
                          from: range?.from,
                          to: range?.to,
                        })
                      }
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Filter className="h-4 w-4 mr-1" />
                      Category
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                      All Categories
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter("challenge")}
                    >
                      Challenges
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter("achievement")}
                    >
                      Achievements
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter("streak")}
                    >
                      Streaks
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter("referral")}
                    >
                      Referrals
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter("bonus")}
                    >
                      Bonuses
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter("reward")}
                    >
                      Rewards
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter("gift-card")}
                    >
                      Gift Cards
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter("cashback")}
                    >
                      Cashback
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>

            {/* Transactions List */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${categoryFilter}-${searchQuery}-${dateRange.from?.toISOString()}-${dateRange.to?.toISOString()}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="mb-8"
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Transaction History</CardTitle>
                      <Select defaultValue="newest">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="highest">
                            Highest Points
                          </SelectItem>
                          <SelectItem value="lowest">Lowest Points</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <CardDescription>
                      {filteredTransactions.length} transactions found
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction, index) => {
                          const IconComponent = getLucideIcon(transaction.icon);
                          return (
                            <motion.div
                              key={transaction.id}
                              variants={itemVariants}
                              custom={index}
                              whileHover="hover"
                            >
                              <motion.div variants={cardHoverVariants}>
                                <Card className="overflow-hidden border shadow-sm">
                                  <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                      <motion.div
                                        className={`p-3 rounded-full shrink-0 ${getCategoryColor(
                                          transaction.category
                                        )}`}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{
                                          type: "spring",
                                          stiffness: 400,
                                          damping: 10,
                                        }}
                                      >
                                        {IconComponent ? (
                                          <IconComponent className="h-5 w-5" />
                                        ) : transaction.type === "earned" ? (
                                          <ArrowUpRight className="h-5 w-5" />
                                        ) : (
                                          <ArrowDownLeft className="h-5 w-5" />
                                        )}
                                      </motion.div>

                                      <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                          <div>
                                            <h3 className="font-medium">
                                              {transaction.title}
                                            </h3>
                                            {transaction.description && (
                                              <p className="text-xs text-slate-500 mt-1">
                                                {transaction.description}
                                              </p>
                                            )}
                                          </div>

                                          <motion.div
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                              delay: 0.3 + index * 0.05,
                                              duration: 0.3,
                                            }}
                                            className={`font-medium ${getTransactionTypeColor(
                                              transaction.type
                                            )}`}
                                          >
                                            {transaction.type === "earned"
                                              ? "+"
                                              : "-"}
                                            {transaction.points.toLocaleString()}{" "}
                                            points
                                          </motion.div>
                                        </div>

                                        <div className="mt-2 flex justify-between items-center">
                                          <div className="flex items-center gap-2">
                                            <Badge
                                              variant="outline"
                                              className={`text-xs capitalize ${
                                                transaction.type === "earned"
                                                  ? "border-emerald-200 text-emerald-700"
                                                  : "border-red-200 text-red-700"
                                              }`}
                                            >
                                              {transaction.type}
                                            </Badge>
                                            <Badge
                                              variant="outline"
                                              className="text-xs capitalize"
                                            >
                                              {transaction.category.replace(
                                                "-",
                                                " "
                                              )}
                                            </Badge>
                                          </div>

                                          <div className="text-xs text-slate-500">
                                            {formatDate(transaction.date)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            </motion.div>
                          );
                        })
                      ) : (
                        <motion.div
                          className="flex flex-col items-center justify-center py-12 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <History className="h-12 w-12 text-slate-300 mb-4" />
                          <h3 className="text-xl font-medium mb-2">
                            No transactions found
                          </h3>
                          <p className="text-slate-500 max-w-md mb-6">
                            Try adjusting your filters or search query to find
                            what you're looking for
                          </p>
                          <Button
                            onClick={() => {
                              setActiveTab("all");
                              setCategoryFilter("all");
                              setSearchQuery("");
                              setDateRange({
                                from: subDays(new Date(), 30),
                                to: new Date(),
                              });
                            }}
                          >
                            Reset Filters
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                  {filteredTransactions.length > 0 && (
                    <CardFooter className="flex justify-between items-center border-t p-4 bg-slate-50">
                      <div className="text-sm text-slate-500">
                        Showing {filteredTransactions.length} of{" "}
                        {transactions.length} transactions
                      </div>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Points Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Points Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Points by Category */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <h3 className="font-medium mb-3">Points by Category</h3>
                      <div className="space-y-3">
                        {(
                          [
                            "challenge",
                            "achievement",
                            "streak",
                            "referral",
                            "bonus",
                          ] as TransactionCategory[]
                        ).map((category, index) => {
                          const totalPoints = transactions
                            .filter(
                              (t) =>
                                t.category === category && t.type === "earned"
                            )
                            .reduce((sum, t) => sum + t.points, 0);

                          const percentage = Math.round(
                            (totalPoints / (pointsStats?.totalEarned || 0)) *
                              100
                          );

                          return (
                            <div key={category}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="capitalize">
                                  {category.replace("-", " ")}
                                </span>
                                <span>
                                  {totalPoints.toLocaleString()} ({percentage}%)
                                </span>
                              </div>
                              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full rounded-full ${
                                    category === "challenge"
                                      ? "bg-blue-500"
                                      : category === "achievement"
                                      ? "bg-purple-500"
                                      : category === "streak"
                                      ? "bg-amber-500"
                                      : category === "referral"
                                      ? "bg-pink-500"
                                      : "bg-orange-500"
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{
                                    delay: 0.7 + index * 0.1,
                                    duration: 1,
                                    ease: "easeOut",
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>

                    {/* Points Spent */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <h3 className="font-medium mb-3">Points Spent</h3>
                      <div className="space-y-3">
                        {(
                          [
                            "gift-card",
                            "cashback",
                            "reward",
                          ] as TransactionCategory[]
                        ).map((category, index) => {
                          const totalPoints = transactions
                            .filter(
                              (t) =>
                                t.category === category && t.type === "spent"
                            )
                            .reduce((sum, t) => sum + t.points, 0);

                          const percentage = Math.round(
                            (totalPoints / (pointsStats?.totalSpent || 0)) * 100
                          );

                          return (
                            <div key={category}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="capitalize">
                                  {category.replace("-", " ")}
                                </span>
                                <span>
                                  {totalPoints.toLocaleString()} ({percentage}%)
                                </span>
                              </div>
                              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full rounded-full ${
                                    category === "gift-card"
                                      ? "bg-indigo-500"
                                      : category === "cashback"
                                      ? "bg-green-500"
                                      : "bg-emerald-500"
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{
                                    delay: 0.8 + index * 0.1,
                                    duration: 1,
                                    ease: "easeOut",
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </div>

                  {/* Points Insights */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                      className="bg-slate-50 p-4 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        <h3 className="font-medium text-sm">
                          Top Earning Source
                        </h3>
                      </div>
                      <div className="text-lg font-bold">Achievements</div>
                      <div className="text-sm text-slate-500">
                        5,500 points earned
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-slate-50 p-4 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <h3 className="font-medium text-sm">
                          Best Earning Month
                        </h3>
                      </div>
                      <div className="text-lg font-bold">March</div>
                      <div className="text-sm text-slate-500">
                        4,250 points earned
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-slate-50 p-4 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="h-4 w-4 text-indigo-600" />
                        <h3 className="font-medium text-sm">Most Redeemed</h3>
                      </div>
                      <div className="text-lg font-bold">Gift Cards</div>
                      <div className="text-sm text-slate-500">
                        5,000 points spent
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 rounded-b-lg border-t p-4">
                  <div className="text-sm text-slate-500 flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    Points data is updated in real-time as you earn and redeem
                    rewards
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </>
  );
}
