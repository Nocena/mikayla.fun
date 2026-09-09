import React from "react";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Roadmap from "./components/Roadmap";
import Services from "./components/Services";
import UpcomingDrops from "./components/UpcomingDrops";
import ContentVault from "./components/ContentVault";
import ClickSpark from "./components/react-bits/ClickSpark";
import FloatingSideMenu from "./components/FloatingSideMenu";

const App = () => {
  return (
    <ClickSpark sparkColor="#d4fc50" sparkCount={9} sparkRadius={24} duration={400}>
      <div className="overflow-x-clip min-h-screen bg-[#080808] text-[#f4f4f2]">
        <Header />
        <Hero />
        <UpcomingDrops />
        <ContentVault />
        <Benefits />
        <Services />
        <Pricing />
        <Roadmap />
        <Footer />
        <FloatingSideMenu />
      </div>
      <ButtonGradient />
    </ClickSpark>
  );
};

export default App;
