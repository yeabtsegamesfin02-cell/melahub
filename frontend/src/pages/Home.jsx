import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedOpportunities from "../components/FeaturedOpportunities";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedOpportunities />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
}

export default Home;