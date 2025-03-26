// HomePage.jsx
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomeContent from "../components/HomeContent";

const HomePage = () => (
  <div className="flex flex-col min-h-screen w-full">
    <Header />
    <main className="flex-grow" />
    <HomeContent />
    <Footer />
  </div>
);

export default HomePage;
