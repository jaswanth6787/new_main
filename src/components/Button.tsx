import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-smooth disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90",
        wellness: "bg-wellness-green text-white shadow-soft hover:bg-wellness-green/90 hover:shadow-card",
        hero: "bg-wellness-green text-white shadow-hero hover:bg-wellness-green/90 hover:scale-105 transition-bounce text-lg px-8 py-4",
        secondary: "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/80",
        outline: "border border-wellness-green text-wellness-green bg-white hover:bg-wellness-green hover:text-white shadow-soft",
        ghost: "hover:bg-wellness-green-light hover:text-wellness-green",
        cta: "bg-gradient-to-r from-wellness-green to-wellness-green/80 text-white shadow-hero hover:from-wellness-green/90 hover:to-wellness-green/70 hover:scale-105 transition-bounce text-xl px-12 py-6",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-full px-3",
        lg: "h-12 rounded-full px-8",
        xl: "h-16 rounded-full px-12 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({ 
  variant, 
  size, 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <ShadcnButton
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </ShadcnButton>
  );
}