const paths: Record<string, string> = {
  price: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  quality: "M2 7h20v12H2zM7 3l5 4 5-4",
  devices: "M4 5h12v9H4zM2 18h16M19 8h3v11h-3z",
  support: "M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H4zM17 14h3v5h-3z",
  speed: "M13 2 4 14h7l-1 8 9-12h-7z",
  mobile: "M7 2h10v20H7zM11 18h2",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  card: "M2 6h20v12H2zM2 10h20M6 15h4",
  shield: "M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  check: "M5 12l5 5L20 7",
  chat: "M4 4h16v12H8l-4 4z",
  tv: "M3 5h18v12H3zM8 21h8",
};

export default function Icon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={paths[name] ?? paths.check} />
    </svg>
  );
}
