export const DURATION = {
  micro: 0.12,
  standard: 0.24,
  emphasized: 0.42,
  ambient: 12.0,
};

export const EASING = {
  entrance: [0.22, 1, 0.36, 1] as const,
  spring: {
    type: "spring" as const,
    stiffness: 260,
    damping: 28,
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.standard, ease: EASING.entrance },
  },
  exit: { opacity: 0, transition: { duration: DURATION.micro } },
};

export const slideUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.standard, ease: EASING.entrance },
  },
  exit: { opacity: 0, y: -8, transition: { duration: DURATION.micro } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -2,
    scale: 1.005,
    transition: { duration: DURATION.micro, ease: "easeOut" },
  },
};
