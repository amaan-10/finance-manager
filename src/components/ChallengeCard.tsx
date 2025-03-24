"use client";

import { useState } from "react";
import { ArrowRight, Gift, Sparkles, Check } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface BonusCardProps {
  title?: string;
  description?: string;
  points?: number;
  maxPoints?: number;
  rewardAmount?: string;
  isRedeemed?: boolean;
  backgroundColor?: string;
  textColor?: string;
  onRedeem?: () => void;
  completeChallenge?: (challenge: any) => void;
}

export default function ChallengeCard({
  title = "Loyalty Bonus",
  description = "Complete purchases to earn your reward",
  points = 75,
  maxPoints = 100,
  rewardAmount = "$25",
  isRedeemed = false,
  backgroundColor = "bg-gradient-to-br from-violet-500 to-indigo-700",
  textColor = "text-white",
  onRedeem = () => console.log("Redeem clicked"),
  completeChallenge = (challenge) =>
    console.log("Challenge completed", challenge),
}: BonusCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClaimed, setIsClaimed] = useState(isRedeemed);
  const [showConfetti, setShowConfetti] = useState(false);
  const progress = (points / maxPoints) * 100;

  const handleRedeem = () => {
    if (progress >= 100 && !isClaimed) {
      setShowConfetti(true);
      setIsClaimed(true);
      isRedeemed = true;
      onRedeem();

      // Hide confetti after animation completes
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  };

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
      className={`w-full max-w-md overflow-hidden border-0 shadow-lg ${backgroundColor} relative transition-all duration-500 ${
        isClaimed ? "scale-[1.02]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

      <div className="absolute top-0 right-0 p-4">
        <div className="relative">
          <Sparkles className={`${textColor} w-6 h-6 opacity-75`} />
          <div
            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-300 ${
              isHovered ? "animate-ping" : ""
            }`}
          ></div>
        </div>
      </div>

      <CardContent
        className={`p-6 pt-10 transition-opacity duration-500 ${
          isClaimed ? "opacity-50" : "opacity-100"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-full bg-white/20 backdrop-blur-sm ${textColor}`}
          >
            <Gift className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className={`text-xl font-bold ${textColor}`}>{title}</h3>
            <p className={`${textColor} opacity-90 text-sm`}>{description}</p>
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <div className="flex justify-between">
            <span className={`text-sm font-medium ${textColor}`}>
              {points} streak
            </span>
            <span className={`text-sm ${textColor} opacity-75`}>
              {maxPoints} streak
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-white/20" />
        </div>

        <div className={`mt-6 text-center ${textColor}`}>
          <div className="text-xs uppercase tracking-wider opacity-75">
            Reward
          </div>
          <div className="text-3xl font-bold mt-1">{rewardAmount}</div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          className={`w-full group transition-all ${
            progress >= 100 && !isClaimed
              ? "bg-white hover:bg-white/90 text-indigo-700"
              : isClaimed
              ? "bg-green-500 text-white"
              : "bg-white/20 hover:bg-white/30 text-white"
          }`}
          onClick={progress >= 100 ? handleRedeem : completeChallenge}
        >
          {isClaimed
            ? "Claimed!"
            : progress >= 100
            ? "Redeem Now"
            : "Mark as Completed"}
          {!isClaimed && (
            <ArrowRight
              className={`ml-2 w-4 h-4 transition-transform ${
                isHovered && progress >= 100 ? "translate-x-1" : ""
              }`}
            />
          )}
        </Button>
        {/* //     <button
            //       onClick={() => completeChallenge(challenge)}
            //       className="mt-2 flex gap-2 bg-blue-500 text-white px-4 py-2 rounded"
            //     >
            //       <Image src={squareCheck} className="w-4 h-4 mt-1" alt="check" />{" "}
            //       Mark as Completed
            //     </button> */}
      </CardFooter>

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
