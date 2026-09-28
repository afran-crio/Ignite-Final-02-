import Hero from '../sections/Hero';
import About from '../sections/About';
import BoldStats from '../components/ui/stats-bold';
import Approach from '../sections/Approach';
import Expertise from '../sections/Expertise';
import Works from '../sections/Works';
import Clientele from '../sections/Clientele';
import Testimonials from '../sections/Testimonials';
import Team from '../sections/Team';
import Founder from '../sections/Founder';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <BoldStats />
      <Approach />
      <Expertise />
      <Works />
      {/* The clients sit directly ahead of what those clients say. */}
      <Clientele />
      <Testimonials />
      <Team />
      <Founder />
    </>
  );
}
