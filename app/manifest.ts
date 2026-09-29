import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Web app manifest: name, colours and icons used when the site is added to a phone's home screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} – IPTV Norge`,
    short_name: "IPTV Norge",
    description: "IPTV Norge – TV på alle skjermer. Prøv gratis i 1 dag.",
    start_url: "/no",
    display: "standalone",
    background_color: "#030a1a",
    theme_color: "#030a1a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
