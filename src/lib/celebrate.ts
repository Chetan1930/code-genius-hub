import confetti from "canvas-confetti";

/**
 * Short confetti burst after a successful API response.
 * Respects reduced-motion via canvas-confetti.
 */
export function celebrateSuccess(): void {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    return;
  }

  const colors = ["#4ade80", "#86efac", "#bbf7d0", "#ecfccb", "#ffffff"];

  void confetti({
    particleCount: 90,
    spread: 88,
    startVelocity: 38,
    ticks: 220,
    gravity: 1.05,
    origin: { y: 0.62 },
    colors,
    disableForReducedMotion: true,
    zIndex: 100,
  });

  window.setTimeout(() => {
    void confetti({
      particleCount: 45,
      spread: 100,
      startVelocity: 25,
      ticks: 180,
      origin: { y: 0.58 },
      colors,
      disableForReducedMotion: true,
      zIndex: 100,
    });
  }, 180);
}
