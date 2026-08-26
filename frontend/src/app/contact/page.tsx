"use client";

import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { getProducers } from "@/lib/api";
import { Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  // Route the general contact WhatsApp to Santi (Head Producer), read live
  // from admin so it stays in sync with whatever number is set there.
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    getProducers()
      .then((producers) => {
        const santi = producers.find((p) => p.slug === "santi");
        if (santi?.whatsapp_number) setWhatsappNumber(santi.whatsapp_number);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-saint-matte-black pt-32 pb-16 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full px-6 flex-grow flex flex-col items-center justify-center text-center">
        
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest text-saint-white">
          Let&apos;s <span className="text-saint-blue">Connect</span>
        </h1>
        <p className="mt-8 text-saint-light max-w-2xl text-xl leading-relaxed mb-16">
          Reach out to inquire about our services or start a conversation about shaping your next sonic experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* WhatsApp Action */}
          {whatsappNumber ? (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-12 border border-saint-charcoal rounded-3xl hover:bg-saint-charcoal hover:scale-105 transition-all duration-300 group"
            >
              <MessageSquare size={48} className="text-saint-purple mb-6 group-hover:text-saint-white transition-colors" />
              <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">WhatsApp</h2>
              <p className="text-saint-gray">Instant Messaging</p>
            </a>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border border-saint-charcoal rounded-3xl opacity-50">
              <MessageSquare size={48} className="text-saint-purple mb-6" />
              <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">WhatsApp</h2>
              <p className="text-saint-gray">Instant Messaging</p>
            </div>
          )}

          {/* Email Action */}
          <a
            href="mailto:contact.saintsproductions@gmail.com"
            className="flex flex-col items-center justify-center p-12 border border-saint-charcoal rounded-3xl hover:bg-saint-charcoal hover:scale-105 transition-all duration-300 group"
          >
            <Mail size={48} className="text-saint-blue mb-6 group-hover:text-saint-white transition-colors" />
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">Email</h2>
            <p className="text-saint-gray">contact.saintsproductions@gmail.com</p>
          </a>
        </div>

      </div>

      <div className="mt-20">
         <Footer />
      </div>
    </div>
  );
}
