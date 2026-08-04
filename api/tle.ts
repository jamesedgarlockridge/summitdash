// Proxies CelesTrak TLE lookups through Vercel's own edge cache, so every
// visitor's browser no longer fetches CelesTrak directly. CelesTrak's data
// only updates every ~2 hours anyway, so a matching cache window loses no
// real freshness — and it means no single visitor's network (or a shared
// office/campus IP) can ever trip CelesTrak's per-IP abuse protection for
// everyone else on it again.
export default async function handler(req: any, res: any) {
  const catnr = req.query?.catnr;
  if (!catnr || !/^\d+$/.test(String(catnr))) {
    res.status(400).send('catnr query param required');
    return;
  }

  try {
    const upstream = await fetch(`https://celestrak.org/NORAD/elements/gp.php?CATNR=${catnr}&FORMAT=TLE`);
    if (!upstream.ok) throw new Error(`Upstream HTTP ${upstream.status}`);
    const text = await upstream.text();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=7200, stale-while-revalidate=3600');
    res.status(200).send(text);
  } catch (e) {
    res.status(502).send('');
  }
}
