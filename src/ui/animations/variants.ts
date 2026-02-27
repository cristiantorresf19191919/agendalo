import { type Variants } from 'framer-motion';

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const tapScale = { scale: 0.98 };
export const hoverScale = { scale: 1.02 };
export const hoverGlow = { boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)' };

// Scroll-triggered section (fade + blur + slide)
export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

// Stretchy stat card (spring entrance)
export const stretchyCard: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 15 },
  },
};

// Hover bounce for stretchy cards
export const hoverBounce = {
  scale: 1.04,
  y: -4,
  transition: { type: 'spring' as const, stiffness: 400, damping: 10 },
};

// Split text word reveal
export const wordRevealContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const wordRevealItem: Variants = {
  hidden: { opacity: 0, y: 20, rotateX: 40 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: 'spring', stiffness: 150, damping: 12 },
  },
};

// Accent-colored hover glows
export const hoverGlowPurple = {
  boxShadow: '0 0 25px rgba(111, 66, 193, 0.2)',
};
export const hoverGlowTeal = {
  boxShadow: '0 0 25px rgba(32, 201, 151, 0.2)',
};

// Stretchy loading pulse — subtle, elegant entrance
export const stretchyPulse: Variants = {
  hidden: { opacity: 0, scaleX: 0.92, scaleY: 0.96 },
  visible: {
    opacity: 1,
    scaleX: [0.92, 1.02, 0.98, 1],
    scaleY: [0.96, 1.01, 0.99, 1],
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Skeleton loading shimmer
export const skeletonPulse: Variants = {
  initial: { opacity: 0.4 },
  animate: {
    opacity: [0.4, 0.7, 0.4],
    scaleX: [1, 1.005, 1],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Card entrance with spring bounce
export const cardEntrance: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};
