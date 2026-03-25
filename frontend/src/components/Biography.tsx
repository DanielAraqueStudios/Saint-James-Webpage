import Image from "next/image";

export function Biography() {
  return (
    <section id="about" className="w-full bg-zinc-950 py-32 px-6 md:px-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
        
        {/* Profile Image (Fetched from Spotify Avatar) */}
        <div className="w-full md:w-1/2 relative aspect-[3/4] md:aspect-square overflow-hidden bg-black grayscale hover:grayscale-0 transition-all duration-700">
          {/* We use unoptimized for external URLs momentarily unless domains are configured in next.config.mjs */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-transparent z-10" />
          <Image 
            src="https://i.scdn.co/image/ab6775700000ee85b070b8171ce4559ae1ceb7cf"
            alt="Santiago Leiva Profile"
            fill
            className="object-cover object-top opacity-80 mix-blend-lighten"
            unoptimized
          />
        </div>

        {/* Bio Copy */}
        <div className="w-full md:w-1/2 flex flex-col space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white leading-none">
            The<br/>Vision
          </h2>
          
          <div className="space-y-6 text-neutral-400 font-light text-lg md:text-xl leading-relaxed">
            <p>
              Santiago Leiva pushes the boundaries of modern electronic music. 
              Fusing driving techno rhythms with deep, atmospheric house layers, his sound is designed for the darkest hours of the dancefloor.
            </p>
            <p>
              Drawing inspiration from industry titans while carving out a distinct sonic identity, each release and performance is an immersive journey into frequency and vibration.
            </p>
          </div>

          <div className="pt-8 flex flex-wrap gap-4">
            <a href="https://open.spotify.com/user/sadasa546?si=18ad908e57284d9a" target="_blank" rel="noopener noreferrer" className="border border-white text-white px-8 py-4 uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors">
              Follow on Spotify
            </a>
            <a href="#contact" className="border border-zinc-800 text-neutral-400 px-8 py-4 uppercase tracking-widest text-sm hover:border-white hover:text-white transition-colors">
              Press Kit
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}