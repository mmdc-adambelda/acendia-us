import { ReactNode } from "react";
import Container from "./Container";
import Breadcrumbs, { Crumb } from "./Breadcrumbs";

export default function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  breadcrumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <div className="bg-grid border-b border-[var(--border-dim)]">
      <Container>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className="py-14 sm:py-20">
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              {eyebrow}
            </p>
          )}
          <h1 className="text-balance max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="text-balance mt-5 max-w-2xl text-lg text-white/60">{description}</p>
          {children}
        </div>
      </Container>
    </div>
  );
}
