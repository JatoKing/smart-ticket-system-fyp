import type { Metadata } from "next";
import FixturesSection from "@/components/site/FixturesSection";
import HeroSection from "@/components/site/HeroSection";
import LineupSection from "@/components/site/LineupSection";
import Navbar from "@/components/site/Navbar";
import "@/components/site/site.css";
import "@/components/site/fixtures.css";
import "@/components/site/lineup.css";

export const metadata: Metadata = {
  title: { absolute: "NFT — National Football Ticket" },
  description: "Malaysia matchday tickets: Home and Away kits, fixtures and seats at Stadium Bukit Jalil.",
};

export default function HomePage() {
  return (
    <div className="site">
      <Navbar />
      <main>
        <HeroSection />
        <FixturesSection />
        <LineupSection />
      </main>
      <noscript>
        <style>{`.hero[data-intro="pending"] .hero__center,.hero[data-intro="pending"] .kit__stage,.hero[data-intro="pending"] .kit__caption{visibility:visible}`}</style>
      </noscript>
    </div>
  );
}
