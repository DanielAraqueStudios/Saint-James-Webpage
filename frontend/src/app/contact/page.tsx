import type { Metadata } from "next";
import { getProducers } from "@/lib/api";
import { ContactContent } from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach out to Saints Productions to inquire about our services or start a conversation about your next sonic experience.",
  alternates: { canonical: "/contact" },
};

export default async function Contact() {
  // Route the general contact WhatsApp to Santi (Head Producer), read live
  // from admin so it stays in sync with whatever number is set there.
  const producers = await getProducers().catch(() => []);
  const santi = producers.find((p) => p.slug === "santi");
  const whatsappNumber = santi?.whatsapp_number ?? "";

  return <ContactContent whatsappNumber={whatsappNumber} />;
}
