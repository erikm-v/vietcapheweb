import { MotionConfig, motion, useScroll, useSpring } from "motion/react";
import { Nav } from "./sections/Nav";
import { Hero } from "./sections/Hero";
import { NotesBand } from "./sections/NotesBand";
import { Story } from "./sections/Story";
import { WhyRobusta } from "./sections/WhyRobusta";
import { Coffee } from "./sections/Coffee";
import { Process } from "./sections/Process";
import { Faq } from "./sections/Faq";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  return (
    <MotionConfig reducedMotion="user">
      <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-ink" />
      <Nav />
      <main>
        <Hero />
        <NotesBand />
        <Story />
        <WhyRobusta />
        <Coffee />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
