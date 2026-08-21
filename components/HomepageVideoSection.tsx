"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import Section, { Eyebrow } from "@/components/Section";

const YT_VIDEO_ID = "WxQQmyT4ULo";

function postCommand(iframe: HTMLIFrameElement | null, func: string) {
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
}

/**
 * Click-to-play YouTube embed, inline on the page (not a popup, no forced
 * autoplay). Shows a thumbnail with a play button until clicked — clicking
 * is a real user gesture, so the embed can autoplay with sound once it
 * loads, without hitting any browser autoplay-block policy.
 *
 * Once playing, YouTube's native control bar (and the branding/watermark
 * that lives inside it) is fully hidden via `controls=0` — a small custom
 * play/pause + mute/unmute toolbar replaces it, driven via the YouTube
 * postMessage command channel (`enablejsapi=1` on the iframe src enables
 * this channel). Play/pause and mute state are tracked optimistically
 * since we're the only thing that can change them (no native controls are
 * ever shown to drift out of sync with).
 */
export default function HomepageVideoSection() {
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function togglePlayPause() {
    postCommand(iframeRef.current, paused ? "playVideo" : "pauseVideo");
    setPaused((p) => !p);
  }

  function toggleMute() {
    postCommand(iframeRef.current, muted ? "unMute" : "mute");
    setMuted((m) => !m);
  }

  const src = `https://www.youtube-nocookie.com/embed/${YT_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=0&controls=0&showinfo=0&iv_load_policy=3&playsinline=1&enablejsapi=1`;

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
          <>
            <iframe
              ref={iframeRef}
              src={src}
              title="Acendia intro video"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlayPause}
                aria-label={paused ? "Play video" : "Pause video"}
                className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur transition-colors hover:bg-black/90"
              >
                {paused ? (
                  <Play className="ml-0.5 h-5 w-5" fill="currentColor" strokeWidth={0} />
                ) : (
                  <Pause className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                )}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute video" : "Mute video"}
                className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur transition-colors hover:bg-black/90"
              >
                {muted ? <VolumeX className="h-5 w-5" strokeWidth={2} /> : <Volume2 className="h-5 w-5" strokeWidth={2} />}
              </button>
            </div>
          </>
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
