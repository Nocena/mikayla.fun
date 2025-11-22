import { curve, heroBackground, robot } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { heroIcons } from "../constants";
import { ScrollParallax } from "react-just-parallax";
import { useRef, useState } from "react";
import Generating from "./Generating";
import Notification from "./Notification";
import CompanyLogos from "./CompanyLogos";

const Hero = () => {
  const parallaxRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleCopyCA = () => {
    const ca = "cjng4fc3wuizyym4mznkduuxq9v9bs6junk7xyszcjyb";
    navigator.clipboard.writeText(ca);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @keyframes gradient-shift-hero {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-shift-hero {
          background-size: 200% 200%;
          animation: gradient-shift-hero 3s ease infinite;
        }
      `}</style>

      <Section
        className="pt-[12rem] -mt-[5.25rem]"
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
        customPaddings
        id="hero"
      >
        <div className="container relative" ref={parallaxRef}>
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
            {/* Enhanced Heading */}
            <h1 className="h1 mb-6">
              Say hello to {` `}
              <span className="inline-block relative">
                <span className="bg-gradient-to-r from-n-1 via-color-1 to-n-1 bg-clip-text text-transparent animate-gradient-shift-hero">
                  Mikayla
                </span>{" "}
                <img
                  src={curve}
                  className="absolute top-full left-0 w-full xl:-mt-2"
                  width={624}
                  height={28}
                  alt="Curve"
                />
              </span>
            </h1>

            {/* Enhanced Description */}
            <p className="body-1 max-w-3xl mx-auto mb-8 text-n-2 lg:mb-10 leading-relaxed">
              The first AI assistant for OnlyFans chatters that features its own Solana token, designed to help degens who support us early profit alongside us.
            </p>
            
            {/* Enhanced & Desktop/Mobile-Responsive Token CA */}
            <div className="relative group inline-block w-full max-w-md mx-auto px-4 md:max-w-2xl lg:max-w-3xl">
              {/* Gradient glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-color-1/20 via-color-2/20 to-color-3/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between items-center gap-3 md:gap-6 px-4 md:px-6 py-4 md:py-5 bg-n-9/60 backdrop-blur-md border border-n-1/10 rounded-2xl group-hover:border-color-1/30 transition-all duration-300 group-hover:bg-n-9/80">
                {/* CA Label & Code Container */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 flex-1 w-full md:w-auto">
                  {/* CA Label */}
                  <span className="text-xs text-n-4/80 font-mono uppercase tracking-widest font-bold md:shrink-0">
                    Contract Address
                  </span>
                  
                  {/* CA Code - Better mobile & desktop handling */}
                  <code className="text-xs md:text-sm font-mono text-n-1/90 tracking-tight break-all md:break-normal text-center md:text-left leading-relaxed px-2 md:px-0">
                    cjng4fc3wuizyym4mznkduuxq9v9bs6junk7xyszcjyb
                  </code>
                </div>
                
                {/* Copy Button - Centered below on mobile, right side on desktop */}
                <button
                  onClick={handleCopyCA}
                  className="relative flex items-center justify-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-n-7/50 hover:bg-n-7 rounded-xl transition-all duration-300 group/btn w-full sm:w-auto md:shrink-0"
                  aria-label="Copy contract address"
                >
                  {/* Button glow */}
                  <div className="absolute inset-0 bg-color-1/20 rounded-xl opacity-0 group-hover/btn:opacity-100 blur-md transition-opacity duration-300" />
                  
                  {copied ? (
                    <>
                      <svg className="relative w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="relative text-xs md:text-sm font-code text-green-400 font-bold whitespace-nowrap">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="relative w-4 h-4 text-n-3 group-hover/btn:text-color-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="relative text-xs md:text-sm font-code text-n-3 group-hover/btn:text-n-1 transition-colors font-bold whitespace-nowrap">Copy Address</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Enhanced Hero Image Container */}
          <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24 group">
            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-color-1/10 via-transparent to-color-2/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl" />
            
            <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient transition-transform duration-500 group-hover:scale-[1.02]">
              <div className="relative bg-n-8 rounded-[1rem]">
                <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />

                <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                  <img
                    src={robot}
                    className="w-full scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%] transition-transform duration-700 group-hover:scale-[1.02]"
                    width={1024}
                    height={490}
                    alt="AI"
                  />

                  <Generating className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" />

                  <ScrollParallax isAbsolutelyPositioned>
                    <ul className="hidden absolute -left-[5.5rem] bottom-[7.5rem] px-1 py-1 bg-n-9/60 backdrop-blur-md border border-n-1/10 rounded-2xl xl:flex hover:bg-n-9/80 transition-all duration-300 group/icons">
                      {heroIcons.map((icon, index) => (
                        <li 
                          className="p-5 transition-transform duration-300 hover:scale-110" 
                          key={index}
                          style={{ transitionDelay: `${index * 50}ms` }}
                        >
                          <img src={icon} width={24} height={25} alt={icon} />
                        </li>
                      ))}
                    </ul>
                  </ScrollParallax>

                  {/* Notification positioned at the right edge of the image */}
                  <div className="hidden absolute -right-8 top-1/3 -translate-y-1/2 xl:block">
                    <Notification
                      className="w-[18rem]"
                      title="Answer ready"
                    />
                  </div>
                </div>
              </div>

              <Gradient />
            </div>
            
            <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
              <img
                src={heroBackground}
                className="w-full"
                width={1440}
                height={1800}
                alt="hero"
              />
            </div>

            <BackgroundCircles />
          </div>

          <CompanyLogos className="hidden relative z-10 mt-20 lg:block" />
        </div>

        <BottomLine />
      </Section>
    </>
  );
};

export default Hero;