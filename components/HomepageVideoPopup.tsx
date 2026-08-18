"use client";

import { useEffect, useRef, useState } from "react";
import { X, Volume2, VolumeX } from "lucide-react";

const YT_VIDEO_ID = "WxQQmyT4ULo";
const CLOSE_UNLOCK_SECONDS = 10;
// Session-scoped (not permanent) — the popup won't re-interrupt someone
// browsing multiple homepage visits in the same tab session, but a
// genuinely new visitor (new tab/session) still sees it once.
const DISMISSED_KEY = "acendia_video_popup_dismissed";

/**
 * Autoplaying, chrome-free YouTube popup for the homepage. Uses
 * youtube-nocookie.com (no third-party cookies until someone actually
 * plays) with controls/branding/related-videos stripped via URL params —
 * YouTube doesn't allow fully removing its logo from the player, but
 * `modestbranding=1` minimizes it and `controls=0` removes the whole
 * control bar, including the fullscreen/YouTube-logo watermark that only
 * appears on hover of the native controls.
 *
 * Autoplay only works muted (browser policy, not a choice here) — a
 * custom unmute button talks to the embed via the YouTube postMessage
 * API (`enablejsapi=1` on the iframe src is what enables this channel).
 *
 * Close is intentionally unavailable for the first 10 seconds, per the
 * request — the button doesn't render at all until then, with a visible
 * countdown in its place so it's clear why, rather than an inexplicably
 * missing close control.
 */
export default function HomepageVideoPopup() {
  const [open, setOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(CLOSE_UNLOCK_SECONDS);
  const [muted, setMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(DISMISSED_KEY) === "1";
    } catch {
      // sessionStorage can throw in locked-down/private-browsing contexts
      // — degrade to "always show" rather than crash the homepage over a
      // popup dismissal preference.
    }
    if (!dismissed) {
      // Reads a browser-only API (sessionStorage) that isn't available
      // during SSR, so the "should this be open" decision can only be made
      // after mount — starting closed and flipping open here (instead of a
      // synchronous lazy useState initializer) avoids a hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open || secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [open, secondsLeft]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && secondsLeft <= 0) close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, secondsLeft]);

  function close() {
    setOpen(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Same graceful-degradation reasoning as above — worst case the
      // popup shows again next load, which is harmless.
    }
  }

  function toggleMute() {
    const iframe = iframeRef.current;
    const next = !muted;
    setMuted(next);
    iframe?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: next ? "mute" : "unMute", args: [] }),
      "*",
    );
  }

  if (!open) return null;

  const canClose = secondsLeft <= 0;
  const src = `https://www.youtube-nocookie.com/embed/${YT_VIDEO_ID}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&enablejsapi=1`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Acendia intro video"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
    >
      <div className="relative w-full max-w-4xl">
        <div className="absolute -top-11 right-0 flex items-center gap-3">
          {canClose ? (
            <button
              type="button"
              onClick={close}
              aria-label="Close video"
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-hi)] bg-black/60 text-white transition-colors hover:bg-white hover:text-black"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          ) : (
            <span className="text-xs font-medium text-white/50">You can close this in {secondsLeft}s</span>
          )}
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-[var(--r-lg)] border border-[var(--border-hi)] shadow-[var(--shadow-dark)]">
          <iframe
            ref={iframeRef}
            src={src}
            title="Acendia intro video"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="focus-ring absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur transition-colors hover:bg-black/90"
          >
            {muted ? <VolumeX className="h-5 w-5" strokeWidth={2} /> : <Volume2 className="h-5 w-5" strokeWidth={2} />}
          </button>
        </div>
      </div>
    </div>
  );
}
