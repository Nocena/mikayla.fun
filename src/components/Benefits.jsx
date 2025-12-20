import { benefits } from "../constants";
import Heading from "./Heading";
import Section from "./Section";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";

const Benefits = () => {
  return (
    <>
      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer-benefit {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-icon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-shimmer-benefit {
          animation: shimmer-benefit 2s infinite;
        }
        .animate-pulse-icon {
          animation: pulse-icon 2s ease-in-out infinite;
        }
      `}</style>

      <Section id="features">
        <div className="container relative z-2">
          {/* UPDATED HEADING FOR LAUNCHPAD CONTEXT */}
          <Heading
            className="md:max-w-md lg:max-w-2xl"
            title="Infrastructure built for the SCM Economy"
          />

          <div className="flex flex-wrap gap-10 mb-10 justify-center">
            {benefits.map((item, index) => (
              <div
                className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem] group cursor-pointer"
                style={{
                  backgroundImage: `url(${item.backgroundUrl})`,
                  animationDelay: `${index * 0.1}s`
                }}
                key={item.id}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-color-1/20 via-transparent to-color-2/20 blur-xl" />
                </div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer-benefit" />
                </div>

                <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] pointer-events-none">
                  <h5 className="h5 mb-5 transition-all duration-300 group-hover:text-n-1 group-hover:translate-x-1">
                    {item.title}
                  </h5>
                  <p className="body-2 mb-6 text-n-3 transition-all duration-300 group-hover:text-n-2 leading-relaxed">
                    {item.text}
                  </p>
                  
                  <div className="flex items-center mt-auto gap-3">
                    {/* Icon */}
                    <div className="relative flex-shrink-0 group-hover:animate-pulse-icon">
                      <div className="absolute inset-0 bg-color-1/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <img
                        src={item.iconUrl}
                        width={48}
                        height={48}
                        alt={item.title}
                        className="relative transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    {/* UPDATED TAGS LOGIC: Reads directly from item.tag */}
                    <div className="flex flex-wrap gap-2 ml-auto pointer-events-auto">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-n-6/50 border border-n-1/10 text-xs font-code font-bold uppercase tracking-wider transition-all duration-300 group-hover:bg-n-6 group-hover:border-color-1/30 group-hover:scale-105">
                        <span className="w-1.5 h-1.5 rounded-full bg-color-1 mr-2 animate-pulse" />
                        {item.tag} 
                      </span>
                    </div>
                  </div>
                </div>

                {item.light && <GradientLight />}

                <div
                  className="absolute inset-0.5 bg-n-8 transition-all duration-500 group-hover:bg-n-7"
                  style={{ clipPath: "url(#benefits)" }}
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-20">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        width={380}
                        height={362}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                <ClipPath />
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};

export default Benefits;