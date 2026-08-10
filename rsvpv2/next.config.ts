import type { NextConfig } from "next";

// `allowedDevOrigins` only affects dev mode — Next.js 16 blocks cross-origin
// requests to dev-only JS/HMR endpoints by default. Without this, a phone on
// a different network (e.g. connected over NetBird at 100.x.x.x) loads the
// HTML but no JS chunks, leaving the entrance gate non-interactive.
// Production builds are unaffected; this is a no-op outside `next dev`.
// We use '*' because the NetBird IP rotates.
const nextConfig: NextConfig = {
  // The wedding app uses only local assets; no image remote patterns needed.
  allowedDevOrigins: ["*", "192.168.0.128", "100.84.178.4"],
};

export default nextConfig;
