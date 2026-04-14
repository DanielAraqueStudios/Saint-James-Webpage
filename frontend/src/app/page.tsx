"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    "RE-CONCEPTUALIZING",
    "THE SONIC",
    "LANDSCAPE",
    "YOUR STORY,",
    "OUR SCORE."
  ];

  useEffect(() => {
    // Escala de tiempo manual para que pasen las palabras gradualmente.
    // Esto se ajustará una vez que tengamos el video real.
    const interval = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev < messages.length - 1) return prev + 1;
        // Cuando terminan de aparecer todos los mensajes, simulamos el fin del video.
        setTimeout(() => setVideoEnded(true), 2500); 
        clearInterval(interval);
        return prev;
      });
    }, 1500); // 1.5s per message appearance
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full h-screen bg-saint-matte-black relative overflow-hidden">
      
      {/* Background Video Component */}
      <div className="absolute inset-0 z-0">
        {/* Placeholder Video. You can replace this src with your local/hosted actual video. */}
        <video 
          className="object-cover w-full h-full opacity-60 mix-blend-screen"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="https://assets.codepen.io/3364143/7btrrd.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-saint-vivid-black via-transparent to-saint-vivid-black opacity-80" />
      </div>

      {/* Hero Content: Sequences & Frames */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        
        <AnimatePresence mode="wait">
          {!videoEnded ? (
            <motion.div 
              key="messages"
              className="flex flex-col items-center gap-2"
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              {messages.slice(0, currentMessage + 1).map((msg, idx) => (
                <motion.h1
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-saint-white"
                  style={{ textShadow: "0px 4px 20px rgba(0,0,0,0.8)" }}
                >
                  {msg}
                </motion.h1>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              {/* This is the final state/logo after the video text transition */}
              <h1 className="text-7xl md:text-9xl font-bold uppercase tracking-tighter text-saint-white">
                Saints
              </h1>
              <h2 className="text-3xl md:text-5xl font-light uppercase tracking-widest text-saint-purple mt-2">
                Productions
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Footer Ecosystem (Oculto o sutil hasta que se necesite, por ahora Absolute Bottom) */}
      <div className="absolute bottom-0 w-full z-20">
        <Footer />
      </div>
    </div>
  );
}

