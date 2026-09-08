import { useState, useEffect, useRef } from "react";
import { logo } from "../assets";

const tokensList = [
  { id: "mika", name: "Mikayla Protocol", ticker: "$MIKA", price: "$0.0428", change: "+342.8%", isUp: true, mcap: "$42.8M", category: "Platform Token" },
  { id: "aria", name: "Aria Brooks", ticker: "$ARIA", price: "$0.0192", change: "+54.2%", isUp: true, mcap: "$19.2M", category: "Haute Boudoir" },
  { id: "kira", name: "Kira Fox", ticker: "$KIRA", price: "$0.0215", change: "+42.5%", isUp: true, mcap: "$21.5M", category: "Underground DJ" },
  { id: "luna", name: "Luna St. Claire", ticker: "$LUNA", price: "$0.0310", change: "+18.1%", isUp: true, mcap: "$31.0M", category: "Nocturnal Cinema" },
  { id: "chloe", name: "Chloe Vane", ticker: "$CHLOE", price: "$0.0145", change: "+64.2%", isUp: true, mcap: "$14.5M", category: "Parisian Boudoir" },
  { id: "solar", name: "Solaris Creator Trust", ticker: "$SOLAR", price: "$0.0240", change: "+88.9%", isUp: true, mcap: "$24.0M", category: "Agency Trust" },
];

const SearchModal = ({ isOpen, onClose, onSelectToken }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose ? onClose() : null;
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filtered = tokensList.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.ticker.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#0e100e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-[#f4f4f2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tokens, creator names, or tickers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-white/40 text-base focus:outline-none font-sans"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono text-white/40 bg-white/5 border border-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-white/5">
          {filtered.length > 0 ? (
            filtered.map((token) => (
              <div
                key={token.id}
                onClick={() => {
                  if (onSelectToken) onSelectToken(token);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-1 flex items-center justify-center shrink-0">
                    <img src={logo} alt={token.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white group-hover:text-[#d4fc50] transition-colors truncate">
                        {token.name}
                      </span>
                      <span className="text-xs font-mono text-[#a8c3a0]">
                        {token.ticker}
                      </span>
                    </div>
                    <span className="text-[11px] text-white/40 block">
                      {token.category} · Robinhood Chain L2
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono shrink-0 pl-3">
                  <div className="text-sm font-medium text-white">
                    {token.price}
                  </div>
                  <div className={`text-xs ${token.isUp ? "text-[#30d158]" : "text-[#ff453a]"}`}>
                    {token.change}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-white/40 text-sm">
              No tokens found matching "{query}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-xs text-white/40 font-mono">
          <span>{filtered.length} tokens available on bonding curve</span>
          <span className="hidden sm:inline">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
