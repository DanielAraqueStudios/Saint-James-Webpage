import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const socials = ["Instagram", "Twitter", "Spotify", "Apple Music", "Soundcloud", "YouTube"];

  return (
    <footer className="w-full bg-black py-20 px-6 md:px-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
        
        {/* Brand Left */}
        <div className="flex flex-col max-w-sm">
          <h2 className="text-3xl font-bold uppercase tracking-widest text-white mb-6">
            ARTIST<span className="text-neutral-600">_HQ</span>
          </h2>
          <p className="text-neutral-500 text-sm leading-relaxed mb-8">
            The official platform. New music, exclusive releases, and global tour updates directly from the source.
          </p>
          <div className="text-xs text-neutral-600 tracking-widest uppercase">
            &copy; {new Date().getFullYear()} Official Artist. All rights reserved.
          </div>
        </div>

        {/* Links Right */}
        <div className="flex flex-col sm:flex-row gap-12 md:gap-24 w-full md:w-auto">
          {/* Internal Navigation */}
          <div className="flex flex-col space-y-4">
            <span className="text-xs text-white font-bold uppercase tracking-widest mb-2">Explore</span>
            <a href="#releases" className="text-sm text-neutral-400 hover:text-white transition-colors">Releases</a>
            <a href="#tour" className="text-sm text-neutral-400 hover:text-white transition-colors">Tour Dates</a>
            <a href="#shop" className="text-sm text-neutral-400 hover:text-white transition-colors">Merch Store</a>
            <a href="#about" className="text-sm text-neutral-400 hover:text-white transition-colors">Biography</a>
            <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">Contact</a>
          </div>

          {/* Socials Ecosystem */}
          <div className="flex flex-col space-y-4">
            <span className="text-xs text-white font-bold uppercase tracking-widest mb-2">Connect</span>
            {socials.map((social) => (
              <a 
                key={social} 
                href="#" 
                className="group flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {social}
                <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}