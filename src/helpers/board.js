import { GRADIENT_MAP } from "@/config/theme";

export const getBoardGradient = (color) =>
    GRADIENT_MAP[color] || "from-primary/80 to-primary";
