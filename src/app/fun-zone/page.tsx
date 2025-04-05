"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Clock,
  Gift,
  icons,
  LucideIcon,
  Medal,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import AnimatedProgress from "@/components/AnimatedProgress";
import ScrollReveal from "@/components/ScrollAnimation";
import CountUp from "react-countup";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const barVariants = {
  hidden: { height: 0 },
  visible: (height: number) => ({
    height,
    transition: { duration: 1.2, ease: "easeInOut" },
  }),
};

const listVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1, duration: 0.4 },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

type Challenge = {
  isCompleted: any;
  lastCompleted: any;
  id: number;
  title: string;
  description: string;
  icon: string;
  points: number;
  progress: number;
  total: number;
  daysLeft: number;
  difficulty: "easy" | "medium" | "hard";
  category: "savings" | "spending" | "investing";
};

type Reward = {
  id: number;
  title: string;
  description: string;
  pointsCost: number;
  image: string;
  category: "gift-card" | "cashback" | "discount" | "experience";
  featured?: boolean;
  brand?: string;
};

type RecentActivity = {
  id: string;
  type: string;
  category: string;
  title: string;
  points: number;
  date: Date;
};

type Achievements = {
  id: string;
  title: string;
  description: string;
  date: Date;
  icon: string;
};

type UserStats = {
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
  achievements: Achievements[];
  recentActivity: RecentActivity[];
};

type MonthlyPointsData = {
  month: string;
  earned: number;
  spent: number;
};

type WeeklyPointsDataData = {
  week: string;
  earned: number;
  spent: number;
};

const getLucideIcon = (iconName: string): LucideIcon | null => {
  return icons[iconName as keyof typeof icons] || null;
};

