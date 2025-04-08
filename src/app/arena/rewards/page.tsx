"use client";

import { useEffect, useState } from "react";
import { Calendar, CreditCard, Gift, Search, Star, Trophy } from "lucide-react";
import Image from "next/image";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import CountUp from "react-countup";
import ScrollReveal from "@/components/ScrollAnimation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

// Types
type Challenge = {
  isCompleted: any;
  lastCompleted: any;
  id: string;
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

type Reward = {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  image: string;
  category: "gift-card" | "cashback" | "discount" | "experience";
  featured?: boolean;
  brand?: string;
};

type RewardHistory = {
  date: Date;
  description: string;
  rewardId: string;
  title: string;
  userId: string;
  image: string;
  pointsSpent: number;
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
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

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const Rewards = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState("rewards");

  useEffect(() => {
    fetch("/api/challenges")
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data);
        setLoading(false);
      });
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

  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    fetch("/api/rewards")
      .then((res) => res.json())
      .then((data) => {
        setRewards(data);
      });
  }, []);

  const [rewardsHistory, setRewardsHistory] = useState<RewardHistory[]>([]);

  useEffect(() => {
    fetch("/api/rewards/history")
      .then((res) => res.json())
      .then((data) => {
        setRewardsHistory(data);
      });
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Filter rewards based on search and category
  const filteredRewards = rewards.filter((reward) => {
    const matchesSearch =
      reward.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || reward.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const userPoints = userStats?.currentPoints || 0;

  const handleRedeem = async (rewardId: string) => {
    try {
      const res = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "An unexpected error occurred");
      }

      toast({
        description: "Reward redeemed successfully!",
        className: "bg-neutral-900 border-neutral-900 text-white",
      });
    } catch (error) {
      console.error("Redemption Error:", error);

      toast({
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

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
              <h1 className="text-3xl font-bold text-slate-900">Rewards</h1>
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

          <Tabs value={tabValue} onValueChange={setTabValue}>
            <TabsList className="grid grid-cols-2 w-full md:w-[400px] bg-slate-200">
              <TabsTrigger value="rewards">Rewards & Gift Cards</TabsTrigger>
              <TabsTrigger value="history">Rewards History</TabsTrigger>
            </TabsList>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="mt-6">
              {/* Featured Rewards */}
              <h2 className="text-xl font-semibold mb-4">Featured Rewards</h2>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
              >
                {rewards
                  .filter((r) => r.featured)
                  .map((reward) => (
                    <motion.div key={reward.id} variants={cardVariants}>
                      <Card className="flex overflow-hidden border-0 shadow-md">
                        <div className="w-1/3 bg-slate-100 flex items-center justify-center p-4">
                          <Image
                            src={reward.image || "/placeholder.svg"}
                            alt={reward.title}
                            width={120}
                            height={120}
                            className="object-contain rounded"
                          />
                        </div>
                        <div className="w-2/3">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              {reward.title}
                            </CardTitle>
                            <CardDescription>
                              {reward.description}
                            </CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-amber-500 mr-1" />
                              <span className="font-bold">
                                {reward.pointsCost.toLocaleString()}
                              </span>
                              <span className="text-sm text-slate-500 ml-1">
                                points
                              </span>
                            </div>
                            <motion.div
                              whileHover="hover"
                              whileTap="tap"
                              variants={buttonVariants}
                            >
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    disabled={userPoints < reward.pointsCost}
                                    variant={
                                      userPoints >= reward.pointsCost
                                        ? "default"
                                        : "outline"
                                    }
                                  >
                                    Redeem
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Redeem Your Reward?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to redeem this
                                      reward? This action is final and will
                                      deduct the required points from your
                                      balance.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleRedeem(reward.id)}
                                    >
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </motion.div>
                          </CardFooter>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </motion.div>

              {/* Header with Tabs */}
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeIn}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
              >
                <Tabs defaultValue="all" className="w-auto">
                  <TabsList className="bg-slate-200">
                    {["all", "gift-card", "cashback", "experience"].map(
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
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Search rewards..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </motion.div>

              {/* All Rewards Grid */}
              <ScrollReveal variants={containerVariants}>
                {(isInView) => (
                  <>
                    <AnimatePresence mode="wait">
                      <h2 className="text-xl font-semibold mb-4">
                        {activeCategory === "all"
                          ? "All Rewards"
                          : activeCategory === "gift-card"
                          ? "Gift Cards"
                          : activeCategory === "cashback"
                          ? "Cashback Rewards"
                          : "Experiences"}
                      </h2>
                      <motion.div
                        key={activeCategory} // Re-renders when category changes
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        exit="hidden"
                        variants={containerVariants}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                      >
                        {filteredRewards.map((reward) => (
                          <motion.div key={reward.id} variants={itemVariants}>
                            <Card className="overflow-hidden border hover:shadow-md transition-shadow">
                              <div className="h-36 bg-slate-100 flex items-center justify-center">
                                <Image
                                  src={reward.image || "/placeholder.svg"}
                                  alt={reward.title}
                                  width={120}
                                  height={120}
                                  className="object-contain rounded"
                                />
                              </div>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">
                                  {reward.title}
                                </CardTitle>
                                <CardDescription className="text-xs mt-1">
                                  {reward.description}
                                </CardDescription>
                              </CardHeader>
                              <CardFooter className="flex justify-between items-center pt-2">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-amber-500 mr-1" />
                                  <span className="font-bold">
                                    {reward.pointsCost.toLocaleString()}
                                  </span>
                                </div>
                                <motion.div
                                  whileHover="hover"
                                  whileTap="tap"
                                  variants={buttonVariants}
                                >
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        disabled={
                                          userPoints < reward.pointsCost
                                        }
                                        variant={
                                          userPoints >= reward.pointsCost
                                            ? "default"
                                            : "outline"
                                        }
                                      >
                                        Redeem
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Redeem Your Reward?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to redeem this
                                          reward? This action is final and will
                                          deduct the required points from your
                                          balance.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleRedeem(reward.id)
                                          }
                                        >
                                          Continue
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </motion.div>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </>
                )}
              </ScrollReveal>
            </TabsContent>
            {/* Redemption History */}
            <TabsContent value="history" className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Redemption History</h2>
              <ScrollReveal variants={fadeInVariants}>
                {(isInView) => (
                  <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    exit="exit"
                    variants={fadeInVariants}
                  >
                    {rewardsHistory.length === 0 ? (
                      <Card>
                        <CardContent className="p-6">
                          <motion.div
                            variants={fadeInVariants}
                            className="flex flex-col items-center justify-center py-8 text-center"
                          >
                            <Gift className="h-12 w-12 text-slate-300 mb-4" />
                            <h3 className="text-xl font-medium mb-2">
                              No redemptions yet
                            </h3>
                            <p className="text-slate-500 max-w-md mb-6">
                              Complete challenges to earn points and redeem them
                              for exciting rewards
                            </p>
                            <motion.div
                              whileHover="hover"
                              whileTap="tap"
                              variants={buttonVariants}
                            >
                              <Button onClick={() => setTabValue("rewards")}>
                                Browse Rewards
                              </Button>
                            </motion.div>
                          </motion.div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="p-6">
                          <motion.div
                            variants={fadeInVariants}
                            className="flex flex-col items-center justify-center py-8 text-center"
                          >
                            <h3 className="text-xl font-medium mb-2">
                              Your Redemption History
                            </h3>
                            <p className="text-slate-500 max-w-md mb-6">
                              Here are the rewards you've redeemed so far
                            </p>
                            <div className="grid gap-4">
                              {rewardsHistory.map((reward) => (
                                <motion.div
                                  key={reward?.rewardId}
                                  className="shadow-sm border rounded-md hover:shadow-md transition-shadow bg-slate-100"
                                  whileHover="hover"
                                  initial="hidden"
                                  animate={isInView ? "visible" : "hidden"}
                                  exit="exit"
                                >
                                  <CardHeader>
                                    <CardTitle className="text-base">
                                      {reward?.title}
                                    </CardTitle>
                                    <CardDescription>
                                      {reward?.description}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="flex items-center justify-center p-4">
                                    <div className="flex items-center gap-2">
                                      <Image
                                        src={
                                          reward?.image || "/placeholder.svg"
                                        }
                                        alt={reward?.title}
                                        width={50}
                                        height={50}
                                        className="object-contain rounded"
                                      />
                                      <Star className="h-4 w-4 text-amber-500 ml-2" />
                                      <span className="font-bold text-slate-800">
                                        {reward?.pointsSpent.toLocaleString()}{" "}
                                        points
                                      </span>
                                    </div>
                                  </CardContent>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                )}
              </ScrollReveal>
            </TabsContent>
          </Tabs>

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
};

export default Rewards;
