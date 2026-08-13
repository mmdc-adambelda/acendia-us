"use client";

// Ambient decorative layer for the homepage hero's left side — sits behind
// the logo/H1/copy, never in front of it (aria-hidden canvas, pointer-events
// disabled, z-order below the text via DOM order). Desktop/laptop only
// (lg:+): a full canvas animation isn't worth the extra JS/paint cost on
// mobile where the hero already stacks vertically and there's no "left side"
// to decorate.
//
// Per the brand direction: every moving body and its trailing wake uses the
// single Acendia accent color (#5B50FF) — only the orbital component's own
// SOLAR_SYSTEM shapes/speeds are reused, not its default multi-color
// palette. The Sun (stationary relative to the camera by design — see the
// component's own header comment) uses the lighter accent-family tone
// (#8B5CF6) already established for the pricing card, so the whole scene
// stays inside the one brand palette instead of introducing new colors.
import { OrbitalHeroSection, SOLAR_SYSTEM, type Planet } from "@/components/ui/orbital-hero-section";

const ACCENT_PLANETS: Planet[] = SOLAR_SYSTEM.map((p) => ({ ...p, color: "#5B50FF" }));

export default function HeroOrbitalBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 hidden w-[58%] lg:block"
      style={{
        // Fades the whole layer (including its own opaque canvas fill) to
        // transparent before it reaches the hero's right side, so it blends
        // into the existing bg-grid/off-black background instead of
        // showing a hard rectangular edge. The component's own `scrim`
        // prop (below) is a separate concern — it darkens the *scene*
        // content so any text sitting on the left is still readable.
        WebkitMaskImage: "linear-gradient(to right, black 0%, black 45%, transparent 88%)",
        maskImage: "linear-gradient(to right, black 0%, black 45%, transparent 88%)",
      }}
    >
      <OrbitalHeroSection
        planets={ACCENT_PLANETS}
        sunColor="#8B5CF6"
        focus={[0.12, 0.5]}
        scrim="right"
        scrimStrength={0.95}
        viewRadius={3.2}
        trailYears={2.2}
        starCount={180}
        glow={0.6}
        interactive={false}
        showSunTrack={false}
        className="h-full w-full"
      />
    </div>
  );
}
