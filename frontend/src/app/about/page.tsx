"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";

export default function About() {
  const producers = [
    {
      name: "Santi",
      role: "Head Producer",
      // Grid positioning top-center
      gridClass: "col-span-2 flex justify-center",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=256&h=256&fit=crop"
    },
    {
      name: "Trace",
      role: "Producer & Engineer",
      gridClass: "flex justify-end",
      image: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=256&h=256&fit=crop"
    },
    {
      name: "Ethan",
      role: "Producer & Composer",
      gridClass: "flex justify-start",
      image: "https://images.unsplash.com/photo-1598462002345-0d05fe71a179?q=80&w=256&h=256&fit=crop"
    },
  ];

  return (
    <div className="min-h-screen bg-saint-matte-black pt-32 pb-16 flex flex-col justify-between">
      
      <div className="max-w-6xl mx-auto w-full px-6 flex-grow flex flex-col justify-center">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest">
            The <span className="text-saint-light-blue">Vision</span>
          </h1>
          <p className="mt-4 text-saint-gray max-w-2xl mx-auto text-lg leading-relaxed">
            A collective of sonic architects. Click on each producer to understand their background, specializations, and portfolio.
          </p>
        </div>

        {/* Triangle Layout Component */}
        <div className="grid grid-cols-2 gap-y-12 gap-x-8 max-w-3xl mx-auto w-full">
          {producers.map((prod, index) => (
            <motion.div
              key={prod.name}
              className={prod.gridClass}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center gap-4 focus:outline-none"
                onClick={() => {
                  // Aquí conectaremos la ruta dinámica para el perfil más adelante
                  console.log("Navigating to:", prod.name);
                }}
              >
                <div className="w-56 h-56 md:w-64 md:h-64 rounded-[2rem] overflow-hidden border border-saint-charcoal relative">
                  <div className="absolute inset-0 bg-saint-purple/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay" />
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold tracking-wider">{prod.name}</h2>
                  <p className="text-sm text-saint-gray uppercase tracking-widest">{prod.role}</p>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}