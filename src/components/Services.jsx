import { useState } from "react";
import Section from "./Section";
import Heading from "./Heading";
import { service1, service2, service3, check } from "../assets";
import { launchpadServices, launchStages, brainwaveServicesIcons } from "../constants"; // Make sure to import the new data
import { Gradient } from "./design/Services";
import Generating from "./Generating";
import { brainwaveWhiteSymbol } from "../assets";

// Reusing the chat bubble wing for a "Transaction Notification" look
import ChatBubbleWing from "../assets/svg/ChatBubbleWing";

// COMPONENT: Simulates a User Buying the Token
const LiveTradeNotification = () => {
  return (
    <div className="absolute top-8 right-8 max-w-[17.5rem] py-6 px-8 bg-black rounded-t-xl rounded-bl-xl font-code text-base lg:top-16 lg:right-[8.75rem] lg:max-w-[17.5rem] border border-n-1/10 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs font-bold text-n-3 uppercase tracking-wider">New Buy Order</span>
      </div>
      <div className="text-n-1">
        User <span className="text-color-1">@degen_sol</span> bought <span className="text-white font-bold">5.2 SOL</span> of $MIKA
      </div>
      <p className="tagline absolute right-2.5 bottom-1 text-[0.625rem] text-n-3 uppercase">
        2s ago
      </p>
      <ChatBubbleWing className="absolute left-full bottom-0" />
    </div>
  );
};

// COMPONENT: Simulates the System Status (Bonding Curve/Migration)
const SystemStatusMessage = ({ stage }) => {
  return (
    <div className="absolute top-8 left-[3.125rem] w-full max-w-[14rem] pt-2.5 pr-2.5 pb-7 pl-5 bg-n-6 rounded-t-xl rounded-br-xl font-code text-base md:max-w-[17.5rem] border border-n-1/10">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[0.65rem] px-2 py-0.5 rounded bg-color-1/20 text-color-1 font-bold uppercase">
          {stage.status}
        </span>
      </div>
      <div className="text-n-1 leading-tight text-sm">
        {stage.description}
      </div>
      
      <div className="absolute left-5 -bottom-[1.125rem] flex items-center justify-center w-[2.25rem] h-[2.25rem] rounded-[0.75rem] bg-n-6 border border-n-1/10">
        <img
          src={brainwaveWhiteSymbol}
          width={24}
          height={24}
          alt="Mikayla"
        />
      </div>
      <p className="tagline absolute right-2.5 bottom-1 text-[0.625rem] text-n-3 uppercase">
        System
      </p>
      <ChatBubbleWing
        className="absolute right-full bottom-0 -scale-x-100"
        pathClassName="fill-n-6"
      />
    </div>
  );
};

