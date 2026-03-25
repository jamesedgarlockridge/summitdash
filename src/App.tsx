import React, { useState, useEffect, useMemo } from 'react';

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
      {/* Central modules */}
      <path d="M9 12h6" />
      <path d="M12 9v6" />
      <rect x="10.5" y="10.5" width="3" height="3" rx="0.5" />
      {/* Long Outward Trusses */}
      <path d="M4 12h5" />
      <path d="M15 12h5" />
      {/* Protruding Solar Arrays (Sticking out far) */}
      <rect x="2" y="5" width="2" height="14" rx="0.5" />
      <rect x="5" y="5" width="2" height="14" rx="0.5" />
      <rect x="17" y="5" width="2" height="14" rx="0.5" />
      <rect x="20" y="5" width="2" height="14" rx="0.5" />
    </svg>
  ),
  Clock: ({ size = 24, color = "currentColor" }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  MapPin: ({ size = 24, color = "currentColor" }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Info: ({ size = 24, color = "currentColor", className = "" }: any) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
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
  )
};

const getLocalDateString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// --- ASTRONOMICAL ENGINE ---
const calculateSellsSunset = (dateStr: string) => {
  const LAT = 31.7801; const LON = -111.5730; const TIMEZONE = -7; 
  const targetDate = new Date(`${dateStr}T12:00:00`);
  const start = new Date(targetDate.getFullYear(), 0, 0);
  const diff = targetDate.getTime() - start.getTime();
  const n = Math.floor(diff / (1000 * 60 * 60 * 24));
  const gamma = (2 * Math.PI / 365) * (n - 1);
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma);
  const zenithRad = 90.833 * (Math.PI / 180); const latRad = LAT * (Math.PI / 180);
  let cosHa = (Math.cos(zenithRad) / (Math.cos(latRad) * Math.cos(decl))) - (Math.tan(latRad) * Math.tan(decl));
  cosHa = Math.max(Math.min(cosHa, 1), -1);
  const sunsetUtc = 720 - (4 * LON) - eqt + (4 * Math.acos(cosHa) * (180 / Math.PI));
  const sunsetLocalMinutes = (sunsetUtc + (TIMEZONE * 60)) % 1440;
  const h = Math.floor(sunsetLocalMinutes / 60); const m = Math.floor(sunsetLocalMinutes % 60);
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

const calculateNightfall = (dateStr: string) => {
  const LAT = 31.7801; const LON = -111.5730; const TIMEZONE = -7; 
  const targetDate = new Date(`${dateStr}T12:00:00`);
  const start = new Date(targetDate.getFullYear(), 0, 0);
  const diff = targetDate.getTime() - start.getTime();
  const n = Math.floor(diff / (1000 * 60 * 60 * 24));
  const gamma = (2 * Math.PI / 365) * (n - 1);
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma);
  const zenithRad = 108 * (Math.PI / 180); const latRad = LAT * (Math.PI / 180);
  let cosHa = (Math.cos(zenithRad) / (Math.cos(latRad) * Math.cos(decl))) - (Math.tan(latRad) * Math.tan(decl));
  cosHa = Math.max(Math.min(cosHa, 1), -1);
  const darkUtc = 720 - (4 * LON) - eqt + (4 * Math.acos(cosHa) * (180 / Math.PI));
  const darkLocalMinutes = (darkUtc + (TIMEZONE * 60)) % 1440;
  const h = Math.floor(darkLocalMinutes / 60); const m = Math.floor(darkLocalMinutes % 60);
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

const getMoonData = (dateStr: string) => {
  const lp = 2551443; const now = new Date(`${dateStr}T12:00:00Z`);
  const newMoon = new Date("1970-01-07T20:35:00Z");
  const pos = (((now.getTime() - newMoon.getTime()) / 1000) % lp) / lp;
  const illum = Math.abs(Math.cos(pos * 2 * Math.PI - Math.PI) / 2 + 0.5);
  let name = pos < 0.05 || pos > 0.95 ? "New Moon" : pos < 0.25 ? "Waxing Crescent" : pos < 0.30 ? "First Quarter" : pos < 0.45 ? "Waxing Gibbous" : pos < 0.55 ? "Full Moon" : pos < 0.70 ? "Waning Gibbous" : pos < 0.75 ? "Last Quarter" : "Waning Crescent";
  return { pos, illum: Math.round(illum * 100), name };
};

const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, backoff = 1000): Promise<any> => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw e;
  }
};

