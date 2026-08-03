"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Our Sounds", href: "/sounds" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 text-white px-nav-inset-sm md:px-nav-inset-lg py-8 flex justify-between items-center bg-transparent">
        <Link href="/" className="z-50 flex items-center">
          <Image src="/logo.png" alt="Saints Productions" width={752} height={846} priority className="h-nav-logo w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-6 z-50">
          <a
            href={process.env.NEXT_PUBLIC_ADMIN_URL || "https://admin-production-6328.up.railway.app"}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block text-sm uppercase tracking-widest border border-white/30 rounded-full px-5 py-2 hover:bg-white hover:text-black transition-colors"
          >
            Admin
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:scale-105 transition-transform text-white"
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-saint-vivid-black text-white flex flex-col justify-center items-center"
          >
            <ul className="text-center space-y-6 md:space-y-10">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-5xl md:text-7xl font-bold uppercase tracking-tighter hover:text-saint-purple transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + navLinks.length * 0.1, duration: 0.5 }}
              >
                <a
                  href={process.env.NEXT_PUBLIC_ADMIN_URL || "https://admin-production-6328.up.railway.app"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl md:text-3xl font-bold uppercase tracking-tighter text-saint-gray hover:text-saint-purple transition-colors"
                >
                  Admin
                </a>
              </motion.li>
            </ul>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.8 }}
               className="absolute bottom-12 uppercase tracking-widest text-sm text-saint-gray"
            >
              Shaping The Future Of Sound
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
