import type { Metadata } from "next";
import { Baskervville, Gotu } from "next/font/google";
import localFont from "next/font/local";
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

const avenirNext = localFont({
  src: [
    { path: "../fonts/AvenirNext-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/AvenirNext-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/AvenirNext-DemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/AvenirNext-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-avenir-next",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://saintsproductions.net";
const SITE_NAME = "Saints Productions";
const SITE_DESCRIPTION =
  "Sonic architecture, music production, and audio identity for stories that need a distinct voice.";
const SOCIAL_LINKS = [
  "https://www.instagram.com/saintsproductions.music",
  "https://youtube.com/@saintsproductions-music",
  "https://www.facebook.com/share/1ER5HNGEoP/",
  "https://www.tiktok.com/@saintsproductions.music",
];
const CONTACT_EMAIL = "contact.saintsproductions@gmail.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Saints Productions | Official Platform",
    template: `%s | ${SITE_NAME}`,
  },
  description: "Sonic architecture and production services.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    title: "Saints Productions | Official Platform",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary",
    title: "Saints Productions | Official Platform",
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
};

// Built entirely from data already rendered elsewhere in the app (Footer's
// description/social links, Contact page's email) — nothing invented here.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
  email: CONTACT_EMAIL,
  sameAs: SOCIAL_LINKS,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className={`${gotu.variable} ${baskervville.variable} ${avenirNext.variable} font-sans min-h-screen bg-saint-matte-black text-saint-white flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <NavBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
