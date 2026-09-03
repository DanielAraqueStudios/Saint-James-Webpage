import type { Metadata } from "next";
import { getProducers } from "@/lib/api";
import { ServicesWizard } from "./ServicesWizard";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Design your sonic architecture with Saints Productions. Select your project type, scale, and required services to get a tailored proposal.",
  alternates: { canonical: "/services" },
};

export default async function Services() {
  const producers = await getProducers().catch(() => []);
  return <ServicesWizard producers={producers} />;
}
