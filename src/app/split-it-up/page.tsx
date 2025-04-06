"use client";
import { useEffect, useState, useRef } from "react";
import type React from "react";

import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Plus,
  Save,
  Trash2,
  ChevronDown,
  ChevronUp,
  Users,
  Receipt,
  FileText,
  IndianRupee,
  PieChart,
  BarChart3,
  Clock,
  Download,
  Tag,
  ArrowUpDown,
  Filter,
  Search,
  Share2,
  CreditCard,
  History,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Member {
  id: string;
  name: string;
  amountPaid: number;
  balance?: number;
  color?: string;
  email?: string;
  avatarUrl?: string;
}

interface Transaction {
  _id: string;
  transactionName: string;
  createdAt: Date;
  members: Member[];
  category?: string;
  notes?: string;
}

// New interface for expense categories
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

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
    transition: { type: "spring", stiffness: 300, damping: 24 },
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

const SettleUpApp = () => {
  const [totalBill, setTotalBill] = useState<number>(0);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<
    { from: string; to: string; amount: number }[]
  >([]);
  const [isOpen, setOpenInput] = useState(false);
  const [transactionName, setTransactionName] = useState<string>("");
  const [pastTransactions, setPastTransactions] = useState<Transaction[]>([]);
  const [expandedTransactionId, setExpandedTransactionId] = useState<
    string | null
  >(null);
  const [activeTab, setActiveTab] = useState<
    "current" | "history" | "analytics" | "settle"
  >("current");
  const [selectedCategory, setSelectedCategory] = useState<string>("food");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [showAddPersonDialog, setShowAddPersonDialog] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: "", email: "" });
  const newMemberRef = useRef<HTMLInputElement>(null);

  // Member colors for visualization
  const memberColors = [
    "#10b981", // emerald-500
    "#3b82f6", // blue-500
    "#f97316", // orange-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#f43f5e", // rose-500
    "#06b6d4", // cyan-500
    "#84cc16", // lime-500
  ];

  // Predefined expense categories
  const categories: Category[] = [
    {
      id: "food",
      name: "Food & Drinks",
      icon: <CreditCard className="w-4 h-4" />,
      color: "#f97316",
    },
    {
      id: "transport",
      name: "Transportation",
      icon: <ArrowUpDown className="w-4 h-4" />,
      color: "#3b82f6",
    },
    {
      id: "entertainment",
      name: "Entertainment",
      icon: <BarChart3 className="w-4 h-4" />,
      color: "#8b5cf6",
    },
    {
      id: "shopping",
      name: "Shopping",
      icon: <Tag className="w-4 h-4" />,
      color: "#ec4899",
    },
    {
      id: "utilities",
      name: "Utilities",
      icon: <Calculator className="w-4 h-4" />,
      color: "#10b981",
    },
    {
      id: "rent",
      name: "Rent",
      icon: <Clock className="w-4 h-4" />,
      color: "#f43f5e",
    },
    {
      id: "other",
      name: "Other",
      icon: <FileText className="w-4 h-4" />,
      color: "#6b7280",
    },
  ];

  const handleTransactionClick = (id: string) => {
    setExpandedTransactionId(expandedTransactionId === id ? null : id);
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/split-up");
        const data = await response.json();
        setPastTransactions(data);
        console.log(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Assign colors to members when they're added
  useEffect(() => {
    if (members.length > 0) {
      const membersWithColors = members.map((member, index) => ({
        ...member,
        color: member.color || memberColors[index % memberColors.length],
      }));
      setMembers(membersWithColors);
    }
  }, [members.length]);

  const openInput = async () => {
    setOpenInput(true);
  };

  const handleSaveData = async () => {
    if (!members.length) {
      alert("Please add at least one member");
      return;
    }

    if (!transactionName) {
      alert("Please provide a transaction name");
      return;
    }

    // Include category in the saved transaction
    const response = await fetch("/api/split-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionName,
        members,
        category: selectedCategory,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      window.location.reload();
    } else {
      alert("Failed to add transaction");
    }
  };

  const handleDeleteData = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    const response = await fetch("/api/split-up", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setPastTransactions(
        pastTransactions.filter((transaction) => transaction._id !== id)
      );
    } else {
      alert("Failed to delete transaction data");
    }
  };

  const fairShare = members.length > 0 ? totalBill / members.length : 0;

  const calculateBalances = (
    members: Member[],
    totalBill: number
  ): Member[] => {
    const fairShare = totalBill / members.length;
    return members.map((member) => ({
      ...member,
      balance: member.amountPaid - fairShare,
    }));
  };

  const settleUp = (members: Member[]) => {
    const transactions: { from: string; to: string; amount: number }[] = [];
    const sortedMembers = [...members].sort((a, b) => a.balance! - b.balance!);

    let i = 0;
    let j = sortedMembers.length - 1;

    while (i < j) {
      const debtor = sortedMembers[i];
      const creditor = sortedMembers[j];

      const amountToSettle = Math.min(-debtor.balance!, creditor.balance!);

      if (amountToSettle > 0) {
        transactions.push({
          from: debtor.name,
          to: creditor.name,
          amount: Number.parseFloat(amountToSettle.toFixed(2)),
        });

        debtor.balance! += amountToSettle;
        creditor.balance! -= amountToSettle;
      }

      if (debtor.balance! === 0) i++;
      if (creditor.balance! === 0) j--;
    }

    return transactions;
  };

  const addMember = () => {
    const newMember = { id: Date.now().toString(), name: "", amountPaid: 0 };
    setMembers([...members, newMember]);

    // Focus on the new member's name input after rendering
    setTimeout(() => {
      if (newMemberRef.current) {
        newMemberRef.current.focus();
      }
    }, 100);
  };

  const updateMember = (
    id: string,
    field: keyof Member,
    value: string | number
  ) => {
    setMembers(
      members.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const handleCalculate = () => {
    if (members.length === 0) {
      alert("Please add at least one member");
      return;
    }

    const totalPaid = members.reduce(
      (sum, member) => sum + member.amountPaid,
      0
    );

    if (totalPaid !== totalBill) {
      alert(
        `Total amount paid (${totalPaid}) does not match the total bill (${totalBill}).`
      );
      return;
    }

    const membersWithBalances = calculateBalances(members, totalBill);
    const settlementTransactions = settleUp(membersWithBalances);
    setTransactions(settlementTransactions);
  };

  // Filter transactions based on search query, category, and date range
  const filteredTransactions = pastTransactions.filter((transaction) => {
    const matchesSearch =
      searchQuery === "" ||
      transaction.transactionName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.members.some((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      filterCategory === "all" || transaction.category === filterCategory;

    // Date filtering logic
    let matchesDate = true;
    if (dateRange !== "all") {
      const transactionDate = new Date(transaction.createdAt);
      const now = new Date();

      if (dateRange === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        matchesDate = transactionDate >= today;
      } else if (dateRange === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = transactionDate >= weekAgo;
      } else if (dateRange === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = transactionDate >= monthAgo;
      }
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  // Calculate total spending by category for analytics
  const spendingByCategory = pastTransactions.reduce((acc, transaction) => {
    const category = transaction.category || "other";
    const total = transaction.members.reduce(
      (sum, member) => sum + member.amountPaid,
      0
    );

    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += total;
    return acc;
  }, {} as Record<string, number>);

  // Calculate spending by member
  const spendingByMember = pastTransactions.reduce((acc, transaction) => {
    transaction.members.forEach((member) => {
      if (!acc[member.name]) {
        acc[member.name] = 0;
      }
      acc[member.name] += member.amountPaid;
    });
    return acc;
  }, {} as Record<string, number>);

  // Get total spending
  const totalSpending = Object.values(spendingByCategory).reduce(
    (sum, amount) => sum + amount,
    0
  );

  // Function to export transaction data as CSV
  const exportTransactions = () => {
    // Create CSV content
    let csvContent = "Transaction Name,Date,Category,Total Amount,Members\n";

    pastTransactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt).toLocaleDateString();
      const totalAmount = transaction.members.reduce(
        (sum, member) => sum + member.amountPaid,
        0
      );
      const membersList = transaction.members
        .map((m) => `${m.name}:${m.amountPaid}`)
        .join("; ");
      const category = transaction.category || "Other";

      csvContent += `"${transaction.transactionName}","${date}","${category}",${totalAmount},"${membersList}"\n`;
    });

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "settle-up-transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to get category details by ID
  const getCategoryById = (id: string): Category => {
    return (
      categories.find((cat) => cat.id === id) ||
      categories[categories.length - 1]
    );
  };

  const handleAddPerson = () => {
    if (!newPerson.name) {
      alert("Please enter a name");
      return;
    }

    const newMemberObj: Member = {
      id: Date.now().toString(),
      name: newPerson.name,
      email: newPerson.email,
      amountPaid: 0,
      avatarUrl: "/placeholder.svg?height=40&width=40",
    };

    setMembers([...members, newMemberObj]);
    setNewPerson({ name: "", email: "" });
    setShowAddPersonDialog(false);
  };

  return (
    <div className="max-w-7xl py-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Split Up Expense
          </h1>
          <p className="text-slate-500 mt-1">
            An extenstion to SpendLess that settle balances effortlessly within
            groups.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAddPersonDialog(true)}
            variant="outline"
          >
            <User className="h-4 w-4 mr-2" />
            Add Person
          </Button>
          <Button onClick={() => setActiveTab("current")}>
            <Plus className="h-4 w-4 mr-2" />
            New Split
          </Button>
        </div>
      </motion.div>

      <Tabs
        defaultValue="current"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
      >
        <TabsList className="mb-6 bg-slate-200">
          <TabsTrigger value="current">New Split</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settle">Settle Up</TabsTrigger>
          <TabsTrigger value="analytics">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex text-xl items-center">
                    <IndianRupee className="w-5 h-5 mr-2 text-primary" />
                    Bill Details
                  </CardTitle>
                  <CardDescription>
                    Enter the total bill amount and select a category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Total Bill Amount
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          type="number"
                          placeholder="Enter total amount"
                          className="pl-9"
                          value={totalBill === 0 ? "" : totalBill}
                          min={0}
                          onChange={(e) =>
                            setTotalBill(Number.parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Expense Category
                      </label>
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category, index) => (
                            <SelectItem
                              key={index}
                              value={category.id}
                              className="flex items-center"
                            >
                              <div className="flex items-center">
                                <span
                                  className="mr-2"
                                  style={{ color: category.color }}
                                >
                                  {category.icon}
                                </span>
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button onClick={addMember} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {members.length > 0 && (
              <motion.div variants={itemVariants} className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="flex text-xl items-center">
                      <Users className="w-5 h-5 mr-2 text-primary" />
                      Members
                    </CardTitle>
                    <Button size="sm" variant="outline" onClick={addMember}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="space-y-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {members.map((member, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 300,
                            damping: 24,
                          }}
                        >
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                              <label className="text-sm font-medium mb-1 block">
                                Member Name
                              </label>
                              <div className="relative">
                                <div
                                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full"
                                  style={{ backgroundColor: member.color }}
                                ></div>
                                <Input
                                  ref={
                                    index === members.length - 1
                                      ? newMemberRef
                                      : null
                                  }
                                  type="text"
                                  value={member.name}
                                  onChange={(e) =>
                                    updateMember(
                                      member.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  className="pl-9"
                                  placeholder="Enter name"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <label className="text-sm font-medium mb-1 block">
                                Amount Paid
                              </label>
                              <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                  type="number"
                                  value={member.amountPaid || ""}
                                  min={0}
                                  onChange={(e) =>
                                    updateMember(
                                      member.id,
                                      "amountPaid",
                                      Number.parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="pl-9"
                                  placeholder="Enter amount paid"
                                />
                              </div>
                            </div>
                            <div className="flex items-end">
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => removeMember(member.id)}
                                className="h-10 w-10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleCalculate}>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Settlements
                    </Button>

                    {isOpen ? (
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Transaction Name"
                          value={transactionName}
                          onChange={(e) => setTransactionName(e.target.value)}
                          className="w-48"
                        />
                        <Button onClick={handleSaveData}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={openInput}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Transaction
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {fairShare > 0 && (
              <motion.div variants={itemVariants} className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex text-xl items-center">
                      <Calculator className="w-5 h-5 mr-2 text-primary" />
                      Fair Share
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                      <span className="font-medium">Each person pays:</span>
                      <Badge
                        variant="outline"
                        className="text-lg font-semibold px-3 py-1 bg-white dark:bg-gray-800"
                      >
                        ₹{fairShare.toFixed(2)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {transactions.length > 0 && (
              <motion.div variants={itemVariants} className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex text-xl items-center">
                      <Receipt className="w-5 h-5 mr-2 text-primary" />
                      Settlement Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="space-y-3"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {transactions.map((transaction, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          whileHover="hover"
                        >
                          <motion.div variants={cardHoverVariants}>
                            <Card className="overflow-hidden border shadow-sm">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex w-full items-center gap-4">
                                    <Avatar className="h-10 w-10">
                                      <AvatarFallback className="bg-primary/10 text-primary">
                                        {transaction.from.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {transaction.from}
                                      </span>
                                      <span className="text-xs text-slate-500">
                                        owes
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex flex-col w-full items-center">
                                    <div className="font-bold text-lg">
                                      ₹{transaction.amount.toFixed(2)}
                                    </div>
                                    <motion.div
                                      className="w-16 h-1 bg-primary/30 rounded-full my-2"
                                      initial={{ width: 0 }}
                                      animate={{ width: "4rem" }}
                                      transition={{
                                        delay: 0.3 + index * 0.1,
                                        duration: 0.8,
                                      }}
                                    ></motion.div>
                                  </div>

                                  <div className="flex w-full items-center justify-end gap-4">
                                    <div className="flex flex-col items-end">
                                      <span className="font-medium">
                                        {transaction.to}
                                      </span>
                                      <span className="text-xs text-slate-500">
                                        receives
                                      </span>
                                    </div>
                                    <Avatar className="h-10 w-10">
                                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                                        {transaction.to.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* New Feature: Expense Visualization */}
            {members.length > 0 && transactions.length > 0 && (
              <motion.div variants={itemVariants} className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex text-xl items-center">
                      <PieChart className="w-5 h-5 mr-2 text-primary" />
                      Expense Visualization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      {/* Pie chart visualization */}
                      <div className="relative w-48 h-48 mb-6">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {members.map((member, index) => {
                            const percentage =
                              (member.amountPaid / totalBill) * 100;
                            const previousPercentages = members
                              .slice(0, index)
                              .reduce(
                                (sum, m) =>
                                  sum + (m.amountPaid / totalBill) * 100,
                                0
                              );

                            // Calculate the SVG arc parameters
                            const startAngle =
                              (previousPercentages / 100) * 360;
                            const endAngle =
                              ((previousPercentages + percentage) / 100) * 360;

                            // Convert angles to radians and calculate points
                            const startRad =
                              (startAngle - 90) * (Math.PI / 180);
                            const endRad = (endAngle - 90) * (Math.PI / 180);

                            const x1 = 50 + 40 * Math.cos(startRad);
                            const y1 = 50 + 40 * Math.sin(startRad);
                            const x2 = 50 + 40 * Math.cos(endRad);
                            const y2 = 50 + 40 * Math.sin(endRad);

                            // Determine if the arc should be drawn as a large arc
                            const largeArcFlag = percentage > 50 ? 1 : 0;

                            return (
                              <path
                                key={index}
                                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                fill={member.color}
                                stroke="white"
                                strokeWidth="1"
                              />
                            );
                          })}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-sm font-medium">Total</div>
                            <div className="text-xl font-bold">
                              ₹{totalBill}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="grid grid-cols-2 gap-2 w-full">
                        {members.map((member, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: member.color }}
                            ></div>
                            <div className="flex justify-between w-full">
                              <span className="text-sm">{member.name}</span>
                              <span className="text-sm font-medium">
                                ₹{member.amountPaid} (
                                {(
                                  (member.amountPaid / totalBill) *
                                  100
                                ).toFixed(1)}
                                %)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="history">
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex text-xl items-center">
                    <Filter className="w-5 h-5 mr-2 text-primary" />
                    Filter Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          type="text"
                          placeholder="Search transactions..."
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Category
                      </label>
                      <Select
                        value={filterCategory}
                        onValueChange={setFilterCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All categories</SelectItem>
                          {categories.map((category, index) => (
                            <SelectItem key={index} value={category.id}>
                              <div className="flex items-center">
                                <span
                                  className="mr-2"
                                  style={{ color: category.color }}
                                >
                                  {category.icon}
                                </span>
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Time Period
                      </label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger>
                          <SelectValue placeholder="All time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All time</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">Last 7 days</SelectItem>
                          <SelectItem value="month">Last 30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setFilterCategory("all");
                      setDateRange("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                  <Button variant="outline" onClick={exportTransactions}>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex text-xl items-center">
                    <Receipt className="w-5 h-5 mr-2 text-primary" />
                    Transaction History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : error ? (
                    <div className="p-4 bg-red-50 text-red-500 rounded-lg">
                      Error: {error}
                    </div>
                  ) : !filteredTransactions ||
                    filteredTransactions.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                      <History className="h-12 w-12 text-slate-300 mb-4 mx-auto" />
                      <h3 className="text-xl font-medium mb-2">
                        No transactions found
                      </h3>
                      <p className="text-slate-500 max-w-md mx-auto mb-6">
                        {searchQuery ||
                        filterCategory !== "all" ||
                        dateRange !== "all"
                          ? "Try adjusting your filters to find what you're looking for"
                          : "Create your first split to start tracking expenses!"}
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      className="space-y-4"
                      variants={containerVariants}
                    >
                      {filteredTransactions.map((transaction, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="border rounded-lg overflow-hidden"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 300,
                            damping: 24,
                          }}
                          whileHover="hover"
                        >
                          <motion.div variants={cardHoverVariants}>
                            <div
                              className="p-4 bg-gray-50 dark:bg-gray-800 cursor-pointer flex justify-between items-center"
                              onClick={() =>
                                handleTransactionClick(transaction._id)
                              }
                            >
                              <div className="flex items-center">
                                {transaction.category && (
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                                    style={{
                                      backgroundColor:
                                        getCategoryById(transaction.category)
                                          .color + "20",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: getCategoryById(
                                          transaction.category
                                        ).color,
                                      }}
                                    >
                                      {
                                        getCategoryById(transaction.category)
                                          .icon
                                      }
                                    </span>
                                  </div>
                                )}
                                <div>
                                  <h3 className="font-medium text-lg">
                                    {transaction.transactionName}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {formatDate(transaction.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Badge className="mr-3">
                                  ₹
                                  {transaction.members
                                    .reduce(
                                      (total, member) =>
                                        total + member.amountPaid,
                                      0
                                    )
                                    .toFixed(2)}
                                </Badge>
                                <Button variant="ghost" size="icon">
                                  {expandedTransactionId === transaction._id ? (
                                    <ChevronUp className="h-5 w-5" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </motion.div>

                          <AnimatePresence>
                            {expandedTransactionId === transaction._id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 bg-white dark:bg-gray-900">
                                  <h4 className="font-medium mb-2 flex items-center">
                                    <Users className="w-4 h-4 mr-2 text-primary" />
                                    Members
                                  </h4>
                                  <div className="space-y-2 mb-4">
                                    {transaction.members.map(
                                      (member, index) => (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                                        >
                                          <span>{member.name}</span>
                                          <Badge variant="outline">
                                            ₹{member.amountPaid.toFixed(2)}
                                          </Badge>
                                        </div>
                                      )
                                    )}
                                  </div>

                                  <Separator className="my-4" />

                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="text-sm font-medium">
                                        Total Amount:
                                      </p>
                                      <p className="text-lg font-bold">
                                        ₹
                                        {transaction.members
                                          .reduce(
                                            (total, member) =>
                                              total + member.amountPaid,
                                            0
                                          )
                                          .toFixed(2)}
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant="outline" size="sm">
                                              <Share2 className="w-4 h-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Share transaction</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={(e) =>
                                          handleDeleteData(transaction._id, e)
                                        }
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="settle">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Settling Debts</CardTitle>
                  <CardDescription>
                    Simplest way to settle expenses across all transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-6">
                    <motion.div
                      className="p-4 bg-primary/10 rounded-full"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <Calculator className="h-8 w-8 text-primary" />
                    </motion.div>
                  </div>

                  {transactions.length > 0 ? (
                    <div className="space-y-4">
                      {transactions.map((transaction, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.2 + index * 0.1,
                            duration: 0.5,
                          }}
                        >
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex w-full items-center gap-4">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {transaction.from.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {transaction.from}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      owes
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-col w-full items-center">
                                  <div className="font-bold text-lg">
                                    ₹{transaction.amount.toFixed(2)}
                                  </div>
                                  <motion.div
                                    className="w-16 h-1 bg-primary/30 rounded-full my-2"
                                    initial={{ width: 0 }}
                                    animate={{ width: "4rem" }}
                                    transition={{
                                      delay: 0.3 + index * 0.1,
                                      duration: 0.8,
                                    }}
                                  ></motion.div>
                                </div>

                                <div className="flex w-full items-center justify-end gap-4">
                                  <div className="flex flex-col items-end">
                                    <span className="font-medium">
                                      {transaction.to}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      receives
                                    </span>
                                  </div>
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                                      {transaction.to.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              </div>

                              <div className="mt-4 flex justify-end">
                                <Button size="sm" variant="outline">
                                  Mark as Settled
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <h3 className="text-lg font-medium mb-2">
                          All settled up!
                        </h3>
                        <p className="text-slate-500 mb-6">
                          Everyone is square with each other. No payments are
                          needed.
                        </p>
                        <Button onClick={() => setActiveTab("current")}>
                          Create New Split
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics">
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
          >
            {/* Summary Card */}
            <motion.div variants={itemVariants} className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex text-xl items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                    Spending Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-primary/10 rounded-lg text-center">
                      <p className="text-sm text-gray-500 mb-1">
                        Total Spending
                      </p>
                      <p className="text-2xl font-bold">
                        ₹{totalSpending.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                      <p className="text-sm text-gray-500 mb-1">Transactions</p>
                      <p className="text-2xl font-bold">
                        {pastTransactions.length}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                      <p className="text-sm text-gray-500 mb-1">
                        Avg. Transaction
                      </p>
                      <p className="text-2xl font-bold">
                        ₹
                        {pastTransactions.length
                          ? (totalSpending / pastTransactions.length).toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Spending by Category */}
            <motion.div variants={itemVariants} className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex text-xl items-center">
                    <PieChart className="w-5 h-5 mr-2 text-primary" />
                    Spending by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Pie Chart */}
                    <div className="relative w-48 h-48 mx-auto md:mx-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {Object.entries(spendingByCategory).map(
                          ([categoryId, amount], index) => {
                            const percentage = (amount / totalSpending) * 100;
                            const previousPercentages = Object.entries(
                              spendingByCategory
                            )
                              .slice(0, index)
                              .reduce(
                                (sum, [_, amt]) =>
                                  sum + (amt / totalSpending) * 100,
                                0
                              );

                            // Calculate the SVG arc parameters
                            const startAngle =
                              (previousPercentages / 100) * 360;
                            const endAngle =
                              ((previousPercentages + percentage) / 100) * 360;

                            // Convert angles to radians and calculate points
                            const startRad =
                              (startAngle - 90) * (Math.PI / 180);
                            const endRad = (endAngle - 90) * (Math.PI / 180);

                            const x1 = 50 + 40 * Math.cos(startRad);
                            const y1 = 50 + 40 * Math.sin(startRad);
                            const x2 = 50 + 40 * Math.cos(endRad);
                            const y2 = 50 + 40 * Math.sin(endRad);

                            // Determine if the arc should be drawn as a large arc
                            const largeArcFlag = percentage > 50 ? 1 : 0;

                            const category = getCategoryById(categoryId);

                            return (
                              <path
                                key={index}
                                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                fill={category.color}
                                stroke="white"
                                strokeWidth="1"
                              />
                            );
                          }
                        )}
                      </svg>
                    </div>

                    {/* Category List */}
                    <div className="flex-1 space-y-2">
                      {Object.entries(spendingByCategory).map(
                        ([categoryId, amount], index) => {
                          const category = getCategoryById(categoryId);
                          const percentage = (amount / totalSpending) * 100;

                          return (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span>{category.name}</span>
                                  <span className="font-medium">
                                    ₹{amount.toFixed(2)}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div
                                    className="h-2 rounded-full"
                                    style={{
                                      width: `${percentage}%`,
                                      backgroundColor: category.color,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Spending by Member */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex text-xl items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    Spending by Member
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(spendingByMember)
                      .sort(([_, amountA], [__, amountB]) => amountB - amountA)
                      .map(([memberName, amount], index) => {
                        const percentage = (amount / totalSpending) * 100;

                        return (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{memberName}</span>
                              <span>
                                ₹{amount.toFixed(2)} ({percentage.toFixed(1)}
                                %)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Add Person Dialog */}
      <Dialog open={showAddPersonDialog} onOpenChange={setShowAddPersonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Person</DialogTitle>
            <DialogDescription>
              Add a new person to split expenses with
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Enter name"
                value={newPerson.name}
                onChange={(e) =>
                  setNewPerson((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email (Optional)</label>
              <Input
                type="email"
                placeholder="Enter email"
                value={newPerson.email}
                onChange={(e) =>
                  setNewPerson((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddPersonDialog(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAddPerson}>
              Add Person
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettleUpApp;
