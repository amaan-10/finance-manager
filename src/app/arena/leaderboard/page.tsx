"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Crown,
  DollarSign,
  IndianRupee,
  Medal,
  Search,
  Star,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CountUp from "react-countup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faWhatsapp,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faClone, faCopy } from "@fortawesome/free-solid-svg-icons";

// Sample data for the leaderboard
// const users = [
//   {
//     id: 1,
//     name: "Alex Morgan",
//     savings: 12580,
//     points: 9450,
//     trend: "up",
//     percentChange: 12,
//     rank: 1,
//   },
//   {
//     id: 2,
//     name: "Jamie Chen",
//     savings: 10340,
//     points: 8720,
//     trend: "up",
//     percentChange: 8,
//     rank: 2,
//   },
//   {
//     id: 3,
//     name: "Taylor Swift",
//     savings: 9870,
//     points: 7890,
//     trend: "down",
//     percentChange: 3,
//     rank: 3,
//   },
//   {
//     id: 4,
//     name: "Jordan Lee",
//     savings: 8650,
//     points: 7450,
//     trend: "up",
//     percentChange: 5,
//     rank: 4,
//   },
//   {
//     id: 5,
//     name: "Casey Kim",
//     savings: 7920,
//     points: 6780,
//     trend: "up",
//     percentChange: 7,
//     rank: 5,
//   },
//   {
//     id: 6,
//     name: "Riley Johnson",
//     savings: 6540,
//     points: 5430,
//     trend: "down",
//     percentChange: 2,
//     rank: 6,
//   },
//   {
//     id: 7,
//     name: "Morgan Smith",
//     savings: 5890,
//     points: 4980,
//     trend: "up",
//     percentChange: 4,
//     rank: 7,
//   },
//   {
//     id: 8,
//     name: "Avery Williams",
//     savings: 4760,
//     points: 3870,
//     trend: "up",
//     percentChange: 6,
//     rank: 8,
//   },
// ];

