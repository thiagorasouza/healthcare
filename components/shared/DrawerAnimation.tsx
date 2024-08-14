import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface DrawerAnimationProps {
  toggle: boolean;
  children: React.ReactNode;
}

export default function DrawerAnimation({ toggle, children }: DrawerAnimationProps) {
  return (
    <AnimatePresence>
      {toggle && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative overflow-hidden">
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
