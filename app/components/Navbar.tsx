"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Tournaments",
    href: "/tournaments",
  },
  {
    label: "Players",
    href: "/players",
  },
  {
    label: "Teams",
    href: "/teams",
  },
  {
    label: "Sponsors",
    href: "/sponsors",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="group shrink-0 text-xl font-black tracking-wider"
        >
          PINTO{" "}
          <span className="text-red-500 transition group-hover:text-red-400">
            ESPORTS.
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative py-7 text-sm font-medium transition-all duration-300 ${
                  active
                    ? "text-white"
                    : "text-gray-500 hover:text-white hover:text-red-400 hover:[text-shadow:0_0_12px_rgba(239,68,68,0.7)]"
                }`}
              >
                {item.label}

                {/* Active indicator */}
                <span
                  className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 bg-red-500 transition-all duration-300 ${
                    active
                      ? "w-full shadow-[0_0_12px_rgba(239,68,68,0.9)]"
                      : "w-0 group-hover:w-full group-hover:shadow-[0_0_12px_rgba(239,68,68,0.9)]"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Login */}
          <Link
            href="/login"
            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-bold text-gray-300 transition hover:border-white/30 hover:bg-white/5 hover:text-white"
          >
            Login
          </Link>

          {/* Sign Up */}
          <Link
            href="/register/player"
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-white transition hover:bg-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.25)]"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
