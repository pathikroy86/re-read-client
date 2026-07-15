import { BackendStatusSection } from "@/components/pages/home/BackendStatusSection";
import { FaqNewsletterSection } from "@/components/pages/home/FaqNewsletterSection";
import FeaturedBooksSection from "@/components/pages/home/FeaturedBooksSection";
import { GenreSection } from "@/components/pages/home/GenreSection";
import HeroSection from "@/components/pages/home/HeroSection";
import { HowItWorksSection } from "@/components/pages/home/HowItWorksSection";
import { ReadingJournalSection } from "@/components/pages/home/ReadingJournalSection";
import { StatsSection } from "@/components/pages/home/StatsSection";
import { TestimonialSection } from "@/components/pages/home/TestimonialSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <BackendStatusSection />
      <FeaturedBooksSection />
      <GenreSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialSection />
      <ReadingJournalSection />
      <FaqNewsletterSection />
    </div>
  );
}
