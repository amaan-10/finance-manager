"use client";

import { motion } from "framer-motion";

interface AnimatedProgressProps {
  isInView?: boolean; // Boolean to check if component is in view
  value: number; // Progress percentage (0-100)
  className?: string; // Optional custom styling
}

const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  isInView = true,
  value,
  className,
}) => {
  return (
    <div
      className={`relative w-full h-2 rounded-full overflow-hidden ${className}`}
    >
      <motion.div
        className="h-full bg-[#0f172a] rounded-full"
        initial={{ width: "0%" }}
        animate={isInView ? { width: `${value}%` } : "hidden"}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
    </div>
  );
};

export default AnimatedProgress;
