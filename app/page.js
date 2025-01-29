import Image from "next/image";
import { Button } from "@/components/ui/button"
import LandingHeader from "./dashboard/_components/LandingHeader";
import LandingPage from "./dashboard/_components/LandingPage";

export default function Home() {
  return (
    <div>
      <LandingHeader/>
      <LandingPage/>
    </div>
  );
}