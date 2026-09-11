import React from "react";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Protocol from "./components/Protocol";
import UpcomingDrops from "./components/UpcomingDrops";
import ClickSpark from "./components/react-bits/ClickSpark";
import FloatingSideMenu from "./components/FloatingSideMenu";

const App = () => {
  return (
    <ClickSpark sparkColor="#d4fc50" sparkCount={9} sparkRadius={24} duration={400}>
      <div className="overflow-x-clip min-h-screen bg-[#080808] text-[#f4f4f2] pb-28 lg:pb-0">
        <Header />
        <Hero />
        <UpcomingDrops />
        <Protocol />
        <Footer />
        <FloatingSideMenu />
      </div>
      <ButtonGradient />
    </ClickSpark>
  );
};

export default App;
