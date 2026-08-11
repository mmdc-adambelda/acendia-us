import Image from "next/image";
import { ReactNode } from "react";
import Container from "./Container";
import Breadcrumbs, { Crumb } from "./Breadcrumbs";
import ImagePlaceholder from "./ImagePlaceholder";

export default function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  image,
  placeholderIcon,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  breadcrumbs?: Crumb[];
  image?: { src: string; alt: string };
  /** Rendered instead of `image` when no real photo exists yet — keeps
   * every content page visually complete instead of shipping a blank gap. */
  placeholderIcon?: string;
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
          {image ? (
            <div className="mt-10 overflow-hidden rounded-[var(--r-lg)] border border-[var(--border)]">
              <Image
                src={image.src}
                alt={image.alt}
                width={1600}
                height={900}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          ) : placeholderIcon ? (
            <ImagePlaceholder icon={placeholderIcon} className="mt-10" />
          ) : null}
        </div>
      </Container>
    </div>
  );
}
