export const pageTransition = {
  initial: { opacity: 0, y: 14, scale: 0.99, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: 10, scale: 0.99, filter: "blur(10px)" },
  transition: { type: "spring", stiffness: 420, damping: 36, mass: 0.7 },
};

export const listStagger = {
  animate: {
    transition: { staggerChildren: 0.05, delayChildren: 0.02 },
  },
};

export const listItem = {
  initial: { opacity: 0, y: 10, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 6, scale: 0.99 },
};

