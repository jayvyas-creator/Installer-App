import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import styles from "./Toast.module.css";

export interface ToastProps {
  message: string;
  open: boolean;
}

export function Toast({ message, open }: ToastProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.toast}
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        >
          <AlertCircle size={18} className={styles.icon} aria-hidden />
          <span className={styles.message}>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
