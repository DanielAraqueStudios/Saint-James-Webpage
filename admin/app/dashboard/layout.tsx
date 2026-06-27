"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!localStorage.getItem("saints_token")) {
      router.replace("/login");
    }
  }, [router]);

  function logout() {
    localStorage.removeItem("saints_token");
    router.replace("/login");
  }

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/producers", label: "Producers" },
    { href: "/dashboard/tracks", label: "Tracks" },
    { href: "/dashboard/tracks/upload", label: "Upload Track" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-white font-bold text-lg">Saint&apos;s Admin</h1>
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
      </aside>
      <main className="flex-1 p-8 text-white">{children}</main>
    </div>
  );
}
