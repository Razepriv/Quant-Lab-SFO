import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import HowWeOperate from '@/components/sections/HowWeOperate';
import Trust from '@/components/sections/Trust';
import Contact from '@/components/sections/Contact';
import Subscribe from '@/components/sections/Subscribe';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <About />
      <HowWeOperate />
      <Trust />
      <Contact />
      <Subscribe />
      <Footer />
    </div>
  );
}
