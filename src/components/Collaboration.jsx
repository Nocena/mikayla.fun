import { brainwaveSymbol, check } from "../assets";
import { collabApps, collabContent, collabText } from "../constants";
import Button from "./Button";
import Section from "./Section";
import { LeftCurve, RightCurve } from "./design/Collaboration";

const Collaboration = () => {
  return (
    <>
      <style>{`
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        @keyframes rotate-gradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-float-icon { animation: float-icon 3s ease-in-out infinite; }
        .animate-pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
        .animate-rotate-gradient { animation: rotate-gradient 8s linear infinite; }
      `}</style>

      <Section crosses>
        <div className="container lg:flex lg:gap-12">
          {/* Left Content Section */}
          <div className="max-w-[35rem] lg:max-w-[40rem]">
            <h2 className="h2 mb-6 md:mb-10 bg-gradient-to-r from-n-1 to-n-3 bg-clip-text text-transparent leading-tight">
              Launch, Trade, and Grow with <br />
              <span className="text-color-1">Unique Leverage Tech</span>
            </h2>

            <ul className="mb-12 md:mb-16 space-y-1">
              {collabContent.map((item, index) => (
                <li 
                  className={`py-4 px-4 -mx-4 group hover:bg-n-7/30 rounded-2xl transition-all duration-300 ${item.title.includes("Leverage") ? "bg-n-7/10 border border-n-1/5" : ""}`}
                  key={item.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center mb-2">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-color-1/30 blur-md rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                      <img 
                        src={check} 
                        width={24} 
                        height={24} 
                        alt="check"
                        className="relative transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <h6 className="body-2 ml-5 font-bold transition-colors duration-300 group-hover:text-n-1 flex items-center gap-2">
                      {item.title}
                      {/* Add a 'NEW' badge if it's the leverage item */}
                      {item.title.includes("Leverage") && (
                        <span className="text-[0.65rem] bg-color-1 text-n-1 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                          Unique
                        </span>
                      )}
                    </h6>
                  </div>
                  {item.text && (
                    <p className="body-2 ml-11 text-n-4 transition-colors duration-300 group-hover:text-n-3 leading-relaxed">
                      {item.text}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            <Button href="https://mikayla.cyreneai.com/explore-projects">
              Open Trading Terminal
            </Button>
          </div>

          {/* Right Content Section */}
          <div className="lg:ml-auto xl:w-[38rem] mt-12 lg:mt-4">
            <p className="body-2 mb-8 text-n-4 md:mb-16 lg:mb-32 lg:w-[22rem] lg:mx-auto text-center lg:text-left">
              {collabText}
            </p>

            {/* Circular Container */}
            <div className="relative left-1/2 flex w-[22rem] aspect-square border border-n-6 rounded-full -translate-x-1/2 scale-75 md:scale-100 group/circle">
              {/* Outer glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-color-1/10 via-transparent to-color-2/10 opacity-0 group-hover/circle:opacity-100 transition-opacity duration-700 blur-xl" />
              
              <div className="absolute inset-0 rounded-full border border-color-1/20 animate-pulse-ring" />

              {/* Inner Circle */}
              <div className="flex w-60 aspect-square m-auto border border-n-6 rounded-full relative overflow-hidden group/inner hover:border-color-1/30 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-color-1/5 to-color-2/5 opacity-0 group-hover/inner:opacity-100 transition-opacity duration-500" />
                
                {/* Center Logo */}
                <div className="relative w-[6rem] aspect-square m-auto p-[0.2rem] bg-conic-gradient rounded-full group-hover/inner:shadow-2xl transition-shadow duration-500">
                  <div className="absolute inset-0 rounded-full bg-conic-gradient opacity-0 group-hover/inner:opacity-100 animate-rotate-gradient blur-sm" />
                  <div className="relative flex items-center justify-center w-full h-full bg-n-8 rounded-full">
                    <img
                      src={brainwaveSymbol}
                      width={48}
                      height={48}
                      alt="brainwave"
                      className="transition-transform duration-500 group-hover/inner:scale-110"
                    />
                  </div>
                </div>
              </div>

              {/* Icons */}
              <ul>
                {collabApps.map((app, index) => {
                  const rotation = index * 60; // 360 / 6 = 60 degrees per icon
                  return (
                    <li
                      key={app.id}
                      className="absolute top-0 left-1/2 h-1/2 -ml-[1.6rem] origin-bottom"
                      style={{ 
                        transform: `rotate(${rotation}deg)`,
                        animationDelay: `${index * 0.1}s`,
                        zIndex: 10 
                      }}
                    >
                      <div
                        className="relative -top-[1.6rem] flex w-[3.2rem] h-[3.2rem] bg-n-7 border border-n-1/15 rounded-xl group/app cursor-pointer transition-all duration-300 hover:bg-n-6 hover:border-color-1/30 hover:scale-110 hover:shadow-xl animate-float-icon"
                        style={{ 
                          transform: `rotate(-${rotation}deg)`,
                          animationDelay: `${index * 0.2}s`,
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-color-1/20 to-color-2/20 opacity-0 group-hover/app:opacity-100 transition-opacity duration-300" />
                        <img
                          className="m-auto relative z-10 transition-transform duration-300 group-hover/app:scale-110"
                          width={app.width}
                          height={app.height}
                          alt={app.title}
                          src={app.icon}
                        />
                        {/* Tooltip */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-n-6 rounded text-xs font-code whitespace-nowrap opacity-0 group-hover/app:opacity-100 transition-opacity duration-300 pointer-events-none border border-n-1/10 text-n-1">
                          {app.title}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <LeftCurve />
              <RightCurve />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Collaboration;