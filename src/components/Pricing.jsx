import { useState } from "react";
import Section from "./Section";
import { smallSphere, stars } from "../assets";
import Heading from "./Heading";

// UPDATED: Launchpad-focused allocation (High Liquidity + Community)
const tokenAllocation = [
  { name: "Public Liquidity", percentage: 45.0, amount: "450,000,000", color: "color-4", description: "100% unlocked for trading liquidity" },
  { name: "Community", percentage: 20.0, amount: "200,000,000", color: "color-5", description: "Airdrops for top traders & creators" },
  { name: "Team", percentage: 15.0, amount: "150,000,000", color: "color-1", description: "Locked for 1 year, linear vesting" },
  { name: "CEX Listings", percentage: 10.0, amount: "100,000,000", color: "color-2", description: "Reserved for Tier 1 Exchange listings" },
  { name: "Treasury", percentage: 10.0, amount: "100,000,000", color: "color-3", description: "Future development & partnerships" },
];

const colorMap = {
  "color-1": "#AC6AFF",
  "color-2": "#FFC876",
  "color-3": "#FF776F",
  "color-4": "#7ADB78",
  "color-5": "#858DFF",
  "color-6": "#FF98E2",
};

const PieChart = ({ data, activeIndex, onHover }) => {
  let cumulativePercentage = 0;

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 rounded-full blur-3xl opacity-30">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-color-1 via-color-2 to-color-3 animate-pulse" />
      </div>
      
      <svg viewBox="0 0 200 200" className="relative w-full h-full drop-shadow-2xl">
        <defs>
          {data.map((item, index) => (
            <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorMap[item.color]} stopOpacity="1" />
              <stop offset="100%" stopColor={colorMap[item.color]} stopOpacity="0.7" />
            </linearGradient>
          ))}
          
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="innerShadow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
            <feOffset in="blur" dx="0" dy="1" result="offsetBlur"/>
            <feFlood floodColor="#000000" floodOpacity="0.3" result="offsetColor"/>
            <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur"/>
            <feBlend in="SourceGraphic" in2="offsetBlur" mode="normal"/>
          </filter>
        </defs>

        {data.map((item, index) => {
          const percentage = item.percentage;
          const startAngle = (cumulativePercentage / 100) * 360;
          const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
          cumulativePercentage += percentage;

          const startAngleRad = (startAngle - 90) * (Math.PI / 180);
          const endAngleRad = (endAngle - 90) * (Math.PI / 180);
          const outerRadius = 85;
          const innerRadius = 45;
          
          const x1 = 100 + outerRadius * Math.cos(startAngleRad);
          const y1 = 100 + outerRadius * Math.sin(startAngleRad);
          const x2 = 100 + outerRadius * Math.cos(endAngleRad);
          const y2 = 100 + outerRadius * Math.sin(endAngleRad);
          const x3 = 100 + innerRadius * Math.cos(endAngleRad);
          const y3 = 100 + innerRadius * Math.sin(endAngleRad);
          const x4 = 100 + innerRadius * Math.cos(startAngleRad);
          const y4 = 100 + innerRadius * Math.sin(startAngleRad);
          
          const largeArcFlag = percentage > 50 ? 1 : 0;
          const pathData = [
            `M ${x1} ${y1}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
            `Z`
          ].join(' ');

          const isActive = activeIndex === index;
          const scale = isActive ? 1.05 : 1;
          const opacity = activeIndex === null || isActive ? 1 : 0.4;
          const midAngle = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180);
          const centerX = 100 + ((outerRadius + innerRadius) / 2) * Math.cos(midAngle);
          const centerY = 100 + ((outerRadius + innerRadius) / 2) * Math.sin(midAngle);

          return (
            <g key={index}>
              <path
                d={pathData}
                fill={`url(#gradient-${index})`}
                opacity={opacity}
                filter="url(#shadow)"
                className="cursor-pointer transition-all duration-300 ease-out"
                onMouseEnter={() => onHover(index)}
                onMouseLeave={() => onHover(null)}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: `${centerX}px ${centerY}px`,
                  filter: isActive ? 'brightness(1.2) drop-shadow(0 0 8px currentColor)' : 'brightness(1)',
                }}
              />
              {isActive && (
                <path
                  d={pathData}
                  fill="none"
                  stroke={colorMap[item.color]}
                  strokeWidth="1.5"
                  opacity="0.8"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: `${centerX}px ${centerY}px`,
                  }}
                />
              )}
            </g>
          );
        })}

        <circle cx="100" cy="100" r="42" fill="#15131D" filter="url(#innerShadow)"/>
        <circle cx="100" cy="100" r="42" fill="url(#centerGradient)" opacity="0.1"/>
        <defs>
          <radialGradient id="centerGradient">
            <stop offset="0%" stopColor="#AC6AFF" />
            <stop offset="100%" stopColor="#858DFF" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

