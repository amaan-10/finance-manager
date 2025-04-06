"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Receipt, Users, ArrowRight } from "lucide-react";

export default function ExpenseSplitDemo() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const expenses = [
    {
      id: 1,
      title: "Dinner at Olive Garden",
      amount: 120,
      paidBy: "Amit",
      date: "June 10",
      category: "Food",
    },
    {
      id: 2,
      title: "Movie tickets",
      amount: 45,
      paidBy: "Sara",
      date: "June 8",
      category: "Entertainment",
    },
    {
      id: 3,
      title: "Groceries",
      amount: 85,
      paidBy: "Muskan",
      date: "June 5",
      category: "Food",
    },
  ];

  const balances = [
    { name: "Amit", avatar: "A", balance: 65, color: "bg-green-500" },
    { name: "Sara", avatar: "S", balance: -15, color: "bg-red-500" },
    { name: "Muskan", avatar: "M", balance: 25, color: "bg-green-500" },
    { name: "Jay", avatar: "J", balance: -75, color: "bg-red-500" },
  ];

  return (
    <div className="p-6 bg-background h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
            <Users className="h-4 w-4 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold">Roommates Group</h3>
        </div>
        <Button size="sm" variant="outline" className="gap-1">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <Tabs
        defaultValue="expenses"
        className="mb-6"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="mt-4 space-y-4">
          <AnimatePresence>
            {expenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Receipt className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{expense.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{expense.date}</span>
                            <span>•</span>
                            <Badge
                              variant="outline"
                              className="rounded-sm text-xs"
                            >
                              {expense.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">₹{expense.amount}</div>
                        <div className="text-sm text-muted-foreground">
                          Paid by {expense.paidBy}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="balances" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Current Balances</CardTitle>
              <CardDescription>Who owes who in the group</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {balances.map((person, index) => (
                  <motion.div
                    key={person.name}
                    initial={{ opacity: 0, x: person.balance > 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{person.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{person.name}</span>
                    </div>
                    <div
                      className={`font-bold ${
                        person.balance >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {person.balance >= 0 ? "+" : ""}
                      {person.balance}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Suggested Settlements</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>Jay</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>Amit</span>
                    </div>
                    <div>₹650</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>Sara</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>Muskan</span>
                    </div>
                    <div>₹150</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>
                Latest transactions and settlements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "added an expense",
                    user: "Amit",
                    item: "Dinner at Olive Garden",
                    time: "2 hours ago",
                  },
                  {
                    action: "settled up with",
                    user: "Jay",
                    item: "Muskan",
                    amount: 30,
                    time: "1 day ago",
                  },
                  {
                    action: "added an expense",
                    user: "Sara",
                    item: "Movie tickets",
                    time: "2 days ago",
                  },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{activity.user[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          {activity.action}{" "}
                        </span>
                        <span className="font-medium">{activity.item}</span>
                        {activity.amount && <span> (₹{activity.amount})</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activity.time}
                      </div>
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
