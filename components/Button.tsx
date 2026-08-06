import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  dataEvent?: string;
};

const base =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-[var(--r-sm)] px-6 py-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap";

const variants = {
  primary:
    "bg-white text-black hover:shadow-[var(--glow-white)] hover:-translate-y-0.5",
  secondary:
    "border border-[var(--border-hi)] text-white hover:bg-white/5 hover:-translate-y-0.5",
  ghost: "text-white/80 hover:text-white",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  dataEvent,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      data-event={dataEvent}
    >
      {children}
    </Link>
  );
}
