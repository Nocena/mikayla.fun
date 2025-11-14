import { companyLogos } from "../constants";

const CompanyLogos = ({ className }) => {
  return (
    <>
      <style>{`
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

        .animate-fade-in-logo {
          animation: fade-in-logo 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

      <div className={className}>
        {/* Enhanced tagline - CENTERED */}
        <div className="relative text-center mb-8">
          <h5 className="tagline text-n-1/70 font-semibold tracking-wider uppercase text-xs inline-block">
            Currently working on these platforms
          </h5>
          {/* Subtle underline accent */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-color-1/50 to-transparent" />
        </div>

        {/* Enhanced logo grid with hover effects */}
        <ul className="flex flex-wrap justify-center gap-4 md:gap-8">
          {companyLogos.map((logo, index) => {
            // Only first logo (OnlyFans) is integrated
            const isIntegrated = index === 0;
            
            return (
              <li
                className="relative group animate-fade-in-logo"
                key={index}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Hover background glow - stronger for integrated */}
                <div className={`absolute inset-0 bg-gradient-to-br ${isIntegrated ? 'from-color-1/20 to-color-2/20' : 'from-color-1/5 to-color-2/5'} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
                
                {/* Card container */}
                <div className={`relative flex items-center justify-center h-[8.5rem] px-8 rounded-2xl border bg-n-8/50 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl ${
                  isIntegrated 
                    ? 'border-n-6 group-hover:border-color-1/30 group-hover:bg-n-7/50' 
                    : 'border-n-6/50 group-hover:border-n-5'
                }`}>
                  {/* Shimmer effect on hover - only for integrated */}
                  {isIntegrated && (
                    <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  )}

                  {/* Subtle corner accent - only for integrated */}
                  {isIntegrated && (
                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-color-1/20 to-transparent rounded-tr-2xl rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-color-1 to-color-2 group-hover:w-12 transition-all duration-300" />
                  )}
                </div>

                {/* Status badge on hover */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-n-6 border rounded-full text-xs font-code font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none">
                  <span className={`${isIntegrated ? 'bg-gradient-to-r from-color-1 to-color-2 bg-clip-text text-transparent border-color-1/50' : 'text-n-3 border-n-1/20'}`}>
                    {isIntegrated ? '✓ Integrated' : 'Coming Soon'}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Trust indicator - CENTERED */}
        <div className="flex items-center justify-center gap-2 mt-8 text-n-4 text-xs">
          <div className="w-2 h-2 rounded-full bg-color-1 animate-pulse-glow" />
          <span className="font-code">OnlyFans integration live • More platforms coming</span>
        </div>
      </div>
    </>
  );
};

export default CompanyLogos;