import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ScrollReveal = ({
  children,
  variants,
  className,
}: {
  children: (isInView: boolean) => React.ReactNode;
  variants: any;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children(isInView)}
    </motion.div>
  );
};

export default ScrollReveal;
