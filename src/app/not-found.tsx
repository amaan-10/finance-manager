"use client";

import type React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
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
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="mx-auto my-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column - Text Content */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col space-y-6"
          >
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                <span className="text-primary">404</span>
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Page not found
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Oops! It seems like the financial data you're looking for has
                been invested elsewhere.
              </p>
            </div>

            {/* Navigation Options */}
            <div className="flex flex-wrap gap-2 lg:gap-4 pt-4">
              <Button asChild variant="default" size="lg" className="gap-2">
                <Link href="/finance">
                  <ArrowLeft className="h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/">
                <Home className="h-4 w-4" />
                Back to Home
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Column - Visual Element */}
          <motion.div
            variants={itemVariants}
            className="hidden md:flex justify-center items-center"
          >
            <div className="relative">
              {/* Animated chart illustration */}
              <svg
                width="400"
                height="300"
                viewBox="0 0 400 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto"
              >
                {/* Background grid */}
                <rect width="400" height="300" rx="8" fill="#F9FAFB" />
                <path d="M0 20 H400" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M0 60 H400" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M0 100 H400" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M0 140 H400" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M0 180 H400" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M0 220 H400" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M0 260 H400" stroke="#E5E7EB" strokeWidth="1" />

                <path d="M40 0 V300" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M80 0 V300" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M120 0 V300" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M160 0 V300" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M200 0 V300" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M240 0 V300" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M280 0 V300" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M320 0 V300" stroke="#E5E7EB" strokeWidth="1" />
                <path d="M360 0 V300" stroke="#E5E7EB" strokeWidth="1" />

                {/* 404 text as a broken chart line */}
                <motion.path
                  d="M40 200 L80 100 L120 180 L160 120 L200 220 L240 80 L280 404 L320 404 L360 404"
                  stroke="#EF4444"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="600"
                  initial={{ strokeDashoffset: 600 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  fill="none"
                />

                {/* Broken chart line */}
                <motion.path
                  d="M280 404 L280 150 L320 180 L360 120"
                  stroke="#8884d8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="300"
                  initial={{ strokeDashoffset: 300 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
                  fill="none"
                />

                {/* Data points */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                >
                  <circle cx="80" cy="100" r="6" fill="#EF4444" />
                  <circle cx="120" cy="180" r="6" fill="#EF4444" />
                  <circle cx="160" cy="120" r="6" fill="#EF4444" />
                  <circle cx="200" cy="220" r="6" fill="#EF4444" />
                  <circle cx="240" cy="80" r="6" fill="#EF4444" />
                  <circle cx="280" cy="150" r="6" fill="#8884d8" />
                  <circle cx="320" cy="180" r="6" fill="#8884d8" />
                  <circle cx="360" cy="120" r="6" fill="#8884d8" />
                </motion.g>

                {/* 404 text */}
                <motion.text
                  x="200"
                  y="150"
                  fontFamily="monospace"
                  fontSize="72"
                  fontWeight="bold"
                  fill="rgba(239, 68, 68, 0.2)"
                  textAnchor="middle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.5 }}
                >
                  404
                </motion.text>
              </svg>

              {/* Animated elements */}
              <motion.div
                className="absolute -bottom-6 -right-6 bg-primary/10 backdrop-blur-sm rounded-full p-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
              >
                <RefreshCw className="h-8 w-8 text-primary" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
