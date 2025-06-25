"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Search,
  Calendar,
  Trash2,
  FileText,
  BarChart4,
  PieChart,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Save,
  Wallet,
  QrCode,
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  PieChart as RechartPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import DePayLogo from "@/assets/depay-logo";

interface Expense {
  _id?: string;
  category: string;
  amount: number;
  date: Date;
  notes?: string;
}

interface MonthlyExpense {
  totalAmount: number;
  _id: {
    month: number;
    year: number;
  };
}

interface CategoryTotal {
  category: string;
  total: number;
  color: string;
}

const months = [
  { name: "All Months", value: "all" },
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
  { name: "All Years", value: "all" },
  ...Array.from({ length: 5 }, (_, i) => ({
    name: `${new Date().getFullYear() - i}`,
    value: new Date().getFullYear() - i,
  })),
];

// Category colors for consistent visualization
const categoryColors: Record<string, string> = {
  Food: "#FF6384",
  Groceries: "#36A2EB",
  Transportation: "#FFCE56",
  Entertainment: "#4BC0C0",
  Shopping: "#9966FF",
  Utilities: "#FF9F40",
  Rent: "#8AC926",
  Healthcare: "#1982C4",
  Education: "#6A4C93",
  Travel: "#F15BB5",
  Other: "#A0A0A0",
};

