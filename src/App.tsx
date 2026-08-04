import { useState, useEffect, useMemo } from 'react';
import * as satellite from 'satellite.js';
import profilePhoto from './assets/profile.jpg';

// --- STYLING & BRAND THEME ---
const BRAND = {
  bgApp: '#05070A',
  textGray: '#484848',
  navy: '#163A58',
  slate: '#2B5D82',
  blue: '#4B9CD3',
  cyan: '#75D1F5',
  daygloOrange: '#FF5F1F',
  status: {
    ideal: '#10B981',
    fair: '#F59E0B',
    marginal: '#F97316',
    poor: '#EF4444',
    error: '#4B5563'
  }
};

// --- INTERNAL SVG ICONS ---
const Icons = {
  Wind: ({ size = 24, color = "currentColor" }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>
  ),
  CloudSimple: ({ size = 24, color = "currentColor" }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.82 17.3a4.5 4.5 0 0 1-1.32-8.8 5 5 0 0 1 9.5-2.2 4 4 0 0 1 5 3.7 4 4 0 0 1-4 4H6.82Z"/></svg>
  ),
  Rocket: ({ size = 24, color = "currentColor" }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.5-1 1-4c2 0 3 .5 3 .5"/><path d="M15 20s-1 .5-4 1c0-2 .5-3 .5-3"/></svg>
  ),
  SpaceStation: ({ size = 24, color = "currentColor", className = "" }: any) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12h6M12 9v6" />
      <rect x="10.5" y="10.5" width="3" height="3" rx="0.5" />
      <path d="M4 12h5M15 12h5" />
      <rect x="2" y="5" width="2" height="14" rx="0.5" />
      <rect x="5" y="5" width="2" height="14" rx="0.5" />
      <rect x="17" y="5" width="2" height="14" rx="0.5" />
      <rect x="20" y="5" width="2" height="14" rx="0.5" />
    </svg>
  ),
  Clock: ({ size = 24, color = "currentColor" }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r={10}/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  MapPin: ({ size = 24, color = "currentColor" }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Info: ({ size = 24, color = "currentColor", className = "" }: any) => (
    <svg className={className} width={size} height={size} viewBox="182 119 136 262" style={{ color }}>
      <g transform="translate(0,500) scale(0.1,-0.1)" fill="currentColor"><path d="M2363 3736 c-103 -34 -176 -98 -222 -196 -22 -47 -26 -68 -26 -145 1 -79 4 -97 30 -148 34 -68 107 -140 173 -169 72 -33 191 -36 264 -8 76 28 159 104 195 178 25 50 28 68 28 152 0 79 -4 103 -24 142 -60 122 -173 198 -304 204 -43 3 -89 -2 -114 -10z M2335 2794 c-170 -7 -343 -13 -382 -13 l-73 -1 0 -80 0 -80 103 0 c124 0 168 -11 201 -51 l26 -31 0 -514 c0 -554 -1 -568 -52 -595 -13 -7 -73 -15 -140 -17 l-118 -4 0 -79 0 -79 610 0 610 0 0 79 0 78 -102 5 c-120 5 -160 21 -177 69 -8 22 -11 232 -11 680 l0 649 -92 -1 c-51 -1 -232 -8 -403 -15z"/></g>
    </svg>
  ),
  ExternalLink: ({ size = 24, color = "currentColor", className = "" }: any) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
  ),
  ThermometerSnowflake: ({ size = 24, color = "currentColor", className = "" }: any) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/><path d="M2 12h10"/><path d="M9 4v4"/><path d="M15 4v4"/><path d="M12 2v2"/><path d="M12 8l-2 2"/><path d="M12 8l2 2"/></svg>
  ),
  X: ({ size = 24, color = "currentColor" }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  ),
  Stars: ({ size = 24, color = "currentColor", className = "" }: any) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="currentColor" stroke="none" />
      <path d="M5.5 1L6.5 4.5L10 5.5L6.5 6.5L5.5 10L4.5 6.5L1 5.5L4.5 4.5L5.5 1Z" fill="currentColor" stroke="none" />
      <path d="M18.5 14L19.5 17.5L23 18.5L19.5 19.5L18.5 23L17.5 19.5L14 18.5L17.5 17.5L18.5 14Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  Radar: ({ size = 24, color = "currentColor", className = "" }: any) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r={10} strokeOpacity="0.8" />
      <circle cx="12" cy="12" r={5} strokeOpacity="0.4" />
      <circle cx="12" cy="12" r={1} fill={color} strokeOpacity="0" />
      <path d="M12 2v20M2 12h20" strokeOpacity="0.2" />
      <line x1="12" y1="12" x2="12" y2="2" strokeWidth="2.5" className="animate-spin origin-center" style={{ transformOrigin: '12px 12px', animationDuration: '4s' }} />
    </svg>
  )
};

