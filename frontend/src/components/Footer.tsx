import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const socials = [
    { name: "Instagram", href: "https://www.instagram.com/saintsproductions.music?igsh=MXZ4bWpubzgwejI2ZA%3D%3D&utm_source=qr" },
    { name: "YouTube", href: "https://youtube.com/@saintsproductions-music?si=uEku2rWkQkzB-shv" },
    { name: "Facebook", href: "https://www.facebook.com/share/1ER5HNGEoP/?mibextid=wwXIfr" },
    { name: "TikTok", href: "https://www.tiktok.com/@saintsproductions.music?_r=1&_t=ZS-98aIYZb9xOm" },
  ];
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Our Sounds", href: "/sounds" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="w-full bg-black py-20 px-6 md:px-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">

        {/* Brand Left */}
        <div className="flex flex-row items-start gap-5 max-w-sm">
          <Image
            src="/footer_logo.png"
            alt="Saints Productions"
            width={367}
            height={560}
            className="h-footer-logo w-auto flex-shrink-0 object-contain object-left"
          />
          <div className="flex flex-col">
            <p className="text-neutral-500 text-sm leading-relaxed mb-8">
              Sonic architecture, music production, and audio identity for stories that need a distinct voice.
            </p>
            <div className="text-xs text-neutral-600 tracking-widest uppercase">
              &copy; {new Date().getFullYear()} Saints Productions. All rights reserved.
            </div>
          </div>
        </div>

        {/* Links Right */}
        <div className="flex flex-col sm:flex-row gap-12 md:gap-24 w-full md:w-auto">
          {/* Internal Navigation */}
          <div className="flex flex-col space-y-4">
            <span className="text-xs text-white font-bold uppercase tracking-widest mb-2">Explore</span>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Socials Ecosystem */}
          <div className="flex flex-col space-y-4">
            <span className="text-xs text-white font-bold uppercase tracking-widest mb-2">Connect</span>
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {social.name}
                <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
