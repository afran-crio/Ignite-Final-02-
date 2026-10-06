import Hero from '../sections/Hero';
import About from '../sections/About';
import Approach from '../sections/Approach';
import Expertise from '../sections/Expertise';
import Works from '../sections/Works';
import Clientele from '../sections/Clientele';
import Team from '../sections/Team';
import Founder from '../sections/Founder';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Approach />
      <Expertise />
      <Works />
      {/* The clients, and beneath the logos what they say (Testimonials,
          rendered inside Clientele). */}
      <Clientele />
      <Team />
      <Founder />
    </>
  );
}
