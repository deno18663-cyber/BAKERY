import BakerySceneDynamic from "@/components/three/BakerySceneDynamic";
import RegisterScrollTriggers from "@/components/three/RegisterScrollTriggers";
import Hero from "@/components/sections/Hero";
import StoryProcess from "@/components/sections/StoryProcess";
import SignatureProducts from "@/components/sections/SignatureProducts";
import MenuGrid from "@/components/sections/MenuGrid";
import BuildCustomizer from "@/components/sections/BuildCustomizer";
import BakeSchedule from "@/components/sections/BakeSchedule";
import ReviewsCarousel from "@/components/sections/ReviewsCarousel";
import Faq from "@/components/sections/Faq";
import StoreLocator from "@/components/sections/StoreLocator";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <BakerySceneDynamic />
      <RegisterScrollTriggers />
      <Hero />
      <StoryProcess />
      <SignatureProducts />
      <MenuGrid />
      <BuildCustomizer />
      <BakeSchedule />
      <ReviewsCarousel />
      <Faq />
      <StoreLocator />
      <Footer />
    </>
  );
}
