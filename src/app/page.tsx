"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  PieChart,
  Wallet,
  Users,
  Trophy,
  TrendingUp,
  Shield,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BudgetDemo from "@/components/BudgetDemo";
import ExpenseSplitDemo from "@/components/ExpenseSplitDemo";
import InvestmentDemo from "@/components/InvestmentDemo";
import ChallengesDemo from "@/components/ChallengesDemo";
import SpendingAnalyticsDemo from "@/components/SpendingAnalyticsDemo";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen mx-[-40px]">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-10 relative overflow-hidden">
          <div className={`absolute inset-0 z-0 overflow-hidden`}>
            <motion.div
              className="absolute inset-0 -z-10 h-full w-full "
              style={{
                backgroundImage: `
            radial-gradient(circle at 100% 0%, rgba(0, 136, 254, 0.1) 0%, transparent 25%),
            radial-gradient(circle at 0% 50%, rgba(0, 196, 159, 0.1) 0%, transparent 25%),
            radial-gradient(circle at 50% 100%, rgba(255, 187, 40, 0.1) 0%, transparent 25%)
          `,
              }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(136, 132, 216, 0.08) 0%, transparent 50%)
            `,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 0.9, 0.7],
                }}
                transition={{
                  duration: 15,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
              radial-gradient(circle at 80% 20%, rgba(255, 128, 66, 0.08) 0%, transparent 50%)
            `,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            </motion.div>
          </div>
          <div className="container relative z-10 py-24 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  Smart Finance,{" "}
                  <span className="text-primary">Simplified</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-md">
                  Track budgets, analyze spending, grow investments, and split
                  expenses—all in one beautiful app.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="group"
                    onClick={() => {
                      window.open("/finance", "_self");
                    }}
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      window.open("#how-it-works", "_self");
                    }}
                  >
                    See Demo
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="relative aspect-square md:aspect-[4/3] overflow-y-scroll rounded-lg border bg-background shadow-xl">
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-full">
                        Loading...
                      </div>
                    }
                  >
                    <BudgetDemo />
                  </Suspense>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-primary/10 backdrop-blur-sm rounded-full p-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-10 py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  All-in-One Financial Platform
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Everything you need to take control of your finances in one
                  beautiful app.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Smart Budget Tracking",
                  description:
                    "Set, track, and achieve your financial goals with intelligent budget categories.",
                  icon: <PieChart className="h-6 w-6" />,
                  color: "bg-blue-500/10",
                  textColor: "text-blue-500",
                },
                {
                  title: "Spending Analytics",
                  description:
                    "Visualize your spending patterns and identify opportunities to save.",
                  icon: <BarChart3 className="h-6 w-6" />,
                  color: "bg-purple-500/10",
                  textColor: "text-purple-500",
                },
                {
                  title: "Investment Portfolio",
                  description:
                    "Track and grow your investments with real-time data and insights.",
                  icon: <TrendingUp className="h-6 w-6" />,
                  color: "bg-green-500/10",
                  textColor: "text-green-500",
                },
                {
                  title: "Expense Splitting",
                  description:
                    "Easily split bills with friends and track who owes what.",
                  icon: <Users className="h-6 w-6" />,
                  color: "bg-orange-500/10",
                  textColor: "text-orange-500",
                },
                {
                  title: "Rewards & Challenges",
                  description:
                    "Complete financial challenges and earn rewards for healthy money habits.",
                  icon: <Trophy className="h-6 w-6" />,
                  color: "bg-pink-500/10",
                  textColor: "text-pink-500",
                },
                {
                  title: "Secure Transactions",
                  description:
                    "Bank-level security keeps your financial data safe and protected.",
                  icon: <CreditCard className="h-6 w-6" />,
                  color: "bg-cyan-500/10",
                  textColor: "text-cyan-500",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full transition-all hover:shadow-md">
                    <CardHeader>
                      <div
                        className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                          feature.color
                        )}
                      >
                        <div className={feature.textColor}>{feature.icon}</div>
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="ghost" className="group">
                        Learn more
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* App Demo Section */}
        <section id="how-it-works" className="px-10 py-20">
          <div className="container">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  See SpendLess in Action
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Explore our powerful features and see how they can transform
                  your financial life.
                </p>
              </motion.div>
            </div>

            <Tabs defaultValue="budget" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-full max-w-2xl bg-slate-200">
                  <TabsTrigger value="budget">Budget</TabsTrigger>
                  <TabsTrigger value="spending">Spending</TabsTrigger>
                  <TabsTrigger value="invest">Invest</TabsTrigger>
                  <TabsTrigger value="challenges">Challenges</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="budget" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-2xl font-bold mb-4">
                      Smart Budget Tracking
                    </h3>
                    <ul className="space-y-4">
                      {[
                        "Create custom budget categories that fit your lifestyle",
                        "Set monthly, weekly, or custom period budgets",
                        "Get real-time alerts when approaching budget limits",
                        "Visualize spending vs. budget with beautiful charts",
                        "Receive AI-powered suggestions to optimize your budget",
                      ].map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <ArrowRight className="h-3 w-3 text-primary" />
                          </div>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <Button
                      className="mt-8 group"
                      onClick={() => {
                        window.open("/finance/budgets", "_self");
                      }}
                    >
                      Try Budget Tracking
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative rounded-lg overflow-hidden border shadow-lg"
                  >
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center h-[400px]">
                          Loading...
                        </div>
                      }
                    >
                      <BudgetDemo />
                    </Suspense>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="spending" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-2xl font-bold mb-4">
                      Spending Analytics
                    </h3>
                    <ul className="space-y-4">
                      {[
                        "Track all your expenses in one place automatically",
                        "Categorize transactions with AI-powered suggestions",
                        "Identify spending trends with interactive charts",
                        "Compare month-to-month spending patterns",
                        "Discover opportunities to save with personalized insights",
                      ].map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="h-6 w-6 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <ArrowRight className="h-3 w-3 text-purple-500" />
                          </div>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <Button
                      className="mt-8 group"
                      onClick={() => {
                        window.open("/finance/expenses", "_self");
                      }}
                    >
                      Explore Analytics
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative rounded-lg overflow-hidden border shadow-lg"
                  >
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center h-[400px]">
                          Loading...
                        </div>
                      }
                    >
                      <SpendingAnalyticsDemo />
                    </Suspense>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="invest" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-2xl font-bold mb-4">
                      Investment Portfolio
                    </h3>
                    <ul className="space-y-4">
                      {[
                        "Track all your investments in one unified dashboard",
                        "Monitor performance with real-time data updates",
                        "Analyze asset allocation and diversification",
                        "Set investment goals and track progress",
                        "Get personalized investment recommendations",
                      ].map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <ArrowRight className="h-3 w-3 text-green-500" />
                          </div>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <Button
                      className="mt-8 group"
                      onClick={() => {
                        window.open("/finance/investments", "_self");
                      }}
                    >
                      Start Investing
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative rounded-lg overflow-hidden border shadow-lg"
                  >
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center h-[400px]">
                          Loading...
                        </div>
                      }
                    >
                      <InvestmentDemo />
                    </Suspense>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="challenges" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-2xl font-bold mb-4">
                      Gamified Challenges
                    </h3>
                    <ul className="space-y-4">
                      {[
                        "Complete financial challenges to build healthy habits",
                        "Earn points and rewards for achieving financial goals",
                        "Compete with friends on leaderboards",
                        "Unlock achievements for financial milestones",
                        "Redeem points for real-world rewards and discounts",
                      ].map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="h-6 w-6 rounded-full bg-pink-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <ArrowRight className="h-3 w-3 text-pink-500" />
                          </div>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <Button
                      className="mt-8 group"
                      onClick={() => {
                        window.open("/arena/challenges", "_self");
                      }}
                    >
                      Join Challenges
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative rounded-lg overflow-hidden border shadow-lg"
                  >
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center h-[400px]">
                          Loading...
                        </div>
                      }
                    >
                      <ChallengesDemo />
                    </Suspense>
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Split Expenses Section */}
        <section className="px-10 py-20 bg-muted/50">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative rounded-lg overflow-hidden border shadow-lg order-2 md:order-1"
              >
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-[400px]">
                      Loading...
                    </div>
                  }
                >
                  <ExpenseSplitDemo />
                </Suspense>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="order-1 md:order-2"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Split Expenses Effortlessly
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  No more awkward money conversations or complicated
                  calculations. Split bills with friends, roommates, or family
                  with just a few taps.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Create groups for different occasions or relationships",
                    "Split bills equally or with custom amounts",
                    "Track who paid what and who owes whom",
                    "Settle debts with integrated payment options",
                    "View expense history and generate reports",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="h-6 w-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3 text-orange-500" />
                      </div>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  className="group"
                  onClick={() => {
                    window.open("/split-up", "_self");
                  }}
                >
                  Try Expense Splitting
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {/* <section id="testimonials" className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  What Our Users Say
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of happy users who have transformed their
                  financial lives with SpendLess.
                </p>
              </motion.div>
            </div>

            <Suspense
              fallback={
                <div className="flex items-center justify-center h-[300px]">
                  Loading testimonials...
                </div>
              }
            >
              <Testimonials />
            </Suspense>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="px-10 py-20 bg-primary/5">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Transform Your Finances?
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Join thousands of users who have taken control of their
                  financial future with SpendLess.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="group"
                    onClick={() => {
                      window.open("/finance", "_self");
                    }}
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t px-10 pt-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 font-normal"
                  viewBox="0 0 24 24"
                  fill="black"
                >
                  <path d="m6,9c-3.421,0-6,1.505-6,3.5v8c0,1.995,2.579,3.5,6,3.5s6-1.505,6-3.5v-8c0-1.995-2.579-3.5-6-3.5Zm4,7.5c0,.529-1.519,1.5-4,1.5s-4-.971-4-1.5v-1.348c1.046.533,2.435.848,4,.848s2.954-.315,4-.848v1.348Zm-4-5.5c2.481,0,4,.971,4,1.5s-1.519,1.5-4,1.5-4-.971-4-1.5,1.519-1.5,4-1.5Zm0,11c-2.481,0-4-.971-4-1.5v-1.348c1.046.533,2.435.848,4,.848s2.954-.315,4-.848v1.348c0,.529-1.519,1.5-4,1.5ZM24,5v14c0,2.757-2.243,5-5,5h-5c-.553,0-1-.448-1-1s.447-1,1-1h5c1.654,0,3-1.346,3-3V5c0-1.654-1.346-3-3-3h-10c-1.654,0-3,1.346-3,3v1c0,.552-.447,1-1,1s-1-.448-1-1v-1C4,2.243,6.243,0,9,0h10c2.757,0,5,2.243,5,5Zm-11,5c-.553,0-1-.448-1-1s.447-1,1-1h5v-2h-8v.5c0,.552-.447,1-1,1s-1-.448-1-1v-.5c0-1.103.897-2,2-2h8c1.103,0,2,.897,2,2v2c0,1.103-.897,2-2,2h-5Zm1,8c0-.552.447-1,1-1h4c.553,0,1,.448,1,1s-.447,1-1,1h-4c-.553,0-1-.448-1-1Zm0-4v-1c0-.552.447-1,1-1s1,.448,1,1v1c0,.552-.447,1-1,1s-1-.448-1-1Zm6,0c0,.552-.447,1-1,1s-1-.448-1-1v-1c0-.552.447-1,1-1s1,.448,1,1v1Z" />
                </svg>
                <span className="text-xl font-bold">SpendLess</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Smart finance tools to help you budget, save, invest, and
                achieve your financial goals.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-gray-200"
                >
                  <FontAwesomeIcon icon={faFacebookF} className="h-6 w-6" />
                  <span className="sr-only">Facebook</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-gray-200"
                >
                  <FontAwesomeIcon icon={faXTwitter} className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-gray-200"
                >
                  <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
