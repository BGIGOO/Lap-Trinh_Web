import { Menu } from "lucide-react";
import Banner from "./Banner";
import MenuSection from "./Menu_Section";
import Booking from "./Booking";

export default function Home() {
  return (
    <main>
      <Banner />
      <Booking />
      <MenuSection />
    </main>
  );
}
