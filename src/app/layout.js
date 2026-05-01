import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "MedSpeak Web",
  description: "Web hoc tieng Anh co admin, toi uu de deploy tren Vercel.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[var(--app-bg)] text-[var(--ink)]">
        <div className="min-h-screen">
          <header className="sticky top-0 z-30 border-b border-white/60 bg-[rgba(248,247,242,0.82)] backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
              <Link href="/" className="flex flex-col">
                <span className="font-[family:var(--font-display)] text-2xl leading-none text-slate-950">
                  MedSpeak
                </span>
                <span className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  English for Dr. Tran
                </span>
              </Link>

              <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 lg:flex">
                <Link href="/topics" className="transition hover:text-slate-950">
                  Daily Topics
                </Link>
                <Link href="/medical" className="transition hover:text-slate-950">
                  Medical
                </Link>
                <Link href="/procedures" className="transition hover:text-slate-950">
                  Procedures
                </Link>
                <Link href="/drills" className="transition hover:text-slate-950">
                  Drills
                </Link>
                <Link href="/listening" className="transition hover:text-slate-950">
                  Listening
                </Link>
                <Link href="/scenarios" className="transition hover:text-slate-950">
                  Scenarios
                </Link>
              </nav>

              <Link
                href="/admin"
                className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Admin
              </Link>
            </div>
          </header>

          {children}
        </div>
      </body>
    </html>
  );
}
