
export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.1, 0.25, 1] // Apple's cubic-bezier
    } 
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { 
      duration: 0.2, 
      ease: [0.25, 0.1, 0.25, 1] 
    } 
  }
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.1, 0.25, 1] 
    } 
  }
};

export const cardHover = {
  rest: { 
    scale: 1, 
    y: 0,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    transition: { 
      duration: 0.3, 
      ease: [0.25, 0.1, 0.25, 1] 
    } 
  },
  hover: { 
    scale: 1.02, 
    y: -5,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
    transition: { 
      duration: 0.3, 
      ease: [0.25, 0.1, 0.25, 1] 
    } 
  }
};

export const blurInTransition = {
  initial: { 
    opacity: 0, 
    filter: "blur(8px)" 
  },
  animate: { 
    opacity: 1, 
    filter: "blur(0px)",
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.1, 0.25, 1] 
    } 
  }
};
