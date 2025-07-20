import React from "react";
import Banner from "../components/Banner";
import HomeContent from "../components/HomeContent";
import Promotions from "../components/Promotions";
import QuickBooking from "../components/QuickBooking";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <QuickBooking />
      <HomeContent />
      <Promotions />
    </div>
  );
};

export default HomePage;