type LeaderboardEntry = {
  userId: number;
  name: string;
  savings: number;
  points: number;
  trend: string;
  percentChange: number;
  rank: number;
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

export default function Leaderboard() {
  const [sortBy, setSortBy] = useState<"savings" | "points">("savings");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setuserStats] = useState<UserStats>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/challenges/leaderboard", { method: "POST" });

    fetch("/api/challenges/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data);
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

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) =>
    sortBy === "savings" ? b.savings - a.savings : b.points - a.points
  );

  const [inviteLink, setInviteLink] = useState("");

  // Generate referral link (Placeholder function)
  const generateInviteLink = () => {
    const uniqueCode = Math.random().toString(36).substring(2, 10);
    setInviteLink(`${window.location.origin}/invite?ref=${uniqueCode}`);
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied!");
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
              <h1 className="text-3xl font-bold text-slate-900">
                Savings Leaderboard
              </h1>
              <p className="text-slate-500 mt-1">
                See who's saving the most and earning rewards
              </p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search users..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    Sort by
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("savings")}>
                    Savings Amount
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("points")}>
                    Points Earned
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className=" bg-slate-200">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="top">Top Savers</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Global Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {/* Top 3 users with special styling */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {sortedUsers.slice(0, 3).map((user) => (
                        <Card
                          key={user.userId}
                          className={`overflow-hidden border-0 shadow-md ${
                            user.rank === 1
                              ? "bg-gradient-to-br from-amber-50 to-amber-100 shadow-amber-200/50"
                              : user.rank === 2
                              ? "bg-gradient-to-br from-slate-50 to-slate-100 shadow-slate-200/50"
                              : "bg-gradient-to-br from-orange-50 to-orange-100 shadow-orange-200/50"
                          }`}
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Image
                                    src={
                                      `https://avatar.iran.liara.run/username?username=${user.name}` ||
                                      `https://avatar.iran.liara.run/username?username=${user.name}`
                                    }
                                    alt={user.name}
                                    width={56}
                                    height={56}
                                    className="rounded-full border-2 border-white shadow-sm"
                                  />
                                  <div
                                    className={`absolute -bottom-1 -right-1 rounded-full p-1 ${
                                      user.rank === 1
                                        ? "bg-amber-400"
                                        : user.rank === 2
                                        ? "bg-slate-400"
                                        : "bg-orange-400"
                                    }`}
                                  >
                                    {user.rank === 1 ? (
                                      <Crown className="h-4 w-4 text-white" />
                                    ) : user.rank === 2 ? (
                                      <Medal className="h-4 w-4 text-white" />
                                    ) : (
                                      <Star className="h-4 w-4 text-white" />
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg">
                                    {user.name}
                                  </h3>
                                  <div className="flex items-center text-sm text-slate-600">
                                    Rank #{user.rank}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white/80 rounded-lg p-3 shadow-sm">
                                <div className="text-sm text-slate-500 mb-1">
                                  Savings
                                </div>
                                <div className="flex items-center">
                                  <IndianRupee className="h-4 w-4 text-emerald-500 mr-1" />
                                  <span className="font-bold text-lg">
                                    <span className=" font-sans">₹</span>
                                    {user.savings.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <div className="bg-white/80 rounded-lg p-3 shadow-sm">
                                <div className="text-sm text-slate-500 mb-1">
                                  Points
                                </div>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-amber-500 mr-1" />
                                  <span className="font-bold text-lg">
                                    {user.points.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center">
                              <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                              <span className="text-sm text-slate-600">
                                {user.trend === "up" ? (
                                  <span className="text-emerald-600">
                                    ↑ {user.percentChange}% this month
                                  </span>
                                ) : user.trend === "steady" ? (
                                  <span className="text-slate-600">
                                    {user.percentChange}% this month
                                  </span>
                                ) : (
                                  <span className="text-red-600">
                                    ↓ {user.percentChange}% this month
                                  </span>
                                )}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Remaining users in list format */}
                    {sortedUsers.slice(3).length > 0 && (
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="grid grid-cols-12 py-3 px-4 bg-slate-50 border-b text-sm font-medium text-slate-500">
                          <div className="col-span-1">Rank</div>
                          <div className="col-span-5">User</div>
                          <div className="col-span-3 text-right">Savings</div>
                          <div className="col-span-3 text-right">Points</div>
                        </div>
                        {sortedUsers.slice(3).map((user) => (
                          <div
                            key={user.userId}
                            className="grid grid-cols-12 py-4 px-4 border-b last:border-0 items-center hover:bg-slate-50 transition-colors"
                          >
                            <div className="col-span-1 font-medium text-slate-600">
                              #{user.rank}
                            </div>
                            <div className="col-span-5 flex items-center gap-3">
                              <Image
                                src={
                                  `https://avatar.iran.liara.run/username?username=${user.name}` ||
                                  `https://avatar.iran.liara.run/username?username=${user.name}`
                                }
                                alt={user.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="flex items-center text-xs text-slate-500">
                                  {user.trend === "up" ? (
                                    <>
                                      <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
                                      <span className="text-emerald-600">
                                        {user.percentChange}%
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                                      <span className="text-red-600">
                                        {user.percentChange}%
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-span-3 text-right">
                              <div className="font-medium">
                                <span className=" font-sans">₹</span>
                                {user.savings.toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-500">
                                total saved
                              </div>
                            </div>
                            <div className="col-span-3 text-right">
                              <div className="font-medium">
                                {user.points.toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-500">
                                reward points
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="friends">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <TrendingUp className="h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      Connect with friends
                    </h3>
                    <p className="text-slate-500 max-w-md mb-6">
                      Invite friends to join and compare your savings progress
                      together
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={generateInviteLink}>
                          Invite Friends
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Invite Friends</DialogTitle>
                        </DialogHeader>
                        <p className="text-gray-600">
                          Share your invite link and compare your savings
                          progress together.
                        </p>

                        {inviteLink && (
                          <div className="flex items-center bg-gray-100 p-2 rounded mt-3">
                            <span className="truncate text-sm text-gray-700">
                              {inviteLink}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={copyToClipboard}
                            >
                              <FontAwesomeIcon
                                icon={faClone}
                                className="w-4 h-4"
                              />
                            </Button>
                          </div>
                        )}

                        <div className="flex gap-3 mt-4">
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open(
                                `https://www.facebook.com/sharer/sharer.php?u=${inviteLink}`,
                                "_blank"
                              )
                            }
                          >
                            <FontAwesomeIcon
                              icon={faFacebookF}
                              className="w-4 h-4 mr-1"
                            />{" "}
                            Facebook
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open(
                                `https://api.whatsapp.com/send?text=Join me on SpendLess! ${inviteLink}`,
                                "_blank"
                              )
                            }
                          >
                            <FontAwesomeIcon
                              icon={faWhatsapp}
                              className="w-4 h-4 mr-1"
                            />{" "}
                            WhatsApp
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open(
                                `https://twitter.com/intent/tweet?url=${inviteLink}&text=Join%20me%20on%20SpendLess!`,
                                "_blank"
                              )
                            }
                          >
                            <FontAwesomeIcon
                              icon={faXTwitter}
                              className="w-4 h-4 mr-1"
                            />{" "}
                            X
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="top">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Crown className="h-12 w-12 text-amber-300 mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      Top Savers This Month
                    </h3>
                    <p className="text-slate-500 max-w-md mb-6">
                      This section will be updated at the end of the month
                    </p>
                    <Button variant="outline">View Previous Winners</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4">
                  <div className="text-sm text-emerald-700 mb-1">
                    Current Savings
                  </div>
                  <div className="text-2xl font-bold text-emerald-900">
                    {" "}
                    <span className=" font-sans">₹</span>
                    <CountUp
                      start={0}
                      end={userStats?.currentSavings || 0}
                      separator=","
                      duration={1.5}
                    />{" "}
                  </div>
                  <div className="mt-2 text-xs text-emerald-700">
                    <span className="inline-flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      5% from last month
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="text-sm text-blue-700 mb-1">Your Rank</div>
                  <div className="text-2xl font-bold text-blue-900">
                    #
                    <CountUp
                      start={0}
                      end={userStats?.rank || 0}
                      separator=","
                      duration={1.5}
                    />{" "}
                  </div>
                  <div className="mt-2 text-xs text-blue-700">
                    <span className="inline-flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      Up 2 positions
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
                  <div className="text-sm text-amber-700 mb-1">
                    Points Earned
                  </div>
                  <div className="text-2xl font-bold text-amber-900">
                    <CountUp
                      start={0}
                      end={userStats?.currentPoints || 0}
                      separator=","
                      duration={1.5}
                    />{" "}
                  </div>
                  <div className="mt-2 text-xs text-amber-700">
                    <span className="inline-flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      Redeem for rewards
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}{" "}
    </>
  );
}
