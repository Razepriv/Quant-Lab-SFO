import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import SentimentDashboard from '@/components/sections/SentimentDashboard';
import HowWeOperate from '@/components/sections/HowWeOperate';
import TradingSimulator from '@/components/sections/TradingSimulator';
import NeuralNetworkViz from '@/components/sections/NeuralNetworkViz';
import Trust from '@/components/sections/Trust';
import Contact from '@/components/sections/Contact';
import Subscribe from '@/components/sections/Subscribe';
import Footer from '@/components/sections/Footer';
import AIChat from '@/components/sections/AIChat';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <About />
      <SentimentDashboard />
      <HowWeOperate />
      <TradingSimulator />
      <NeuralNetworkViz />
      <Trust />
      <Contact />
      <Subscribe />
      <Footer />
      <AIChat />
    </div>
  );
}
