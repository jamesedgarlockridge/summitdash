import { useState, useEffect, useMemo } from 'react';
import { 
  Wind, 
  Cloud, 
  Rocket, 
  Satellite,
  MapPin,
  Clock,
  Info,
  ExternalLink,
  ThermometerSnowflake
} from 'lucide-react';

// --- STYLING & BRAND THEME ---
const BRAND = {
  bgApp: '#05070A',         
  textGray: '#484848',      // Dark gray matching the Kitt Peak logo
  navy: '#163A58',          
  slate: '#2B5D82',         
  blue: '#4B9CD3',          
  cyan: '#75D1F5',          
  status: {
    ideal: '#10B981',       
    fair: '#F59E0B',        
    marginal: '#F97316',    
    poor: '#EF4444',        
    error: '#4B5563'        
  }
};

// --- ASTRONOMICAL ENGINE ---
const calculateSellsSunset = (dateStr) => {
  const LAT = 31.7801;
  const LON = -111.5730; 
  const TIMEZONE = -7; 
  const targetDate = new Date(`${dateStr}T12:00:00`);
  const start = new Date(targetDate.getFullYear(), 0, 0);
  const diff = targetDate - start;
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

const calculateNightfall = (dateStr) => {
  const LAT = 31.7801;
  const LON = -111.5730; 
  const TIMEZONE = -7; 
  const targetDate = new Date(`${dateStr}T12:00:00`);
  const start = new Date(targetDate.getFullYear(), 0, 0);
  const diff = targetDate - start;
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
  return `${hours % 12 || 12}:${mins.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
};

const getMoonData = (dateStr) => {
  const lp = 2551443; 
  const now = new Date(`${dateStr}T12:00:00Z`);
  const newMoon = new Date("1970-01-07T20:35:00Z");
  const phase = ((now.getTime() - newMoon.getTime()) / 1000) % lp;
  const pos = phase / lp;
  const illum = Math.abs(Math.cos(pos * 2 * Math.PI - Math.PI) / 2 + 0.5);
  let name = pos < 0.05 || pos > 0.95 ? "New Moon" : pos < 0.25 ? "Waxing Crescent" : pos < 0.30 ? "First Quarter" : pos < 0.45 ? "Waxing Gibbous" : pos < 0.55 ? "Full Moon" : pos < 0.70 ? "Waning Gibbous" : pos < 0.75 ? "Last Quarter" : "Waning Crescent";
  return { pos, illum: Math.round(illum * 100), name };
};

const fetchWithRetry = async (url, options, retries = 3, backoff = 1000) => {
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

const IconBox = ({ icon: Icon, moonPos }) => (
  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0" style={{ backgroundColor: BRAND.blue }}>
    {Icon ? <Icon size={24} strokeWidth={2.5} color="#FFFFFF" /> : <MoonGraphic pos={moonPos} />}
  </div>
);

const MoonGraphic = ({ pos }) => {
  const sweep = pos > 0.5 ? 0 : 1;
  const radius = 10;
  const shadowX = radius * Math.cos(pos * 2 * Math.PI);
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r={radius} fill="rgba(0,0,0,0.2)" />
      <path d={`M 12 ${12-radius} A ${radius} ${radius} 0 0 ${sweep} 12 ${12+radius} A ${shadowX} ${radius} 0 0 ${1-sweep} 12 ${12-radius}`} fill="#FFFFFF" />
    </svg>
  );
};

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [weather, setWeather] = useState({ 
    tempLow: '--', windRange: '--', coverMax: '--', status: 'Fetching Data...', detail: '', color: BRAND.status.error 
  });
  const [transients, setTransients] = useState({ 
    iss: { time: "--:--", note: "Initializing Web Scraper..." }, 
    rocket: { time: "--:--", note: "Initializing Web Scraper..." }, 
    tiangong: { time: "--:--", note: "Initializing Web Scraper..." } 
  });
  const [loading, setLoading] = useState({ weather: true, transients: true });

  const moon = useMemo(() => getMoonData(selectedDate), [selectedDate]);
  const sunset = useMemo(() => calculateSellsSunset(selectedDate), [selectedDate]);
  const nightfall = useMemo(() => calculateNightfall(selectedDate), [selectedDate]);

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

        const parseDuration = (durationStr) => {
            let hours = 0;
            const daysMatch = durationStr.match(/P(\d+)D/);
            if (daysMatch) hours += parseInt(daysMatch[1], 10) * 24;
            const timePart = durationStr.includes('T') ? durationStr.split('T')[1] : '';
            const hoursMatch = timePart.match(/(\d+)H/);
            if (hoursMatch) hours += parseInt(hoursMatch[1], 10);
            return hours || 1; 
        };

        const getValueForTime = (valuesArray, targetTimeMs) => {
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
        const windowTempsF = [];
        const windowWindsMph = [];
        const windowCovers = [];

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
      
      const results = {
          iss: { time: "None Tonight", note: "No pass in window" },
          tiangong: { time: "None Tonight", note: "No pass in window" },
          rocket: { time: "None Tonight", note: "No Vandenberg launch scheduled" }
      };

      try {
        const dateObj = new Date(`${selectedDate}T12:00:00`);
        const day = dateObj.getDate();
        const haMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const haDateStr = `${day} ${haMonthNames[dateObj.getMonth()]}`;
        const sfnMonthNames = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
        const sfnMonthStr = sfnMonthNames[dateObj.getMonth()];
        const fullMonthStr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][dateObj.getMonth()];
        
        const fetchHtmlWithProxy = async (targetUrl) => {
            const encodedUrl = encodeURIComponent(targetUrl);
            try {
                const res = await fetch(`https://api.allorigins.win/get?url=${encodedUrl}`, { cache: 'no-store' });
                const data = await res.json();
                if (data.contents && data.contents.length > 500) return data.contents;
            } catch(e) {}
            try {
                const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodedUrl}`, { cache: 'no-store' });
                const text = await res.text();
                if (text && text.length > 500) return text;
            } catch(e) {}
            try {
                const res = await fetch(`https://corsproxy.io/?${encodedUrl}`, { cache: 'no-store' });
                const text = await res.text();
                if (text && text.length > 500) return text;
            } catch(e) {}
            throw new Error("All proxy routes blocked");
        };

        const scrapePasses = async (satId) => {
            try {
                const url = `https://heavens-above.com/PassSummary.aspx?satid=${satId}&lat=31.7801&lng=-111.5730&loc=Kitt+Peak&alt=2096&tz=MST`;
                const html = await fetchHtmlWithProxy(url);
                const doc = new DOMParser().parseFromString(html, "text/html");
                const rows = doc.querySelectorAll('.standardTable tbody tr.clickableRow');
                for (let row of rows) {
                    const cells = row.querySelectorAll('td');
                    if (cells.length > 5 && cells[0].textContent.includes(haDateStr)) {
                        const mag = cells[1].textContent.trim();
                        const time24 = cells[2].textContent.trim(); 
                        let [hh, mm] = time24.split(':');
                        hh = parseInt(hh, 10);
                        if (hh >= 18 && hh <= 22) {
                            const ampm = hh >= 12 ? 'PM' : 'AM';
                            const hh12 = hh % 12 || 12;
                            return { time: `${hh12}:${mm} ${ampm}`, note: `Mag ${mag} (Confirmed)` };
                        }
                    }
                }
                return null;
            } catch (e) {
                return { time: "Error", note: "Proxies Offline" };
            }
        };

        const scrapeSFN = async () => {
            try {
                const html = await fetchHtmlWithProxy('https://spaceflightnow.com/launch-schedule/');
                const doc = new DOMParser().parseFromString(html, "text/html");
                const datenames = doc.querySelectorAll('.datename');
                for (let el of datenames) {
                    if ((el.textContent.includes(sfnMonthStr) || el.textContent.includes(fullMonthStr)) && el.textContent.includes(day.toString())) {
                        const block = el.parentElement;
                        if (block && block.textContent.includes('Vandenberg')) {
                            const mission = block.querySelector('.mission')?.textContent || "Launch Scheduled";
                            return { time: "Scheduled", note: `${mission.substring(0,25)} (SFN)` };
                        }
                    }
                }
                return null;
            } catch (e) {
                return { time: "Error", note: "Proxies Offline" };
            }
        };

        const [issData, cssData, rocketData] = await Promise.all([
            scrapePasses(25544), 
            scrapePasses(48274), 
            scrapeSFN()
        ]);

        if (issData && active) results.iss = issData;
        if (cssData && active) results.tiangong = cssData;
        if (rocketData && active) results.rocket = rocketData;

        if (active) setTransients(results);
      } catch (e) {
        if (active) {
            setTransients({ 
                iss: { time: "Error", note: "Scraper Blocked" }, 
                rocket: { time: "Error", note: "Scraper Blocked" }, 
                tiangong: { time: "Error", note: "Scraper Blocked" } 
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
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-10 flex flex-col md:flex-row justify-between items-end border-b pb-6 border-white/10">
          <div className="w-full md:w-auto">
            <div className="mb-6 flex flex-wrap gap-x-3">
                <h1 
                    className="text-5xl md:text-6xl font-thin uppercase tracking-tighter leading-none" 
                    style={{ transform: 'scaleY(1.15)', transformOrigin: 'left bottom' }}
                >
                    <span style={{ color: BRAND.blue }}>Kitt Peak</span>{' '}
                    <span style={{ color: BRAND.navy }}>VC Dashboard</span>
                </h1>
            </div>
            <input 
                type="date" 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)} 
                className="bg-transparent border-none text-4xl md:text-5xl font-black uppercase tracking-tighter p-0 focus:ring-0 outline-none cursor-pointer text-white hover:text-[#4B9CD3] transition-colors"
            />
          </div>
          <div className="text-right opacity-60 w-full md:w-auto mt-6 md:mt-0 text-gray-400">
            <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 justify-end">
                <MapPin size={12}/> 31.7801° N, 111.5730° W
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 justify-end mt-1.5">
                <Clock size={12}/> Observing Window: 6 PM – 10 PM
            </p>
          </div>
        </header>

        <div 
          className="rounded-3xl p-8 mb-8 shadow-2xl transition-all duration-700 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden text-[#05070A]" 
          style={{ backgroundColor: weather.color, boxShadow: `0 20px 50px -12px ${weather.color}44` }}
        >
          {loading.weather && (
             <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-10">
                 <div className="font-bold uppercase tracking-widest text-sm animate-pulse text-[#05070A]">Synchronizing NWS Grid...</div>
             </div>
          )}
          
          <div className="text-center md:text-left relative z-0 pl-4 md:pl-0">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Program Conditions</p>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight mt-1">
                {weather.status}
            </h2>
            <p className="text-sm font-bold uppercase opacity-80 mt-2">{weather.detail}</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto relative z-0">
            <div className="bg-black/10 p-5 rounded-2xl flex-1 md:min-w-[140px] text-center border border-black/5 backdrop-blur-md">
              <p className="text-[9px] font-black uppercase opacity-60 mb-2">Sunset (Local)</p>
              <p className="text-2xl font-black">{sunset}</p>
            </div>
            <div className="bg-black/10 p-5 rounded-2xl flex-1 md:min-w-[140px] text-center border border-black/5 backdrop-blur-md">
              <p className="text-[9px] font-black uppercase opacity-60 mb-2 flex justify-center items-center gap-1">
                Program Low <ThermometerSnowflake size={10} className="opacity-70" />
              </p>
              <p className="text-2xl font-black">{weather.tempLow}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="p-8 rounded-[2rem] space-y-8 flex flex-col shadow-lg border text-white" style={{ backgroundColor: BRAND.navy, borderColor: BRAND.slate }}>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2" style={{ color: BRAND.cyan }}>
                Atmospheric Profile
            </h3>
            
            <div className="flex items-center gap-6">
              <IconBox moonPos={moon.pos} />
              <div>
                <p className="text-xl font-black uppercase tracking-tight leading-none mb-1">{moon.name}</p>
                <p className="text-[10px] font-bold uppercase opacity-80 text-gray-400">Illumination: {moon.illum}%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t" style={{ borderColor: BRAND.slate }}>
              <div className="flex items-center gap-4">
                <IconBox icon={Wind} />
                <div>
                  <p className="text-[9px] font-bold uppercase opacity-60 text-gray-400">Max Wind</p>
                  <p className="text-xl font-bold tabular-nums">{weather.windRange}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <IconBox icon={Cloud} />
                <div>
                  <p className="text-[9px] font-bold uppercase opacity-60 text-gray-400">Cloud Cover</p>
                  <p className="text-xl font-bold tabular-nums">{weather.coverMax}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: BRAND.slate }}>
              <IconBox icon={Clock} />
              <div>
                <p className="text-[9px] font-bold uppercase opacity-60 text-gray-400">Astronomical Twilight (Nightfall)</p>
                <p className="text-xl font-bold tabular-nums">{nightfall}</p>
              </div>
            </div>

            <div className="mt-auto p-4 rounded-xl flex gap-3 items-start bg-black/20 border" style={{ borderColor: BRAND.slate }}>
                <Info size={14} className="shrink-0 mt-0.5" style={{ color: BRAND.cyan }} />
                <p className="text-[10px] font-medium opacity-90 leading-relaxed uppercase tracking-wider text-gray-300">
                    Data verified from official NWS Graphical Forecast matching KPNO coordinates.
                </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: BRAND.textGray }}>Scraped Telemetry</h3>
                {loading.transients && <span className="text-[9px] font-bold uppercase animate-pulse" style={{ color: BRAND.blue }}>Reading DOM Tables...</span>}
            </div>

            {[
              { id: 'iss', label: 'INTL. SPACE STATION PASS', icon: Satellite, link: 'https://www.astroviewer.net/iss/en/observation.php' },
              { id: 'rocket', label: 'VANDENBERG LAUNCH', icon: Rocket, link: 'https://spaceflightnow.com/launch-schedule/' },
              { id: 'tiangong', label: 'Tiangong Pass', icon: Satellite, link: 'https://www.astroviewer.net/iss/en/observation-css.php' }
            ].map(ev => (
              <a key={ev.id} href={ev.link} target="_blank" rel="noreferrer" className="block p-5 rounded-2xl flex justify-between items-center shadow-md transition-all border text-white hover:bg-black/10" style={{ backgroundColor: BRAND.navy, borderColor: BRAND.slate }}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <IconBox icon={ev.icon} />
                    {transients[ev.id]?.time !== "None Tonight" && transients[ev.id]?.time !== "Error" && transients[ev.id]?.time !== "--:--" && !loading.transients && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 shadow-lg" style={{ backgroundColor: BRAND.cyan, borderColor: BRAND.navy }}></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-lg uppercase leading-none mb-1.5">{ev.label}</h4>
                    <p className="text-[9px] font-medium uppercase opacity-70 line-clamp-1 max-w-[150px] text-gray-300">
                        {loading.transients ? "Executing Web Scrape..." : transients[ev.id]?.note}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-black tabular-nums">
                        {loading.transients ? "--:--" : transients[ev.id]?.time}
                    </div>
                    {!loading.transients && transients[ev.id]?.time !== "None Tonight" && transients[ev.id]?.time !== "Error" && (
                         <div className="text-[8px] font-bold uppercase flex items-center gap-1 justify-end mt-1" style={{ color: BRAND.cyan }}>
                            Confirmed <ExternalLink size={8}/>
                         </div>
                    )}
                </div>
              </a>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}