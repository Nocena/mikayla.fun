import { useState } from "react";
import Section from "./Section";
import Heading from "./Heading";
import { service1, service2, service3, check } from "../assets";
import { brainwaveServices, brainwaveServicesIcons } from "../constants";
import { Gradient } from "./design/Services";
import Generating from "./Generating";
import ChatBubbleWing from "../assets/svg/ChatBubbleWing";
import { brainwaveWhiteSymbol } from "../assets";

const personalityModes = {
  slutty: "Mmm baby I've been thinking about you all day... Just been lying in bed in that little set you love...",
  brat: "Oh so NOW you miss me? Where were you yesterday when I was bored? Maybe work harder to keep my attention!",
  shy: "Oh... hiii I missed you too... I've just been working and thinking about you honestly... I'm really happy you messaged!",
  dominant: "Good boy, I like when you tell me you missed me. Now tell me what have you brought me for interrupting my day.",
  girlfriend: "Aww babe I missed you so much! I've been at the gym and got my nails done - they're your favorite color!"
};

const FanChatMessage = () => {
  return (
    <div className="absolute top-8 right-8 max-w-[17.5rem] py-6 px-8 bg-black rounded-t-xl rounded-bl-xl font-code text-base lg:top-16 lg:right-[8.75rem] lg:max-w-[17.5rem]">
      Hey Mikayla, I missed you... What have you been up to today?
      <p className="tagline absolute right-2.5 bottom-1 text-[0.625rem] text-n-3 uppercase">
        2m ago
      </p>
      <ChatBubbleWing className="absolute left-full bottom-0" />
    </div>
  );
};

const MikaylaChatMessage = ({ message }) => {
  return (
    <div className="absolute top-8 left-[3.125rem] w-full max-w-[14rem] pt-2.5 pr-2.5 pb-7 pl-5 bg-n-6 rounded-t-xl rounded-br-xl font-code text-base md:max-w-[17.5rem]">
      {message}
      <div className="absolute left-5 -bottom-[1.125rem] flex items-center justify-center w-[2.25rem] h-[2.25rem] rounded-[0.75rem]">
        <img
          src={brainwaveWhiteSymbol}
          width={64}
          height={64}
          alt="Mikayla"
        />
      </div>
      <p className="tagline absolute right-2.5 bottom-1 text-[0.625rem] text-n-3 uppercase">
        just now
      </p>
      <ChatBubbleWing
        className="absolute right-full bottom-0 -scale-x-100"
        pathClassName="fill-n-6"
      />
    </div>
  );
};

