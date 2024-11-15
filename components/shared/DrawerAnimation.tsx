import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface DrawerAnimationProps {
  mode?: "vertical" | "horizontal";
  toggle: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function DrawerAnimation({
  mode = "vertical",
  toggle,
  className,
  children,
}: DrawerAnimationProps) {
  if (mode === "vertical") {
    return (
      <AnimatePresence>
        {toggle && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative -m-1 overflow-hidden p-1">
              <motion.div
                initial={{ opacity: 0, y: "-100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "-100%" }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  } else if (mode === "horizontal") {
    return (
      <AnimatePresence>
        {toggle && (
          <div className={cn("relative -m-1 overflow-hidden p-1", className)}>
            <motion.div
              initial={{ opacity: 0, x: "-100%", height: "100%" }}
              animate={{ opacity: 1, x: 0, height: "100%" }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  } else {
    throw new Error("Invalid animation mode");
  }
}
