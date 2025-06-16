import React from "react";
import Hero from "../components/Hero";
import LatestCollections from "../components/LatestCollections";
import BestSellerProducts from "../components/BestSellerProducts";
import PolicyFeatures from "../components/PolicyFeatures";
import Testimonials from "../components/Testimonials";

const Home = () => {

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw]">
      <Hero />
      <LatestCollections />
      <BestSellerProducts />
      <PolicyFeatures />
      <Testimonials />
    </div>
  );
};

export default Home;
