import { useErrorHandler } from "../context/ErrorContext";
import { AnimatePresence, motion } from "framer-motion";

export default function ErrorHandler() {
  const { errors } = useErrorHandler();

  return (
    <div className="absolute flex flex-col items-center w-full gap-2 top-2 z-0">
      <AnimatePresence>
        {errors.map((error, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            role="alert"
            className="alert alert-error flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
