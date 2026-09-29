import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootNotFound() {
  return (
    <html lang="nb" className={inter.variable}>
      <body className="font-sans">
        <section className="flex min-h-screen items-center justify-center bg-[radial-gradient(60%_50%_at_50%_0%,rgba(0,64,180,.18),transparent)] px-4 text-center">
          <div>
            <p className="text-8xl font-semibold tracking-tightest text-fg sm:text-9xl">404</p>
            <h1 className="mt-4 text-lg text-muted">Siden finnes ikke · Page not found</h1>
            <Link href="/no" className="btn-primary mt-8">Til forsiden</Link>
          </div>
        </section>
      </body>
    </html>
  );
}