const Services = () => {
  const [selectedStage, setSelectedStage] = useState(0);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  return (
    <>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
      
      <Section id="how-to-use">
        <div className="container">
          <Heading
            title="The Lifecycle of a Creator Token"
            text="We've automated the complex DeFi mechanics so creators can focus on content and traders can focus on price discovery."
          />

          <div className="relative">
            {/* Main hero card */}
            <div className="relative z-1 flex items-center h-[39rem] mb-5 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 xl:h-[46rem] group hover:border-n-1/20 transition-all duration-500">
              
              <div className="absolute inset-0 bg-gradient-to-br from-color-1/3 via-transparent to-color-2/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Main Image */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none md:w-3/5 xl:w-auto overflow-hidden">
                <div className="relative w-full h-full">
                  <img
                    className="w-full h-full object-cover md:object-right transition-transform duration-700 group-hover:scale-105"
                    width={800}
                    alt="Launchpad Dashboard"
                    height={730}
                    src={service1} // Recommend swapping this image for a Dashboard screenshot later
                  />
                  {/* Darker overlay to make text pop */}
                  <div className="absolute inset-0 bg-gradient-to-r from-n-8/80 via-n-8/50 to-transparent" />
                </div>
              </div>

              <div className="relative z-1 max-w-[17rem] ml-auto">
                <h4 className="h4 mb-4 bg-gradient-to-r from-n-1 to-n-3 bg-clip-text text-transparent">
                  Launch in Seconds
                </h4>
                <p className="body-2 mb-[3rem] text-n-3">
                  Mikayla handles the smart contracts, metadata, and asset authority. Just upload your profile and go live.
                </p>
                <ul className="body-2">
                  {launchpadServices.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start py-4 border-t border-n-6 group/item hover:border-color-1/30 transition-all duration-300"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-color-1/30 blur-md rounded-full scale-0 group-hover/item:scale-100 transition-transform duration-300" />
                        <img 
                          width={24} 
                          height={24} 
                          src={check} 
                          className="relative transition-transform duration-300 group-hover/item:scale-110"
                        />
                      </div>
                      <p className="ml-4 transition-colors duration-300 group-hover/item:text-n-1">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <Generating className="absolute left-4 right-4 bottom-4 lg:left-1/2 lg:right-auto lg:bottom-8 lg:-translate-x-1/2" />
            </div>

            {/* Two column grid */}
            <div className="relative z-1 grid gap-5 lg:grid-cols-2">
              
              {/* Left card - Live Trading Feed */}
              <div className="relative min-h-[39rem] border border-n-1/10 rounded-3xl overflow-hidden group hover:border-n-1/20 transition-all duration-500">
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-color-1/20 via-transparent to-color-2/20 blur-xl" />
                </div>

                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={service2} // Recommend swapping for a chart/graph image
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    width={630}
                    height={750}
                    alt="Trading Activity"
                  />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-b from-n-8/0 via-n-8/50 to-n-8/95 lg:p-15">
                  <h4 className="h4 mb-4 bg-gradient-to-r from-n-1 to-n-3 bg-clip-text text-transparent">
                    Live Trading Terminal
                  </h4>
                  <p className="body-2 mb-[3rem] text-n-3">
                    Watch the bonding curve fill in real-time. Spot the whales, track the volume, and see which creator is about to graduate to Raydium.
                  </p>
                </div>

                <LiveTradeNotification />
              </div>

              {/* Right card - Interactive Stages */}
              <div className="relative p-4 bg-n-7 rounded-3xl overflow-hidden lg:min-h-[46rem] border border-n-1/10 group hover:border-n-1/20 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-color-1/5 via-transparent to-color-3/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 py-12 px-4 xl:px-8">
                  <h4 className="h4 mb-4 bg-gradient-to-r from-n-1 to-n-3 bg-clip-text text-transparent">
                    Current Stage: <span className="text-color-1">{launchStages[selectedStage].name}</span>
                  </h4>
                  <p className="body-2 mb-[2rem] text-n-3">
                    Click the icons below to understand the journey of a creator token on Mikayla.
                  </p>

                  {/* Icon Selector */}
                  <ul className="flex items-center justify-between gap-2">
                    {brainwaveServicesIcons.map((item, index) => {
                      // Note: We are using the existing 5 icons, assuming launchStages has 5 items
                      const isSelected = index === selectedStage;
                      const isHovered = hoveredIcon === index;
                      const stageName = launchStages[index]?.name || "Stage";
                      
                      return (
                        <li
                          key={index}
                          onClick={() => setSelectedStage(index)}
                          onMouseEnter={() => setHoveredIcon(index)}
                          onMouseLeave={() => setHoveredIcon(null)}
                          className={`
                            relative rounded-2xl flex items-center justify-center cursor-pointer 
                            transition-all duration-300 ease-out
                            ${isSelected
                              ? "w-[3rem] h-[3rem] p-0.25 bg-conic-gradient md:w-[4.5rem] md:h-[4.5rem] scale-110 shadow-2xl"
                              : "flex w-10 h-10 bg-n-6 md:w-15 md:h-15 hover:bg-n-5 hover:scale-105"
                            }
                          `}
                        >
                          {(isHovered || isSelected) && (
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-color-1/30 to-color-2/30 blur-lg animate-pulse" />
                          )}
                          
                          <div
                            className={`
                              relative z-10 transition-all duration-300
                              ${isSelected
                                ? "flex items-center justify-center w-full h-full bg-n-7 rounded-[1rem]"
                                : ""
                              }
                            `}
                          >
                            <img 
                              src={item} 
                              width={isSelected ? 32 : 32} 
                              height={isSelected ? 24 : 24}
                              alt={stageName}
                              className="transition-all duration-300"
                            />
                          </div>
                          
                          {isHovered && !isSelected && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-n-6 rounded-lg text-xs font-code whitespace-nowrap opacity-0 animate-fade-in border border-n-1/10 z-20">
                              {stageName}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Status Preview Card */}
                <div className="relative h-[20rem] bg-n-8 rounded-xl overflow-hidden md:h-[25rem] border border-n-1/10 shadow-2xl group/chat">
                  <div className="absolute inset-0 bg-gradient-to-t from-n-8/30 to-transparent z-10 pointer-events-none" />
                  
                  <img
                    src={service3} // Recommend swapping for an abstract "blockchain" or "network" image
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/chat:scale-105"
                    width={520}
                    height={400}
                    alt="System Status"
                  />

                  <SystemStatusMessage stage={launchStages[selectedStage]} />
                </div>
              </div>
            </div>

            <Gradient />
          </div>
        </div>
      </Section>
    </>
  );
};

export default Services;