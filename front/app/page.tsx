import { Hero } from "@/components/landing/Hero";
import { WhatAndWho } from "@/components/landing/WhatAndWho";
import { WhatWeOffer } from "@/components/landing/WhatWeOffer";
import { BuiltFor } from "@/components/landing/BuiltFor";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Mission } from "@/components/landing/Mission";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <Hero />
      <WhatAndWho />
      <WhatWeOffer />
      <BuiltFor />
      <HowItWorks />
      <Mission />
    </div>
  );
}
