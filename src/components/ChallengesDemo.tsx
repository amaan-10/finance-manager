"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Gift, Star, Clock } from "lucide-react";
import Image from "next/image";

export default function ChallengesDemo() {
  const [mounted, setMounted] = useState(false);
  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const [progress3, setProgress3] = useState(0);

  useEffect(() => {
    setMounted(true);
    const timer1 = setTimeout(() => setProgress1(65), 500);
    const timer2 = setTimeout(() => setProgress2(40), 700);
    const timer3 = setTimeout(() => setProgress3(90), 900);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  if (!mounted) return null;

  const challenges = [
    {
      title: "Budget Master",
      description: "Stay under budget in all categories for 30 days",
      progress: progress1,
      reward: 500,
      icon: <Trophy className="h-5 w-5 text-amber-500" />,
      color: "bg-amber-500/10",
      textColor: "text-amber-500",
      daysLeft: 15,
    },
    {
      title: "Savings Streak",
      description: "Save at least ₹100 every week for a month",
      progress: progress2,
      reward: 300,
      icon: <Star className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-500/10",
      textColor: "text-blue-500",
      daysLeft: 21,
    },
    {
      title: "Expense Tracker",
      description: "Log all expenses for 2 weeks straight",
      progress: progress3,
      reward: 200,
      icon: <Clock className="h-5 w-5 text-green-500" />,
      color: "bg-green-500/10",
      textColor: "text-green-500",
      daysLeft: 3,
    },
  ];

  const rewards = [
    {
      title: "₹100 Amazon Gift Card",
      points: 1000,
      image: "/amazon-gift-card.png",
    },
    {
      title: "₹250 Starbucks Card",
      points: 2500,
      image: "/starbucks-gift-card.png",
    },
    {
      title: "₹100 Target Gift Card",
      points: 1000,
      image: "/100-target-gift-card.png",
    },
  ];

  return (
    <div className="p-6 bg-background h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Challenges & Rewards</h3>
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <span className="font-bold">1,250 points</span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium mb-4">Active Challenges</h4>
          <div className="space-y-4">
            {challenges.map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div
                        className={`h-12 w-12 rounded-lg flex items-center justify-center ${challenge.color}`}
                      >
                        {challenge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h5 className="font-medium">{challenge.title}</h5>
                            <p className="text-sm text-muted-foreground">
                              {challenge.description}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={challenge.textColor}
                          >
                            +{challenge.reward} pts
                          </Badge>
                        </div>
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{challenge.progress}% complete</span>
                            <span>{challenge.daysLeft} days left</span>
                          </div>
                          <Progress
                            value={challenge.progress}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-4">Available Rewards</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rewards.map((reward, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-2 text-center">
                    <div className="mx-auto mb-2">
                      <Image
                        src={reward.image}
                        alt={reward.title}
                        width={80}
                        height={80}
                        className="object-contain rounded"
                      />
                    </div>
                    <CardTitle className="text-base">{reward.title}</CardTitle>
                    <CardDescription>{reward.points} points</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Redeem
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