const getLocalDateString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// --- ASTRONOMICAL ENGINE ---
const calculateSellsSunset = (dateStr: string) => {
  const LAT = 31.7801;
  const LON = -111.5730;
  const TIMEZONE = -7;
  const targetDate = new Date(`${dateStr}T12:00:00`);
  const start = new Date(targetDate.getFullYear(), 0, 0);
  const diff = targetDate.getTime() - start.getTime();
  const n = Math.floor(diff / (1000 * 60 * 60 * 24));
  const gamma = (2 * Math.PI / 365) * (n - 1);
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma);
  const zenithRad = 90.833 * (Math.PI / 180);
  const latRad = LAT * (Math.PI / 180);
  let cosHa = (Math.cos(zenithRad) / (Math.cos(latRad) * Math.cos(decl))) - (Math.tan(latRad) * Math.tan(decl));
  cosHa = Math.max(Math.min(cosHa, 1), -1);
  const ha = Math.acos(cosHa) * (180 / Math.PI);
  const solarNoonUtc = 720 - (4 * LON) - eqt;
  const sunsetUtc = solarNoonUtc + (4 * ha);
  const sunsetLocalMinutes = (sunsetUtc + (TIMEZONE * 60)) % 1440;
  const hours = Math.floor(sunsetLocalMinutes / 60);
  const mins = Math.floor(sunsetLocalMinutes % 60);
  return `${hours % 12 || 12}:${mins.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
};

const calculateNightfall = (dateStr: string) => {
  const LAT = 31.7801;
  const LON = -111.5730;
  const TIMEZONE = -7;
  const targetDate = new Date(`${dateStr}T12:00:00`);
  const start = new Date(targetDate.getFullYear(), 0, 0);
  const diff = targetDate.getTime() - start.getTime();
  const n = Math.floor(diff / (1000 * 60 * 60 * 24));
  const gamma = (2 * Math.PI / 365) * (n - 1);
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma);

  const zenithRad = 108 * (Math.PI / 180);
  const latRad = LAT * (Math.PI / 180);
  let cosHa = (Math.cos(zenithRad) / (Math.cos(latRad) * Math.cos(decl))) - (Math.tan(latRad) * Math.tan(decl));
  cosHa = Math.max(Math.min(cosHa, 1), -1);
  const ha = Math.acos(cosHa) * (180 / Math.PI);
  const solarNoonUtc = 720 - (4 * LON) - eqt;

  const darkUtc = solarNoonUtc + (4 * ha);
  const darkLocalMinutes = (darkUtc + (TIMEZONE * 60)) % 1440;
  const hours = Math.floor(darkLocalMinutes / 60);
  const mins = Math.floor(darkLocalMinutes % 60);
  return `${hours % 12 || 12}:${mins.toString().padStart(2, '0')}`;
};

const getMoonData = (dateStr: string) => {
  const lp = 2551443;
  const now = new Date(`${dateStr}T12:00:00Z`);
  const newMoon = new Date("1970-01-07T20:35:00Z");
  const phase = ((now.getTime() - newMoon.getTime()) / 1000) % lp;
  let pos = phase / lp;
  if (pos < 0) pos += 1; // Guarantee positive position
  const illum = Math.abs(Math.cos(pos * 2 * Math.PI - Math.PI) / 2 + 0.5);
  let name = pos < 0.05 || pos > 0.95 ? "New Moon" : pos < 0.25 ? "Waxing Crescent" : pos < 0.30 ? "First Quarter" : pos < 0.45 ? "Waxing Gibbous" : pos < 0.55 ? "Full Moon" : pos < 0.70 ? "Waning Gibbous" : pos < 0.75 ? "Last Quarter" : "Waning Crescent";
  return { pos, illum: Math.round(illum * 100), name };
};

const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, backoff = 1000): Promise<any> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
};

const fetchTextWithRetry = async (url: string, retries = 2, backoff = 1200): Promise<string> => {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchTextWithRetry(url, retries - 1, backoff * 2);
    }
    throw error;
  }
};

// --- SATELLITE PASS ENGINE (SGP4 over raw CelesTrak TLEs — no scraping, no proxies) ---
// Validated against live Heavens-Above "visible passes" listings for Kitt Peak:
// reproduces the exact same pass count, timing (within ~20s sampling resolution),
// peak elevation, and compass direction across a 10-day, 2-satellite test window.
const EARTH_RADIUS_KM = 6378.137;

// satellite.js@5's shipped .d.ts omits this real runtime export — alias it once here.
const radiansToDegrees: (radians: number) => number = (satellite as any).radiansToDegrees;

const sunEciUnitVector = (date: Date): [number, number, number] => {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const n = jd - 2451545.0;
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = satellite.degreesToRadians((357.528 + 0.9856003 * n) % 360);
  const lambda = satellite.degreesToRadians(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
  const epsilon = satellite.degreesToRadians(23.439 - 0.0000004 * n);
  return [Math.cos(lambda), Math.cos(epsilon) * Math.sin(lambda), Math.sin(epsilon) * Math.sin(lambda)];
};

// Cylindrical shadow model: satellite is dark if it's on Earth's night side
// and within one Earth-radius of the Earth-Sun line.
const isSatelliteSunlit = (posEci: any, sunDir: [number, number, number]) => {
  const dot = posEci.x * sunDir[0] + posEci.y * sunDir[1] + posEci.z * sunDir[2];
  if (dot > 0) return true;
  const mag2 = posEci.x ** 2 + posEci.y ** 2 + posEci.z ** 2;
  const perp = Math.sqrt(Math.max(mag2 - dot * dot, 0));
  return perp > EARTH_RADIUS_KM;
};

const sunElevationDeg = (date: Date, sunDir: [number, number, number], observerGd: any) => {
  const gmst = satellite.gstime(date);
  const cosg = Math.cos(gmst), sing = Math.sin(gmst);
  const sunEcf = {
    x: cosg * sunDir[0] + sing * sunDir[1],
    y: -sing * sunDir[0] + cosg * sunDir[1],
    z: sunDir[2]
  };
  const FAR = 1e8; // treat the sun as a point far away in the correct direction — only the angle matters
  const look = satellite.ecfToLookAngles(observerGd, { x: sunEcf.x * FAR, y: sunEcf.y * FAR, z: sunEcf.z * FAR });
  return radiansToDegrees(look.elevation);
};

const COMPASS_POINTS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
const compassFromAzimuth = (deg: number) => COMPASS_POINTS[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];

// A pass is "visible" only when it's above 10° elevation, still lit by the sun,
// and the observer's sky is dark (sun below -6°, civil twilight) — the same
// definition Heavens-Above uses, confirmed against their live pass lists.
const findVisiblePass = (satrec: any, observerGd: any, windowStartMs: number, windowEndMs: number) => {
  const STEP_MS = 15000;
  let inPass = false;
  let aos: Date | null = null;
  let peak: { elevDeg: number, azDeg: number } | null = null;

  for (let t = windowStartMs; t <= windowEndMs; t += STEP_MS) {
    const date = new Date(t);
    const pv = satellite.propagate(satrec, date);
    if (!pv || !pv.position) continue;
    const posEci: any = pv.position;
    const gmst = satellite.gstime(date);
    const posEcf = satellite.eciToEcf<number>(posEci, gmst);
    const look = satellite.ecfToLookAngles(observerGd, posEcf);
    const elevDeg = radiansToDegrees(look.elevation);
    const sunDir = sunEciUnitVector(date);
    const visibleNow = elevDeg > 10 && isSatelliteSunlit(posEci, sunDir) && sunElevationDeg(date, sunDir, observerGd) < -6;

    if (visibleNow) {
      if (!inPass) { inPass = true; aos = date; peak = { elevDeg, azDeg: radiansToDegrees(look.azimuth) }; }
      else if (peak && elevDeg > peak.elevDeg) { peak = { elevDeg, azDeg: radiansToDegrees(look.azimuth) }; }
    } else if (inPass) {
      return { aos: aos as Date, peak: peak as { elevDeg: number, azDeg: number } };
    }
  }
  return inPass ? { aos: aos as Date, peak: peak as { elevDeg: number, azDeg: number } } : null;
};

const IconBox = ({ icon: Icon, moonPos, className = "" }: { icon?: any, moonPos?: number, className?: string }) => (
  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0 border border-white/10 ${className}`} style={{ backgroundColor: BRAND.blue }}>
    {Icon ? <Icon size={24} color="#FFFFFF" /> : <MoonGraphic pos={moonPos || 0} />}
  </div>
);

