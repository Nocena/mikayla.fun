// Removed 'useState' and 'useEffect' imports as they are no longer needed for control logic
import { companyLogos } from "../constants"; 

// The component is simplified to only accept className props
const CompanyLogos = ({ className }) => {
  
  // Define the indexes for the integrated platforms statically
  const integratedIndexes = [0, 1]; // OnlyFans (0) and Fansly (1)
  
  return (
    <>
      <style>{`
        /* Keep static animations for subtle background effects */
        @keyframes fade-in-logo {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        /* Keep subtle, slow holographic shimmer for richness */
        @keyframes holographic-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-fade-in-logo {
          animation: fade-in-logo 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Removed 'key' attribute */}
      <div className={className}>
        {/* Enhanced tagline - CENTERED */}
        <div className="relative text-center mb-8">
          <h5 className="tagline text-n-1/70 font-semibold tracking-wider uppercase text-xs inline-block">
            Currently working on these platforms
          </h5>
          {/* Subtle underline accent */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-color-1/50 to-color-2/50 to-transparent" />
        </div>

        {/* Enhanced logo grid with richer hover effects */}
        <ul className="flex flex-wrap justify-center gap-6 md:gap-10">
          {companyLogos.map((logo, index) => {
            const isIntegrated = integratedIndexes.includes(index);

            return (
              <li
                // Static fade-in applied to all items on initial load
                className={`relative group animate-fade-in-logo rounded-2xl`}
                key={index}
                style={{ animationDelay: `${index * 0.1}s` }} // Staggered initial load
              >
                {/* Holographic background border for integrated platforms */}
                {isIntegrated && (
                  <div className={`
                    absolute inset-[-1px] rounded-[1.3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none 
                  `}>
                    <div 
                      className="absolute inset-0 rounded-[1.3rem] bg-gradient-to-r from-color-1 via-color-2 to-color-3"
                      style={{
                        backgroundSize: '300% 300%',
                        animation: 'holographic-shift 6s ease infinite',
                        filter: 'blur(3px)',
                      }}
                    />
                  </div>
                )}
                
                {/* Hover background glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${isIntegrated ? 'from-color-1/20 to-color-2/20' : 'from-color-1/5 to-color-2/5'} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
                
                {/* Card container - Adjusted for richer look */}
                <div className={`relative flex items-center justify-center h-[9rem] w-[10rem] px-8 rounded-2xl border bg-n-8/70 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-color-1/20 ${
                  isIntegrated 
                    ? 'border-n-6 group-hover:border-color-1/30 group-hover:bg-n-7/70' 
                    : 'border-n-6/50 group-hover:border-n-5'
                }`}>
                  
                  {/* Shimmer effect on hover - only for integrated */}
                  {isIntegrated && (
                    <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  )}

                  {/* Subtle corner accent - only for integrated */}
                  {isIntegrated && (
                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-color-1/30 to-transparent rounded-tr-2xl rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}
                  
                  {/* Logo */}
                  <img 
                    src={logo} 
                    width={134} 
                    height={28} 
                    alt={`Platform ${index + 1}`}
                    className={`relative z-10 transition-all duration-300 ${
                      isIntegrated 
                        ? 'grayscale-[30%] group-hover:grayscale-0 group-hover:brightness-110' 
                        : 'grayscale opacity-40 group-hover:opacity-60'
                    }`}
                  />

                  {/* Bottom indicator - only for integrated */}
                  {isIntegrated && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-color-1 via-color-2 to-color-3 group-hover:w-16 transition-all duration-300" />
                  )}
                </div>

                {/* Status badge on hover - uses rainbow gradient */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-n-7 border rounded-full text-xs font-code font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-xl shadow-n-9/50">
                  <span className={`${isIntegrated ? 'bg-gradient-to-r from-color-1 to-color-3 bg-clip-text text-transparent border-color-1/50' : 'text-n-3 border-n-1/20'}`}>
                    {isIntegrated ? '✓ Integrated' : 'Coming Soon'}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Trust indicator - CENTERED, using dynamic color for the text */}
        <div className="flex items-center justify-center gap-2 mt-12 text-n-4 text-sm font-code">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-color-1 to-color-3 animate-pulse-glow" />
          <span className="bg-gradient-to-r from-color-1 to-color-3 bg-clip-text text-transparent font-extrabold">
            OnlyFans & Fansly integration live
          </span> 
          <span className="text-n-4">• More platforms coming</span>
        </div>
      </div>
    </>
  );
};

export default CompanyLogos;