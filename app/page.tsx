import SmoothScroll from '@/components/SmoothScroll';
import Sky from '@/components/Sky';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Story from '@/components/Story';
import Mixer from '@/components/Mixer';
import Features from '@/components/Features';
import Reviews from '@/components/Reviews';
import Pricing from '@/components/Pricing';
import Download from '@/components/Download';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SmoothScroll />
      <Sky />
      <Nav />
      <main id="main">
        <Hero />
        <Story />
        <Mixer />
        <Features />
        <Reviews />
        <Pricing />
        <Download />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
