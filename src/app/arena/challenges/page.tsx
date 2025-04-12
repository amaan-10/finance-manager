"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  ChevronRight,
  CreditCard,
  icons,
  type LucideIcon,
  Star,
  Trophy,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChallengeCard from "@/components/ChallengeCard";
import { AnimatePresence, motion } from "framer-motion";
import CountUp from "react-countup";
import ScrollReveal from "@/components/ScrollAnimation";
import { useToast } from "@/hooks/use-toast";

// Types
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
};

const getLucideIcon = (iconName: string): LucideIcon | null => {
  return icons[iconName as keyof typeof icons] || null;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.2, duration: 0.5 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const iconVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 10 },
  },
};

// Component
export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchChallenges = async () => {
    fetch("/api/challenges")
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const [userStats, setuserStats] = useState<UserStats>();
  useEffect(() => {
    fetch("/api/user-stats")
      .then((res) => res.json())
      .then((data) => {
        setuserStats(data);
        setLoading(false);
      });
  }, []);

  // console.log(challenges);

  const startChallenge = async (challenge: Challenge) => {
    try {
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(challenge),
      });

      if (!res.ok) throw new Error("Failed to start challenge");

      fetchChallenges();

      toast({
        description: "The challenge is now live!",
        className: "bg-neutral-900 border-neutral-900 text-white",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Filter challenges based on category
  const filteredChallenges = challenges.filter((challenge) => {
    return activeCategory === "all" || challenge.category === activeCategory;
  });

  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    return a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1;
  });

  const userPoints = userStats?.currentPoints || 0;

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-[95vh]">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="container max-w-7xl pt-32 pb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Challenges</h1>
              <p className="text-slate-500 mt-1">
                Complete challenges to earn points and redeem for rewards
              </p>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-2 rounded-lg shadow-sm">
              <Star className="h-5 w-5 text-amber-500" />
              <div>
                <div className="text-sm text-slate-600">Your Points</div>
                <div className="font-bold text-amber-700 text-lg">
                  <CountUp
                    start={0}
                    end={userPoints}
                    separator=","
                    duration={1.5}
                    delay={0.5}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Challenges Tab */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          >
            {/* Savings Challenges */}
            <motion.div variants={cardVariants}>
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-0 shadow-md shadow-emerald-100/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-emerald-800">
                    Savings Challenges
                  </CardTitle>
                  <CardDescription className="text-emerald-700">
                    Save more, earn more points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-emerald-900">
                      <CountUp
                        start={0}
                        end={
                          challenges.filter(
                            (challenge) => challenge.category === "savings"
                          ).length
                        }
                        separator=","
                        duration={1.5}
                        delay={0.5}
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveCategory("savings")}
                      className="text-emerald-700 hover:text-emerald-900 hover:bg-emerald-200/50 p-2 rounded-md"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Spending Challenges */}
            <motion.div variants={cardVariants}>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-md shadow-blue-100/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-blue-800">
                    Spending Challenges
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Optimize your spending habits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-blue-900">
                      <CountUp
                        start={0}
                        end={
                          challenges.filter(
                            (challenge) => challenge.category === "spending"
                          ).length
                        }
                        separator=","
                        duration={1.5}
                        delay={0.5}
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveCategory("spending")}
                      className="text-blue-700 hover:text-blue-900 hover:bg-blue-200/50 p-2 rounded-md"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Investing Challenges */}
            <motion.div variants={cardVariants}>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-md shadow-purple-100/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-purple-800">
                    Investing Challenges
                  </CardTitle>
                  <CardDescription className="text-purple-700">
                    Grow your investment portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-purple-900">
                      <CountUp
                        start={0}
                        end={
                          challenges.filter(
                            (challenge) => challenge.category === "investing"
                          ).length
                        }
                        separator=","
                        duration={1.5}
                        delay={0.5}
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveCategory("investing")}
                      className="text-purple-700 hover:text-purple-900 hover:bg-purple-200/50 p-2 rounded-md"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          >
            <div className="grid gap-4">
              {/* Header with Tabs */}
              <motion.div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Active Challenges</h2>
                <Tabs defaultValue="all" className="w-auto">
                  <TabsList className="bg-slate-200 flex-wrap gap-1 h-full justify-end">
                    {["all", "savings", "spending", "investing"].map(
                      (category) => (
                        <TabsTrigger
                          key={category}
                          value={category}
                          onClick={() => setActiveCategory(category)}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </TabsTrigger>
                      )
                    )}
                  </TabsList>
                </Tabs>
              </motion.div>

              {/* Challenges Grid */}
              <ScrollReveal variants={containerVariants}>
                {(isInView) => (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeCategory} // This re-renders when category changes
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        exit="hidden"
                        variants={containerVariants}
                      >
                        {sortedChallenges
                          .filter(
                            (challenge) =>
                              activeCategory === "all" ||
                              challenge.category === activeCategory
                          )
                          .map((challenge) => {
                            const IconComponent = getLucideIcon(challenge.icon);
                            return (
                              <motion.div
                                key={challenge.id}
                                variants={itemVariants}
                              >
                                <ChallengeCard
                                  challenge={challenge}
                                  IconComponent={IconComponent}
                                  userPoints={userPoints}
                                  startChallenge={() =>
                                    startChallenge(challenge)
                                  }
                                  isInView={isInView}
                                />
                              </motion.div>
                            );
                          })}
                      </motion.div>
                    </AnimatePresence>
                  </>
                )}
              </ScrollReveal>

              {/* View All Button */}
              {sortedChallenges.length > 6 && (
                <motion.div
                  className="mt-4 flex justify-center"
                  variants={itemVariants}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View All Challenges
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Points Summary Card */}
          <ScrollReveal variants={containerVariants}>
            {(isInView) => (
              <Card className="mt-8 bg-gradient-to-r from-slate-50 to-slate-100 border shadow-sm">
                <CardHeader>
                  <motion.h2
                    variants={itemVariants}
                    className="text-lg font-semibold"
                  >
                    Points Summary
                  </motion.h2>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    variants={containerVariants}
                  >
                    {/* Total Points Earned */}
                    <motion.div
                      className="flex items-center gap-4"
                      variants={itemVariants}
                    >
                      <motion.div
                        className="p-3 bg-white rounded-full shadow-sm"
                        variants={iconVariants}
                      >
                        <Trophy className="h-6 w-6 text-amber-500" />
                      </motion.div>
                      <div>
                        <div className="text-sm text-slate-500">
                          Total Points Earned
                        </div>
                        <div className="text-2xl font-bold">
                          {isInView ? (
                            <CountUp
                              start={0}
                              end={userPoints}
                              separator=","
                              duration={1.5}
                            />
                          ) : (
                            0
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Available Points */}
                    <motion.div
                      className="flex items-center gap-4"
                      variants={itemVariants}
                    >
                      <motion.div
                        className="p-3 bg-white rounded-full shadow-sm"
                        variants={iconVariants}
                      >
                        <CreditCard className="h-6 w-6 text-emerald-500" />
                      </motion.div>
                      <div>
                        <div className="text-sm text-slate-500">
                          Available Points
                        </div>
                        <div className="text-2xl font-bold">
                          {isInView ? (
                            <CountUp
                              start={0}
                              end={userPoints}
                              separator=","
                              duration={1.5}
                            />
                          ) : (
                            0
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Points Expiring Soon */}
                    <motion.div
                      className="flex items-center gap-4"
                      variants={itemVariants}
                    >
                      <motion.div
                        className="p-3 bg-white rounded-full shadow-sm"
                        variants={iconVariants}
                      >
                        <Calendar className="h-6 w-6 text-blue-500" />
                      </motion.div>
                      <div>
                        <div className="text-sm text-slate-500">
                          Points Expiring Soon
                        </div>
                        <div className="text-2xl font-bold">
                          {isInView ? (
                            <CountUp
                              start={0}
                              end={0}
                              separator=","
                              duration={1.5}
                            />
                          ) : (
                            0
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-b-lg border-t p-4">
                  <motion.div
                    className="text-sm text-slate-500"
                    variants={itemVariants}
                  >
                    Points are earned by completing challenges and can be
                    redeemed for rewards
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm font-medium px-4 py-2 border rounded-md bg-slate-50 hover:bg-slate-100 transition"
                  >
                    View Points History
                  </motion.button>
                </CardFooter>
              </Card>
            )}
          </ScrollReveal>
        </div>
      )}{" "}
    </>
  );
}
