"use client";

import { Footer } from "@/components/Footer";
import { ReleaseGrid } from "@/components/ReleaseGrid";

export default function Sounds() {
  return (
    <div className="min-h-screen bg-saint-matte-black pt-32 pb-16 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col items-center">
        
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest text-center px-4">
          Our <span className="text-saint-purple">Sounds</span>
        </h1>
        <p className="mt-4 text-saint-gray max-w-2xl mx-auto text-lg text-center px-4 leading-relaxed mb-12">
          Experience our portfolio in action.
        </p>

        {/* Temporalmente reciclamos la parrilla de releases actual para este layout */}
        <div className="w-full">
          <ReleaseGrid />
        </div>

      </div>

      <div className="mt-20">
         <Footer />
      </div>
    </div>
  );
}