// Get color for a category, creating one if it doesn't exist
const getCategoryColor = (category: string): string => {
  if (!categoryColors[category]) {
    // Generate a random color if we don't have one assigned
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    categoryColors[category] = color;
  }
  return categoryColors[category];
};

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<string | number>(
    new Date().getFullYear()
  );
  const [activeTab, setActiveTab] = useState("list");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [monthlyTotals, setMonthlyTotals] = useState<any[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [averageExpense, setAverageExpense] = useState(0);
  const [expenseChange, setExpenseChange] = useState(0);
  const [topCategory, setTopCategory] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch expenses data
  const fetchExpenses = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/expenses");
      const data = await response.json();
      setExpenses(data);
      processExpenseData(data);
      const expensesRes = await fetch(`/api/expenses/monthly`);
      const expensesData = await expensesRes.json();
      setMonthlyExpenses(expensesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Process expense data for visualizations
  const processExpenseData = (data: Expense[]) => {
    // Calculate total expenses
    const total = data.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalExpenses(total);

    // Calculate average expense
    setAverageExpense(data.length > 0 ? total / data.length : 0);

    // Calculate month-over-month change (simplified)
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    const currentMonthExpenses = data
      .filter((expense) => new Date(expense.date).getMonth() === currentMonth)
      .reduce((sum, expense) => sum + expense.amount, 0);

    const lastMonthExpenses = data
      .filter((expense) => new Date(expense.date).getMonth() === lastMonth)
      .reduce((sum, expense) => sum + expense.amount, 0);

    const change =
      lastMonthExpenses > 0
        ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
        : 0;

    setExpenseChange(change);

    // Calculate category totals
    const categories: Record<string, number> = {};
    data.forEach((expense) => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += expense.amount;
    });

    const categoryData = Object.entries(categories).map(
      ([category, total]) => ({
        category,
        total,
        color: getCategoryColor(category),
      })
    );

    // Sort by total amount descending
    categoryData.sort((a, b) => b.total - a.total);
    setCategoryTotals(categoryData);

    if (categoryData.length > 0) {
      setTopCategory(categoryData[0].category);
    }

    // Calculate monthly totals for the chart
    const monthlyTotalsMap: Record<string, number> = {};
    data.forEach((expense) => {
      const date = new Date(expense.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!monthlyTotalsMap[monthYear]) {
        monthlyTotalsMap[monthYear] = 0;
      }
      monthlyTotalsMap[monthYear] += expense.amount;
    });

    // Convert to array and sort by date
    const monthlyData = Object.entries(monthlyTotalsMap).map(
      ([monthYear, total]) => {
        const [month, year] = monthYear.split("/").map(Number);
        const monthName =
          months.find((m) => m.value === month)?.name || "Unknown";

        return {
          monthYear,
          month,
          year,
          total,
          name: `${monthName.substring(0, 3)} ${year} `,
        };
      }
    );

    // Sort by date
    monthlyData.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    setMonthlyTotals(monthlyData);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Filtering expenses
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);

    // Filter by month and year
    const matchesMonth =
      selectedMonth === "all" ||
      expenseDate.getMonth() + 1 === Number(selectedMonth);
    const matchesYear =
      selectedYear === "all" ||
      expenseDate.getFullYear() === Number(selectedYear);

    // Filter by search term
    const matchesSearch =
      searchTerm === "" ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.notes &&
        expense.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesMonth && matchesYear && matchesSearch;
  });

  // Sort expenses by date (newest first)
  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleAddExpense = async () => {
    if (!category || !amount) {
      return;
    }

    const newExpense = {
      category,
      amount: Number.parseFloat(amount),
      date: new Date(),
      notes: notes || undefined,
    };

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });

      const data = await res.json();

      if (res.ok) {
        // Add the new expense to the state
        setExpenses([...expenses, { ...newExpense, _id: data.id }]);
        processExpenseData([...expenses, newExpense]);

        toast({
          description: "Expense added successfully!",
          className: "bg-neutral-900 border-neutral-900 text-white",
        });

        // Reset form
        setCategory("");
        setAmount("");
        setNotes("");
        setIsAddExpenseOpen(false);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteExpense = async (expense: Expense) => {
    try {
      const res = await fetch("/api/expenses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: expense.category,
          amount: expense.amount,
          date: expense.date,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Remove the expense from state
        const updatedExpenses = expenses.filter(
          (e) =>
            !(
              e.category === expense.category &&
              e.amount === expense.amount &&
              new Date(e.date).getTime() === new Date(expense.date).getTime()
            )
        );
        setExpenses(updatedExpenses);
        processExpenseData(updatedExpenses);
        setConfirmDeleteId(null);
        toast({
          description: "Expense deleted successfully!",
          className: "bg-neutral-900 border-neutral-900 text-white",
        });
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRefresh = () => {
    fetchExpenses();
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

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const [monthlyTopCategory, setMonthlyTopCategory] = useState("N/A");
  const [currentMonthExpense, setCurrentMonthExpense] = useState(0);

  useEffect(() => {
    const currentMonthExpense =
      monthlyExpenses?.find((expense) => {
        const now = new Date();
        return (
          expense._id.month === now.getMonth() + 1 &&
          expense._id.year === now.getFullYear()
        );
      })?.totalAmount || 0;

    setCurrentMonthExpense(currentMonthExpense);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter expenses from current month
    const monthExpense = expenses.filter((expense) => {
      const date = new Date(expense.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    // Group by category and sum amounts
    const categoryTotals: Record<string, number> = {};
    for (const expense of monthExpense) {
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + expense.amount;
    }

    // Find top category
    let top = "N/A";
    let maxAmount = 0;
    for (const [category, amount] of Object.entries(categoryTotals)) {
      if (amount > maxAmount) {
        top = category;
        maxAmount = amount;
      }
    }

    setMonthlyTopCategory(top);
  }, [expenses, monthlyExpenses]);

  const [view, setView] = useState<"monthly" | "total">("monthly");

  const exp = view === "total" ? totalExpenses : currentMonthExpense;
  const avgExpense = view === "total" ? averageExpense : averageExpense;
  const change = view === "total" ? expenseChange : expenseChange;
  const cat = view === "total" ? topCategory : monthlyTopCategory;

  function handleDePayTransaction() {
    const callbackURL = encodeURIComponent(
      // "http://localhost:3001/depay/callback"
      "https://spend-less.vercel.app/depay/callback"
    );

    // const depayURL = `http://localhost:3000/pay?callback=${callbackURL}`;
    const depayURL = `https://depayment.vercel.app/pay?callback=${callbackURL}`;

    window.location.href = depayURL;
  }

  return (
    <motion.section
      className="container mx-auto pt-32 pb-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Expense Tracker
          </h1>
          <p className="text-gray-500 mt-1">
            Track, analyze and manage your expenses
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

          <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Select how you want to log your expense
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="form" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="form">Manual Entry</TabsTrigger>
                  <TabsTrigger value="depay">Pay via DePay</TabsTrigger>
                </TabsList>

                {/* Manual Entry Form */}
                <TabsContent value="form">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category
                      </Label>
                      <div className="col-span-3">
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Food">Food</SelectItem>
                            <SelectItem value="Groceries">Groceries</SelectItem>
                            <SelectItem value="Transportation">
                              Transportation
                            </SelectItem>
                            <SelectItem value="Entertainment">
                              Entertainment
                            </SelectItem>
                            <SelectItem value="Shopping">Shopping</SelectItem>
                            <SelectItem value="Utilities">Utilities</SelectItem>
                            <SelectItem value="Rent">Rent</SelectItem>
                            <SelectItem value="Healthcare">
                              Healthcare
                            </SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Travel">Travel</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
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
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">
                        Notes
                      </Label>
                      <Input
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="col-span-3"
                        placeholder="Optional notes"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={handleAddExpense}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Expense
                    </Button>
                  </DialogFooter>
                </TabsContent>

                {/* DePay Tab Content */}
                <TabsContent value="depay">
                  <div className="py-6">
                    <div>
                      {/* QR Scan Button */}
                      <div className="flex justify-center">
                        <div
                          onClick={handleDePayTransaction}
                          className="group cursor-pointer relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/30 to-teal-600/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-110"></div>

                          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-700/60 rounded-3xl p-12 shadow-2xl hover:shadow-emerald-900/20 transition-all duration-500 group-hover:border-emerald-600/50 group-hover:bg-slate-900/100">
                            <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500/60 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300 animate-pulse"></div>
                            <div className="absolute bottom-6 left-6 w-1 h-1 bg-teal-400/50 rounded-full opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>

                            <div className="absolute top-6 left-6 w-3 h-3 border-l-2 border-t-2 border-emerald-500/30 group-hover:border-emerald-400/60 transition-colors duration-300"></div>
                            <div className="absolute bottom-6 right-6 w-3 h-3 border-r-2 border-b-2 border-emerald-500/30 group-hover:border-emerald-400/60 transition-colors duration-300"></div>

                            <div className="flex flex-col items-center space-y-5">
                              <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-900/50 to-teal-800/50 rounded-2xl flex items-center justify-center group-hover:from-emerald-800/60 group-hover:to-teal-700/60 transition-all duration-300 shadow-lg border border-emerald-700/30 group-hover:border-emerald-600/50">
                                  <div className="relative">
                                    <div>
                                      <DePayLogo
                                        className="h-7 w-7 text-emerald-300 group-hover:text-emerald-200 rounded-[1px] transition-colors duration-300"
                                        fill="green"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="absolute inset-0 rounded-2xl border border-emerald-600/30 opacity-0 group-hover:opacity-100 animate-ping"></div>
                                <div
                                  className="absolute inset-0 rounded-2xl border border-emerald-500/20 opacity-0 group-hover:opacity-100 animate-ping"
                                  style={{ animationDelay: "0.5s" }}
                                ></div>
                              </div>

                              <div className="text-center space-y-1">
                                <h3 className="text-lg font-semibold text-slate-100 tracking-tight">
                                  Pay via DePay
                                </h3>
                              </div>
                            </div>

                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-sm shadow-emerald-400/50"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Replace with your actual DePay integration logic */}
                    <p className="text-sm text-muted-foreground text-center mt-7">
                      You'll be redirected to the DePay interface to complete
                      the transaction securely.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <>
        {/* Toggle */}
        <div className="flex justify-end mb-4">
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(val) => val && setView(val as "monthly" | "total")}
          >
            <ToggleGroupItem
              value="monthly"
              className="px-4 py-1.5 rounded-md text-sm data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-700"
            >
              This Month
            </ToggleGroupItem>
            <ToggleGroupItem
              value="total"
              className="px-4 py-1.5 rounded-md text-sm data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-700"
            >
              Total
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
        >
          {/* Total Expenses */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-indigo-100 to-violet-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Expenses ({view === "monthly" ? "This Month" : "Total"})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">
                      ₹
                      {exp.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Average Expense */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-indigo-100 to-violet-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Average Expense
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">
                      ₹
                      {avgExpense.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Month-over-Month Change */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-indigo-100 to-violet-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Month-over-Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">
                      {Math.abs(change).toFixed(1)}%
                    </span>
                    {change > 0 ? (
                      <ArrowUpRight className="ml-2 h-5 w-5 text-red-500" />
                    ) : change < 0 ? (
                      <ArrowDownRight className="ml-2 h-5 w-5 text-green-500" />
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Category */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-indigo-100 to-violet-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Top Category ({view === "monthly" ? "This Month" : "Total"})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">{cat}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </>

      {/* Main Content */}
      <motion.div variants={containerVariants}>
        <Tabs
          defaultValue="list"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <TabsList className="mb-4 sm:mb-0 bg-slate-200/75">
              <TabsTrigger
                value="list"
                className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-900"
              >
                <FileText className="mr-2 h-4 w-4" />
                Expenses List
              </TabsTrigger>
              <TabsTrigger
                value="charts"
                className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-900"
              >
                <BarChart4 className="mr-2 h-4 w-4" />
                Charts
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-900"
              >
                <PieChart className="mr-2 h-4 w-4" />
                Categories
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-[200px]"
                />
              </div>

              <div className="flex gap-2">
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(value) => setSelectedMonth(value)}
                >
                  <SelectTrigger className="w-[130px]">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem
                        key={month.value}
                        value={month.value.toString()}
                      >
                        {month.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(value)}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem
                        key={year.value}
                        value={year.value.toString()}
                      >
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <TabsContent value="list" className="mt-0">
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
                ) : sortedExpenses.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 mb-4">
                      <FileText className="h-8 w-8 text-violet-600" />
                    </div>
                    <h3 className="text-lg font-medium">No expenses found</h3>
                    <p className="text-gray-500 mt-1 mb-4">
                      {searchTerm
                        ? "Try a different search term or"
                        : "Get started by"}{" "}
                      adding your first expense.
                    </p>
                    <Button
                      onClick={() => setIsAddExpenseOpen(true)}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Expense
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-violet-50">
                          <th className="text-left py-3 px-4 font-medium text-gray-600">
                            Category
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">
                            Amount
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">
                            Date
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">
                            Notes
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-gray-600">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {sortedExpenses.map((expense, index) => (
                            <motion.tr
                              key={`${expense.category}-${
                                expense.amount
                              }-${new Date(expense.date).getTime()}`}
                              className="border-b hover:bg-gray-50"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{
                                duration: 0.2,
                                delay: index * 0.05,
                              }}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{
                                      backgroundColor: getCategoryColor(
                                        expense.category
                                      ),
                                    }}
                                  />
                                  <span>{expense.category}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-medium">
                                ₹
                                {expense.amount.toLocaleString("en-IN", {
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className="py-3 px-4 text-gray-600">
                                {new Date(expense.date).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </td>
                              <td className="py-3 px-4 text-gray-600 max-w-[200px] truncate">
                                {expense.notes || "-"}
                              </td>
                              <td className="py-3 px-4 text-right">
                                {confirmDeleteId ===
                                `${expense.category}-${
                                  expense.amount
                                }-${new Date(expense.date).getTime()}` ? (
                                  <div className="flex items-center justify-end space-x-2">
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteExpense(expense)
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
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setConfirmDeleteId(
                                        `${expense.category}-${
                                          expense.amount
                                        }-${new Date(expense.date).getTime()}`
                                      )
                                    }
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
              {sortedExpenses.length > 0 && (
                <CardFooter className="flex justify-between p-4 border-t">
                  <div className="text-sm text-gray-500">
                    Showing {sortedExpenses.length} of {expenses.length}{" "}
                    expenses
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="mt-0">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Expense Trends</CardTitle>
                <CardDescription>
                  View your spending patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="w-full h-[300px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700"></div>
                  </div>
                ) : monthlyTotals.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No data available for the selected period
                    </p>
                  </div>
                ) : (
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={monthlyTotals}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorTotal"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#8884d8"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#8884d8"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="monthYear"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const [month, year] = value.split("/");
                            return `${months[
                              Number.parseInt(month)
                            ]?.name.substring(0, 3)} ${year.substring(2)}`;
                          }}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `₹${value}`}
                        />
                        <CartesianGrid strokeDasharray="3 3" />
                        <RechartsTooltip
                          formatter={(value: number) => [
                            `₹${value.toLocaleString("en-IN")}`,
                            "Total",
                          ]}
                          labelFormatter={(label) => {
                            const [month, year] = label.split("/");
                            return `${
                              months[Number.parseInt(month)]?.name
                            } ${year}`;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="total"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorTotal)"
                          animationDuration={1000}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>
                  See how your expenses are distributed across categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="w-full h-[300px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700"></div>
                  </div>
                ) : categoryTotals.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No data available for the selected period
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="w-full h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartPieChart>
                          <Pie
                            data={categoryTotals}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="total"
                            nameKey="category"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            animationDuration={1000}
                          >
                            {categoryTotals.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value: number) => [
                              `₹${value.toLocaleString("en-IN")}`,
                              "Amount",
                            ]}
                          />
                          <Legend />
                        </RechartPieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-4">
                      {categoryTotals.slice(0, 5).map((category, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: category.color }}
                              />
                              <span>{category.category}</span>
                            </div>
                            <span className="font-medium">
                              ₹{category.total.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="h-2 rounded-full"
                              style={{
                                backgroundColor: category.color,
                                width: `${
                                  (category.total / totalExpenses) * 100
                                }%`,
                              }}
                              initial={{ width: 0 }}
                              animate={{
                                width: `${
                                  (category.total / totalExpenses) * 100
                                }%`,
                              }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.section>
  );
}
