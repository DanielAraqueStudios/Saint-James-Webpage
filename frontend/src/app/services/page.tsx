"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Film, Gamepad2, Music, CheckCircle2, ArrowRight, ArrowLeft, Calendar, Send } from "lucide-react";

type ServiceData = {
  type: string;
  size: string;
  services: string[];
  producer: string;
};

export default function Services() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ServiceData>({
    type: "",
    size: "",
    services: [],
    producer: "",
  });

  const updateData = (key: keyof ServiceData, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleService = (service: string) => {
    setData((prev) => {
      const exists = prev.services.includes(service);
      if (exists) {
        return { ...prev, services: prev.services.filter((s) => s !== service) };
      } else {
        return { ...prev, services: [...prev.services, service] };
      }
    });
  };

  const generateLeadMessage = () => {
    return `Hello Saints Productions! I would like to start a project with the following details:%0A
- Category: ${data.type}%0A
- Project Scale: ${data.size}%0A
- Required Services: ${data.services.join(", ")}%0A
- Preferred Producer: ${data.producer}%0A%0A
Please let me know the next steps to schedule our interview!`;
  };

  return (
    <div className="min-h-screen bg-saint-matte-black pt-32 pb-16 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full px-6 flex-grow flex flex-col items-center">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest text-saint-white">
            Our <span className="text-saint-blue">Services</span>
          </h1>
          <p className="mt-4 text-saint-gray max-w-2xl mx-auto text-lg leading-relaxed">
            Design your sonic architecture. Select your project requirements below to get a tailored proposal.
          </p>
        </div>

        {/* Progress Bar indicator */}
        <div className="flex gap-3 mb-12">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-500 ${
                step >= s ? "bg-saint-purple w-12" : "bg-saint-charcoal w-6"
              }`}
            />
          ))}
        </div>

        <div className="w-full max-w-4xl relative min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: TYPE OF PROJECT */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col gap-6"
              >
                <h2 className="text-3xl font-bold uppercase tracking-widest mb-4">1. Type of Project</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: "Film/TV", icon: <Film size={40} />, desc: "Scoring and cinematic soundscapes for visual media." },
                    { id: "Videogames", icon: <Gamepad2 size={40} />, desc: "Interactive and adaptive audio for gaming experiences." },
                    { id: "Commercial Music", icon: <Music size={40} />, desc: "Production for independent artists and commercial releases." },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => updateData("type", item.id)}
                      className={`p-8 rounded-3xl border text-left transition-all duration-300 group flex flex-col gap-4
                        ${data.type === item.id 
                          ? "border-saint-purple bg-saint-purple/10" 
                          : "border-saint-charcoal bg-saint-dark-blue/30 hover:border-saint-gray"}
                      `}
                    >
                      <div className={`${data.type === item.id ? "text-saint-purple" : "text-saint-light-blue"}`}>
                        {item.icon}
                      </div>
                      <h3 className="text-2xl font-bold tracking-wider">{item.id}</h3>
                      <p className="text-sm text-saint-gray leading-relaxed">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: SIZE OF PROJECT */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col gap-6"
              >
                <h2 className="text-3xl font-bold uppercase tracking-widest mb-4">2. Size of Project</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: "Small", title: "Small Project", desc: "Indie scale, starting projects, short formats." },
                    { id: "Medium", title: "Medium Project", desc: "Standard releases, advanced developments, EP size." },
                    { id: "Large", title: "Large Project", desc: "Full feature films, complete albums, AAA games." },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => updateData("size", item.title)}
                      className={`p-8 rounded-3xl border text-left transition-all duration-300 flex flex-col gap-2
                        ${data.size === item.title 
                          ? "border-saint-blue bg-saint-blue/10" 
                          : "border-saint-charcoal bg-saint-dark-blue/30 hover:border-saint-gray"}
                      `}
                    >
                      <h3 className="text-2xl font-bold tracking-wider text-saint-white">{item.title}</h3>
                      <p className="text-sm text-saint-gray leading-relaxed">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: SERVICES REQUIRED */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col gap-6"
              >
                <h2 className="text-3xl font-bold uppercase tracking-widest mb-4">3. Services Required</h2>
                <p className="text-saint-gray mb-2">Select all that apply.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["Composition", "Production", "Mixing", "Mastering", "Full Bundle (All Services)"].map((srv) => (
                    <button
                      key={srv}
                      onClick={() => toggleService(srv)}
                      className={`p-6 rounded-2xl border flex items-center justify-between transition-all duration-300
                        ${data.services.includes(srv)
                          ? "border-saint-light-blue bg-saint-light-blue/10 text-saint-white" 
                          : "border-saint-charcoal bg-saint-dark-blue/30 text-saint-gray hover:border-saint-gray hover:text-saint-light"}
                      `}
                    >
                      <span className="text-lg font-medium tracking-wide">{srv}</span>
                      {data.services.includes(srv) && <CheckCircle2 className="text-saint-light-blue" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: SELECT PRODUCER */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col gap-6"
              >
                <h2 className="text-3xl font-bold uppercase tracking-widest mb-4">4. Select Producer</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: "Santi", label: "Santi", role: "Head Producer" },
                    { id: "Trace", label: "Trace", role: "Producer & Engineer" },
                    { id: "Ethan", label: "Ethan", role: "Producer & Composer" },
                  ].map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => updateData("producer", prod.label)}
                      className={`p-8 rounded-3xl border text-center transition-all duration-300 flex flex-col items-center gap-2
                        ${data.producer === prod.label 
                          ? "border-saint-purple bg-saint-purple/10" 
                          : "border-saint-charcoal bg-saint-dark-blue/30 hover:border-saint-gray"}
                      `}
                    >
                      <div className="w-20 h-20 rounded-full bg-saint-navy flex items-center justify-center mb-2">
                        <span className="text-2xl font-bold text-saint-light-blue">{prod.id[0]}</span>
                      </div>
                      <h3 className="text-2xl font-bold tracking-wider">{prod.label}</h3>
                      <p className="text-sm text-saint-gray uppercase">{prod.role}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: SUMMARY & CHECKOUT */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-8 bg-saint-dark-blue/40 border border-saint-charcoal p-10 rounded-3xl"
              >
                <div className="text-center">
                  <h2 className="text-4xl font-bold uppercase tracking-widest mb-4 text-saint-purple">Architecture Ready</h2>
                  <p className="text-saint-light text-lg">Review your project scope before scheduling.</p>
                </div>
                
                <div className="bg-saint-matte-black p-6 rounded-2xl border border-saint-charcoal/50 space-y-4">
                  <div className="flex justify-between border-b border-saint-charcoal/30 pb-2">
                    <span className="text-saint-gray uppercase tracking-widest text-sm">Category</span>
                    <span className="font-bold text-saint-white">{data.type}</span>
                  </div>
                  <div className="flex justify-between border-b border-saint-charcoal/30 pb-2">
                    <span className="text-saint-gray uppercase tracking-widest text-sm">Scale</span>
                    <span className="font-bold text-saint-white">{data.size}</span>
                  </div>
                  <div className="flex justify-between border-b border-saint-charcoal/30 pb-2">
                    <span className="text-saint-gray uppercase tracking-widest text-sm">Services</span>
                    <span className="font-bold text-saint-white text-right max-w-[60%]">{data.services.join(", ")}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-saint-gray uppercase tracking-widest text-sm">Lead Producer</span>
                    <span className="font-bold text-saint-blue">{data.producer}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <a
                    href="https://calendly.com" // Update to actual scheduling link
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 bg-saint-white text-saint-vivid-black py-5 px-6 rounded-xl font-bold uppercase tracking-widest hover:bg-saint-light transition-colors"
                  >
                    <Calendar size={20} />
                    Schedule Interview
                  </a>
                  <a
                    href={`https://wa.me/5491100000000?text=${generateLeadMessage()}`} // Update Phone Number
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 bg-saint-purple text-saint-white py-5 px-6 rounded-xl font-bold uppercase tracking-widest hover:bg-saint-purple/80 transition-colors"
                  >
                    <Send size={20} />
                    Send Request
                  </a>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="w-full max-w-4xl flex justify-between mt-12 border-t border-saint-charcoal pt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 text-saint-gray hover:text-saint-white transition-colors uppercase tracking-widest py-3 px-6"
            >
              <ArrowLeft size={20} /> Back
            </button>
          ) : <div></div>}

          {step < 5 && (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !data.type) || 
                (step === 2 && !data.size) || 
                (step === 3 && data.services.length === 0) || 
                (step === 4 && !data.producer)
              }
              className="flex items-center gap-2 bg-saint-charcoal/50 hover:bg-saint-charcoal text-saint-white transition-all uppercase tracking-widest py-3 px-8 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ArrowRight size={20} />
            </button>
          )}
        </div>

      </div>

      <div className="mt-20">
         <Footer />
      </div>
    </div>
  );
}