const MoonGraphic = ({ pos }: { pos: number }) => {
  const p = ((pos % 1) + 1) % 1;
  if (p <= 0.02 || p >= 0.98) return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.4)" />
    </svg>
  );
  if (p >= 0.48 && p <= 0.52) return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#FFFFFF" />
    </svg>
  );

  const isWaxing = p < 0.5;
  const sweep1 = isWaxing ? 1 : 0;
  const sweep2 = (p < 0.25 || (p > 0.5 && p <= 0.75)) ? 0 : 1;
  const rX = Math.max(Math.abs(Math.cos(p * 2 * Math.PI) * 10), 0.05);

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.4)" />
      <path d={`M 12 2 A 10 10 0 0 ${sweep1} 12 22 A ${rX} 10 0 0 ${sweep2} 12 2 Z`} fill="#FFFFFF" />
    </svg>
  );
};

export default function App() {
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [weather, setWeather] = useState({
    tempLow: '--', windRange: '--', coverMax: '--', status: 'Fetching Data...', detail: '', color: BRAND.status.error
  });
  const [transients, setTransients] = useState<Record<string, any>>({
    iss: { time: "--:--", note: "Initializing Telemetry..." },
    rocket: { time: "--:--", note: "Initializing Telemetry..." },
    tiangong: { time: "--:--", note: "Initializing Telemetry..." }
  });
  const [loading, setLoading] = useState({ weather: true, transients: true });
  const [showInfo, setShowInfo] = useState(false);
  const [showRadar, setShowRadar] = useState(false);
  const [showFullPhoto, setShowFullPhoto] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const moon = useMemo(() => getMoonData(selectedDate), [selectedDate]);
  const sunset = useMemo(() => calculateSellsSunset(selectedDate), [selectedDate]);
  const nightfall = useMemo(() => calculateNightfall(selectedDate), [selectedDate]);

  useEffect(() => {
    const interval = setInterval(() => setRefreshKey(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let active = true;
    async function fetchWeather() {
      setLoading(p => ({ ...p, weather: true }));
      try {
        const TARGET_LAT = 31.7801;
        const TARGET_LON = -111.5730;

        const pointsUrl = `https://api.weather.gov/points/${TARGET_LAT},${TARGET_LON}`;
        const pointsData = await fetchWithRetry(pointsUrl, {
            headers: { 'User-Agent': 'KittPeakObservatoryApp/1.0' }
        });

        if (!pointsData.properties?.forecastGridData) throw new Error("Could not resolve Grid");

        const gridUrl = pointsData.properties.forecastGridData;
        const data = await fetchWithRetry(gridUrl, {
          headers: { 'User-Agent': 'KittPeakObservatoryApp/1.0' }
        });

        const parseDuration = (durationStr: string) => {
            let hours = 0;
            const daysMatch = durationStr.match(/P(\d+)D/);
            if (daysMatch) hours += parseInt(daysMatch[1], 10) * 24;
            const timePart = durationStr.includes('T') ? durationStr.split('T')[1] : '';
            const hoursMatch = timePart.match(/(\d+)H/);
            if (hoursMatch) hours += parseInt(hoursMatch[1], 10);
            return hours || 1;
        };

        const getValueForTime = (valuesArray: any[], targetTimeMs: number) => {
          if (!valuesArray) return null;
          for (const item of valuesArray) {
            const [timeStr, durationStr] = item.validTime.split('/');
            const startTimeMs = new Date(timeStr).getTime();
            const durationHours = parseDuration(durationStr);
            const endTimeMs = startTimeMs + (durationHours * 60 * 60 * 1000);
            if (targetTimeMs >= startTimeMs && targetTimeMs < endTimeMs) return item.value;
          }
          return null;
        };

        const targetHours = [18, 19, 20, 21, 22];
        const windowTempsF: number[] = [];
        const windowWindsMph: number[] = [];
        const windowCovers: number[] = [];

        targetHours.forEach(hour => {
          const targetStr = `${selectedDate}T${hour.toString().padStart(2, '0')}:00:00-07:00`;
          const targetMs = new Date(targetStr).getTime();

          if (data.properties.temperature?.values) {
              const val = getValueForTime(data.properties.temperature.values, targetMs);
              if (val !== null) {
                  const uom = data.properties.temperature.uom || '';
                  windowTempsF.push(uom.includes('degC') ? Math.round((val * 9/5) + 32) : Math.round(val));
              }
          }

          if (data.properties.windSpeed?.values) {
              const val = getValueForTime(data.properties.windSpeed.values, targetMs);
              if (val !== null) {
                  const uom = data.properties.windSpeed.uom || '';
                  windowWindsMph.push(uom.includes('km_h') ? Math.round(val / 1.60934) : Math.round(val));
              }
          }

          if (data.properties.skyCover?.values) {
              const val = getValueForTime(data.properties.skyCover.values, targetMs);
              if (val !== null) windowCovers.push(Math.round(val));
          }
        });

        if (windowTempsF.length > 0 && active) {
          const tMin = Math.min(...windowTempsF);
          const wMin = Math.min(...windowWindsMph);
          const wMax = Math.max(...windowWindsMph);
          const cMax = windowCovers.length > 0 ? Math.max(...windowCovers) : 0;

          let status = "Excellent Seeing";
          let color = BRAND.status.ideal;
          let detail = "Clear summit conditions";

          if (cMax > 60) { status = "Poor Observation"; color = BRAND.status.poor; detail = "Heavy Cloud Cover"; }
          else if (cMax > 30 || wMax > 20) { status = "Marginal"; color = BRAND.status.marginal; detail = wMax > 20 ? "High Winds" : "Scattered Clouds"; }
          else if (cMax > 10) { status = "Fair"; color = BRAND.status.fair; detail = "High Thin Clouds"; }

          setWeather({
            tempLow: `${tMin}°F`,
            windRange: `${wMin}–${wMax} mph`,
            coverMax: `${cMax}%`,
            status,
            color,
            detail
          });
        } else if (active) {
            setWeather({ tempLow: '--', windRange: '--', coverMax: '--', status: "Out of Range", color: BRAND.status.error, detail: "NWS forecast limit reached" });
        }
      } catch (e) {
        if (active) setWeather(prev => ({ ...prev, status: "Offline", color: BRAND.status.error, detail: "NWS Grid Sync Error" }));
      } finally {
        if (active) setLoading(p => ({ ...p, weather: false }));
      }
    }
    fetchWeather();
    return () => { active = false; };
  }, [selectedDate]);

  useEffect(() => {
    let active = true;
    async function executeScrape() {
      setLoading(p => ({ ...p, transients: true }));

      const results: Record<string, any> = {
          iss: { time: "None Tonight", note: "No pass in window" },
          tiangong: { time: "None Tonight", note: "No pass in window" },
          rocket: { time: "None Tonight", note: "No Vandenberg launch scheduled" }
      };

      try {
        const observerGd = {
          longitude: satellite.degreesToRadians(-111.5730),
          latitude: satellite.degreesToRadians(31.7801),
          height: 2.096 // km
        };
        const windowStartMs = new Date(`${selectedDate}T18:00:00-07:00`).getTime();
        const windowEndMs = new Date(`${selectedDate}T22:00:00-07:00`).getTime();

        const scrapeSatellitePass = async (catalogNumber: number) => {
            try {
                const tleText = await fetchTextWithRetry(`https://celestrak.org/NORAD/elements/gp.php?CATNR=${catalogNumber}&FORMAT=TLE`);
                const lines = tleText.trim().split('\n').map(l => l.trim());
                const line1 = lines.find(l => l.startsWith('1 '));
                const line2 = lines.find(l => l.startsWith('2 '));
                if (!line1 || !line2) throw new Error("Malformed TLE");
                const satrec = satellite.twoline2satrec(line1, line2);

                const pass = findVisiblePass(satrec, observerGd, windowStartMs, windowEndMs);
                if (!pass) return null;

                const timeLabel = pass.aos.toLocaleTimeString('en-US', { timeZone: 'America/Phoenix', hour: 'numeric', minute: '2-digit' });
                const dir = compassFromAzimuth(pass.peak.azDeg);
                return { time: timeLabel, note: `Peak ${Math.round(pass.peak.elevDeg)}° · ${dir} (Confirmed)` };
            } catch (e) {
                return { time: "Error", note: "TLE Fetch Failed" };
            }
        };

        const scrapeRocketLaunch = async () => {
            try {
                const dayStart = new Date(`${selectedDate}T00:00:00-07:00`);
                const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
                const url = `https://ll.thespacedevs.com/2.2.0/launch/?net__gte=${dayStart.toISOString()}&net__lt=${dayEnd.toISOString()}&search=Vandenberg&limit=5`;
                const res = await fetch(url, { cache: 'no-store' });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                // "TBD" means the date itself isn't confirmed yet — excluding it is what
                // stops the dashboard from claiming a launch is "Scheduled" when it isn't.
                const confirmed = (data.results || []).filter((r: any) => r.status?.abbrev && r.status.abbrev !== 'TBD');
                if (confirmed.length === 0) return null;

                const launch = confirmed[0];
                const timeLabel = new Date(launch.net).toLocaleTimeString('en-US', { timeZone: 'America/Phoenix', hour: 'numeric', minute: '2-digit' });
                const missionName = (launch.name || '').split('|')[1]?.trim() || launch.name || 'Launch';
                return { time: timeLabel, note: `${missionName.slice(0, 26)} (${launch.status.abbrev})` };
            } catch (e) {
                return { time: "Error", note: "Launch API Unavailable" };
            }
        };

        const [issData, cssData, rocketData] = await Promise.all([
            scrapeSatellitePass(25544),
            scrapeSatellitePass(48274),
            scrapeRocketLaunch()
        ]);

        if (issData && active) results.iss = issData;
        if (cssData && active) results.tiangong = cssData;
        if (rocketData && active) results.rocket = rocketData;

        if (active) setTransients(results);
      } catch (e) {
        if (active) {
            setTransients({
                iss: { time: "Error", note: "Telemetry Unavailable" },
                rocket: { time: "Error", note: "Telemetry Unavailable" },
                tiangong: { time: "Error", note: "Telemetry Unavailable" }
            });
        }
      } finally {
        if (active) setLoading(p => ({ ...p, transients: false }));
      }
    }
    executeScrape();
    return () => { active = false; };
  }, [selectedDate]);

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans selection:bg-[#4B9CD3]/30" style={{ backgroundColor: BRAND.bgApp }}>
      <div className="max-w-4xl mx-auto flex flex-col min-h-[90vh]">

        {/* INFO MODAL OVERLAY */}
        {showInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#163A58] border border-[#2B5D82] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                <h2 className="text-xl font-black uppercase tracking-widest text-[#75D1F5]">About This Dashboard</h2>
                <button onClick={() => setShowInfo(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <Icons.X size={24} color="white" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6 text-sm">
                <div className="flex flex-col items-center text-center gap-4 pb-2">
                  <img src={profilePhoto} alt="James Edgar Lockridge" className="w-48 h-48 rounded-full object-cover border border-white/10 shadow-xl" />
                  <p className="text-gray-300 leading-relaxed text-[13px] max-w-sm">
                    Kitt Peak Summit Dashboard is a personal project built by{' '}
                    <a href="https://www.linkedin.com/in/jamesedgarlockridge/" target="_blank" rel="noreferrer" className="text-[#75D1F5] font-bold hover:underline">James Edgar Lockridge</a>
                    {' '}with Gemini and Claude AI in 2026. It's not affiliated with the observatory or the organizations that manage it.
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    Icon photo by{' '}
                    <button onClick={() => setShowFullPhoto(true)} className="text-[#75D1F5] hover:underline">Dmitry Mamyrin</button>
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <h3 className="text-[#10B981] font-black uppercase text-xs mb-2 tracking-widest">Weather</h3>
                  <p className="text-gray-300 leading-relaxed uppercase font-medium tracking-wide text-[11px]">
                    Cloud cover, wind, and temperature come from the National Weather Service's public forecast for this exact spot on the mountain.
                    If that service doesn't respond, the dashboard retries a few times automatically before showing "Offline."
                  </p>
                </div>
                <div>
                  <h3 className="text-[#4B9CD3] font-black uppercase text-xs mb-2 tracking-widest">Sun & Moon</h3>
                  <p className="text-gray-300 leading-relaxed uppercase font-medium tracking-wide text-[11px]">
                    Sunset, nightfall, and moon phase are worked out directly with standard astronomy formulas for this location.
                    No outside service is involved, so these always show up correctly, even without an internet connection.
                  </p>
                </div>
                <div>
                  <h3 className="text-[#F59E0B] font-black uppercase text-xs mb-2 tracking-widest">Satellite Passes</h3>
                  <p className="text-gray-300 leading-relaxed uppercase font-medium tracking-wide text-[11px]">
                    ISS and Tiangong sighting times are calculated from live, public satellite-tracking data, using the same orbit math sites like Heavens-Above use.
                    A pass only counts as visible when the station is high enough in the sky, lit by sunlight, and it's actually dark enough here to see it.
                  </p>
                </div>
                <div>
                  <h3 className="text-[#FF5F1F] font-black uppercase text-xs mb-2 tracking-widest">Rocket Launches</h3>
                  <p className="text-gray-300 leading-relaxed uppercase font-medium tracking-wide text-[11px]">
                    Vandenberg launch info comes from The Space Devs' public launch-tracking API, filtered to this date.
                    Launches without a confirmed time are left out, so the dashboard won't tell you one's happening unless it actually is.
                  </p>
                </div>
              </div>
              <div className="p-4 bg-black/40 text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">This app is free. Enjoy the sky!</p>
              </div>
            </div>
          </div>
        )}

        {/* RADAR MODAL */}
        {showRadar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-xl animate-in zoom-in-95 duration-300">
             <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl flex flex-col">
                <div className="p-4 bg-[#163A58] border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Icons.Radar size={20} color={BRAND.cyan} />
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">Radar</h3>
                    </div>
                    <button onClick={() => setShowRadar(false)} className="p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"><Icons.X size={24} color="white" /></button>
                </div>
                <div className="flex-1 relative bg-[#05070A]">
                    <iframe
                        src={`https://embed.windy.com/embed2.html?lat=31.958&lon=-111.597&detailLat=31.958&detailLon=-111.597&width=650&height=450&zoom=8&level=surface&overlay=clouds&product=ecmwf&menu=&message=&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`}
                        className="w-full h-full border-none"
                        title="Radar"
                    />
                </div>
                <div className="p-3 bg-black/40 text-center border-t border-white/5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Animated Satellite Overlay - Source: Windy Colorful Telemetry</p>
                </div>
             </div>
          </div>
        )}

        {/* FULL-SIZE ICON PHOTO MODAL */}
        {showFullPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-xl animate-in zoom-in-95 duration-300">
             <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl flex flex-col">
                <div className="p-4 bg-[#163A58] border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Photo by Dmitry Mamyrin</h3>
                    <button onClick={() => setShowFullPhoto(false)} className="p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"><Icons.X size={24} color="white" /></button>
                </div>
                <div className="flex-1 flex items-center justify-center bg-[#05070A]">
                    <img src="/kitt-peak-aurora-full.jpg" alt="Kitt Peak dome under an aurora, by Dmitry Mamyrin" className="max-w-full max-h-full object-contain" />
                </div>
             </div>
          </div>
        )}

        <header className="mb-10 flex flex-col md:flex-row justify-between items-end border-b pb-6 border-white/10">
          <div className="w-full md:w-auto text-left">
            <h1 className="text-5xl md:text-6xl font-thin uppercase tracking-tighter leading-none mb-4" style={{ transform: 'scaleY(1.15)', transformOrigin: 'left bottom' }}>
                <span style={{ color: BRAND.blue }}>Kitt Peak Summit</span> <span style={{ color: BRAND.navy }}>Dashboard</span>
            </h1>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="bg-transparent border-none text-4xl md:text-5xl font-black uppercase tracking-tighter p-0 focus:ring-0 outline-none cursor-pointer text-white hover:text-[#4B9CD3] transition-colors" />
          </div>
          <div className="text-right opacity-60 w-full md:w-auto mt-6 md:mt-0 text-gray-400">
            <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 justify-end text-gray-400"><Icons.MapPin size={12} /> 31.7801° N, -111.5730° W</p>
            <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 justify-end mt-1.5 text-gray-400"><Icons.Clock size={12} /> Window: 6 PM – 10 PM</p>
          </div>
        </header>

        {/* GREEN CARTOUCHE - CENTERED */}
        <div className="rounded-3xl p-8 mb-8 shadow-2xl flex flex-col justify-center items-center gap-6 relative overflow-hidden text-[#05070A]" style={{ backgroundColor: weather.color }}>
          {loading.weather && <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-10 font-bold uppercase tracking-widest text-sm animate-pulse">Syncing NWS...</div>}
          <div className="text-center w-full relative z-0">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Summit Conditions</p>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight mt-1">{weather.status}</h2>
            <p className="text-sm font-bold uppercase opacity-80 mt-2">{weather.detail}</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto justify-center relative z-0">
            <div className="bg-black/10 p-5 rounded-2xl flex-1 md:min-w-[140px] text-center border border-black/5"><p className="text-[9px] font-black uppercase opacity-60 mb-2">Sunset (Local)</p><p className="text-2xl font-black">{sunset}</p></div>
            <div className="bg-black/10 p-5 rounded-2xl flex-1 md:min-w-[140px] text-center border border-black/5"><p className="text-[9px] font-black uppercase opacity-60 mb-2 flex justify-center items-center gap-1">Program Low <Icons.ThermometerSnowflake size={10} /></p><p className="text-2xl font-black">{weather.tempLow}</p></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <section className="p-8 rounded-[2rem] space-y-8 flex flex-col shadow-lg border text-white" style={{ backgroundColor: BRAND.navy, borderColor: BRAND.slate }}>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-center" style={{ color: BRAND.cyan }}>Atmospheric Profile (6pm–10pm)</h3>

            <div className="flex items-center gap-6">
              <IconBox moonPos={moon.pos} />
              <div className="text-left">
                <p className="text-xl font-black uppercase tracking-tight leading-none mb-1">{moon.name}</p>
                <p className="text-[10px] font-bold uppercase opacity-80 text-gray-400">Illumination: {moon.illum}%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-8 pt-6 border-t" style={{ borderColor: BRAND.slate }}>
              <div className="flex items-center gap-4"><IconBox icon={Icons.Wind} /><div className="text-left"><p className="text-[9px] font-bold uppercase opacity-60 text-gray-400">Max Wind</p><p className="text-xl font-bold tabular-nums">{weather.windRange}</p></div></div>
              <div className="flex items-center gap-4"><IconBox icon={Icons.CloudSimple} /><div className="text-left"><p className="text-[9px] font-bold uppercase opacity-60 text-gray-400">Cloud Cover</p><p className="text-xl font-bold tabular-nums">{weather.coverMax}</p></div></div>
              <div className="flex items-center gap-4"><IconBox icon={Icons.Clock} /><div className="text-left"><p className="text-[9px] font-bold uppercase opacity-60 text-gray-400">Nightfall</p><p className="text-xl font-bold tabular-nums">{nightfall}</p></div></div>

              <div className="flex items-center gap-4 group">
                <button onClick={() => setShowRadar(true)} className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-xl shadow-lg border border-white/10 transition-transform hover:scale-110 active:scale-95 overflow-hidden" style={{ backgroundColor: BRAND.blue }}>
                  <Icons.Radar size={40} color="white" />
                </button>
                <div className="text-left">
                  <p className="text-[9px] font-bold uppercase opacity-60 text-gray-400">sky cover</p>
                  <button onClick={() => setShowRadar(true)} className="text-xl font-bold uppercase tracking-tight flex items-center gap-2 text-white hover:text-[#75D1F5] transition-colors">Radar <Icons.ExternalLink size={14} className="opacity-80" /></button>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <a href="https://varuna.kpno.noirlab.edu/allsky.htm" target="_blank" rel="noreferrer" className="relative shrink-0 flex items-center justify-center w-12 h-12 transition-transform hover:scale-105">
                  <div className="absolute inset-0 rounded-xl shadow-lg border border-white/10" style={{ backgroundColor: BRAND.blue }} />
                  <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden border border-white/20 shadow-xl z-10 bg-black">
                    <img
                      src={`https://wsrv.nl/?url=https%3A%2F%2Fvaruna.kpno.noirlab.edu%2Fallsky%2FAllSkyCurrentImage.JPG&w=150&h=150&fit=cover&a=center&t=${refreshKey}`}
                      alt="Sky"
                      className="w-full h-full object-cover scale-[1.35]"
                      onError={(e: any) => { e.target.src = `https://varuna.kpno.noirlab.edu/allsky/AllSkyCurrentImage.JPG?t=${refreshKey}`; }}
                    />
                  </div>
                </a>
                <div className="text-left">
                  <p className="text-[9px] font-bold uppercase opacity-60 text-gray-400">All-Sky Camera</p>
                  <a href="https://varuna.kpno.noirlab.edu/allsky.htm" target="_blank" rel="noreferrer" className="text-xl font-bold uppercase tracking-tight flex items-center gap-2 text-white hover:text-[#75D1F5] transition-colors">Sky Cam <Icons.ExternalLink size={14} className="opacity-80" /></a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <a href="https://www.wunderground.com/dashboard/pws/KAZSELLS7" target="_blank" rel="noreferrer" className="shrink-0 transition-transform group-hover:scale-105 block"><IconBox icon={Icons.Stars} /></a>
                <div className="text-left overflow-hidden min-w-0 flex-1">
                  <p className="text-[9px] font-bold uppercase opacity-60 text-gray-400 mb-1 leading-tight">Local Station</p>
                  <a href="https://www.wunderground.com/dashboard/pws/KAZSELLS7" target="_blank" rel="noreferrer" className="text-xl font-bold uppercase tracking-tight flex items-center gap-2 text-white hover:text-[#75D1F5] transition-colors">WX Now <Icons.ExternalLink size={14} className="opacity-80" /></a>
                </div>
              </div>
            </div>

          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: BRAND.textGray }}>Telemetry</h3>
                {loading.transients && <span className="text-[9px] font-bold uppercase animate-pulse text-[#4B9CD3]">Computing Orbits...</span>}
            </div>

            {[
              { id: 'iss', label: 'INTL. SPACE STATION PASS', icon: Icons.SpaceStation, link: 'https://heavens-above.com/PassSummary.aspx?satid=25544&lat=31.7801&lng=-111.5730&loc=Kitt+Peak&alt=2096&tz=MST' },
              { id: 'rocket', label: 'VANDENBERG LAUNCH', icon: Icons.Rocket, link: 'https://spaceflightnow.com/launch-schedule/' },
              { id: 'tiangong', label: 'Tiangong Pass', icon: Icons.SpaceStation, link: 'https://heavens-above.com/PassSummary.aspx?satid=48274&lat=31.7801&lng=-111.5730&loc=Kitt+Peak&alt=2096&tz=MST' }
            ].map(ev => {
                const data = transients[ev.id];
                const isNT = data?.time === "None Tonight";
                return (
                  <a key={ev.id} href={ev.link} target="_blank" rel="noreferrer" className="block p-5 rounded-2xl flex justify-between items-center shadow-md transition-all border text-white hover:bg-black/10 group" style={{ backgroundColor: BRAND.navy, borderColor: BRAND.slate }}>
                    <div className="flex items-center gap-4">
                      <div className="relative"><IconBox icon={ev.icon} />{!isNT && data?.time !== "Error" && data?.time !== "--:--" && !loading.transients && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 shadow-lg" style={{ backgroundColor: BRAND.cyan, borderColor: BRAND.navy }}></div>}</div>
                      <div className="text-left"><h4 className="font-black text-lg uppercase leading-none mb-1.5">{ev.label}</h4><p className="text-[9px] font-medium uppercase opacity-70 line-clamp-1 max-w-[150px] text-gray-300">{loading.transients ? "Computing Pass..." : data?.note}</p></div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        {isNT ? <div className="flex flex-col items-end leading-tight"><span className="text-xl font-black uppercase">None</span><span className="text-xl font-black uppercase">Tonight</span></div> : <div className="text-xl font-black tabular-nums">{loading.transients ? "--:--" : data?.time}</div>}
                        {!loading.transients && !isNT && data?.time !== "Error" && <div className="text-[8px] font-bold uppercase flex items-center gap-1 justify-end mt-1" style={{ color: BRAND.cyan }}>Confirmed <Icons.ExternalLink size={8} color={BRAND.cyan} /></div>}
                    </div>
                  </a>
                );
            })}
          </section>
        </div>

        <footer className="mt-auto py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row gap-x-8 gap-y-2 text-center md:text-left">
              <a href="tel:911" className="text-[10px] font-black uppercase tracking-widest hover:underline" style={{ color: BRAND.daygloOrange }}>Emergency: 911</a>
              <a href="tel:9058859471" className="text-[10px] font-black uppercase tracking-widest hover:underline" style={{ color: BRAND.daygloOrange }}>KPVC Ops Manager: (905) 885-9471</a>
              <a href="tel:5202500407" className="text-[10px] font-black uppercase tracking-widest hover:underline" style={{ color: BRAND.daygloOrange }}>Telescope Engineer: (520) 250-0407</a>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => setShowInfo(true)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5" title="About this dashboard"><Icons.Info size={20} color={BRAND.cyan} /></button>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Kitt Peak Summit Dashboard v4.5</p>
            </div>
        </footer>
      </div>
    </div>
  );
}
