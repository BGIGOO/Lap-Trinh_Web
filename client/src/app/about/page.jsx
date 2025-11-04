import { Menu } from "lucide-react";
import AchievementSection from "./AchievementSection";
import Banner from "./Banner";
import IngredientsSection from "./IngredientsSection";
import OurStory from "./OurStory";
import MenuSection from "./Menu_Section";

export default function Home() {
  return (
    <main>
      <Banner />
      <OurStory />
      <IngredientsSection />
      <AchievementSection />
      <MenuSection />
    </main>
  );
}
