import { forwardRef } from "react";

import { cn } from "@/lib/utils";

const Card = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

const CardTitle = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </div>
));

const CardHeader = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)}
    {...props}
  >
    {children}
  </div>
));

const CardDescription = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </div>
));

const CardContent = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 sm:p-6", className)} {...props}>
    {children}
  </div>
));

const CardFooter = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6", className)}
    {...props}
  >
    {children}
  </div>
));

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