const Tokenomics = () => {
  const [activeSlice, setActiveSlice] = useState(null);

  return (
    <>
      <Section className="overflow-hidden" id="tokenomics">
      <div className="container relative z-2">
        <div className="hidden relative justify-center mb-[6.5rem] lg:flex">
          <img
            src={smallSphere}
            className="relative z-1"
            width={255}
            height={255}
            alt="Sphere"
          />
          <div className="absolute top-1/2 left-1/2 w-[60rem] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src={stars}
              className="w-full"
              width={950}
              height={400}
              alt="Stars"
            />
          </div>
        </div>

        {/* UPDATED HEADING */}
        <Heading
          tag="Volume Driven. Deflationary."
          title="The $MIKA Economy"
        />

        <div className="relative">
          <div className="absolute top-0 left-0 w-full pointer-events-none">
            <svg className="w-full h-32" viewBox="0 0 1200 128" preserveAspectRatio="none">
              <path
                d="M 100 128 Q 150 64, 200 0"
                stroke="url(#leftGradient)"
                strokeWidth="2"
                fill="none"
                opacity="0.3"
              />
              <path
                d="M 1100 128 Q 1050 64, 1000 0"
                stroke="url(#rightGradient)"
                strokeWidth="2"
                fill="none"
                opacity="0.3"
              />
              <defs>
                <linearGradient id="leftGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#AC6AFF" stopOpacity="0" />
                  <stop offset="100%" stopColor="#AC6AFF" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="rightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF98E2" stopOpacity="0" />
                  <stop offset="100%" stopColor="#FF98E2" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex gap-[1rem] mb-10 max-lg:flex-wrap pt-8">
            {/* LEFT CARD: Protocol Revenue */}
            <div className="w-full h-full px-6 bg-n-8 border border-n-6 rounded-[2rem] lg:w-auto even:py-14 odd:py-8 odd:my-4 [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3 hover:border-color-2 transition-all duration-300">
              <h4 className="h4 mb-4">Protocol Revenue</h4>

              <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
                A standard fee is applied to every trade on the launchpad.
              </p>

              <div className="flex items-center h-[5.5rem] mb-6">
                <div className="text-[3.5rem] leading-none font-bold">
                  1%
                </div>
              </div>

              <button className="w-full mb-6 py-3 px-4 bg-n-8 border border-n-6 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-n-7 hover:border-color-2 transition-colors">
                Trading Fees
              </button>

              <ul>
                <li className="flex items-start py-5 border-t border-n-6">
                  <img src="/assets/check.svg" width={24} height={24} />
                  <p className="body-2 ml-4">Collected in $SOL</p>
                </li>
                <li className="flex items-start py-5 border-t border-n-6">
                  <img src="/assets/check.svg" width={24} height={24} />
                  <p className="body-2 ml-4">Creation Fees (0.02 SOL)</p>
                </li>
                <li className="flex items-start py-5 border-t border-n-6">
                  <img src="/assets/check.svg" width={24} height={24} />
                  <p className="body-2 ml-4">Raydium Migration Fees</p>
                </li>
              </ul>
            </div>

            {/* MIDDLE CARD: Buyback & Burn */}
            <div className="w-full h-full px-6 bg-n-8 border border-n-6 rounded-[2rem] lg:w-auto even:py-14 odd:py-8 odd:my-4 [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3 relative group">
              <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-color-1 via-color-2 to-color-3 animate-gradient-xy blur-sm" />
              </div>
              <div className="absolute inset-0.5 bg-conic-gradient rounded-[2rem] opacity-20 pointer-events-none" />
              <div className="relative">
                <h4 className="h4 mb-4">Buyback & Burn</h4>

                <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
                  50% of all protocol fees are used to buy $MIKA from the open market and burn it.
                </p>

                <div className="flex items-center h-[5.5rem] mb-6">
                  <div className="text-[3.5rem] leading-none font-bold bg-gradient-to-r from-color-1 to-color-2 bg-clip-text text-transparent">
                    Daily
                  </div>
                </div>

                <button className="w-full mb-6 py-3 px-4 bg-n-8 border border-color-1 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gradient-to-r hover:from-color-1/10 hover:to-color-2/10 transition-all">
                  Deflationary
                </button>

                <ul>
                  <li className="flex items-start py-5 border-t border-n-6">
                    <img src="/assets/check.svg" width={24} height={24} />
                    <p className="body-2 ml-4">Constant Buy Pressure</p>
                  </li>
                  <li className="flex items-start py-5 border-t border-n-6">
                    <img src="/assets/check.svg" width={24} height={24} />
                    <p className="body-2 ml-4">Reducing Total Supply</p>
                  </li>
                  <li className="flex items-start py-5 border-t border-n-6">
                    <img src="/assets/check.svg" width={24} height={24} />
                    <p className="body-2 ml-4">Verifiable on-chain</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* RIGHT CARD: Staking/Yield */}
            <div className="w-full h-full px-6 bg-n-8 border border-n-6 rounded-[2rem] lg:w-auto even:py-14 odd:py-8 odd:my-4 [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3 hover:border-color-3 transition-all duration-300">
              <h4 className="h4 mb-4">Real Yield Staking</h4>

              <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
                Stake your $MIKA to earn the other 50% of trading fees.
              </p>

              <div className="flex items-center h-[5.5rem] mb-6">
                <div className="text-[3.5rem] leading-none font-bold">
                  Yield
                </div>
              </div>

              <button className="w-full mb-6 py-3 px-4 bg-n-8 border border-n-6 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-n-7 hover:border-color-3 transition-colors">
                Earn Passive Income
              </button>

              <ul>
                <li className="flex items-start py-5 border-t border-n-6">
                  <img src="/assets/check.svg" width={24} height={24} />
                  <p className="body-2 ml-4">Paid in $SOL or $USDC</p>
                </li>
                <li className="flex items-start py-5 border-t border-n-6">
                  <img src="/assets/check.svg" width={24} height={24} />
                  <p className="body-2 ml-4">Early access to new launches</p>
                </li>
                <li className="flex items-start py-5 border-t border-n-6">
                  <img src="/assets/check.svg" width={24} height={24} />
                  <p className="body-2 ml-4">Governance on platform rules</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Token Allocation Chart Section */}
          <div className="relative p-8 bg-gradient-to-b from-n-8 to-n-7 border border-n-6 rounded-[2rem] mb-10 overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-color-1 via-transparent to-color-2 animate-gradient-xy" />
            </div>

            <div className="relative z-10">
              <h4 className="h4 mb-12 text-center bg-gradient-to-r from-n-1 to-n-3 bg-clip-text text-transparent">
                Token Allocation
              </h4>
              
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="flex justify-center">
                  <div className="w-[320px] h-[320px] md:w-[420px] md:h-[420px] relative">
                    <PieChart 
                      data={tokenAllocation} 
                      activeIndex={activeSlice}
                      onHover={setActiveSlice}
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <div className="text-4xl font-bold bg-gradient-to-r from-color-1 to-color-2 bg-clip-text text-transparent">
                          1B
                        </div>
                        <div className="text-sm text-n-3 mt-1">Total Supply</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {tokenAllocation.map((item, index) => (
                    <div
                      key={index}
                      onMouseEnter={() => setActiveSlice(index)}
                      onMouseLeave={() => setActiveSlice(null)}
                      className={`
                        group relative p-5 rounded-2xl cursor-pointer transition-all duration-300
                        ${activeSlice === index 
                          ? 'bg-n-6 border-2 scale-105 shadow-2xl' 
                          : 'bg-n-7/50 border border-n-6 hover:bg-n-6/50'
                        }
                      `}
                      style={{
                        borderColor: activeSlice === index ? colorMap[item.color] : undefined,
                        boxShadow: activeSlice === index ? `0 0 30px ${colorMap[item.color]}40` : undefined,
                      }}
                    >
                      {activeSlice === index && (
                        <div 
                          className="absolute inset-0 rounded-2xl opacity-10"
                          style={{
                            background: `linear-gradient(135deg, ${colorMap[item.color]}20 0%, transparent 100%)`
                          }}
                        />
                      )}
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-5 h-5 rounded-lg shadow-lg transition-transform group-hover:scale-110"
                              style={{ 
                                backgroundColor: colorMap[item.color],
                                boxShadow: `0 0 15px ${colorMap[item.color]}60`
                              }}
                            />
                            <span className="font-bold text-lg">{item.name}</span>
                          </div>
                          <span 
                            className="text-xl font-bold transition-all"
                            style={{ color: activeSlice === index ? colorMap[item.color] : undefined }}
                          >
                            {item.percentage}%
                          </span>
                        </div>
                        <p className="text-sm text-n-3 ml-8 mb-2">{item.description}</p>
                        <p className="text-xs text-n-4 ml-8 font-mono">{item.amount} tokens</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="flex justify-center mt-10 px-4">
          <a
            className="group relative inline-block text-center"
            href="https://cyreneai.com/"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-color-1/20 via-color-2/20 to-color-3/20 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            
            <span className="relative inline-block text-xs md:text-sm font-code font-bold tracking-wider uppercase border-b-2 border-n-3 group-hover:border-color-1 transition-all duration-300 pb-1 px-2">
              <span className="bg-gradient-to-r from-n-1 to-n-3 group-hover:from-color-1 group-hover:to-color-2 bg-clip-text transition-all duration-300">
                Fair Launch: No VCs, No Pre-sale, Just Community
              </span>
            </span>
            
            <svg 
              className="inline-block ml-2 w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </Section>

      <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 3s ease infinite;
        }
      `}</style>
    </>
  );
};

export default Tokenomics;