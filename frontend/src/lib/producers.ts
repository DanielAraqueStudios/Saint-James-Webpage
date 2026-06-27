export type Producer = {
  slug: string;
  name: string;
  fullName: string;
  role: string;
  image: string;
  bio: string[];
};

export const producers: Producer[] = [
  {
    slug: "santi",
    name: "Santi",
    fullName: "Santiago Leiva",
    role: "Head Producer",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&h=800&fit=crop",
    bio: [
      "Santiago Leiva is a Colombian music producer, composer, audio engineer, percussionist, and the Founder and Head Producer of Saint's Productions. He earned his degree in Music Technology in the United States, specializing in music production and sound design.",
      "Driven by a deep passion for artistic expression, Santiago believes that music is far more than entertainment—it is a language capable of shaping hearts, inspiring minds, and bringing people together through shared human experiences. This belief serves as the foundation of both his creative vision and his approach to every project he undertakes.",
      "Known for his strong work ethic, creativity, organization, and collaborative spirit, Santiago approaches each production with unwavering dedication and attention to detail. He values open communication and meaningful partnerships, striving to create an environment where artists, brands, filmmakers, and creators can fully realize their vision while elevating the artistic quality of the final product.",
      "As a producer, his musical identity is deeply rooted in cinematic composition, electronic music, and the fusion of diverse genres into immersive sonic experiences. His background as a percussionist has cultivated a particular appreciation for complex rhythmic structures, dynamic arrangements, and expressive musical storytelling.",
      "For Santiago, music extends far beyond sound itself. It is about emotion, meaning, and connection — the ability to move people, leave lasting impressions, and communicate ideas that transcend words. Whether composing, producing, recording, mixing, or designing sound, his goal remains the same: to create music that resonates deeply and serves a greater artistic purpose.",
      "Through Saint's Productions, he is committed to crafting meaningful musical experiences, telling compelling stories through sound, and building artistic worlds that leave a lasting impact on those who encounter them.",
    ],
  },
  {
    slug: "ethan",
    name: "Ethan",
    fullName: "Ethan Boone",
    role: "Producer & Composer",
    image: "https://images.unsplash.com/photo-1598462002345-0d05fe71a179?q=80&w=600&h=800&fit=crop",
    bio: [
      "Ethan Boone is an engineer, composer, guitarist, and flutist based in the United States whose work is driven by a singular purpose: to create and elevate meaningful art. Whether crafting emotionally powerful musical moments for film, designing immersive soundscapes, or transforming raw audio into something entirely new, Ethan approaches every project with the heart of an artist and the precision of an engineer.",
      "His creative philosophy thrives at the intersection of beauty and chaos. By embracing both the delicate and the unconventional, he cultivates a diverse artistic palette that allows him to bring unique perspectives and compelling emotional depth to every piece of music he creates.",
      "Known for his imaginative and unconventional approach to problem-solving, Ethan often discovers innovative solutions by exploring paths others might overlook. This creative flexibility, combined with a deep appreciation for collaboration, enables him to build meaningful partnerships and bring out the best in every project.",
      "While his influences span countless genres and musical traditions, Ethan draws inspiration from any music that demonstrates exceptional artistry and craftsmanship. Though he openly admits a special affinity for guitar-driven music, his creative outlook remains broad, curious, and constantly evolving.",
      "For Ethan, music is far more than a profession—it is an essential part of life itself. He believes music has the power to shape experiences, tell stories, and connect people in ways few other art forms can. Through every project, he strives to create work that resonates deeply, leaves a lasting impact, and serves the greater purpose of artistic expression.",
    ],
  },
  {
    slug: "trace",
    name: "Trace",
    fullName: "Trace Thompson",
    role: "Producer & Engineer",
    image: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=600&h=800&fit=crop",
    bio: [
      "Trace Thompson is a multi-instrumentalist, songwriter, and recording creative with a deep-rooted passion for capturing authentic musical moments. With over nine years of songwriting experience, he brings a strong lyrical voice and the ability to craft compelling narratives across a wide range of styles.",
      "Specializing in bass performance, Trace plays across all bass formats including acoustic, electric, fretless, and Bass VI. His musical background spans jazz, indie-pop, folktronica, ambient, hip-hop, punk, grunge, and alternative rock, allowing him to move fluidly between genres while maintaining a distinct artistic identity.",
      "Raised through years of band, jazz combo, choir, vocal jazz, and collaborative work in a hip-hop collective, Trace developed both a technical foundation and a strong sense of musical intuition. As a vocalist rooted in jazz and traditional styles, he brings a nuanced understanding of tone, phrasing, and emotion to both performance and recording.",
      "Trace also offers lyric writing and ghostwriting services, with a natural ability to translate ideas and emotions into impactful, high-quality lyrics tailored to any artist or project.",
      "His creative philosophy centers on imperfection as a defining characteristic of meaningful music. Rather than chasing technical perfection, he focuses on capturing real moments—treating the microphone as a camera that preserves feeling, energy, and authenticity.",
      "While fully embracing the convenience of digital production, Trace consistently incorporates analog elements into his workflow, blending modern tools with timeless techniques to create recordings that feel both polished and alive.",
    ],
  },
];

export function getProducer(slug: string): Producer | undefined {
  return producers.find((p) => p.slug === slug);
}