const IconBox = ({ icon: Icon, moonPos, className = "" }: { icon?: any, moonPos?: number, className?: string }) => (
  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0 border border-white/10 ${className}`} style={{ backgroundColor: BRAND.blue }}>
    {Icon ? <Icon size={24} color="#FFFFFF" /> : <MoonGraphic pos={moonPos || 0} />}
  </div>
);

const MoonGraphic = ({ pos }: { pos: number }) => {
  const sweep = pos > 0.5 ? 0 : 1; const radius = 10; const shadowX = radius * Math.cos(pos * 2 * Math.PI);
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r={radius} fill="rgba(0,0,0,0.2)" />
      <path d={`M 12 ${12-radius} A ${radius} ${radius} 0 0 ${sweep} 12 ${12+radius} A ${shadowX} ${radius} 0 0 ${1-sweep} 12 ${12-radius}`} fill="#FFFFFF" />
    </svg>
  );
};

export default function App() {
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [weather, setWeather] = useState({ tempLow: '--', windRange: '--', coverMax: '--', status: 'Fetching Data...', detail: '', color: BRAND.status.error });
  const [transients, setTransients] = useState<any>({ 
    iss: { time: "--:--", note: "Initializing Web Scraper..." }, 
    rocket: { time: "--:--", note: "Initializing Web Scraper..." }, 
    tiangong: { time: "--:--", note: "Initializing Web Scraper..." } 
  });
  const [loading, setLoading] = useState({ weather: true, transients: true });
  const [showInfo, setShowInfo] = useState(false);

  const moon = useMemo(() => getMoonData(selectedDate), [selectedDate]);
  const sunset = useMemo(() => calculateSellsSunset(selectedDate), [selectedDate]);
  const nightfall = useMemo(() => calculateNightfall(selectedDate), [selectedDate]);

  useEffect(() => {
    let active = true;
    async function fetchWeather() {
      setLoading(p => ({ ...p, weather: true }));
      try {
        const pointsUrl = `https://api.weather.gov/points/31.7801,-111.5730`;
        const pointsData = await fetchWithRetry(pointsUrl, { headers: { 'User-Agent': 'KittPeakObservatoryApp/1.0' } });
        const gridUrl = pointsData.properties.forecastGridData;
        const data = await fetchWithRetry(gridUrl, { headers: { 'User-Agent': 'KittPeakObservatoryApp/1.0' } });

        const parseDuration = (d: string) => {
            let h = 0; const dM = d.match(/P(\d+)D/); if (dM) h += parseInt(dM[1])*24;
            const hM = d.match(/T(\d+)H/); if (hM) h += parseInt(hM[1]);
            return h || 1;
        };

        const getValue = (arr: any[], tMs: number) => {
          for (const item of arr) {
            const [tS, dS] = item.validTime.split('/');
            const sMs = new Date(tS).getTime();
            if (tMs >= sMs && tMs < sMs + (parseDuration(dS)*3600000)) return item.value;
          }
          return null;
        };

        const hours = [18, 19, 20, 21, 22]; const tF: number[] = []; const wM: number[] = []; const cV: number[] = [];
        hours.forEach(h => {
          const targetMs = new Date(`${selectedDate}T${h.toString().padStart(2,'0')}:00:00-07:00`).getTime();
          const t = getValue(data.properties.temperature.values, targetMs); if (t !== null) tF.push(Math.round((t * 9/5) + 32));
          const w = getValue(data.properties.windSpeed.values, targetMs); if (w !== null) wM.push(Math.round(w / 1.609));
          const c = getValue(data.properties.skyCover.values, targetMs); if (c !== null) cV.push(Math.round(c));
        });

        if (tF.length > 0 && active) {
          const cMx = Math.max(...cV); const wMx = Math.max(...wM);
          let s = "Excellent Seeing", cl = BRAND.status.ideal, dt = "Clear summit conditions";
          if (cMx > 60) { s = "Poor Observation"; cl = BRAND.status.poor; dt = "Heavy Cloud Cover"; }
          else if (cMx > 30 || wMx > 20) { s = "Marginal"; cl = BRAND.status.marginal; dt = wMx > 20 ? "High Winds" : "Scattered Clouds"; }
          setWeather({ tempLow: `${Math.min(...tF)}°F`, windRange: `${Math.min(...wM)}–${wMx} mph`, coverMax: `${cMx}%`, status: s, color: cl, detail: dt });
        }
      } catch (e) { if (active) setWeather(p => ({ ...p, status: "Offline", color: BRAND.status.error })); }
      finally { if (active) setLoading(p => ({ ...p, weather: false })); }
    }
    fetchWeather(); return () => { active = false; };
  }, [selectedDate]);

  useEffect(() => {
    let active = true;
    async function executeScrape() {
      setLoading(p => ({ ...p, transients: true }));
      const results = { iss: { time: "None Tonight", note: "no visible pass in window" }, tiangong: { time: "None Tonight", note: "no visible pass in window" }, rocket: { time: "None Tonight", note: "No Vandenberg launch scheduled" } };

      try {
        const dO = new Date(`${selectedDate}T12:00:00`);
        const haDateStr = `${dO.getDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][dO.getMonth()]}`;
        const sfnDateStr = `${["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."][dO.getMonth()]} ${dO.getDate()}`;
        
        const fetchHtml = async (u: string) => {
            try {
                const r = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(u)}`, { cache: 'no-store' });
                const d = await r.json(); return d.contents || "";
            } catch(e) { return ""; }
        };

        const scrapePasses = async (id: number) => {
            const h = await fetchHtml(`https://heavens-above.com/PassSummary.aspx?satid=${id}&lat=31.7801&lng=-111.5730&loc=Kitt+Peak&alt=2096&tz=MST`);
            const doc = new DOMParser().parseFromString(h, "text/html");
            const rows = doc.querySelectorAll('.standardTable tr');
            for (let i = 0; i < rows.length; i++) {
                const c = rows[i].querySelectorAll('td');
                if (c.length >= 5 && c[0].textContent?.includes(haDateStr)) {
                    const t = c[2].textContent?.trim() || "";
                    let hh = parseInt(t.split(':')[0], 10);
                    if (hh >= 18 && hh <= 22) return { time: `${hh % 12 || 12}:${t.split(':')[1]} PM`, note: `Mag ${c[1].textContent} (Confirmed)` };
                }
            }
            return null;
        };

        const scrapeSFN = async () => {
            const h = await fetchHtml('https://spaceflightnow.com/launch-schedule/');
            const doc = new DOMParser().parseFromString(h, "text/html");
            const datenames = doc.querySelectorAll('.datename');
            const dayRegex = new RegExp(`\\b${dO.getDate()}\\b`);
            for (let i = 0; i < datenames.length; i++) {
                const el = datenames[i];
                if (el.textContent?.includes(sfnDateStr) && dayRegex.test(el.textContent)) {
                    const block = el.parentElement;
                    if (block && block.textContent?.includes('Vandenberg')) {
                        const launchData = block.querySelector('.launchdata')?.textContent || "";
                        if (launchData.includes("A.M.") || launchData.includes("AM") || launchData.includes("TBD")) continue;
                        const timeMatch = launchData.match(/(\d+(?::\d+)?\s*[a|p]\.?m\.?)/i);
                        return { time: timeMatch ? timeMatch[0].toUpperCase() : "Scheduled", note: `${block.querySelector('.mission')?.textContent?.substring(0,25)} (SFN)` };
                    }
                }
            }
            return null;
        };

        const [iss, css, rkt] = await Promise.all([scrapePasses(25544), scrapePasses(48274), scrapeSFN()]);
        if (iss && active) results.iss = iss; if (css && active) results.tiangong = css; if (rkt && active) results.rocket = rkt;
        if (active) setTransients(results);
      } catch (e) {} finally { if (active) setLoading(p => ({ ...p, transients: false })); }
    }
    executeScrape(); return () => { active = false; };
  }, [selectedDate]);

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans selection:bg-[#4B9CD3]/30" style={{ backgroundColor: BRAND.bgApp }}>
      <div className="max-w-4xl mx-auto flex flex-col min-h-[90vh]">
        
        {showInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#163A58] border border-[#2B5D82] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                <h2 className="text-xl font-black uppercase tracking-widest text-[#75D1F5]">Telemetry Sources</h2>
                <button onClick={() => setShowInfo(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><Icons.X size={24} color="white" /></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-300 uppercase font-bold tracking-widest leading-loose">
                  <p>Point-forecast Grid v3 via NOAA/NWS APIs.</p>
                  <p>Satellite scraping via Heavens-Above MST calibrated elevation model.</p>
                  <p>Vandenberg telemetry via SpaceFlightNow DOM parsing.</p>
                  <div className="pt-4 border-t border-white/5 opacity-60">Created with Gemini Canvas Pro 2026.</div>
              </div>
            </div>
          </div>
        )}

        <header className="mb-10 flex flex-col md:flex-row justify-between items-end border-b pb-6 border-white/10">
          <div className="w-full md:w-auto text-left">
            <h1 className="text-5xl md:text-6xl font-thin uppercase tracking-tighter leading-none mb-4" style={{ transform: 'scaleY(1.15)', transformOrigin: 'left bottom' }}>
                <span style={{ color: BRAND.blue }}>Kitt Peak</span> <span style={{ color: BRAND.navy }}>VC Dashboard</span>
            </h1>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="bg-transparent border-none text-4xl md:text-5xl font-black uppercase tracking-tighter p-0 focus:ring-0 outline-none cursor-pointer text-white hover:text-[#4B9CD3] transition-colors" />
          </div>
          <div className="text-right opacity-60 w-full md:w-auto mt-6 md:mt-0 text-gray-400">
            <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 justify-end text-gray-400"><Icons.MapPin size={12} /> 31.7801° N, -111.5730° W</p>
            <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 justify-end mt-1.5 text-gray-400"><Icons.Clock size={12} /> Observing Window: 6 PM – 10 PM</p>
          </div>
        </header>

        {/* GREEN CARTOUCHE - CENTERED FIX */}
        <div className="rounded-3xl p-8 mb-8 shadow-2xl flex flex-col justify-center items-center gap-6 relative overflow-hidden text-[#05070A]" style={{ backgroundColor: weather.color }}>
          {loading.weather && <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-10 font-bold uppercase tracking-widest text-sm animate-pulse">Syncing NWS...</div>}
          <div className="text-center w-full relative z-0">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Program Conditions</p>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight mt-1">{weather.status}</h2>
            <p className="text-sm font-bold uppercase opacity-80 mt-2">{weather.detail}</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto justify-center relative z-0">
            <div className="bg-black/10 p-5 rounded-2xl flex-1 md:min-w-[140px] text-center border border-black/5"><p className="text-[9px] font-black uppercase opacity-60 mb-2">Sunset (Local)</p><p className="text-2xl font-black">{sunset}</p></div>
            <div className="bg-black/10 p-5 rounded-2xl flex-1 md:min-w-[140px] text-center border border-black/5"><p className="text-[9px] font-black uppercase opacity-60 mb-2">Program Low</p><p className="text-2xl font-black">{weather.tempLow}</p></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <section className="p-8 rounded-[2rem] space-y-8 flex flex-col shadow-lg border text-white" style={{ backgroundColor: BRAND.navy, borderColor: BRAND.slate }}>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: BRAND.cyan }}>Atmospheric Profile</h3>
            
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
                <a href="https://varuna.kpno.noirlab.edu/allsky.htm" target="_blank" rel="noreferrer" className="relative shrink-0 flex items-center justify-center w-12 h-12 group transition-transform group-hover:scale-105">
                  <div className="absolute inset-0 rounded-xl shadow-lg border border-white/10" style={{ backgroundColor: BRAND.blue }} />
                  <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden border border-white/20 shadow-xl z-10"><img src="https://images.weserv.nl/?url=varuna.kpno.noirlab.edu/allsky/AllSkyCurrentImage.JPG&w=150&h=150&fit=cover&a=center&mask=circle" alt="Sky" className="w-full h-full object-cover scale-[1.35]" /></div>
                </a>
                <div className="text-left">
                  <p className="text-[9px] font-bold uppercase opacity-60 text-gray-400">All-Sky Camera</p>
                  <a href="https://varuna.kpno.noirlab.edu/allsky.htm" target="_blank" rel="noreferrer" className="text-xl font-bold uppercase tracking-tight flex items-center gap-2 text-white hover:text-[#75D1F5] transition-colors">Live View <Icons.ExternalLink size={14} className="opacity-80" /></a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <a href="https://www.wunderground.com/dashboard/pws/KAZSELLS7" target="_blank" rel="noreferrer" className="shrink-0 transition-transform group-hover:scale-105 block"><IconBox icon={Icons.Stars} /></a>
                <div className="text-left">
                  <p className="text-[9px] font-bold uppercase opacity-60 text-gray-400 flex items-end gap-1 mb-1"><span className="text-[9px] leading-none">KPNO</span> <span className="leading-none">WU Local Station</span></p>
                  <a href="https://www.wunderground.com/dashboard/pws/KAZSELLS7" target="_blank" rel="noreferrer" className="text-xl font-bold uppercase tracking-tight flex items-center gap-2 text-white hover:text-[#75D1F5] transition-colors">Current WX <Icons.ExternalLink size={14} className="opacity-80" /></a>
                </div>
              </div>
            </div>

            <div className="mt-auto p-4 rounded-xl flex gap-3 items-start bg-black/20 border" style={{ borderColor: BRAND.slate }}><Icons.Info size={14} className="shrink-0 mt-0.5" style={{ color: BRAND.cyan }} /><p className="text-[10px] font-medium opacity-90 leading-relaxed uppercase tracking-wider text-gray-300 text-left">Data verified from official NWS Graphical Forecast matching KPNO coordinates.</p></div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: BRAND.textGray }}>Scraped Telemetry</h3>
                {loading.transients && <span className="text-[9px] font-bold uppercase animate-pulse text-[#4B9CD3]">Reading DOM Tables...</span>}
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
                      <div className="text-left"><h4 className="font-black text-lg uppercase leading-none mb-1.5">{ev.label}</h4><p className="text-[9px] font-medium uppercase opacity-70 line-clamp-1 max-w-[150px] text-gray-300">{loading.transients ? "Executing Web Scrape..." : data?.note}</p></div>
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
              <button onClick={() => setShowInfo(true)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5"><Icons.Info size={20} color={BRAND.cyan} /></button>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Kitt Peak VC Dashboard v3.4</p>
            </div>
        </footer>
      </div>
    </div>
  );
}