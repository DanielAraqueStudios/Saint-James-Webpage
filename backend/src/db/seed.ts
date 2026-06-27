import bcrypt from "bcryptjs";
import { pool } from "./client";

const producers = [
  {
    slug: "santi",
    name: "Santi",
    full_name: "Santiago Leiva",
    role: "Head Producer",
    image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&h=800&fit=crop",
    bio: [
      "Santiago Leiva is a Colombian music producer, composer, audio engineer, percussionist, and the Founder and Head Producer of Saint's Productions.",
      "Driven by a deep passion for artistic expression, Santiago believes that music is far more than entertainment—it is a language capable of shaping hearts, inspiring minds, and bringing people together.",
      "Known for his strong work ethic, creativity, organization, and collaborative spirit, Santiago approaches each production with unwavering dedication and attention to detail.",
      "As a producer, his musical identity is deeply rooted in cinematic composition, electronic music, and the fusion of diverse genres into immersive sonic experiences.",
      "For Santiago, music extends far beyond sound itself. It is about emotion, meaning, and connection.",
      "Through Saint's Productions, he is committed to crafting meaningful musical experiences and building artistic worlds that leave a lasting impact.",
    ],
  },
  {
    slug: "ethan",
    name: "Ethan",
    full_name: "Ethan Boone",
    role: "Producer & Composer",
    image_url: "https://images.unsplash.com/photo-1598462002345-0d05fe71a179?q=80&w=600&h=800&fit=crop",
    bio: [
      "Ethan Boone is an engineer, composer, guitarist, and flutist based in the United States whose work is driven by a singular purpose: to create and elevate meaningful art.",
      "His creative philosophy thrives at the intersection of beauty and chaos.",
      "Known for his imaginative and unconventional approach to problem-solving, Ethan often discovers innovative solutions by exploring paths others might overlook.",
      "While his influences span countless genres and musical traditions, Ethan draws inspiration from any music that demonstrates exceptional artistry and craftsmanship.",
      "For Ethan, music is far more than a profession—it is an essential part of life itself.",
    ],
  },
  {
    slug: "trace",
    name: "Trace",
    full_name: "Trace Thompson",
    role: "Producer & Engineer",
    image_url: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=600&h=800&fit=crop",
    bio: [
      "Trace Thompson is a multi-instrumentalist, songwriter, and recording creative with a deep-rooted passion for capturing authentic musical moments.",
      "Specializing in bass performance, Trace plays across all bass formats including acoustic, electric, fretless, and Bass VI.",
      "Raised through years of band, jazz combo, choir, vocal jazz, and collaborative work in a hip-hop collective, Trace developed both a technical foundation and a strong sense of musical intuition.",
      "Trace also offers lyric writing and ghostwriting services, with a natural ability to translate ideas and emotions into impactful lyrics.",
      "His creative philosophy centers on imperfection as a defining characteristic of meaningful music.",
      "While fully embracing the convenience of digital production, Trace consistently incorporates analog elements into his workflow.",
    ],
  },
];

export async function runSeed() {
  for (const p of producers) {
    await pool.query(
      `INSERT INTO producers (slug, name, full_name, role, image_url, bio)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (slug) DO NOTHING`,
      [p.slug, p.name, p.full_name, p.role, p.image_url, p.bio]
    );
  }
  console.log("Producers seeded.");

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "changeme";
  const hash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO admin_users (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO NOTHING`,
    [username, hash]
  );
  console.log("Admin user seeded.");
}
