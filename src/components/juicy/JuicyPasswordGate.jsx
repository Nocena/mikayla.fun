import React, { useState } from "react";
import { Lock, KeyRound, ArrowRight, ShieldAlert, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function JuicyPasswordGate({ onAuthenticated }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim().toUpperCase() === "JUICY") {
      setError(false);
      setIsDecrypting(true);
      setTimeout(() => {
        try {
          sessionStorage.setItem("juicy_authenticated", "true");
        } catch (err) {}
        onAuthenticated();
      }, 600);
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-[#050605] text-[#f4f4f2] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ambient Grid & Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0 bg-grunge-pattern" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4fc50]/10 blur-[160px] rounded-full pointer-events-none" />

      {/* Centerpiece Decryption Terminal Card */}
      <div className="relative z-10 max-w-md w-full bg-[#0a0c0a]/90 border border-white/15 rounded-3xl p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-center">
        {/* Glowing Top Avatar */}
        <div className="mx-auto w-16 h-16 rounded-full overflow-hidden border-2 border-[#d4fc50] shadow-[0_0_20px_rgba(212,252,80,0.4)] mb-6 relative">
          <img
            src="/creators/msjuicy.jpg"
            alt="Ms Juicy P"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Security Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4fc50]/10 border border-[#d4fc50]/30 mb-4 font-mono text-[11px] uppercase tracking-widest text-[#d4fc50]">
          <Lock className="w-3.5 h-3.5" />
          <span>RESTRICTED EMBARGO // LEVEL 4</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="font-gta text-3xl sm:text-4xl text-white tracking-tight uppercase mb-2">
          CLASSIFIED DOSSIER
        </h1>
        <p className="text-white/60 text-xs sm:text-sm font-sans font-light leading-relaxed mb-8">
          The <span className="text-[#d4fc50] font-mono font-bold">$JUICY</span> syndicate portal is currently under launch embargo. Enter the authorization passkey to decrypt.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              placeholder="ENTER PASSKEY..."
              autoFocus
              className="w-full pl-10 pr-10 py-3.5 bg-black/70 border border-white/20 focus:border-[#d4fc50] rounded-xl text-white font-mono text-sm uppercase tracking-widest placeholder:text-white/30 outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#ff453a]/15 border border-[#ff453a]/40 text-[#ff453a] text-xs font-mono">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>ACCESS DENIED // INVALID PASSKEY</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isDecrypting || !password}
            className={`btn-tactile w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isDecrypting
                ? "bg-[#30d158] text-black animate-pulse shadow-[0_0_25px_rgba(48,209,88,0.5)]"
                : "bg-[#d4fc50] hover:bg-white text-black shadow-[0_0_20px_rgba(212,252,80,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            <span>{isDecrypting ? "DECRYPTING PORTAL..." : "DECRYPT ACCESS"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Mikayla Launchpad</span>
          </a>
        </div>
      </div>
    </div>
  );
}