const Services = () => {
  const [selectedMode, setSelectedMode] = useState(0);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const modeKeys = Object.keys(personalityModes);
  const modeNames = ["Slutty", "Brat", "Shy Girl", "Dominant", "Girlfriend"];

  return (
    <>
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
      
      <Section id="how-to-use">
        <div className="container">
          <Heading
            title="5 year experience in the market"
            text="Allowed us to not only create a chatbot, but a fully integrated app for the modern chatter to outperform even the best ones"
          />

          <div className="relative">
            {/* Main hero card with FIXED lighter overlay */}
            <div className="relative z-1 flex items-center h-[39rem] mb-5 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 xl:h-[46rem] group hover:border-n-1/20 transition-all duration-500">
              {/* Animated gradient background - more subtle */}
              <div className="absolute inset-0 bg-gradient-to-br from-color-1/3 via-transparent to-color-2/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Image container with LIGHTER overlay */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none md:w-3/5 xl:w-auto overflow-hidden">
                <div className="relative w-full h-full">
                  <img
                    className="w-full h-full object-cover md:object-right transition-transform duration-700 group-hover:scale-105"
                    width={800}
                    alt="Smartest AI"
                    height={730}
                    src={service1}
                  />
                  {/* LIGHTER overlay gradient - reduced opacity */}
                  <div className="absolute inset-0 bg-gradient-to-r from-n-8/60 via-n-8/30 to-transparent md:via-n-8/40" />
                </div>
              </div>

              <div className="relative z-1 max-w-[17rem] ml-auto">
                <h4 className="h4 mb-4 bg-gradient-to-r from-n-1 to-n-3 bg-clip-text text-transparent">
                  Mikayla understands
                </h4>
                <p className="body-2 mb-[3rem] text-n-3">
                  Built specifically for OnlyFans conversations - not a generic chatbot
                </p>
                <ul className="body-2">
                  {brainwaveServices.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start py-4 border-t border-n-6 group/item hover:border-color-1/30 transition-all duration-300"
                    >
                      <div className="relative">
                        {/* Glow effect on check icon */}
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

              {/* FIXED: Generating component now visible */}
              <Generating className="absolute left-4 right-4 bottom-4 lg:left-1/2 lg:right-auto lg:bottom-8 lg:-translate-x-1/2" />
            </div>

            {/* Two column grid with enhanced cards */}
            <div className="relative z-1 grid gap-5 lg:grid-cols-2">
              {/* Left card - Fan message */}
              <div className="relative min-h-[39rem] border border-n-1/10 rounded-3xl overflow-hidden group hover:border-n-1/20 transition-all duration-500">
                {/* Animated gradient border effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-color-1/20 via-transparent to-color-2/20 blur-xl" />
                </div>

                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={service2}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    width={630}
                    height={750}
                    alt="robot"
                  />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-b from-n-8/0 via-n-8/50 to-n-8/95 lg:p-15">
                  <h4 className="h4 mb-4 bg-gradient-to-r from-n-1 to-n-3 bg-clip-text text-transparent">
                    Fan sends a message
                  </h4>
                  <p className="body-2 mb-[3rem] text-n-3">
                    Mikayla sees the history of each fan. What they typically respond to and what gets them going. This allows her to be much more personal with each than a chatter ever could.
                  </p>
                </div>

                <FanChatMessage />
              </div>

              {/* Right card - Personality modes */}
              <div className="relative p-4 bg-n-7 rounded-3xl overflow-hidden lg:min-h-[46rem] border border-n-1/10 group hover:border-n-1/20 transition-all duration-500">
                {/* Subtle animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-color-1/5 via-transparent to-color-3/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 py-12 px-4 xl:px-8">
                  <h4 className="h4 mb-4 bg-gradient-to-r from-n-1 to-n-3 bg-clip-text text-transparent">
                    Mikayla is in <span className="bg-gradient-to-r from-color-1 to-color-2 bg-clip-text text-transparent">{modeNames[selectedMode]}</span> mode
                  </h4>
                  <p className="body-2 mb-[2rem] text-n-3">
                    Click different personality icons below to see how Mikayla AI adapts the response style
                  </p>

                  {/* Enhanced icon selector */}
                  <ul className="flex items-center justify-between gap-2">
                    {brainwaveServicesIcons.map((item, index) => {
                      const isSelected = index === selectedMode;
                      const isHovered = hoveredIcon === index;
                      
                      return (
                        <li
                          key={index}
                          onClick={() => setSelectedMode(index)}
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
                          style={{
                            boxShadow: isSelected ? '0 0 30px rgba(172, 106, 255, 0.4)' : undefined
                          }}
                        >
                          {/* Glow effect on hover */}
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
                              width={isSelected ? 48 : 40} 
                              height={isSelected ? 48 : 40}
                              alt={modeNames[index]}
                              className="transition-all duration-300"
                            />
                          </div>
                          
                          {/* Tooltip on hover */}
                          {isHovered && !isSelected && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-n-6 rounded-lg text-xs font-code whitespace-nowrap opacity-0 animate-fade-in border border-n-1/10">
                              {modeNames[index]}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Enhanced chat preview card */}
                <div className="relative h-[20rem] bg-n-8 rounded-xl overflow-hidden md:h-[25rem] border border-n-1/10 shadow-2xl group/chat">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-n-8/30 to-transparent z-10 pointer-events-none" />
                  
                  <img
                    src={service3}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/chat:scale-105"
                    width={520}
                    height={400}
                    alt="Mikayla AI"
                  />

                  <MikaylaChatMessage message={personalityModes[modeKeys[selectedMode]]} />
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