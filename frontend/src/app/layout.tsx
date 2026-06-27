import type { Metadata } from "next";
import { Baskervville, Gotu } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

const gotu = Gotu({
  subsets: ["latin"],
  variable: "--font-gotu",
  weight: "400",
});

const baskervville = Baskervville({
  subsets: ["latin"],
  variable: "--font-baskervville",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Saints Productions | Official Platform",
  description: "Sonic architecture and production services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className={`${gotu.variable} ${baskervville.variable} font-sans min-h-screen bg-saint-matte-black text-saint-white flex flex-col`}>
        <NavBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
