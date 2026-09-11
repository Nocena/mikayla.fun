import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Landmark,
  Building2,
  Flame,
  DollarSign,
  Compass,
  Shield,
} from "lucide-react";

// Signature website green
const SIGNATURE_GREEN = "#d4fc50";

// Authentic Street Highway Routes mapped to city-map-blueprint.webp (3840 x 2160 normalized coordinates)
const ROAD_ROUTES = [
  // Route 0: East-West Arterial Boulevard (Main cross-city thoroughfare)
  [
    { x: 0.000, y: 0.635 },
    { x: 0.180, y: 0.635 },
    { x: 0.235, y: 0.635 },
    { x: 0.350, y: 0.636 },
    { x: 0.505, y: 0.640 },
    { x: 0.625, y: 0.646 },
    { x: 0.730, y: 0.648 },
    { x: 0.820, y: 0.570 },
    { x: 0.875, y: 0.630 },
    { x: 0.965, y: 0.660 },
    { x: 1.020, y: 0.670 },
  ],
  // Route 1: North-South Central Avenue (Straight downtown vertical spine)
  [
    { x: 0.448, y: -0.050 },
    { x: 0.460, y: 0.150 },
    { x: 0.485, y: 0.350 },
    { x: 0.502, y: 0.490 },
    { x: 0.505, y: 0.640 },
    { x: 0.510, y: 0.790 },
    { x: 0.518, y: 0.950 },
    { x: 0.522, y: 1.050 },
  ],
  // Route 2: West Coastal Expressway (Through cloverleaf interchange)
  [
    { x: 0.176, y: -0.050 },
    { x: 0.182, y: 0.120 },
    { x: 0.193, y: 0.250 },
    { x: 0.205, y: 0.430 },
    { x: 0.224, y: 0.530 },
    { x: 0.235, y: 0.635 },
    { x: 0.262, y: 0.780 },
    { x: 0.270, y: 0.880 },
    { x: 0.295, y: 1.050 },
  ],
  // Route 3: Diagonal Northern Highway (Curving across upper city)
  [
    { x: 0.000, y: 0.495 },
    { x: 0.080, y: 0.445 },
    { x: 0.140, y: 0.385 },
    { x: 0.185, y: 0.355 },
    { x: 0.280, y: 0.360 },
    { x: 0.380, y: 0.362 },
    { x: 0.480, y: 0.315 },
    { x: 0.620, y: 0.250 },
    { x: 0.700, y: 0.170 },
    { x: 0.825, y: 0.080 },
  ],
  // Route 4: Eastern River Boulevard Circuit (Downtown loop along waterfront)
  [
    { x: 0.620, y: 0.250 },
    { x: 0.675, y: 0.320 },
    { x: 0.730, y: 0.420 },
    { x: 0.800, y: 0.520 },
    { x: 0.820, y: 0.570 },
    { x: 0.730, y: 0.648 },
    { x: 0.625, y: 0.646 },
    { x: 0.505, y: 0.640 },
    { x: 0.502, y: 0.490 },
    { x: 0.485, y: 0.350 },
    { x: 0.620, y: 0.250 },
  ],
];

// Flank Locations directly aligned with Treetino\x27s SalesHeroCityMap.vue design
const FLANK_NODES = [
  {
    id: "brickell",
    icon: Landmark,
    title: "Brickell Financial",
    amount: "+$850,000 $JUICY",
    positionStyle: { left: "3.5%", top: "24%" },
    isRight: false,
    routeIndex: 3,
  },
  {
    id: "port",
    icon: Building2,
    title: "Port of Miami",
    amount: "+$1,450,000 $JUICY",
    positionStyle: { right: "3.5%", top: "22%" },
    isRight: true,
    routeIndex: 4,
  },
  {
    id: "havana",
    icon: Flame,
    title: "Little Havana",
    amount: "+$690,000 $JUICY",
    positionStyle: { left: "2.5%", top: "54%" },
    isRight: false,
    routeIndex: 2,
  },
  {
    id: "collins",
    icon: DollarSign,
    title: "Collins Penthouse",
    amount: "+$920,000 $JUICY",
    positionStyle: { right: "2.5%", top: "50%" },
    isRight: true,
    routeIndex: 0,
  },
  {
    id: "southbeach",
    icon: Compass,
    title: "South Beach Strip",
    amount: "+$420,000 $JUICY",
    positionStyle: { right: "3.5%", top: "72%" },
    isRight: true,
    routeIndex: 1,
  },
  {
    id: "fed",
    icon: Shield,
    title: "Downtown Reserve",
    amount: "+$2,100,000 $JUICY",
    positionStyle: { left: "3.5%", top: "78%" },
    isRight: false,
    routeIndex: 0,
  },
];

