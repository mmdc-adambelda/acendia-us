import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "./icons";
import { FOOTER_LINK_COLUMNS, SOCIAL_LINKS, TAGLINE } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-dim)] bg-black">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Image
              src="/brand/acendia-logo.png"
              alt="Acendia"
              width={140}
              height={44}
              className="h-8 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm text-white/60">{TAGLINE}</p>
            <p className="mt-4 max-w-xs text-sm text-white/40">
              Providing SEO, web, and digital growth services to businesses across the United States.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Acendia on Facebook"
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-white/55 transition-colors hover:border-[var(--border-hi)] hover:text-white"
              >
                <FacebookIcon />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Acendia on LinkedIn"
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-white/55 transition-colors hover:border-[var(--border-hi)] hover:text-white"
              >
                <LinkedinIcon />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Acendia on Instagram"
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-white/55 transition-colors hover:border-[var(--border-hi)] hover:text-white"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {FOOTER_LINK_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="focus-ring text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[var(--border-dim)] pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-white/40">
            © {year} Acendia International. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Serving businesses across the United States — remote-first, nationwide.
          </p>
        </div>
      </Container>
    </footer>
  );
}
