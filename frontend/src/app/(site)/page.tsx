import type { Metadata } from "next";
import HeroSection from "@/components/site/HeroSection";
import Navbar from "@/components/site/Navbar";
import "@/components/site/site.css";

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
      </main>
      <noscript>
        <style>{`.hero[data-intro="pending"] .hero__center,.hero[data-intro="pending"] .kit__stage,.hero[data-intro="pending"] .kit__caption{visibility:visible}`}</style>
      </noscript>
    </div>
  );
}
