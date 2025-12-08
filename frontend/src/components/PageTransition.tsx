/**
 * Component: PageTransition
 * Purpose: Small wrapper around `framer-motion` to provide
 * a consistent fade/enter/exit animation between route changes.
 * Wrap page content with this component to enable the transition.
 */
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function PageTransition({ children }: { children?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.15 }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
}
