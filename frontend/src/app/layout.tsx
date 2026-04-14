import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
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
      <body suppressHydrationWarning className={`${spaceGrotesk.variable} font-sans min-h-screen bg-saint-matte-black text-saint-white flex flex-col`}>
        <NavBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
