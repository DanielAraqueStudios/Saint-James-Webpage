"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";
import { AudioGallery } from "@/components/AudioGallery";
import type { Producer, Track } from "@/lib/api";

type Props = {
  producer: Producer;
  tracks: Track[];
};

export function ProducerBio({ producer, tracks }: Props) {
  return (
    <div className="min-h-screen bg-saint-matte-black flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 pt-32 pb-20">

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-saint-gray hover:text-saint-white transition-colors uppercase tracking-widest text-sm mb-16"
          >
            <ArrowLeft size={16} /> The Vision
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] border border-saint-charcoal"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-saint-vivid-black/60 via-transparent to-transparent z-10" />
            <Image
              src={producer.image_url}
              alt={producer.full_name}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="flex flex-col space-y-8 pt-4"
          >
            <div>
              <p className="text-saint-gray uppercase tracking-widest text-sm mb-3">{producer.role}</p>
              <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-widest text-saint-white leading-none">
                {producer.full_name}
              </h1>
            </div>

            <div className="w-16 h-px bg-saint-charcoal" />

            <div className="space-y-5">
              {producer.bio.map((paragraph, i) => (
                <p key={i} className="text-saint-gray leading-relaxed text-lg">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-3 bg-saint-purple text-saint-white py-4 px-8 rounded-xl font-bold uppercase tracking-widest hover:bg-saint-purple/80 transition-colors text-sm"
              >
                Work With {producer.name}
              </Link>
            </div>
          </motion.div>
        </div>

        {tracks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-24"
          >
            <h2 className="text-3xl font-bold uppercase tracking-widest mb-8">
              {producer.name}&apos;s <span className="text-saint-light-blue">Sounds</span>
            </h2>
            <AudioGallery tracks={tracks} />
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
