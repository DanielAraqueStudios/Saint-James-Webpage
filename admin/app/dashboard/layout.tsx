"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ConsolePanel } from "@/components/ConsolePanel";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("saints_token")) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function logout() {
    localStorage.removeItem("saints_token");
    router.replace("/login");
  }

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/producers", label: "Producers" },
    { href: "/dashboard/tracks", label: "Tracks" },
    { href: "/dashboard/tracks/upload", label: "Upload Track" },
    { href: "/dashboard/categories", label: "Categories" },
  ];

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h1 className="text-white font-bold text-lg">Saint&apos;s Admin</h1>
        <button
          onClick={() => setMenuOpen(false)}
          className="md:hidden text-gray-400 hover:text-white text-xl leading-none"
          aria-label="Close menu"
        >
          &times;
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === l.href
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full text-left text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row">
      <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
        <h1 className="text-white font-bold text-lg">Saint&apos;s Admin</h1>
        <button
          onClick={() => setMenuOpen(true)}
          className="text-gray-400 hover:text-white"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-gray-900 border-r border-gray-800 flex flex-col transform transition-transform duration-200 md:static md:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      <main className="flex-1 p-4 md:p-8 pb-16 text-white min-w-0">{children}</main>
      <ConsolePanel />
    </div>
  );
}
