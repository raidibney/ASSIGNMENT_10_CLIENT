import AdvertisementSection from "@/components/AdvertisementSection";
import HeroBanner from "@/components/HeroBanner";
import LatestTickets from "@/components/LatestTickets";
import PopularRoutes from "@/components/PopularRoutes";
import WhyChooseUs from "@/components/WhyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroBanner/>
      <AdvertisementSection/>
      <LatestTickets/>
      <PopularRoutes/>
      <WhyChooseUs/>
    </div>
  );
}
