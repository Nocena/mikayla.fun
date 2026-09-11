import React, { useState, useEffect } from "react";
import {
  X,
  Bell,
  Calendar,
  Download,
  Check,
  CheckCircle2,
  ArrowUpRight,
  Clock,
  Shield,
  Send,
  Sparkles
} from "lucide-react";

const JUICY_X_URL = "https://x.com/msjuicy_plenty";
const JUICY_REPOST_URL = "https://x.com/mikaylafun/status/2098092424337711392?s=20";

// Standard ISO & ICS UTC times for Friday 5:00 PM UTC (September 11, 2026 17:00:00 UTC)
const DROP_TIME_UTC_STR = "Friday, Sep 11 · 5:00 PM UTC";
const ICS_DTSTART = "20260911T170000Z";
const ICS_DTEND = "20260911T180000Z";

export default function LaunchNotifyModal({ isOpen, onClose, onAlertSaved }) {
  const [contactInput, setContactInput] = useState("");
  const [contactSaved, setContactSaved] = useState(false);
  const [browserPermission, setBrowserPermission] = useState("default");
  const [browserAlertSet, setBrowserAlertSet] = useState(false);
  const [savedMethods, setSavedMethods] = useState({
    calendar: false,
    browser: false,
    contact: null,
  });

  // Load existing saved alerts from localStorage
  useEffect(() => {
    if (!isOpen) return;

    if (typeof window !== "undefined" && "Notification" in window) {
      setBrowserPermission(Notification.permission);
    }

    try {
      const saved = localStorage.getItem("mika_drop_alert_msjuicy");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedMethods(parsed);
        if (parsed.contact) {
          setContactInput(parsed.contact);
          setContactSaved(true);
        }
        if (parsed.browser) {
          setBrowserAlertSet(true);
        }
      }
    } catch (e) {}
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. Google Calendar Link
  const handleGoogleCalendar = () => {
    const title = encodeURIComponent("🚀 Ms Juicy P Token Fair Launch ($JUICY)");
    const details = encodeURIComponent(
      "Official fair bonding curve token launch of Ms Juicy P (@msjuicy_plenty) on Robinhood Chain L2.\n\n" +
      "• Official Launchpad: https://mikayla.fun\n" +
      "• Embargoed Contract & Ticker unlock at T-0 against sniper bots\n" +
      "• 50% of launch & platform profits route on-chain to buy back and burn $MIKA"
    );
    const location = encodeURIComponent("https://mikayla.fun");
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${ICS_DTSTART}/${ICS_DTEND}&details=${details}&location=${location}`;

    window.open(gCalUrl, "_blank", "noopener,noreferrer");
    recordSavedMethod("calendar", true);
  };

  // 2. Download standard .ics file for Apple Calendar / Outlook / iCal
  const handleDownloadICS = () => {
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Mikayla Launchpad//Ms Juicy P Launch Alert//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:drop-msjuicy-20260911@mikayla.fun",
      "DTSTAMP:20260911T120000Z",
      `DTSTART:${ICS_DTSTART}`,
      `DTEND:${ICS_DTEND}`,
      "SUMMARY:🚀 Ms Juicy P Token Fair Launch ($JUICY)",
      "DESCRIPTION:Official fair bonding curve token launch of Ms Juicy P (@msjuicy_plenty) on Robinhood Chain L2.\\nOfficial site: https://mikayla.fun",
      "LOCATION:https://mikayla.fun",
      "STATUS:CONFIRMED",
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Ms Juicy P Token Launch begins in 15 minutes on mikayla.fun!",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "ms_juicy_p_launch.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    recordSavedMethod("calendar", true);
  };

  // 3. Request Browser Native Push Notification
  const handleEnableBrowserNotifications = async () => {
    if (!("Notification" in window)) {
      alert("Browser notifications are not supported in your browser.");
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setBrowserPermission(perm);

      if (perm === "granted") {
        setBrowserAlertSet(true);
        recordSavedMethod("browser", true);

        // Immediate confirmation system notification
        new Notification("Mikayla Launchpad · Alert Active", {
          body: "You're all set! We will notify you when Ms Juicy P launches this Friday at 5:00 PM UTC.",
          icon: "/creators/msjuicy.jpg",
        });
      }
    } catch (err) {
      console.error("Error enabling notifications:", err);
    }
  };

  // 4. Save Telegram / X / Email contact
  const handleSaveContact = (e) => {
    e.preventDefault();
    const clean = contactInput.trim();
    if (!clean) return;

    recordSavedMethod("contact", clean);
    setContactSaved(true);
  };

  const recordSavedMethod = (type, value) => {
    try {
      const current = {
        ...savedMethods,
        [type]: value,
        updatedAt: Date.now(),
      };
      setSavedMethods(current);
      localStorage.setItem("mika_drop_alert_msjuicy", JSON.stringify(current));
      if (onAlertSaved) onAlertSaved(current);
    } catch (e) {}
  };

  const hasAnyAlert = savedMethods.calendar || savedMethods.browser || savedMethods.contact;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#0d0f0d] border border-[#d4fc50]/30 rounded-2xl shadow-[0_0_60px_rgba(212,252,80,0.15)] overflow-hidden z-10">
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-[#d4fc50] via-white to-[#d4fc50]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#d4fc50] bg-black shrink-0 shadow-[0_0_15px_rgba(212,252,80,0.3)]">
              <img src="/creators/msjuicy.jpg" alt="Ms Juicy P" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-white font-sans">
                  Ms Juicy P
                </h3>
                <span className="text-xs text-[#30d158]">✓</span>
                <span className="text-[10px] font-mono font-bold text-[#d4fc50] px-1.5 py-0.5 rounded bg-[#d4fc50]/10 border border-[#d4fc50]/30">
                  DROP #01
                </span>
              </div>
              <p className="text-xs font-mono text-white/60">
                Fair Launch: <strong className="text-white">{DROP_TIME_UTC_STR}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Anti-Sniper Warning */}
          <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-start gap-2.5 text-xs font-mono">
            <Shield className="w-4 h-4 text-[#d4fc50] shrink-0 mt-0.5" />
            <div className="text-white/70">
              <strong className="text-white">Anti-Sniper Shield Active:</strong> Contract address and token ticker are strictly embargoed until T-0 (Friday 5:00 PM UTC).
            </div>
          </div>

          {/* Section 1: 1-Click Calendar Alerts (Never Miss the Drop) */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-white/50 mb-2 flex items-center justify-between">
              <span>1. Sync to Your Personal Calendar</span>
              {savedMethods.calendar && (
                <span className="text-[#30d158] flex items-center gap-1 text-[11px]">
                  <Check className="w-3 h-3" /> Added
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleGoogleCalendar}
                className="btn-tactile p-3 rounded-xl bg-white/[0.05] hover:bg-[#d4fc50] hover:text-black text-white border border-white/10 text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all group"
              >
                <Calendar className="w-4 h-4 text-[#d4fc50] group-hover:text-black transition-colors" />
                <span>Google Calendar</span>
              </button>

              <button
                onClick={handleDownloadICS}
                className="btn-tactile p-3 rounded-xl bg-white/[0.05] hover:bg-[#d4fc50] hover:text-black text-white border border-white/10 text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all group"
              >
                <Download className="w-4 h-4 text-[#d4fc50] group-hover:text-black transition-colors" />
                <span>Apple / iCal (.ics)</span>
              </button>
            </div>
          </div>

          {/* Section 2: Native Browser Notifications */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
              2. Browser System Notification
            </div>

            <button
              onClick={handleEnableBrowserNotifications}
              disabled={browserAlertSet}
              className={`btn-tactile w-full p-3 rounded-xl text-xs font-mono font-bold flex items-center justify-between cursor-pointer transition-all ${
                browserAlertSet
                  ? "bg-[#30d158]/10 text-[#30d158] border border-[#30d158]/30 cursor-default"
                  : "bg-white/[0.05] hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className={`w-4 h-4 ${browserAlertSet ? "text-[#30d158]" : "text-[#d4fc50]"}`} />
                <span>
                  {browserAlertSet ? "Browser Notification Enabled" : "Enable Native Push Alert"}
                </span>
              </div>
              {browserAlertSet ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#30d158]/20 text-[#30d158]">
                  Active ✓
                </span>
              ) : (
                <span className="text-[10px] font-mono text-white/40">
                  Allow Permission →
                </span>
              )}
            </button>
          </div>

          {/* Section 3: Direct Handle or Email Notification */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
              3. Telegram Handle / Email Alert
            </div>

            <form onSubmit={handleSaveContact} className="flex gap-2">
              <input
                type="text"
                value={contactInput}
                onChange={(e) => {
                  setContactInput(e.target.value);
                  setContactSaved(false);
                }}
                placeholder="@telegram_handle or you@email.com"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-[#d4fc50]"
              />
              <button
                type="submit"
                className={`btn-tactile px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase cursor-pointer transition-all flex items-center gap-1.5 ${
                  contactSaved
                    ? "bg-[#30d158] text-black"
                    : "bg-[#d4fc50] hover:bg-white text-black"
                }`}
              >
                {contactSaved ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                <span>{contactSaved ? "Saved" : "Save"}</span>
              </button>
            </form>

            {contactSaved && (
              <p className="text-[11px] font-mono text-[#30d158] mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Alert scheduled for {contactInput} at T-10m before launch.
              </p>
            )}
          </div>

          {/* Section 4: Verified Announcement Link on X */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-white/50">Creator: @msjuicy_plenty (80K+)</span>
            <a
              href={JUICY_REPOST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#30d158] hover:text-[#d4fc50] transition-colors"
            >
              <span>Verified Repost on X</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-black/60 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            {hasAnyAlert ? (
              <span className="text-[#30d158] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Drop Alert Active!
              </span>
            ) : (
              <span className="text-white/40">Select at least one alert option</span>
            )}
          </div>

          <button
            onClick={onClose}
            className="btn-tactile px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-medium cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