export default function FunZoneOverview() {
  const [featuredRewards, setRewards] = useState<Reward[]>([]);
  const [featuredChallenges, setChallenges] = useState<Challenge[]>([]);
  const [userStats, setuserStats] = useState<UserStats>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/challenges")
      .then((res) => res.json())
      .then((data) => {
        const sortedChallenges = data.sort((a: any, b: any) => {
          if (a.inProgress && !a.isCompleted) return -1;
          if (b.inProgress && !b.isCompleted) return 1;
          if (!a.inProgress && !a.isCompleted) return -1;
          if (!b.inProgress && !b.isCompleted) return 1;
          return 0;
        });
        const slicedChallenges = sortedChallenges.slice(0, 3);
        setChallenges(slicedChallenges);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/rewards")
      .then((res) => res.json())
      .then((data) => {
        const sortedRewards = data
          .sort((a: any, b: any) => a.pointsCost - b.pointsCost)
          .slice(0, 3);
        setRewards(sortedRewards);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/user-stats")
      .then((res) => res.json())
      .then((data) => {
        setuserStats(data);
        setLoading(false);
      });
  }, []);

  const [pointsHistory, setPointsHistory] = useState<{
    monthlyPoints: any;
    weeklyPoints: any;
  } | null>(null);

  const [monthlyPointsData, setMonthlyPointsData] = useState<
    MonthlyPointsData[]
  >([]);
  const [weeklyPointsData, setWeeklyPointsData] = useState<
    WeeklyPointsDataData[]
  >([]);

  useEffect(() => {
    fetch("/api/challenges/points-history")
      .then((res) => res.json())
      .then((data) => {
        setMonthlyPointsData(data.monthlyPoints);
        setWeeklyPointsData(data.weeklyPoints);
        setPointsHistory(data);
        setLoading(false);
      })
      .catch((error) =>
        console.error("Error fetching challenge points:", error)
      );
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-[75vh]">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {userStats && (
            <div className="container py-8 max-w-7xl">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Savings Arena Dashboard
                  </h1>
                  <p className="text-slate-500 mt-1">
                    Track your progress, complete challenges, and earn rewards
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-2 rounded-lg shadow-sm">
                    <Star className="h-5 w-5 text-amber-500" />
                    <div>
                      <div className="text-sm text-slate-600">Your Points</div>
                      <div className="font-bold text-amber-700">
                        <CountUp
                          start={0}
                          end={userStats.currentPoints}
                          separator=","
                          duration={1.5}
                        />
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.025 }}
                    whileTap={{ scale: 0.975 }}
                    onClick={() => window.open(`/fun-zone/rewards`, "_self")}
                    className="px-4 py-2 flex rounded-md bg-primary text-white"
                  >
                    <Gift className="h-4 w-4 mt-1 mr-2" />
                    Redeem
                  </motion.button>
                </div>
              </div>

              {/* Key Metrics */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
              >
                {/* Savings Progress Card */}
                <motion.div variants={cardVariants}>
                  <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-0 shadow-md shadow-emerald-100/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-emerald-800">
                        Savings Progress
                      </CardTitle>
                      <CardDescription className="text-emerald-700">
                        Towards your monthly goal
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-emerald-800">
                            ₹
                            <CountUp
                              start={0}
                              end={userStats.currentSavings}
                              separator=","
                              duration={1.5}
                            />
                          </span>
                          <span className="font-medium text-emerald-800">
                            ₹{userStats.savingsGoal.toLocaleString()}
                          </span>
                        </div>
                        <AnimatedProgress
                          value={
                            (userStats.currentSavings / userStats.savingsGoal) *
                            100
                          }
                          className="bg-emerald-200"
                        />
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-2xl font-bold text-emerald-900">
                            <CountUp
                              start={0}
                              end={Math.round(
                                (userStats.currentSavings /
                                  userStats.savingsGoal) *
                                  100
                              )}
                              duration={1.5}
                            />
                            %
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.025 }}
                            whileTap={{ scale: 0.975 }}
                            className="text-emerald-700 hover:text-emerald-900 hover:bg-emerald-200/50 p-2 rounded-md text-xs font-semibold"
                          >
                            View Details
                          </motion.button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Challenge Streak Card */}
                <motion.div variants={cardVariants}>
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-md shadow-blue-100/50 h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-blue-800">
                        Challenge Streak
                      </CardTitle>
                      <CardDescription className="text-blue-700">
                        Consecutive days active
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-4xl font-bold text-blue-900">
                          <CountUp
                            start={0}
                            end={userStats.streakDays}
                            duration={1.5}
                          />
                        </div>
                        <div className="p-2 bg-blue-200/50 rounded-full">
                          <Zap className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-blue-700">
                        {userStats.streakDays >= 30 ? (
                          <span>You've reached a monthly streak! 🎉</span>
                        ) : (
                          <span>
                            <CountUp
                              start={30}
                              end={30 - userStats.streakDays}
                              duration={1.5}
                            />{" "}
                            more days until your monthly badge
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Next Reward Card */}
                <motion.div variants={cardVariants}>
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-md shadow-purple-100/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-purple-800">
                        Next Reward
                      </CardTitle>
                      <CardDescription className="text-purple-700">
                        Points needed for your goal
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-purple-800">
                            <CountUp
                              start={0}
                              end={userStats.currentPoints}
                              separator=","
                              duration={1.5}
                            />{" "}
                            points
                          </span>
                          <span className="font-medium text-purple-800">
                            {userStats.nextRewardPoints.toLocaleString()} points
                          </span>
                        </div>
                        <AnimatedProgress
                          value={
                            (userStats.currentPoints /
                              userStats.nextRewardPoints) *
                            100
                          }
                          className="bg-purple-200"
                        />
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-purple-800">
                            <span className="font-bold">
                              <CountUp
                                start={0}
                                end={
                                  userStats.nextRewardPoints -
                                  userStats.currentPoints
                                }
                                separator=","
                                duration={1.5}
                              />
                            </span>{" "}
                            more points needed
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.025 }}
                            whileTap={{ scale: 0.975 }}
                            onClick={() =>
                              window.open(`/fun-zone/rewards`, "_self")
                            }
                            className="text-purple-700 hover:text-purple-900 hover:bg-purple-200/50 p-2 rounded-md text-xs font-semibold"
                          >
                            Browse Rewards
                          </motion.button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Points Activity Chart */}
              <ScrollReveal variants={cardVariants}>
                {(isInView) => (
                  <Card className="mb-8">
                    <Tabs defaultValue="monthly" className="w-auto">
                      <div className="flex items-center justify-between mt-6 mx-6">
                        <CardTitle>Points Activity</CardTitle>
                        <TabsList>
                          <TabsTrigger value="monthly">Monthly</TabsTrigger>
                          <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        </TabsList>
                      </div>
                      <TabsContent value="monthly" className="mt-4">
                        <CardContent>
                          {/* Animated Bar Chart */}
                          <div className="h-[200px] w-full flex items-end justify-between gap-2 pt-4">
                            {monthlyPointsData.map((month) => {
                              const maxHeight = 150;
                              const barHeight =
                                (month.earned /
                                  Math.max(
                                    ...monthlyPointsData.map((m) => m.earned)
                                  )) *
                                maxHeight;

                              return (
                                <div
                                  key={month.month}
                                  className="flex flex-col items-center gap-2"
                                >
                                  <motion.div
                                    className="w-12 bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-md"
                                    custom={barHeight}
                                    initial="hidden"
                                    animate={isInView ? "visible" : "hidden"}
                                    variants={barVariants}
                                    style={{
                                      minHeight:
                                        month.earned > 0 ? "20px" : "0px",
                                    }}
                                  />
                                  <div className="text-xs font-medium">
                                    {month.month}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {month.earned > 0 ? (
                                      isInView ? (
                                        <CountUp
                                          start={0}
                                          end={month.earned}
                                          separator=","
                                          duration={1.5}
                                        />
                                      ) : (
                                        0
                                      )
                                    ) : (
                                      "-"
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Footer Section */}
                          <div className="mt-4 pt-4 border-t flex items-center justify-between">
                            <div className="text-sm text-slate-500">
                              <span className="font-medium text-slate-700">
                                {isInView ? (
                                  <CountUp
                                    start={0}
                                    end={userStats.thisMonthEarned}
                                    separator=","
                                    duration={1.5}
                                  />
                                ) : (
                                  0
                                )}
                              </span>{" "}
                              points earned this month
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.025 }}
                              whileTap={{ scale: 0.975 }}
                              onClick={() =>
                                window.open(`/fun-zone/history`, "_self")
                              }
                              className="flex items-center gap-2 px-3 py-1.5 border rounded-md text-xs font-semibold text-slate-900 hover:bg-slate-100 transition"
                            >
                              <BarChart3 className="h-4 w-4" />
                              View Full Report
                            </motion.button>
                          </div>
                        </CardContent>
                      </TabsContent>
                      <TabsContent value="weekly" className="mt-4">
                        <CardContent>
                          {/* Animated Bar Chart */}
                          <div className="h-[200px] w-full flex items-end justify-between gap-2 pt-4">
                            {weeklyPointsData.map((week) => {
                              const maxHeight = 150;
                              const barHeight =
                                (week.earned /
                                  Math.max(
                                    ...weeklyPointsData.map((w) => w.earned)
                                  )) *
                                maxHeight;

                              return (
                                <div
                                  key={week.week}
                                  className="flex flex-col items-center gap-2"
                                >
                                  <motion.div
                                    className="w-12 bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-md"
                                    custom={barHeight}
                                    initial="hidden"
                                    animate={isInView ? "visible" : "hidden"}
                                    variants={barVariants}
                                    style={{
                                      minHeight:
                                        week.earned > 0 ? "20px" : "0px",
                                    }}
                                  />
                                  <div className="text-xs font-medium">
                                    {week.week}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {week.earned > 0 ? (
                                      isInView ? (
                                        <CountUp
                                          start={0}
                                          end={week.earned}
                                          separator=","
                                          duration={1.5}
                                        />
                                      ) : (
                                        0
                                      )
                                    ) : (
                                      "-"
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Footer Section */}
                          <div className="mt-4 pt-4 border-t flex items-center justify-between">
                            <div className="text-sm text-slate-500">
                              <span className="font-medium text-slate-700">
                                {isInView ? (
                                  <CountUp
                                    start={0}
                                    end={userStats.thisMonthEarned}
                                    separator=","
                                    duration={1.5}
                                  />
                                ) : (
                                  0
                                )}
                              </span>{" "}
                              points earned this month
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.025 }}
                              whileTap={{ scale: 0.975 }}
                              onClick={() =>
                                window.open(`/fun-zone/rewards`, "_self")
                              }
                              className="flex items-center gap-2 px-3 py-1.5 border rounded-md text-xs font-semibold text-slate-900 hover:bg-slate-100 transition"
                            >
                              <BarChart3 className="h-4 w-4" />
                              View Full Report
                            </motion.button>
                          </div>
                        </CardContent>
                      </TabsContent>
                    </Tabs>
                  </Card>
                )}
              </ScrollReveal>

              {/* Quick Access Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Featured Challenges */}
                <ScrollReveal variants={cardVariants}>
                  {(isInView) => (
                    <Card className="h-full">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>Featured Challenges</CardTitle>
                          <Link
                            href="/fun-zone/challenges"
                            className="text-sm text-primary hover:underline"
                          >
                            View All
                          </Link>
                        </div>
                        <CardDescription>
                          Complete these challenges to earn more points
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {featuredChallenges.map((challenge, index) => {
                            const IconComponent = getLucideIcon(challenge.icon);
                            return (
                              <motion.div
                                key={challenge.id}
                                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                                custom={index}
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                                variants={listVariants}
                              >
                                <div
                                  className={`p-2 rounded-lg shrink-0 ${
                                    challenge.category === "savings"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : challenge.category === "spending"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-purple-100 text-purple-700"
                                  }`}
                                >
                                  {IconComponent ? (
                                    <IconComponent className="h-5 w-5" />
                                  ) : (
                                    <p>🚫</p>
                                  )}{" "}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-medium text-sm">
                                      {challenge.title}
                                    </h3>
                                    <div className="flex items-center shrink-0">
                                      <Star className="h-3 w-3 text-amber-500 mr-1" />
                                      <span className="text-xs font-medium">
                                        {challenge.points}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mt-1">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="text-slate-500">
                                        Progress
                                      </span>
                                      <span className="text-slate-700">
                                        {isInView ? (
                                          <CountUp
                                            start={0}
                                            end={challenge.progress}
                                            separator=","
                                            duration={1.5}
                                          />
                                        ) : (
                                          0
                                        )}{" "}
                                        / {challenge.total}
                                      </span>
                                    </div>
                                    <AnimatedProgress
                                      isInView={isInView}
                                      value={
                                        (challenge.progress / challenge.total) *
                                        100
                                      }
                                      className="bg-gray-200"
                                    />
                                  </div>
                                  <div className="mt-2 flex items-center text-xs text-slate-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {challenge.daysLeft} days left
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() =>
                            window.open(`/fun-zone/challenges`, "_self")
                          }
                          className="w-full px-3 py-2 rounded-md bg-primary text-white"
                        >
                          Start New Challenge
                        </motion.button>
                      </CardFooter>
                    </Card>
                  )}
                </ScrollReveal>

                {/* Stats & Achievements */}
                <ScrollReveal variants={cardVariants} className="grid gap-4">
                  {(isInView) => (
                    <>
                      {/* Stats Summary */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>Your Stats</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              {
                                icon: Trophy,
                                label: "Challenges Completed",
                                value: userStats.challengesCompleted,
                                color: "emerald",
                              },
                              {
                                icon: Target,
                                label: "In Progress",
                                value: userStats.challengesInProgress,
                                color: "blue",
                              },
                              {
                                icon: Gift,
                                label: "Rewards Redeemed",
                                value: userStats.rewardsRedeemed,
                                color: "amber",
                              },
                              {
                                icon: Medal,
                                label: "Current Rank",
                                value: userStats.rank,
                                color: "purple",
                              },
                            ].map((stat, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center gap-3"
                                custom={index}
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                                variants={listVariants}
                              >
                                <div
                                  className={`p-2 bg-${stat.color}-100 rounded-full`}
                                >
                                  <stat.icon
                                    className={`h-4 w-4 text-${stat.color}-600`}
                                  />
                                </div>
                                <div>
                                  <div className="text-sm text-slate-500">
                                    {stat.label}
                                  </div>
                                  <div className="font-bold">
                                    {" "}
                                    {stat.label === "Current Rank" ? "#" : ""}
                                    {isInView ? (
                                      <CountUp
                                        start={0}
                                        end={stat.value}
                                        separator=","
                                        duration={1.5}
                                      />
                                    ) : (
                                      0
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Featured Rewards */}
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle>Popular Rewards</CardTitle>
                            <Link
                              href="/fun-zone/rewards"
                              className="text-sm text-primary hover:underline"
                            >
                              View All
                            </Link>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-3">
                            {featuredRewards.map((reward, index) => (
                              <motion.div
                                key={reward.id}
                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                                custom={index}
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                                variants={listVariants}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center overflow-hidden">
                                    <Image
                                      src={reward.image || "/placeholder.svg"}
                                      alt={reward.title}
                                      width={60}
                                      height={60}
                                      className="object-contain rounded"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-sm">
                                      {reward.title}
                                    </h3>
                                    <div className="flex items-center text-xs text-slate-500 mt-1">
                                      <Star className="h-3 w-3 text-amber-500 mr-1" />
                                      {reward.pointsCost.toLocaleString()}{" "}
                                      points
                                    </div>
                                  </div>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.025 }}
                                  whileTap={{ scale: 0.975 }}
                                  onClick={() =>
                                    window.open(`/fun-zone/rewards`, "_self")
                                  }
                                  className={`px-3 py-1 rounded text-sm ${
                                    userStats.currentPoints >= reward.pointsCost
                                      ? "bg-primary text-white"
                                      : "border border-gray-300 text-gray-600"
                                  }`}
                                  disabled={
                                    userStats.currentPoints < reward.pointsCost
                                  }
                                >
                                  Redeem
                                </motion.button>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </ScrollReveal>
              </div>

              {/* Recent Activity & Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <ScrollReveal variants={cardVariants}>
                  {(isInView) => (
                    <Card className="h-full flex flex-col justify-between">
                      <CardHeader className="pb-3">
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <motion.div
                          variants={listVariants}
                          initial="hidden"
                          animate={isInView ? "visible" : "hidden"}
                        >
                          {userStats.recentActivity.length === 0 ? (
                            "No Recent Activity found"
                          ) : (
                            <>
                              {userStats.recentActivity.map(
                                (activity, index) => (
                                  <motion.div
                                    key={activity.id}
                                    variants={itemVariants}
                                    className="flex items-start gap-3 pb-3"
                                    custom={index}
                                    initial="hidden"
                                    animate={isInView ? "visible" : "hidden"}
                                  >
                                    <div
                                      className={`p-2 rounded-full shrink-0 ${
                                        activity.category === "challenge"
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-amber-100 text-amber-700"
                                      }`}
                                    >
                                      {activity.category === "challenge" ? (
                                        <Trophy className="h-4 w-4" />
                                      ) : (
                                        <Gift className="h-4 w-4" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-medium text-sm">
                                          {activity.title}
                                        </h3>
                                        <div
                                          className={`text-xs font-medium ${
                                            activity.points > 0
                                              ? "text-emerald-600"
                                              : "text-amber-600"
                                          }`}
                                        >
                                          {activity.points > 0 ? "+" : ""}
                                          {activity.points} points
                                        </div>
                                      </div>
                                      <div className="text-xs text-slate-500 mt-1">
                                        {new Date(
                                          activity.date
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "2-digit",
                                          year: "numeric",
                                        })}
                                      </div>
                                    </div>
                                  </motion.div>
                                )
                              )}
                            </>
                          )}
                        </motion.div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() =>
                            window.open(`/fun-zone/history`, "_self")
                          }
                          className="w-full border rounded-md py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                        >
                          View All Activity
                        </motion.button>
                      </CardFooter>
                    </Card>
                  )}
                </ScrollReveal>

                {/* Achievements */}
                <ScrollReveal variants={cardVariants}>
                  {(isInView) => (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle>Recent Achievements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <motion.div
                          variants={listVariants}
                          initial="hidden"
                          animate={isInView ? "visible" : "hidden"}
                        >
                          {userStats.achievements.length === 0 ? (
                            "No Achievements found"
                          ) : (
                            <>
                              {userStats.achievements.map(
                                (achievement, index) => {
                                  const IconComponent = getLucideIcon(
                                    achievement.icon
                                  );
                                  return (
                                    <motion.div
                                      key={achievement.id}
                                      variants={itemVariants}
                                      className="flex items-start gap-3 pb-3"
                                      custom={index}
                                      initial="hidden"
                                      animate={isInView ? "visible" : "hidden"}
                                    >
                                      <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shrink-0">
                                        {IconComponent ? (
                                          <IconComponent className="h-4 w-4 text-amber-700" />
                                        ) : (
                                          <p>🚫</p>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                          <h3 className="font-medium text-sm">
                                            {achievement.title}
                                          </h3>
                                          <Badge
                                            variant="outline"
                                            className="text-xs border-amber-200 text-amber-700"
                                          >
                                            Achievement
                                          </Badge>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                          {achievement.description}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                          Earned on{" "}
                                          {new Date(
                                            achievement.date
                                          ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "2-digit",
                                            year: "numeric",
                                          })}
                                        </div>
                                      </div>
                                    </motion.div>
                                  );
                                }
                              )}
                            </>
                          )}
                        </motion.div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          // onClick={() => window.open(`/fun-zone/rewards`, "_self")}
                          className="w-full border rounded-md py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                        >
                          View All Achievements
                        </motion.button>
                      </CardFooter>
                    </Card>
                  )}
                </ScrollReveal>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
