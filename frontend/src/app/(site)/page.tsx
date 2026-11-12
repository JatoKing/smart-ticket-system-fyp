import type { Metadata } from "next";
import FixturesSection from "@/components/site/FixturesSection";
import HeroSection from "@/components/site/HeroSection";
import KeyboardReveal from "@/components/site/KeyboardReveal";
import SmoothScroll from "@/components/site/SmoothScroll";
import LineupSection from "@/components/site/LineupSection";
import VenueSection from "@/components/site/VenueSection";
import Navbar from "@/components/site/Navbar";
import SiteFooter from "@/components/site/SiteFooter";
import "@/components/site/site.css";
import "@/components/site/fixtures.css";
import "@/components/site/lineup.css";
import "@/components/site/venue.css";
import "@/components/site/seatmap.css";

export const metadata: Metadata = {
  title: { absolute: "NFT — National Football Ticket" },
  description: "Malaysia matchday tickets: Home and Away kits, fixtures and seats at Stadium Bukit Jalil.",
};

export default function HomePage() {
  return (
    <div className="site">
      <SmoothScroll />
      <KeyboardReveal />
      <Navbar />
      <main>
        <HeroSection />
        <FixturesSection />
        <LineupSection />
        <VenueSection />
      </main>
      <SiteFooter />
      <noscript>
        <style>{`.hero[data-intro="pending"] .hero__center,.hero[data-intro="pending"] .kit__stage,.hero[data-intro="pending"] .kit__caption{visibility:visible}`}</style>
      </noscript>
    </div>
  );
}
