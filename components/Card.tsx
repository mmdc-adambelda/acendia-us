import Link from "next/link";
import { ReactNode } from "react";

export default function Card({
  href,
  children,
  className = "",
  dataEvent,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  dataEvent?: string;
}) {
  const classes = `group relative rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-200 hover:border-[var(--border-hi)] hover:bg-[var(--card-hover)] ${className}`;

  if (href) {
    return (
      <Link href={href} className={`focus-ring block ${classes}`} data-event={dataEvent}>
        {children}
      </Link>
    );
  }
  return <div className={classes}>{children}</div>;
}
