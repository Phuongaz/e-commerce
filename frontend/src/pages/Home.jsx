import React from "react";
import Hero from "../components/Hero";
import LatestCollections from "../components/LatestCollections";
import BestSellerProducts from "../components/BestSellerProducts";
import PolicyFeatures from "../components/PolicyFeatures";
import Testimonials from "../components/Testimonials";

const Home = () => {
  // const isDevelopment = import.meta.env.DEV;

  return (
    <div>
      <Hero />

      
      <LatestCollections />
      <BestSellerProducts />
      <PolicyFeatures />
      <Testimonials />
    </div>
  );
};

export default Home;
