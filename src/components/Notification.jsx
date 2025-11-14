import { notification1 } from "../assets";
import { notificationImages } from "../constants";

const Notification = ({ className, title }) => {
  return (
    <div
      className={`${
        className || ""
      } group relative`}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-color-1/20 to-color-2/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
      
      <div className="relative flex items-center p-4 pr-6 bg-n-9/60 backdrop-blur-md border border-n-1/10 rounded-2xl gap-5 group-hover:bg-n-9/80 group-hover:border-color-1/30 transition-all duration-300">
        {/* Enhanced image with glow */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-color-1/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <img
            src={notification1}
            width={62}
            height={62}
            alt="image"
            className="relative rounded-xl transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h6 className="mb-1 font-semibold text-base transition-colors duration-300 group-hover:text-n-1">
            {title}
          </h6>

          <div className="flex items-center justify-between gap-2">
            {/* Enhanced avatar stack */}
            <ul className="flex -m-0.5">
              {notificationImages.map((item, index) => (
                <li
                  key={index}
                  className="flex w-6 h-6 border-2 border-n-12 rounded-full overflow-hidden transition-transform duration-300 hover:scale-110 hover:z-10"
                  style={{ 
                    transitionDelay: `${index * 50}ms`,
                    zIndex: notificationImages.length - index 
                  }}
                >
                  <img
                    src={item}
                    className="w-full"
                    width={20}
                    height={20}
                    alt={item}
                  />
                </li>
              ))}
            </ul>
            
            {/* Enhanced timestamp */}
            <div className="body-2 text-n-13 transition-colors duration-300 group-hover:text-n-3">
              1m ago
            </div>
          </div>
        </div>

        {/* Subtle shimmer effect on hover */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
};

export default Notification;