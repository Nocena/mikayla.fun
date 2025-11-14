import Button from "./Button";
import Heading from "./Heading";
import Section from "./Section";
import Tagline from "./Tagline";
import { roadmap } from "../constants";
import { check2, grid, loading1 } from "../assets";
import { Gradient } from "./design/Roadmap";

const Roadmap = () => (
  <>
    <style>{`
      @keyframes float-roadmap {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      @keyframes pulse-status {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.05);
        }
      }

      @keyframes shimmer-card {
        0% {
          transform: translateX(-100%) rotate(45deg);
        }
        100% {
          transform: translateX(200%) rotate(45deg);
        }
      }

      @keyframes grid-pulse {
        0%, 100% {
          opacity: 0.5;
        }
        50% {
          opacity: 0.8;
        }
      }

      .animate-float-roadmap {
        animation: float-roadmap 4s ease-in-out infinite;
      }

      .animate-pulse-status {
        animation: pulse-status 2s ease-in-out infinite;
      }

      .animate-shimmer-card {
        animation: shimmer-card 3s infinite;
      }

      .animate-grid-pulse {
        animation: grid-pulse 3s ease-in-out infinite;
      }

      /* Stagger animation for roadmap cards */
      .roadmap-card {
        animation: float-roadmap 4s ease-in-out infinite;
      }

      .roadmap-card:nth-child(1) { animation-delay: 0s; }
      .roadmap-card:nth-child(2) { animation-delay: 0.2s; }
      .roadmap-card:nth-child(3) { animation-delay: 0.4s; }
      .roadmap-card:nth-child(4) { animation-delay: 0.6s; }
    `}</style>

    <Section className="overflow-hidden" id="roadmap">
      <div className="container md:pb-10">
        <Heading tag="Ready to get started" title="What we're working on" />

        <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]">
          {roadmap.map((item, index) => {
            const status = item.status === "done" ? "Done" : "In progress";
            const isDone = item.status === "done";

            return (
              <div
                className={`md:flex even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] transition-all duration-500 group/card hover:scale-[1.02] roadmap-card ${
                  item.colorful ? "bg-conic-gradient" : "bg-n-6"
                }`}
                key={item.id}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Outer glow effect on hover */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-color-1/20 via-transparent to-color-2/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />

                <div className="relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15 transition-all duration-500 group-hover/card:bg-n-7/50">
                  {/* Enhanced Grid Background */}
                  <div className="absolute top-0 left-0 max-w-full opacity-50 group-hover/card:opacity-70 transition-opacity duration-500">
                    <img
                      className="w-full animate-grid-pulse"
                      src={grid}
                      width={550}
                      height={550}
                      alt="Grid"
                    />
                  </div>

                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 overflow-hidden opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:animate-shimmer-card" />
                  </div>

                  <div className="relative z-1">
                    {/* Enhanced Header with Date and Status */}
                    <div className="flex items-center justify-between max-w-[27rem] mb-8 md:mb-20">
                      <Tagline>{item.date}</Tagline>

                      {/* Enhanced Status Badge */}
                      <div className={`flex items-center px-4 py-1.5 rounded-lg text-n-8 font-code font-bold transition-all duration-300 group-hover/card:scale-105 ${
                        isDone 
                          ? "bg-gradient-to-r from-green-400 to-green-500 group-hover/card:shadow-lg group-hover/card:shadow-green-400/30" 
                          : "bg-gradient-to-r from-color-1 to-color-2 group-hover/card:shadow-lg group-hover/card:shadow-color-1/30"
                      }`}>
                        <div className="relative mr-2.5">
                          {/* Pulsing animation for "In progress" */}
                          {!isDone && (
                            <div className="absolute inset-0 bg-white rounded-full animate-pulse-status" />
                          )}
                          <img
                            className="relative"
                            src={isDone ? check2 : loading1}
                            width={16}
                            height={16}
                            alt={status}
                          />
                        </div>
                        <div className="text-xs uppercase tracking-wider">{status}</div>
                      </div>
                    </div>

                    {/* Enhanced Image Container */}
                    <div className="mb-10 -my-10 -mx-15 overflow-hidden rounded-xl relative group/image">
                      {/* Image overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-n-8/80 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                      
                      <img
                        className="w-full transition-all duration-700 group-hover/image:scale-110"
                        src={item.imageUrl}
                        width={628}
                        height={426}
                        alt={item.title}
                      />
                    </div>

                    {/* Enhanced Title */}
                    <h4 className="h4 mb-4 transition-all duration-300 group-hover/card:text-n-1 group-hover/card:translate-x-1">
                      {item.title}
                    </h4>

                    {/* Enhanced Description */}
                    <p className="body-2 text-n-4 transition-all duration-300 group-hover/card:text-n-3 leading-relaxed">
                      {item.text}
                    </p>

                    {/* Progress indicator for colorful cards */}
                    {item.colorful && (
                      <div className="mt-6 pt-6 border-t border-n-6 opacity-0 group-hover/card:opacity-100 transition-all duration-500">
                        <div className="flex items-center justify-between text-xs font-code text-n-4 mb-2">
                          <span>Progress</span>
                          <span className="text-color-1 font-bold">{isDone ? "100%" : "75%"}</span>
                        </div>
                        <div className="w-full h-1.5 bg-n-6 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r from-color-1 to-color-2 rounded-full transition-all duration-1000 ${
                              isDone ? "w-full" : "w-3/4"
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <Gradient />
        </div>

        {/* Enhanced CTA Button */}
        <div className="flex justify-center mt-12 md:mt-15 xl:mt-20">
          <Button 
            href="https://cyreneai.com/"
            className="transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-color-1/20 group/btn"
          >
            <span className="relative">
              Join us
              <span className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/btn:opacity-100 group-hover/btn:right-[-20px] transition-all duration-300">
                →
              </span>
            </span>
          </Button>
        </div>
      </div>
    </Section>
  </>
);

export default Roadmap;