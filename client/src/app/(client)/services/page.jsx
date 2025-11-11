import { Menu } from "lucide-react";
import Banner from "./Banner";
import MenuSection from "./Menu_Section";
import Booking from "./Booking";
import PartySection from "./PartySection";
import ServicesSection from "./ServiceSection";
import MenuVariety from "./MenuVariety";

export default function Home() {
  return (
    <main>
      <Banner />
      <Booking />
      <PartySection />
      <ServicesSection />
      <MenuVariety />
      <MenuSection />
    </main>
  );
}
