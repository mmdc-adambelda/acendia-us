"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import Section, { Eyebrow } from "@/components/Section";

const YT_VIDEO_ID = "WxQQmyT4ULo";

/**
 * Click-to-play YouTube embed, inline on the page (not a popup, no forced
 * autoplay). Shows a thumbnail with a play button until clicked — clicking
 * is a real user gesture, so the embed can autoplay with sound once it
 * loads, without hitting any browser autoplay-block policy.
 */
export default function HomepageVideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <Section className="border-t border-[var(--border-dim)]">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>See Acendia in action</Eyebrow>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          A two-minute look at how we grow your search visibility
        </h2>
      </div>
      <div className="relative mx-auto mt-10 aspect-video w-full max-w-4xl overflow-hidden rounded-[var(--r-lg)] border border-[var(--border-hi)] shadow-[var(--shadow-dark)]">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${YT_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=0`}
            title="Acendia intro video"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Play video"
            className="focus-ring group relative block h-full w-full"
          >
            <Image
              src={`https://img.youtube.com/vi/${YT_VIDEO_ID}/maxresdefault.jpg`}
              alt="Acendia intro video thumbnail"
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/45">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform group-hover:scale-105">
                <Play className="ml-1 h-6 w-6" fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          </button>
        )}
      </div>
    </Section>
  );
}