// Calculate exact projection matching CSS: object-cover object-bottom
function getMapProjection(width, height) {
  const imgAspect = 3840 / 2160; // 16:9
  const containerAspect = width / height;

  let drawW, drawH, offsetX, offsetY;
  if (containerAspect > imgAspect) {
    drawW = width;
    drawH = width / imgAspect;
    offsetX = 0;
    offsetY = height - drawH; // object-bottom anchors to bottom
  } else {
    drawH = height;
    drawW = height * imgAspect;
    offsetX = (width - drawW) / 2; // centered horizontally
    offsetY = 0;
  }

  return { drawW, drawH, offsetX, offsetY };
}

// Sample point along route in normalized [0, 1] map coordinates
function getRoutePoint(route, t) {
  const n = route.length - 1;
  const scaled = Math.max(0, Math.min(1, t)) * n;
  const idx = Math.min(Math.floor(scaled), n - 1);
  const fraction = scaled - idx;

  const p1 = route[idx];
  const p2 = route[idx + 1];

  const normX = p1.x + (p2.x - p1.x) * fraction;
  const normY = p1.y + (p2.y - p1.y) * fraction;

  return { normX, normY, p1, p2 };
}

export default function JuicyCityChaseMap({ className = "" }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [nodeStage, setNodeStage] = useState("location"); // "location" | "cashout"

  // Treetino-style calm cycling through flank locations
  useEffect(() => {
    let t1, t2;

    const cycle = () => {
      setNodeStage("location");
      t1 = setTimeout(() => {
        setNodeStage("cashout");
        t2 = setTimeout(() => {
          setActiveNodeIndex((prev) => (prev + 1) % FLANK_NODES.length);
          cycle();
        }, 2800);
      }, 2600);
    };

    cycle();

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Simulation Entities & State
  const simRef = useRef({
    suspects: [],
    cruisers: [],
    pings: [],
    frame: 0,
    width: 1440,
    height: 900,
  });

  // Initialize deliberate, calibrated simulation entities
  const initSimulation = useCallback(() => {
    // 3 active chases across different main arteries
    const suspects = [
      {
        id: "gangster-1",
        name: "URUS // #01",
        routeIndex: 0, // East-West Expressway
        t: 0.15,
        speed: 0.00065, // Deliberate, smooth speed
        color: SIGNATURE_GREEN,
        trail: [],
      },
      {
        id: "gangster-2",
        name: "HELLCAT // #02",
        routeIndex: 1, // North-South Central Spine
        t: 0.45,
        speed: 0.00072,
        color: SIGNATURE_GREEN,
        trail: [],
      },
      {
        id: "gangster-3",
        name: "GT3 // #03",
        routeIndex: 2, // West Coastal Expressway
        t: 0.68,
        speed: 0.00068,
        color: SIGNATURE_GREEN,
        trail: [],
      },
    ];

    // 2 police interceptors trailing behind each getaway car
    const cruisers = [];
    suspects.forEach((suspect, idx) => {
      // Cruiser 1 (trailing left lane)
      cruisers.push({
        id: `cruiser-${idx}-1`,
        suspectId: suspect.id,
        routeIndex: suspect.routeIndex,
        offsetT: -0.024,
        lateralOffset: -4,
        strobeOffset: 0,
      });
      // Cruiser 2 (trailing right lane)
      cruisers.push({
        id: `cruiser-${idx}-2`,
        suspectId: suspect.id,
        routeIndex: suspect.routeIndex,
        offsetT: -0.046,
        lateralOffset: 4,
        strobeOffset: 12,
      });
    });

    simRef.current.suspects = suspects;
    simRef.current.cruisers = cruisers;
  }, []);

  useEffect(() => {
    initSimulation();
  }, [initSimulation]);

  // Canvas Animation Render Loop with EXACT image-locked coordinates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      simRef.current.width = rect.width;
      simRef.current.height = rect.height;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const sim = simRef.current;
      sim.frame++;
      const width = sim.width || 1440;
      const height = sim.height || 900;

      ctx.clearRect(0, 0, width, height);

      // Compute exact object-cover object-bottom projection matrix
      const proj = getMapProjection(width, height);

      // 1. Subtle, elegant arterial street guide lines (tracing the real pavement)
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(212, 252, 80, 0.08)";
      ROAD_ROUTES.forEach((route) => {
        ctx.beginPath();
        route.forEach((pt, i) => {
          const px = proj.offsetX + pt.x * proj.drawW;
          const py = proj.offsetY + pt.y * proj.drawH;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      });

      // 2. Render Gangster Getaway Vehicles (Signature Green #d4fc50)
      sim.suspects.forEach((suspect) => {
        const route = ROAD_ROUTES[suspect.routeIndex % ROAD_ROUTES.length];
        suspect.t += suspect.speed;
        if (suspect.t > 1.0) {
          suspect.t = 0.0;
          suspect.routeIndex = (suspect.routeIndex + 1) % ROAD_ROUTES.length;
        }

        const { normX, normY, p1, p2 } = getRoutePoint(route, suspect.t);
        const px = proj.offsetX + normX * proj.drawW;
        const py = proj.offsetY + normY * proj.drawH;

        // Calculate heading angle on canvas
        const p1x = proj.offsetX + p1.x * proj.drawW;
        const p1y = proj.offsetY + p1.y * proj.drawH;
        const p2x = proj.offsetX + p2.x * proj.drawW;
        const p2y = proj.offsetY + p2.y * proj.drawH;
        const angle = Math.atan2(p2y - p1y, p2x - p1x);

        // Store trail history
        suspect.trail.unshift({ x: px, y: py });
        if (suspect.trail.length > 22) suspect.trail.pop();

        // Laser speed trail in signature green (#d4fc50)
        if (suspect.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(suspect.trail[0].x, suspect.trail[0].y);
          for (let i = 1; i < suspect.trail.length; i++) {
            ctx.lineTo(suspect.trail[i].x, suspect.trail[i].y);
          }
          ctx.strokeStyle = "rgba(212, 252, 80, 0.4)";
          ctx.lineWidth = 2.2;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Draw Aerodynamic Getaway Vehicle Body
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);

        // Soft ambient neon pulse ring
        const pulse = Math.sin(sim.frame * 0.06) * 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 8 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(212, 252, 80, 0.12)";
        ctx.fill();

        // Arrowhead Getaway Vehicle Body
        ctx.beginPath();
        ctx.moveTo(7, 0);
        ctx.lineTo(-6, -3.5);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-6, 3.5);
        ctx.closePath();
        ctx.fillStyle = SIGNATURE_GREEN;
        ctx.shadowColor = SIGNATURE_GREEN;
        ctx.shadowBlur = 10;
        ctx.fill();

        // Pure white cockpit / headlight core
        ctx.beginPath();
        ctx.arc(1, 0, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 0;
        ctx.fill();

        ctx.restore();

        // Monospaced tactical moniker above vehicle
        ctx.font = "bold 8.5px monospace";
        ctx.fillStyle = "rgba(212, 252, 80, 0.9)";
        ctx.shadowColor = "#000000";
        ctx.shadowBlur = 4;
        ctx.fillText(suspect.name, px + 9, py - 5);
        ctx.shadowBlur = 0;
      });

      // 3. Render Police Cruisers (Pursuing in formation with restrained emergency beacons)
      sim.cruisers.forEach((cruiser) => {
        const suspect = sim.suspects.find((s) => s.id === cruiser.suspectId);
        if (!suspect) return;

        const route = ROAD_ROUTES[cruiser.routeIndex % ROAD_ROUTES.length];
        const cruiserT = Math.max(0.005, suspect.t + cruiser.offsetT);
        const { normX, normY, p1, p2 } = getRoutePoint(route, cruiserT);

        const p1x = proj.offsetX + p1.x * proj.drawW;
        const p1y = proj.offsetY + p1.y * proj.drawH;
        const p2x = proj.offsetX + p2.x * proj.drawW;
        const p2y = proj.offsetY + p2.y * proj.drawH;
        const angle = Math.atan2(p2y - p1y, p2x - p1x);

        // Apply lane offset perpendicular to street angle
        const perpX = -Math.sin(angle) * cruiser.lateralOffset;
        const perpY = Math.cos(angle) * cruiser.lateralOffset;
        const px = proj.offsetX + normX * proj.drawW + perpX;
        const py = proj.offsetY + normY * proj.drawH + perpY;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);

        // Police Cruiser Interceptor Chassis (Crisp high-contrast interceptor)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-5, -2.5, 9, 5);

        // Subtle front headlight beam illuminating the street ahead
        ctx.beginPath();
        ctx.moveTo(4, -1.5);
        ctx.lineTo(14, -5);
        ctx.lineTo(14, 5);
        ctx.lineTo(4, 1.5);
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fill();

        // Classy, soft alternating emergency beacons (Not harsh or blinding)
        const flashPhase = (sim.frame + cruiser.strobeOffset) % 24;
        const isRedPhase = flashPhase < 12;

        // Left Beacon (Soft Ruby Red)
        ctx.beginPath();
        ctx.arc(-0.5, -2.5, isRedPhase ? 2.5 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = isRedPhase ? "rgba(255, 69, 58, 0.95)" : "rgba(255, 69, 58, 0.25)";
        ctx.shadowColor = "#ff453a";
        ctx.shadowBlur = isRedPhase ? 10 : 2;
        ctx.fill();

        // Right Beacon (Soft Electric Blue)
        ctx.beginPath();
        ctx.arc(-0.5, 2.5, !isRedPhase ? 2.5 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = !isRedPhase ? "rgba(10, 132, 255, 0.95)" : "rgba(10, 132, 255, 0.25)";
        ctx.shadowColor = "#0a84ff";
        ctx.shadowBlur = !isRedPhase ? 10 : 2;
        ctx.fill();

        ctx.restore();

        // Subtle, elegant radar ping wave emitting periodically
        if ((sim.frame + cruiser.strobeOffset) % 48 === 0) {
          sim.pings.push({
            x: px,
            y: py,
            radius: 2,
            alpha: 0.6,
          });
        }
      });

      // 4. Subtle Radar Pings
      for (let i = sim.pings.length - 1; i >= 0; i--) {
        const ping = sim.pings[i];
        ping.radius += 0.6;
        ping.alpha *= 0.96;

        ctx.beginPath();
        ctx.arc(ping.x, ping.y, ping.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212, 252, 80, ${ping.alpha * 0.35})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (ping.alpha <= 0.03 || ping.radius >= 45) {
          sim.pings.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Subtle interactive click ripple
  const handleCanvasClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    simRef.current.pings.push({
      x: clickX,
      y: clickY,
      radius: 4,
      alpha: 1,
    });
  };

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden select-none ${className}`}
      aria-hidden="true"
      onClick={handleCanvasClick}
    >
      {/* Ambient Lighting in signature green & deep studio tones */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(212,252,80,0.08),rgba(0,0,0,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_40%,rgba(10,132,255,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_60%,rgba(212,252,80,0.05),transparent_50%)]" />

      {/* Authentic City Map Blueprint Layer (Treetino style) */}
      <div className="absolute inset-0 opacity-65 mix-blend-screen">
        <img
          src="/juicy/images/city-map-blueprint.webp"
          alt="City Map Blueprint"
          className="h-full w-full object-cover object-bottom"
          loading="eager"
        />
      </div>

      {/* Center Readability Vignette (Softly dims center to keep hero typography super crisp) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_35%,rgba(6,7,6,0.88)_0%,rgba(6,7,6,0.45)_55%,transparent_100%)]" />

      {/* Canvas Simulation Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair"
      />

      {/* Treetino-Style Minimalist Flank Locations (Strictly outside central text) */}
      {FLANK_NODES.map((node, index) => {
        const isActive = index === activeNodeIndex;
        const IconComponent = node.icon;

        return (
          <div
            key={node.id}
            style={node.positionStyle}
            className="pointer-events-none absolute hidden md:block z-10 transition-opacity duration-500"
          >
            {/* Phase 1: Clean White Icon + Location Title */}
            {isActive && nodeStage === "location" && (
              <div
                className={`flex items-center gap-2.5 px-2 py-1 animate-fadeIn ${
                  node.isRight ? "flex-row-reverse text-right" : "flex-row text-left"
                }`}
              >
                <IconComponent
                  className="h-5 w-5 shrink-0 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.75)]"
                  strokeWidth={2}
                />
                <span className="text-sm font-semibold tracking-tight whitespace-nowrap text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
                  {node.title}
                </span>
              </div>
            )}

            {/* Phase 2: Game-Like Cash-Out Float Up in Signature Green */}
            {isActive && nodeStage === "cashout" && (
              <div
                className={`cashout-float-up px-2 font-mono text-sm lg:text-base font-bold tracking-wider whitespace-nowrap text-[#d4fc50] drop-shadow-[0_0_15px_rgba(212,252,80,0.85)] ${
                  node.isRight ? "text-right" : "text-left"
                }`}
              >
                {node.amount}
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom Fade to dark page background */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#060706]" />
    </div>
  );
}
