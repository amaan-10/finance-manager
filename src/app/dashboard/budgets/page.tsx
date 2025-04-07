"use client";
import { trackDeposit } from "@/utils/challengeApi";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Calendar,
  Trash2,
  BarChart4,
  RefreshCw,
  Save,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Wallet,
  ArrowRight,
  Edit,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Budget {
  amount: number;
  month: number;
  year: number;
  spent?: number;
  remaining?: number;
}

interface Expense {
  category: string;
  amount: number;
  date: Date;
}

const years = [
  { name: "All Years", value: "all" },
  ...Array.from({ length: 5 }, (_, i) => ({
    name: `${new Date().getFullYear() - i}`,
    value: new Date().getFullYear() - i,
  })),
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthYear, setMonthYear] = useState("");
  const [amount, setAmount] = useState("");
  const [minMonth, setMinMonth] = useState<string>("");
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | number>(
    new Date().getFullYear()
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [budgetsWithSpending, setBudgetsWithSpending] = useState<Budget[]>([]);
  const [totalBudgeted, setTotalBudgeted] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);
  const [budgetTrend, setBudgetTrend] = useState(0);
  const [monthlyComparison, setMonthlyComparison] = useState<any[]>([]);

  // Set minimum month to the current month dynamically
  useEffect(() => {
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7); // Format: YYYY-MM
    setMinMonth(currentMonth);
  }, []);

  // Fetch budgets and expenses data
  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      // Fetch budgets
      const budgetsResponse = await fetch("/api/budgets");
      const budgetsData = await budgetsResponse.json();
      setBudgets(budgetsData);

      // Fetch expenses
      const expensesResponse = await fetch("/api/expenses");
      const expensesData = await expensesResponse.json();
      setExpenses(expensesData);

      // Process data for visualizations
      processData(budgetsData, expensesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Process budget and expense data for visualizations
  const processData = (budgetsData: Budget[], expensesData: Expense[]) => {
    // Calculate spending for each budget
    const budgetsWithSpendingData = budgetsData.map((budget) => {
      const relevantExpenses = expensesData.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() + 1 === budget.month &&
          expenseDate.getFullYear() === budget.year
        );
      });

      const spent = relevantExpenses.reduce(
        (total, expense) => total + expense.amount,
        0
      );
      const remaining = budget.amount - spent;

      return {
        ...budget,
        spent,
        remaining,
      };
    });

    setBudgetsWithSpending(budgetsWithSpendingData);

    // Calculate totals
    const totalBudgetAmount = budgetsWithSpendingData.reduce(
      (total, budget) => total + budget.amount,
      0
    );
    const totalSpentAmount = budgetsWithSpendingData.reduce(
      (total, budget) => total + (budget.spent || 0),
      0
    );
    const totalRemainingAmount = budgetsWithSpendingData.reduce(
      (total, budget) => total + (budget.remaining || 0),
      0
    );

    setTotalBudgeted(totalBudgetAmount);
    setTotalSpent(totalSpentAmount);
    setTotalRemaining(totalRemainingAmount);

    // Calculate budget trend (comparing current month to previous month)
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const currentMonthBudget = budgetsWithSpendingData.find(
      (budget) => budget.month === currentMonth && budget.year === currentYear
    );

    const previousMonthBudget = budgetsWithSpendingData.find(
      (budget) => budget.month === previousMonth && budget.year === previousYear
    );

    if (currentMonthBudget && previousMonthBudget) {
      const trend =
        ((currentMonthBudget.amount - previousMonthBudget.amount) /
          previousMonthBudget.amount) *
        100;
      setBudgetTrend(trend);
    }

    // Prepare monthly comparison data for charts
    const monthlyData: Record<
      string,
      { budget: number; spent: number; month: string; year: number }
    > = {};

    // Initialize with all months in the current year
    const currentYear2 = new Date().getFullYear();
    for (let i = 0; i < 12; i++) {
      const monthKey = `${i + 1}-${currentYear2}`;
      monthlyData[monthKey] = {
        budget: 0,
        spent: 0,
        month: months[i],
        year: currentYear2,
      };
    }

    // Fill in actual budget data
    budgetsWithSpendingData.forEach((budget) => {
      const monthKey = `${budget.month}-${budget.year}`;
      if (budget.year === currentYear2) {
        monthlyData[monthKey] = {
          budget: budget.amount,
          spent: budget.spent || 0,
          month: months[budget.month - 1],
          year: budget.year,
        };
      }
    });

    // Convert to array and sort by month
    const monthlyComparisonData = Object.values(monthlyData)
      .sort((a, b) => {
        const monthIndexA = months.indexOf(a.month);
        const monthIndexB = months.indexOf(b.month);
        return monthIndexA - monthIndexB;
      })
      .map((item) => ({
        ...item,
        name: item.month.substring(0, 3),
      }));

    setMonthlyComparison(monthlyComparisonData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtering budgets by year
  const filteredBudgets = budgets.filter((budget) => {
    return selectedYear === "all" || budget.year === Number(selectedYear);
  });

  // Sort budgets by date (newest first)
  const sortedBudgets = [...filteredBudgets].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  const handleAddBudget = async () => {
    if (!monthYear || !amount) {
      return;
    }

    const [year, month] = monthYear.split("-").map(Number);

    const newBudget = {
      amount: Number.parseFloat(amount),
      month,
      year,
    };

    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBudget),
      });

      const data = await res.json();

      if (res.ok) {
        // Track deposit for challenge
        await trackDeposit(newBudget.amount);

        // Add the new budget to the state
        const updatedBudgets = [...budgets, newBudget];
        setBudgets(updatedBudgets);

        // Process updated data
        processData(updatedBudgets, expenses);

        // Reset form
        setMonthYear("");
        setAmount("");
        setIsAddBudgetOpen(false);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditBudget = async () => {
    if (!editingBudget || !amount) {
      return;
    }

    const updatedBudget = {
      ...editingBudget,
      amount: Number.parseFloat(amount),
    };

    try {
      // First delete the old budget
      await fetch("/api/budgets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: editingBudget.month,
          year: editingBudget.year,
        }),
      });

      // Then add the updated budget
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBudget),
      });

      const data = await res.json();

      if (res.ok) {
        // Update the budget in state
        const updatedBudgets = budgets.map((budget) =>
          budget.month === editingBudget.month &&
          budget.year === editingBudget.year
            ? updatedBudget
            : budget
        );

        setBudgets(updatedBudgets);
        processData(updatedBudgets, expenses);

        // Reset form
        setEditingBudget(null);
        setAmount("");
        setIsEditBudgetOpen(false);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteBudget = async (month: number, year: number) => {
    try {
      const res = await fetch("/api/budgets", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ month, year }),
      });

      const data = await res.json();

      if (res.ok) {
        // Remove the budget from state
        const updatedBudgets = budgets.filter(
          (budget) => !(budget.month === month && budget.year === year)
        );

        setBudgets(updatedBudgets);
        processData(updatedBudgets, expenses);
        setConfirmDeleteId(null);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const getBudgetStatus = (budget: Budget) => {
    const spent = budget.spent || 0;
    const percentage = (spent / budget.amount) * 100;

    if (percentage >= 100) {
      return {
        status: "exceeded",
        color: "bg-red-500",
        textColor: "text-red-500",
      };
    } else if (percentage >= 80) {
      return {
        status: "warning",
        color: "bg-amber-500",
        textColor: "text-amber-500",
      };
    } else {
      return {
        status: "good",
        color: "bg-emerald-500",
        textColor: "text-emerald-500",
      };
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.section
      className="container mx-auto py-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Budget Planner
          </h1>
          <p className="text-gray-500 mt-1">
            Plan, track and optimize your monthly budgets
          </p>
        </div>

        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dialog open={isAddBudgetOpen} onOpenChange={setIsAddBudgetOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[375px]">
              <DialogHeader>
                <DialogTitle>Create New Budget</DialogTitle>
                <DialogDescription>
                  Set a budget for a specific month and year.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="month-year" className="text-right">
                    Month
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="month-year"
                      type="month"
                      value={monthYear}
                      onChange={(e) => setMonthYear(e.target.value)}
                      min={minMonth}
                      className="!w-full block"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <div className="col-span-3 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-7"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleAddBudget}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Budget
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditBudgetOpen} onOpenChange={setIsEditBudgetOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Budget</DialogTitle>
                <DialogDescription>
                  Update the budget amount for{" "}
                  {editingBudget
                    ? `${months[editingBudget.month - 1]} ${editingBudget.year}`
                    : ""}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-amount" className="text-right">
                    Amount
                  </Label>
                  <div className="col-span-3 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <Input
                      id="edit-amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-7"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleEditBudget}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Update Budget
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Budgeted
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">
                    ₹
                    {totalBudgeted.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  {budgetTrend !== 0 && (
                    <span
                      className={`ml-2 text-sm flex items-center ${
                        budgetTrend > 0 ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {budgetTrend > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(budgetTrend).toFixed(1)}%
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">
                    ₹
                    {totalSpent.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {totalBudgeted > 0
                      ? `(${((totalSpent / totalBudgeted) * 100).toFixed(1)}%)`
                      : ""}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Remaining Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="flex items-center">
                  <span
                    className={`text-2xl font-bold ${
                      totalRemaining < 0 ? "text-red-500" : ""
                    }`}
                  >
                    ₹
                    {totalRemaining.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={containerVariants}>
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-slate-200/75">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="budgets"
                className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900"
              >
                <BarChart4 className="mr-2 h-4 w-4" />
                Budget List
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center">
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(value)}
              >
                <SelectTrigger className="w-[130px]">
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value.toString()}>
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Monthly Budget vs. Spending</CardTitle>
                  <CardDescription>
                    Compare your budget with actual spending by month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="w-full h-[300px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
                    </div>
                  ) : monthlyComparison.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        No data available for the selected period
                      </p>
                    </div>
                  ) : (
                    <div className="w-full h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={monthlyComparison}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => `₹${value}`} />
                          <RechartsTooltip
                            formatter={(value: number) => [
                              `₹${value.toLocaleString("en-IN")}`,
                              "",
                            ]}
                          />
                          <Legend />
                          <Bar
                            name="Budget"
                            dataKey="budget"
                            fill="#10b981"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1000}
                          />
                          <Bar
                            name="Spent"
                            dataKey="spent"
                            fill="#0d9488"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1000}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Budget Utilization</CardTitle>
                  <CardDescription>
                    Track how much of your budget has been used
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : budgetsWithSpending.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        No budgets available for the selected period
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {budgetsWithSpending
                        .filter(
                          (budget) =>
                            selectedYear === "all" ||
                            budget.year === Number(selectedYear)
                        )
                        .sort((a, b) => {
                          if (a.year !== b.year) return b.year - a.year;
                          return b.month - a.month;
                        })
                        .slice(0, 5)
                        .map((budget, index) => {
                          const spent = budget.spent || 0;
                          const percentage = Math.min(
                            100,
                            (spent / budget.amount) * 100
                          );
                          const status = getBudgetStatus(budget);

                          return (
                            <motion.div
                              key={`${budget.month}-${budget.year}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="space-y-2"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <span className="font-medium">
                                    {months[budget.month - 1]} {budget.year}
                                  </span>
                                  {percentage >= 100 ? (
                                    <Badge
                                      variant="destructive"
                                      className="ml-2"
                                    >
                                      Exceeded
                                    </Badge>
                                  ) : percentage >= 80 ? (
                                    <Badge
                                      variant="outline"
                                      className="ml-2 bg-amber-500"
                                    >
                                      Warning
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="ml-2 border-emerald-500 text-emerald-500"
                                    >
                                      Good
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center space-x-1 text-sm">
                                  <span className={status.textColor}>
                                    ₹{spent.toLocaleString("en-IN")}
                                  </span>
                                  <span>/</span>
                                  <span>
                                    ₹{budget.amount.toLocaleString("en-IN")}
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <motion.div
                                  className={`h-2.5 rounded-full ${status.color}`}
                                  style={{ width: "0%" }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{
                                    duration: 1,
                                    delay: index * 0.1,
                                  }}
                                />
                              </div>
                            </motion.div>
                          );
                        })}

                      {budgetsWithSpending.filter(
                        (budget) =>
                          selectedYear === "all" ||
                          budget.year === Number(selectedYear)
                      ).length > 5 && (
                        <Button
                          variant="link"
                          onClick={() => setActiveTab("budgets")}
                          className="text-emerald-600 p-0 h-auto"
                        >
                          View all budgets{" "}
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-none shadow-md lg:col-span-2">
                <CardHeader>
                  <CardTitle>Budget Insights</CardTitle>
                  <CardDescription>
                    Smart observations about your budget management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : budgetsWithSpending.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">
                        No budget data available for insights
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {totalSpent > totalBudgeted && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex p-4 bg-red-50 rounded-lg"
                        >
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-red-700">
                              Budget Exceeded
                            </h4>
                            <p className="text-sm text-red-600">
                              You've exceeded your total budget by ₹
                              {Math.abs(totalRemaining).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {totalSpent <= totalBudgeted * 0.8 &&
                        totalBudgeted > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex p-4 bg-emerald-50 rounded-lg"
                          >
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-emerald-700">
                                On Track
                              </h4>
                              <p className="text-sm text-emerald-600">
                                You're staying within budget with{" "}
                                {((totalSpent / totalBudgeted) * 100).toFixed(
                                  0
                                )}
                                % used
                              </p>
                            </div>
                          </motion.div>
                        )}

                      {budgetsWithSpending.some(
                        (b) => (b.spent || 0) > b.amount
                      ) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="flex p-4 bg-amber-50 rounded-lg"
                        >
                          <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-amber-700">
                              Some Budgets Exceeded
                            </h4>
                            <p className="text-sm text-amber-600">
                              {
                                budgetsWithSpending.filter(
                                  (b) => (b.spent || 0) > b.amount
                                ).length
                              }{" "}
                              of your budgets have exceeded their limits
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {budgetTrend > 10 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="flex p-4 bg-blue-50 rounded-lg"
                        >
                          <TrendingUp className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-blue-700">
                              Budget Increase
                            </h4>
                            <p className="text-sm text-blue-600">
                              Your current budget is {budgetTrend.toFixed(0)}%
                              higher than last month
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {budgetTrend < -10 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 }}
                          className="flex p-4 bg-purple-50 rounded-lg"
                        >
                          <TrendingDown className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-purple-700">
                              Budget Decrease
                            </h4>
                            <p className="text-sm text-purple-600">
                              Your current budget is{" "}
                              {Math.abs(budgetTrend).toFixed(0)}% lower than
                              last month
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {budgetsWithSpending.length > 0 &&
                        budgetsWithSpending.every(
                          (b) => (b.spent || 0) <= b.amount
                        ) && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex p-4 bg-emerald-50 rounded-lg"
                          >
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-emerald-700">
                                Perfect Budgeting
                              </h4>
                              <p className="text-sm text-emerald-600">
                                All your budgets are within their limits. Great
                                job!
                              </p>
                            </div>
                          </motion.div>
                        )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budgets" className="mt-0">
            <Card className="border-none shadow-md">
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-6 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="p-6 text-center">
                    <p className="text-red-500">Error: {error}</p>
                    <Button
                      variant="outline"
                      onClick={handleRefresh}
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : sortedBudgets.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                      <Wallet className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-medium">No budgets found</h3>
                    <p className="text-gray-500 mt-1 mb-4">
                      Get started by creating your first monthly budget.
                    </p>
                    <Button
                      onClick={() => setIsAddBudgetOpen(true)}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Budget
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-emerald-50">
                          <th className="text-left py-3 px-4 font-medium text-gray-600">
                            Month
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">
                            Budget
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">
                            Spent
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">
                            Remaining
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">
                            Status
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-gray-600">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {sortedBudgets.map((budget, index) => {
                            const budgetWithSpending = budgetsWithSpending.find(
                              (b) =>
                                b.month === budget.month &&
                                b.year === budget.year
                            ) || {
                              ...budget,
                              spent: 0,
                              remaining: budget.amount,
                            };

                            const spent = budgetWithSpending.spent || 0;
                            const remaining = budgetWithSpending.remaining || 0;
                            const percentage = (spent / budget.amount) * 100;
                            const status = getBudgetStatus(budgetWithSpending);

                            return (
                              <motion.tr
                                key={`${budget.month}-${budget.year}`}
                                className="border-b hover:bg-gray-50"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                  duration: 0.2,
                                  delay: index * 0.05,
                                }}
                              >
                                <td className="py-3 px-4 font-medium">
                                  {months[budget.month - 1]} {budget.year}
                                </td>
                                <td className="py-3 px-4">
                                  ₹{budget.amount.toLocaleString("en-IN")}
                                </td>
                                <td className="py-3 px-4">
                                  ₹{spent.toLocaleString("en-IN")}
                                  <span className="ml-1 text-xs text-gray-500">
                                    ({percentage.toFixed(0)}%)
                                  </span>
                                </td>
                                <td
                                  className={`py-3 px-4 ${
                                    remaining < 0
                                      ? "text-red-500 font-medium"
                                      : ""
                                  }`}
                                >
                                  ₹{remaining.toLocaleString("en-IN")}
                                </td>
                                <td className="py-3 px-4">
                                  {percentage >= 100 ? (
                                    <Badge variant="destructive">
                                      Exceeded
                                    </Badge>
                                  ) : percentage >= 80 ? (
                                    <Badge
                                      variant="outline"
                                      className="bg-amber-100 text-amber-800 border-amber-200"
                                    >
                                      Warning
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="bg-emerald-100 text-emerald-800 border-emerald-200"
                                    >
                                      On Track
                                    </Badge>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  {confirmDeleteId ===
                                  `${budget.month}-${budget.year}` ? (
                                    <div className="flex items-center justify-end space-x-2">
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                          handleDeleteBudget(
                                            budget.month,
                                            budget.year
                                          )
                                        }
                                      >
                                        Confirm
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setConfirmDeleteId(null)}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex justify-end space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setEditingBudget(budget);
                                          setAmount(budget.amount.toString());
                                          setIsEditBudgetOpen(true);
                                        }}
                                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          setConfirmDeleteId(
                                            `${budget.month}-${budget.year}`
                                          )
                                        }
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </td>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
              {sortedBudgets.length > 0 && (
                <CardFooter className="flex justify-between p-4 border-t">
                  <div className="text-sm text-gray-500">
                    Showing {sortedBudgets.length} of {budgets.length} budgets
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.section>
  );
}
