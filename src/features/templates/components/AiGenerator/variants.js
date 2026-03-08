export const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 50 : -50,
        opacity: 0,
        scale: 0.98
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: (direction) => ({
        x: direction < 0 ? 50 : -50,
        opacity: 0,
        scale: 0.98,
        transition: { duration: 0.2, ease: "easeIn" }
    })
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const itemScale = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1 }
};
