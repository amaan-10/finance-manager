"use client";

import { Check, Clock, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "./ui/badge";

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

interface ChallengeCardProps {
  challenge: Challenge;
  IconComponent?: any;
  userPoints: number;
  startChallenge: () => void;
  onRedeem?: () => void;
  completeChallenge?: (challenge: any) => void;
}

export default function ChallengeCard({
  challenge,
  IconComponent,
  userPoints,
  startChallenge,
}: ChallengeCardProps) {
  const isClaimed = challenge.isCompleted;
  const showConfetti = challenge.isCompleted;

  // Generate confetti particles
  const confettiElements = Array.from({ length: 50 }).map((_, index) => {
    const size = Math.random() * 8 + 6;
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 3 + 2;
    const delay = Math.random() * 0.5;
    const color = [
      "bg-pink-500",
      "bg-yellow-400",
      "bg-blue-500",
      "bg-green-400",
      "bg-purple-500",
      "bg-red-500",
    ][Math.floor(Math.random() * 6)];

    return (
      <div
        key={index}
        className={`absolute rounded-sm ${color} opacity-0`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          top: "-20px",
          animation: showConfetti
            ? `confetti ${animationDuration}s ease-out ${delay}s forwards`
            : "none",
        }}
      />
    );
  });

  return (
    <Card
      className={` overflow-hidden border-0 shadow-sm hover:shadow-lg relative transition-all duration-500`}
    >
      {/* Confetti container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettiElements}
      </div>

      {/* Claimed overlay */}
      {isClaimed && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-10 animate-fadeIn">
          <div className="bg-white rounded-full p-3 shadow-lg animate-scaleIn">
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
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
              )}
            </div>
            <div>
              <CardTitle className="text-base">{challenge.title}</CardTitle>
              <CardDescription className="text-xs mt-1">
                {challenge.description}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={
              challenge.difficulty === "easy"
                ? "outline"
                : challenge.difficulty === "medium"
                ? "secondary"
                : "destructive"
            }
            className="text-xs rounded-full"
          >
            {challenge.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span className="font-medium">
              {challenge.progress} / {challenge.total}
            </span>
          </div>
          <Progress
            value={(challenge.progress / challenge.total) * 100}
            className="h-2"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center text-sm text-slate-500">
          <Clock className="h-3 w-3 mr-1" />
          {challenge.daysLeft > 0
            ? `${challenge.daysLeft} days left`
            : "Completed!"}
        </div>
        <div className="flex items-center text-sm font-medium">
          <Star className="h-4 w-4 text-amber-500 mr-1" />
          {challenge.points} points
        </div>
      </CardFooter>
      <Button
        disabled={challenge.lastCompleted}
        variant={userPoints >= challenge.total ? "default" : "outline"}
        onClick={startChallenge}
        className={`flex justify-self-end mb-5 mr-6 ${
          challenge.isCompleted ? "bg-green-600" : ""
        }`}
      >
        {challenge.isCompleted
          ? "Challenge Completed"
          : !challenge.lastCompleted
          ? "Start Challenge"
          : "Ongoing Challenge"}
      </Button>

      <style jsx global>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh)) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0);
          }
          70% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }
      `}</style>
    </Card>
  );
}
