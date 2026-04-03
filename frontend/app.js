const { useState, useEffect, useRef, useCallback, useMemo } = React;
// Use Render backend URL - update this to your deployed Render URL
const API = process.env.REACT_APP_API_URL || "https://your-backend.onrender.com";

// ========== SVG Icons (Feather-style) ==========
const s = (sz = 18) => ({ width: sz, height: sz, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { display: "inline-block", verticalAlign: "middle", flexShrink: 0 } });
const I = {
  Zap: ({ size }) => <svg {...s(size)}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Package: ({ size }) => <svg {...s(size)}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Clock: ({ size }) => <svg {...s(size)}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  AlertTri: ({ size }) => <svg {...s(size)}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Users: ({ size }) => <svg {...s(size)}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Play: ({ size }) => <svg {...s(size)}><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Square: ({ size }) => <svg {...s(size)}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>,
  Flame: ({ size }) => <svg {...s(size)}><path d="M12 22c-4.97 0-9-2.69-9-6 0-3 2-5.5 4-7.5 1-1 2-2.5 2-4.5 0 3 3 5 5 7 .5.5 1 1.5 1 2.5 0-1.5 1.5-3 3-4 0 2.5-1 4-2 5.5C17.5 17 19 14.5 19 12c0 0 2 2.5 2 4 0 3.31-4.03 6-9 6z"/></svg>,
  Layers: ({ size }) => <svg {...s(size)}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  MapPin: ({ size }) => <svg {...s(size)}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  BarChart: ({ size }) => <svg {...s(size)}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  Activity: ({ size }) => <svg {...s(size)}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Navigation: ({ size }) => <svg {...s(size)}><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>,
  Grid: ({ size }) => <svg {...s(size)}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Truck: ({ size }) => <svg {...s(size)}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Settings: ({ size }) => <svg {...s(size)}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  ArrowRight: ({ size }) => <svg {...s(size)}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  TrendUp: ({ size }) => <svg {...s(size)}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  TrendDown: ({ size }) => <svg {...s(size)}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  ChevronRight: ({ size }) => <svg {...s(size)}><polyline points="9 18 15 12 9 6"/></svg>,
  Map: ({ size }) => <svg {...s(size)}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
};

// ========== Coordinates (verified Google Maps April 2026) ==========
const WH = { lat: 27.1800, lng: 78.0100 };
const LC = {
  "Taj Ganj": [27.1604, 78.0541],
  "Sadar Bazaar": [27.1587, 78.0100],
  "Kamla Nagar": [27.2114, 78.0208],
  "Dayal Bagh": [27.2294, 78.0072],
  "Sanjay Place": [27.1897, 78.0039],
  "Fatehabad Road": [27.1630, 78.0260],
  "Shahganj": [27.1664, 77.9738],
  "Khandari": [27.2090, 77.9940],
  "Raja ki Mandi": [27.1941, 77.9969],
  "Sikandra": [27.2204, 77.9503],
  "Trans Yamuna": [27.2081, 78.0468],
  "Loha Mandi": [27.1941, 77.9732],
};

// ========== Chart Component ==========
function ChartC({ type, data, options, id, plugins }) {
  const ref = useRef(null);
  const chart = useRef(null);
  useEffect(() => {
    if (!ref.current || !data) return;
    if (chart.current) chart.current.destroy();
    chart.current = new Chart(ref.current.getContext("2d"), {
      type, data,
      options: { responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: options?.showLegend || false, position: options?.legendPosition || "bottom", labels: { color: "#6b7280", font: { family: "Inter", size: 11 }, padding: 16, usePointStyle: true, pointStyle: "circle" } } },
        scales: { x: { ticks: { color: "#9ca3af", font: { family: "Inter", size: 10 } }, grid: { color: "#f0f0f0" } }, y: { ticks: { color: "#9ca3af", font: { family: "Inter", size: 10 } }, grid: { color: "#f0f0f0" } } },
        ...options },
      plugins: plugins || []
    });
    return () => { if (chart.current) chart.current.destroy(); };
  }, [data, type]);
  return <canvas ref={ref} id={id} />;
}

// ========== Delivery Map ==========
function DeliveryMap({ orders, latest }) {
  const ref = useRef(null);
  const map = useRef(null);
  const ml = useRef(null);
  const pl = useRef(null);

  useEffect(() => {
    if (!ref.current || map.current) return;
    const m = L.map(ref.current, { scrollWheelZoom: true }).setView([WH.lat, WH.lng], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap", maxZoom: 18 }).addTo(m);
    const wi = L.divIcon({ html: '<div class="warehouse-marker-icon">W</div>', className: "", iconSize: [28, 28], iconAnchor: [14, 14] });
    L.marker([WH.lat, WH.lng], { icon: wi }).addTo(m).bindPopup("<b>Blinkit Warehouse</b><br>Central Agra");
    ml.current = L.layerGroup().addTo(m);
    pl.current = L.layerGroup().addTo(m);
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    if (!map.current || !ml.current) return;
    ml.current.clearLayers();
    pl.current.clearLayers();
    orders.forEach((o) => {
      const c = o.drop_lat && o.drop_lng ? [o.drop_lat, o.drop_lng] : LC[o.drop_location];
      if (!c) return;
      const isL = latest && o.order_id === latest.order_id;
      const del = o.delivery_duration_min > 15;
      const col = isL ? "#f5b849" : del ? "#e6533c" : "#26bf94";
      const r = isL ? 9 : 6;
      const ic = L.divIcon({ html: `<div class="delivery-marker-icon" style="width:${r*2}px;height:${r*2}px;background:${col};"></div>`, className: "", iconSize: [r*2, r*2], iconAnchor: [r, r] });
      L.marker(c, { icon: ic }).addTo(ml.current).bindPopup(`<b>#${o.order_id}</b><br>${o.drop_location}<br>${o.distance_km} km • ${o.delivery_duration_min} min`);
      if (isL) {
        L.polyline([[WH.lat, WH.lng], c], { color: "#2ecc40", weight: 3, dashArray: "8,6", opacity: .8 }).addTo(pl.current);
        L.polyline([[WH.lat, WH.lng], c], { color: "#2ecc40", weight: 10, opacity: .08 }).addTo(pl.current);
      }
    });
  }, [orders, latest]);

  return <div ref={ref} style={{ height: "100%", width: "100%" }} />;
}

// ========== Main App ==========
function App() {
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [peakToggle, setPeakToggle] = useState(false);
  const [batchFilter, setBatchFilter] = useState(0);
  const [speed, setSpeed] = useState(3);
  const [streamed, setStreamed] = useState([]);
  const esRef = useRef(null);
  
  // Backend health check
  const [backendStatus, setBackendStatus] = useState("starting"); // "starting", "alive", "dead"
  const [backendMessage, setBackendMessage] = useState("Waking up backend... (30-60s)");

  // Interactive button states
  const [showAllLatest, setShowAllLatest] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [zoneSortMode, setZoneSortMode] = useState(0); // 0=by count, 1=by name, 2=by distance
  const [chartSortMode, setChartSortMode] = useState(0); // 0=time, 1=orders desc, 2=avg time desc
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [slaMode, setSlaMode] = useState(1); // 0=10min, 1=15min, 2=20min
  const slaValues = [10, 15, 20];

  // Auto-wake backend on page load
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 15;
    const checkBackend = async () => {
      try {
        const response = await fetch(`${API}/health`, { method: "GET", timeout: 5000 });
        if (response.ok) {
          setBackendStatus("alive");
          setBackendMessage("Backend is ready! 🚀");
          return true;
        }
      } catch (err) {
        attempts++;
        if (attempts < maxAttempts) {
          setBackendMessage(`Waking up... (${attempts}/${maxAttempts}) ⏳`);
          setTimeout(checkBackend, 2000);
        } else {
          setBackendStatus("dead");
          setBackendMessage("Backend not responding. Check URL. 💥");
        }
      }
      return false;
    };
    checkBackend();
  }, []);

  useEffect(() => {
    if (backendStatus !== "alive") return;
    Promise.all([fetch(`${API}/orders`).then(r => r.json()), fetch(`${API}/metrics`).then(r => r.json())])
      .then(([o, m]) => { setOrders(o); setMetrics(m); setLoading(false); })
      .catch(() => setLoading(false));
  }, [backendStatus]);

  const toggleSim = useCallback(() => {
    if (streaming) { esRef.current?.close(); esRef.current = null; setStreaming(false); }
    else {
      setStreamed([]);
      const es = new EventSource(`${API}/simulate?speed=${speed}`);
      esRef.current = es; setStreaming(true);
      es.onmessage = e => setStreamed(p => [...p, JSON.parse(e.data)]);
      es.onerror = () => { es.close(); setStreaming(false); };
    }
  }, [streaming, speed]);

  const processed = useMemo(() => {
    let d = streaming && streamed.length > 0 ? streamed : orders;
    if (peakToggle) d = d.map(o => ({ ...o, delivery_duration_min: o.is_peak_hour ? +(o.delivery_duration_min * 1.2).toFixed(2) : o.delivery_duration_min }));
    if (batchFilter > 0) d = d.filter(o => o.batch_size === batchFilter);
    return d;
  }, [orders, streamed, streaming, peakToggle, batchFilter]);

  const latest = streaming && streamed.length > 0 ? streamed[streamed.length - 1] : null;

  // SLA threshold: cycles between 10, 15, 20 min
  const SLA = slaValues[slaMode];

  const m = useMemo(() => {
    if (processed.length === 0) return null;
    const avg = processed.reduce((s, o) => s + o.delivery_duration_min, 0) / processed.length;
    const del = processed.filter(o => o.delivery_duration_min > SLA);
    const dp = (del.length / processed.length) * 100;
    const ontime = processed.length - del.length;
    const ontimePct = (ontime / processed.length) * 100;
    const rm = {}; processed.forEach(o => { rm[o.rider_id] = (rm[o.rider_id] || 0) + 1; });
    const rids = Object.keys(rm);
    const opr = rids.reduce((s, id) => s + rm[id], 0) / rids.length;
    const bm = {}; processed.forEach(o => { if (!bm[o.batch_size]) bm[o.batch_size] = { s: 0, c: 0 }; bm[o.batch_size].s += o.delivery_duration_min; bm[o.batch_size].c++; });
    const bc = {}; Object.keys(bm).forEach(k => { bc[k] = +(bm[k].s / bm[k].c).toFixed(1); });
    // Peak vs off-peak
    const peakOrders = processed.filter(o => o.is_peak_hour);
    const offpeakOrders = processed.filter(o => !o.is_peak_hour);
    const peakAvg = peakOrders.length > 0 ? +(peakOrders.reduce((s,o) => s + o.delivery_duration_min, 0) / peakOrders.length).toFixed(1) : 0;
    const offpeakAvg = offpeakOrders.length > 0 ? +(offpeakOrders.reduce((s,o) => s + o.delivery_duration_min, 0) / offpeakOrders.length).toFixed(1) : 0;
    return {
      avg: +avg.toFixed(1), dp: +dp.toFixed(1), ontimePct: +ontimePct.toFixed(1),
      opr: +opr.toFixed(1), total: processed.length, riders: rids.length, bc,
      peakAvg, offpeakAvg, peakCount: peakOrders.length, offpeakCount: offpeakOrders.length,
      delayed: del.length, ontime
    };
  }, [processed]);

  // Avg distance per zone (for sort mode)
  const zoneDistances = useMemo(() => {
    const d = {}; const c = {};
    processed.forEach(o => { d[o.drop_location] = (d[o.drop_location] || 0) + o.distance_km; c[o.drop_location] = (c[o.drop_location] || 0) + 1; });
    const result = {}; Object.keys(d).forEach(k => { result[k] = +(d[k] / c[k]).toFixed(1); });
    return result;
  }, [processed]);

  // Location counts for "Top Delivery Zones"
  const zones = useMemo(() => {
    const c = {}; processed.forEach(o => { c[o.drop_location] = (c[o.drop_location] || 0) + 1; });
    let sorted = Object.entries(c);
    if (zoneSortMode === 0) sorted.sort((a, b) => b[1] - a[1]);
    else if (zoneSortMode === 1) sorted.sort((a, b) => a[0].localeCompare(b[0]));
    else sorted.sort((a, b) => (zoneDistances[b[0]] || 0) - (zoneDistances[a[0]] || 0));
    return sorted.slice(0, 6);
  }, [processed]);

  // Charts — Mixed bar+line for Delivery Overview
  const hourlyData = useMemo(() => {
    const hm = {}; const tm = {}; const cm = {};
    processed.forEach(o => {
      const h = parseInt(o.order_time.split(":")[0]);
      hm[h] = (hm[h] || 0) + 1;
      tm[h] = (tm[h] || 0) + o.delivery_duration_min;
      cm[h] = (cm[h] || 0) + 1;
    });
    const hrs = Array.from({ length: 15 }, (_, i) => i + 9);
    const ordersData = hrs.map(h => hm[h] || 0);
    const avgTimeData = hrs.map(h => cm[h] ? +(tm[h] / cm[h]).toFixed(1) : 0);
    const peakData = hrs.map(h => {
      const chunk = processed.filter(o => parseInt(o.order_time.split(":")[0]) === h && o.is_peak_hour);
      return chunk.length;
    });
    return { labels: hrs.map(h => `${h}:00`), datasets: [
      { type: "bar", label: "Orders/hr", data: ordersData, backgroundColor: "#2ecc40", borderRadius: 4, barPercentage: .5, order: 2 },
      { type: "line", label: "Avg Time (min)", data: avgTimeData, borderColor: "#e6533c", backgroundColor: "rgba(230,83,60,.08)", borderWidth: 2, tension: .4, fill: true, pointRadius: 0, yAxisID: "y1", order: 1 },
      { type: "line", label: "Peak Orders", data: peakData, borderColor: "#c8cdd5", backgroundColor: "rgba(200,205,213,.15)", borderWidth: 1.5, tension: .4, fill: true, pointRadius: 0, order: 0 }
    ] };
  }, [processed]);

  // Half-donut gauge — meaningful delivery status categories
  const statusDonut = useMemo(() => {
    const fast = processed.filter(o => o.delivery_duration_min <= 10).length;     // Under 10 min (Blinkit promise)
    const ontime = processed.filter(o => o.delivery_duration_min > 10 && o.delivery_duration_min <= SLA).length; // 10-15 min (within SLA)
    const delayed = processed.filter(o => o.delivery_duration_min > SLA && o.delivery_duration_min <= 25).length; // 15-25 min (delayed)
    const critical = processed.filter(o => o.delivery_duration_min > 25).length;  // 25+ min (critical)
    return { labels: ["Under 10min", "Within SLA", "Delayed", "Critical"], datasets: [{
      data: [fast, ontime, delayed, critical],
      backgroundColor: ["#2ecc40", "#23b7e5", "#f5b849", "#e6533c"],
      borderWidth: 0, cutout: "82%", borderRadius: 20,
      circumference: 180, rotation: -90
    }] };
  }, [processed]);

  // Center text plugin for half-donut
  const donutCenterPlugin = useMemo(() => [{
    id: 'donutCenterText',
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      const cx = (chartArea.left + chartArea.right) / 2;
      const cy = chartArea.bottom - 20;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#232b3e';
      ctx.font = 'bold 22px Inter';
      ctx.fillText('Total', cx, cy - 16);
      ctx.font = '600 28px Inter';
      ctx.fillText(chart.data.datasets[0].data.reduce((a,b) => a+b, 0).toLocaleString(), cx, cy + 16);
      ctx.restore();
    }
  }], []);

  // Peak Statistics — hourly breakdown showing peak (18-22h) vs off-peak
  const peakBarData = useMemo(() => {
    const hrs = Array.from({ length: 15 }, (_, i) => i + 9);
    const peakCounts = hrs.map(h => processed.filter(o => parseInt(o.order_time.split(":")[0]) === h && o.is_peak_hour).length);
    const offpeakCounts = hrs.map(h => processed.filter(o => parseInt(o.order_time.split(":")[0]) === h && !o.is_peak_hour).length);
    return { labels: hrs.map(h => `${h}`), datasets: [
      { label: "Peak (18-22h)", data: peakCounts, backgroundColor: "#2ecc40", borderRadius: 3, barPercentage: .7 },
      { label: "Off-Peak", data: offpeakCounts, backgroundColor: "#e4e7ed", borderRadius: 3, barPercentage: .7 }
    ] };
  }, [processed]);

  if (loading) return <div className="loading"><div className="spinner"></div><div style={{ fontSize: 14, color: "#9ca3af" }}>Loading delivery data...</div></div>;

  // ontime and delayed are now computed inside useMemo (m.ontime, m.delayed)

  return (
    <div className="layout">
      {/* BACKEND STATUS INDICATOR */}
      <div style={{
        position: "fixed",
        top: 12,
        right: 12,
        padding: "8px 12px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        zIndex: 9999,
        backdropFilter: "blur(10px)",
        backgroundColor: backendStatus === "alive" ? "rgba(46, 204, 64, 0.15)" : backendStatus === "starting" ? "rgba(245, 184, 73, 0.15)" : "rgba(230, 83, 60, 0.15)",
        border: `1px solid ${backendStatus === "alive" ? "#2ecc40" : backendStatus === "starting" ? "#f5b849" : "#e6533c"}`,
        color: backendStatus === "alive" ? "#16a34a" : backendStatus === "starting" ? "#b45309" : "#991b1b"
      }}>
        <div style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: backendStatus === "alive" ? "#2ecc40" : backendStatus === "starting" ? "#f5b849" : "#e6533c",
          animation: backendStatus === "starting" ? "pulse 2s infinite" : "none"
        }} />
        <span>{backendMessage}</span>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/media/blinkitlogo.png" alt="Blinkit" />
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-label">Main</div>
          <a className="nav-item active"><I.Grid size={16} /> Dashboard</a>
          <a className="nav-item"><I.BarChart size={16} /> Analytics <span className="soon-badge">Coming Soon</span></a>
          <a className="nav-item"><I.Truck size={16} /> Deliveries <span className="soon-badge">Coming Soon</span></a>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-label">Simulation</div>
          <a className="nav-item"><I.Activity size={16} /> Live Stream <span className="soon-badge">Coming Soon</span></a>
          <a className="nav-item"><I.Map size={16} /> Map View <span className="soon-badge">Coming Soon</span></a>
          <a className="nav-item"><I.Flame size={16} /> Peak Analysis <span className="soon-badge">Coming Soon</span></a>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-label">Data</div>
          <a className="nav-item"><I.Package size={16} /> Orders <span className="soon-badge">Coming Soon</span></a>
          <a className="nav-item"><I.Users size={16} /> Riders <span className="soon-badge">Coming Soon</span></a>
          <a className="nav-item"><I.Settings size={16} /> Settings <span className="soon-badge">Coming Soon</span></a>
        </div>
        <div className="sidebar-sim-card">
          <p>Real-time delivery simulation with 200 orders across Agra</p>
          <button className={`sim-btn ${streaming ? "running" : ""}`} onClick={toggleSim}>
            {streaming ? <><I.Square size={12} /> Stop Simulation</> : <><I.Play size={12} /> Start Simulation</>}
          </button>
        </div>
      </aside>

      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <div className="breadcrumb">Dashboard <span>→ Overview</span></div>
          <h1>Delivery Dashboard</h1>
        </div>
        <div className="header-right">
          <div className="header-ctrl">
            <I.Clock size={13} />
            <select value={speed} onChange={e => setSpeed(+e.target.value)} disabled={streaming}>
              <option value={1.5}>1.5s Fast</option><option value={3}>3s Normal</option><option value={5}>5s Slow</option>
            </select>
          </div>
          <button className={`header-ctrl ${peakToggle ? "active" : ""}`} onClick={() => setPeakToggle(!peakToggle)}>
            <I.Flame size={13} /> Peak +20%
          </button>
          <button className={`header-ctrl ${batchFilter===0 ? "active" : ""}`} onClick={() => setBatchFilter(0)}>All</button>
          <button className={`header-ctrl ${batchFilter===1 ? "active" : ""}`} onClick={() => setBatchFilter(1)}>Single</button>
          <button className={`header-ctrl ${batchFilter===2 ? "active" : ""}`} onClick={() => setBatchFilter(2)}>
            <I.Layers size={13} /> Batch
          </button>
          <div className={`status-badge ${streaming ? "live" : ""}`}>
            <span className="status-dot"></span>
            {streaming ? `Streaming ${streamed.length}` : "Ready"}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="main">
        {/* KPI ROW */}
        <div className="kpi-row fade-in">
          <div className="kpi">
            <div className="kpi-label">Total Orders</div>
            <div className="kpi-value">{m?.total || 0}</div>
            <div className="kpi-trend up"><I.TrendUp size={13} /> {m?.total || 0} in view</div>
            <div className="kpi-icon-badge purple"><I.Package size={18} /></div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Active Riders</div>
            <div className="kpi-value">{m?.riders || 0}</div>
            <div className="kpi-trend up"><I.TrendUp size={13} /> {m?.opr || 0} orders/rider</div>
            <div className="kpi-icon-badge cyan"><I.Users size={18} /></div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Avg Delivery Time</div>
            <div className="kpi-value">{m?.avg || 0}<span style={{fontSize:14,fontWeight:400}}> min</span></div>
            <div className={`kpi-trend ${m && m.avg <= SLA ? "up" : "down"}`}>
              {m && m.avg <= SLA ? <I.TrendUp size={13} /> : <I.TrendDown size={13} />} SLA: {SLA} min
            </div>
            <div className="kpi-icon-badge green"><I.Clock size={18} /></div>
          </div>
          <div className="kpi">
            <div className="kpi-label">On-Time Rate</div>
            <div className="kpi-value">{m?.ontimePct || 0}<span style={{fontSize:14,fontWeight:400}}>%</span></div>
            <div className={`kpi-trend ${m && m.ontimePct >= 50 ? "up" : "down"}`}>
              {m && m.ontimePct >= 50 ? <I.TrendUp size={13} /> : <I.TrendDown size={13} />} {m?.ontime || 0}/{m?.total || 0} within SLA
            </div>
            <div className="kpi-icon-badge orange"><I.AlertTri size={18} /></div>
          </div>
          <div className="promo-card">
            <img src="/media/banner.png" alt="Blinkit Delivery Simulation Dashboard" />
            <div className="promo-card-overlay">
              <span className="promo-link" onClick={toggleSim}>{streaming ? "Stop Simulation" : "Start Simulation"} <I.ArrowRight size={14} /></span>
            </div>
          </div>
        </div>

        {/* ROW 2: Chart + Donut + Top Zones */}
        <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr",gap:16,marginBottom:20}}>
          {/* Delivery Overview — Mixed Bar+Line (Xintra Sales Overview style) */}
          <div className="card">
            <div className="card-head"><div className="card-title"><I.Activity size={15} /> Delivery Overview</div><span className="card-link" style={{fontSize:12,color:"var(--text-muted)",border:"1px solid var(--border)",padding:"4px 12px",borderRadius:6,cursor:"pointer"}} onClick={() => setChartSortMode((chartSortMode + 1) % 3)}>{["By Time ↓","By Orders ↓","By Avg Time ↓"][chartSortMode]}</span></div>
            <div className="card-body"><div className="chart-area" style={{height:270}}>
              <ChartC id="c1" type="bar" data={hourlyData} options={{
                showLegend: true, legendPosition: "bottom",
                layout: { padding: { left: 0, right: 0 } },
                scales: {
                  x: { offset: false, ticks: { color: "#9ca3af", font: { family: "Inter", size: 10 } }, grid: { display: false } },
                  y: { position: "left", beginAtZero: true, ticks: { color: "#9ca3af", font: { family: "Inter", size: 10 } }, grid: { color: "#f0f0f0" } },
                  y1: { position: "right", beginAtZero: true, ticks: { color: "#e6533c", font: { family: "Inter", size: 10 } }, grid: { display: false } }
                },
                interaction: { mode: "index", intersect: false },
                plugins: { tooltip: { mode: "index", intersect: false, backgroundColor: "#fff", titleColor: "#232b3e", bodyColor: "#6b7280", borderColor: "#e9edf4", borderWidth: 1, padding: 12, cornerRadius: 8, titleFont: { family: "Inter", weight: 600 }, bodyFont: { family: "Inter" } } }
              }} />
            </div></div>
          </div>
          {/* Order Statistics — Half-Donut Gauge (Xintra style) */}
          <div className="card">
            <div className="card-head"><div className="card-title"><I.Package size={15} /> Order Statistics</div><span className="card-link" style={{cursor:"pointer"}} onClick={() => setSlaMode((slaMode + 1) % 3)}>SLA: {SLA}min <I.ChevronRight size={13} /></span></div>
            <div className="card-body">
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:40,height:40,borderRadius:8,background:"var(--primary-light)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--primary)"}}><I.TrendUp size={18} /></div>
                <div>
                  <div style={{fontSize:10,fontWeight:600,color:"var(--text-muted)",letterSpacing:.5}}>TOTAL ORDERS</div>
                  <div style={{fontSize:24,fontWeight:700,letterSpacing:-.5}}>{processed.length.toLocaleString()} <span style={{fontSize:12,color:"var(--success)",fontWeight:500}}>↗ {m?.ontimePct || 0}% on-time</span></div>
                </div>
              </div>
              <div style={{position:"relative"}}>
                <div className="chart-area" style={{height:200}}>
                  <ChartC id="c2" type="doughnut" data={statusDonut} options={{
                    showLegend: true, legendPosition: "bottom",
                    scales: {x:{display:false}, y:{display:false}},
                    plugins: { legend: { display: true, position: "bottom", labels: { color: "#6b7280", font: { family: "Inter", size: 11 }, padding: 14, usePointStyle: true, pointStyle: "circle" } } }
                  }} plugins={donutCenterPlugin} />
                </div>
              </div>
              <div className="complete-link" style={{cursor:"pointer"}} onClick={() => setShowStatsPanel(!showStatsPanel)}><span>{showStatsPanel ? "Hide Statistics" : "Complete Statistics"}</span> <I.ArrowRight size={13} /></div>
              {showStatsPanel && (
                <div className="stats-expand fade-in" style={{marginTop:12,padding:"12px 0",borderTop:"1px solid var(--border)",fontSize:12}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <div style={{padding:"8px 12px",background:"#f0fdf4",borderRadius:8}}>
                      <div style={{color:"#6b7280",fontSize:10,fontWeight:600}}>Under 10 min</div>
                      <div style={{fontWeight:700,color:"#2ecc40"}}>{processed.filter(o => o.delivery_duration_min <= 10).length} orders</div>
                    </div>
                    <div style={{padding:"8px 12px",background:"#eff6ff",borderRadius:8}}>
                      <div style={{color:"#6b7280",fontSize:10,fontWeight:600}}>Within SLA ({SLA}min)</div>
                      <div style={{fontWeight:700,color:"#23b7e5"}}>{processed.filter(o => o.delivery_duration_min > 10 && o.delivery_duration_min <= SLA).length} orders</div>
                    </div>
                    <div style={{padding:"8px 12px",background:"#fffbeb",borderRadius:8}}>
                      <div style={{color:"#6b7280",fontSize:10,fontWeight:600}}>Delayed ({SLA}-25min)</div>
                      <div style={{fontWeight:700,color:"#f5b849"}}>{processed.filter(o => o.delivery_duration_min > SLA && o.delivery_duration_min <= 25).length} orders</div>
                    </div>
                    <div style={{padding:"8px 12px",background:"#fef2f2",borderRadius:8}}>
                      <div style={{color:"#6b7280",fontSize:10,fontWeight:600}}>Critical (25+ min)</div>
                      <div style={{fontWeight:700,color:"#e6533c"}}>{processed.filter(o => o.delivery_duration_min > 25).length} orders</div>
                    </div>
                  </div>
                  <div style={{marginTop:10,padding:"8px 12px",background:"#f9fafb",borderRadius:8}}>
                    <div style={{color:"#6b7280",fontSize:10,fontWeight:600,marginBottom:4}}>Avg by Batch Type</div>
                    <div style={{display:"flex",gap:16}}>
                      <span><b style={{color:"#2ecc40"}}>Single:</b> {m?.bc?.["1"] || "—"} min</span>
                      <span><b style={{color:"#23b7e5"}}>Batch:</b> {m?.bc?.["2"] || "—"} min</span>
                      <span style={{color:"#26bf94",fontWeight:600}}>{m?.bc?.["1"] && m?.bc?.["2"] ? ((1 - m.bc["2"]/m.bc["1"])*100).toFixed(0) : 0}% faster</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Top Delivery Zones */}
          <div className="card">
            <div className="card-head"><div className="card-title">Top Delivery Zones</div><span className="card-link" style={{fontSize:12,color:"var(--text-muted)",border:"1px solid var(--border)",padding:"4px 12px",borderRadius:6,cursor:"pointer"}} onClick={() => setZoneSortMode((zoneSortMode + 1) % 3)}>{["By Count ↓","By Name ↓","By Distance ↓"][zoneSortMode]}</span></div>
            <div className="card-body" style={{padding:"12px 18px"}}>
              <div className="seg-bar">
                {zones.map(([_, count], i) => {
                  const colors = ["#2ecc40","#23b7e5","#26bf94","#f5b849","#e6533c","#49b6f5"];
                  return <span key={i} style={{background:colors[i%6],flex:count}}></span>;
                })}
              </div>
              <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:12}}>
                <span style={{fontSize:11,color:"var(--text-muted)"}}>Overall Orders</span>
                <span style={{fontSize:12,color:"var(--success)",fontWeight:500}}>↗ {m?.ontimePct || 0}% on-time</span>
                <span style={{fontSize:16,fontWeight:700,marginLeft:"auto"}}>{processed.length.toLocaleString()}</span>
              </div>
              <ul className="cat-list">
                {zones.map(([name, count], i) => {
                  const colors = ["#2ecc40","#23b7e5","#26bf94","#f5b849","#e6533c","#49b6f5"];
                  const pct = processed.length > 0 ? ((count / processed.length) * 100).toFixed(1) : 0;
                  return (
                    <li className="cat-item" key={name}>
                      <div className="cat-left"><div className="cat-dot" style={{background:colors[i%6]}}></div><span className="cat-name">{name}</span></div>
                      <span style={{fontSize:12,color:"var(--text-sec)",marginLeft:"auto",marginRight:6}}>{count}</span>
                      <span style={{fontSize:11,color:"var(--text-muted)",marginRight:6}}>{pct}% of total</span>
                      <span className="cat-badge" style={{background:colors[i%6]+"20",color:colors[i%6]}}>{pct}%</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* ROW 3: Table + Activity + Bar Chart + Stats */}
        <div className="row-3">
          {/* Latest Orders */}
          <div className="card">
            <div className="card-head"><div className="card-title"><I.Package size={15} /> Latest Orders</div><span className="card-link" style={{cursor:"pointer"}} onClick={() => setShowAllLatest(!showAllLatest)}>{showAllLatest ? "Show Less" : "View All"} <I.ChevronRight size={13} /></span></div>
            <div className="tbl-scroll" style={{maxHeight: showAllLatest ? 600 : 300}}>
              <table>
                <thead><tr><th>Location</th><th>Dist</th><th>Time</th><th>Status</th></tr></thead>
                <tbody>
                  {processed.slice().reverse().slice(0, showAllLatest ? 30 : 8).map(o => (
                    <tr key={o.order_id} className={streaming && streamed.indexOf(o) >= streamed.length - 3 ? "new-row" : ""}>
                      <td style={{fontWeight:500,color:"var(--text)"}}>{o.drop_location.split(",")[0]}</td>
                      <td>{o.distance_km} km</td>
                      <td>{o.delivery_duration_min} min</td>
                      <td><span className={`badge ${o.delivery_duration_min > SLA ? "danger" : "success"}`}>{o.delivery_duration_min > SLA ? "Delayed" : "On Time"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-head"><div className="card-title"><I.Activity size={15} /> Recent Activity</div><span className="card-link" style={{cursor:"pointer"}} onClick={() => setShowAllActivity(!showAllActivity)}>{showAllActivity ? "Show Less" : "View All"} <I.ChevronRight size={13} /></span></div>
            <div className="card-body" style={{padding:"8px 18px",maxHeight: showAllActivity ? 600 : 300,overflowY:"auto"}}>
              <ul className="activity-list">
                {processed.slice().reverse().slice(0, showAllActivity ? 20 : 6).map(o => (
                  <li className="activity-item" key={o.order_id}>
                    <span className="activity-time">{o.order_time}</span>
                    <div className="activity-dot" style={{background: o.delivery_duration_min > SLA ? "#e6533c" : "#26bf94"}}></div>
                    <div className="activity-text">
                      <b>Rider R{o.rider_id}</b> delivered order <span className="hl">#{o.order_id}</span> to <b>{o.drop_location.split(",")[0]}</b> in {o.delivery_duration_min} min
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Peak Stats Bar */}
          <div className="card">
            <div className="card-head"><div className="card-title"><I.BarChart size={15} /> Peak Hour Analysis</div></div>
            <div className="card-body">
              <div style={{display:"flex",gap:16,marginBottom:12}}>
                <div><div style={{fontSize:11,color:"#9ca3af"}}>Peak Avg</div><div style={{fontSize:16,fontWeight:700,color:"#e6533c"}}>{m?.peakAvg || 0} min</div></div>
                <div><div style={{fontSize:11,color:"#9ca3af"}}>Off-Peak Avg</div><div style={{fontSize:16,fontWeight:700,color:"#26bf94"}}>{m?.offpeakAvg || 0} min</div></div>
              </div>
              <div className="chart-area" style={{height:200}}><ChartC id="c3" type="bar" data={peakBarData} options={{showLegend:true}} /></div>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="card">
            <div className="card-head"><div className="card-title">Overall Statistics</div><span className="card-link" style={{cursor:"pointer"}} onClick={() => document.getElementById('all-orders-section')?.scrollIntoView({behavior:'smooth'})}>View All <I.ChevronRight size={13} /></span></div>
            <div className="card-body" style={{padding:"8px 18px"}}>
              <div className="stat-item">
                <div className="stat-label">Batch vs Single</div>
                <div className="stat-value-row"><span className="stat-value">{m?.bc?.["2"] || "—"}<span style={{fontSize:12}}> min</span></span><span className="stat-change" style={{color:"#26bf94"}}>{m?.bc?.["1"] && m?.bc?.["2"] ? ((1 - m.bc["2"]/m.bc["1"])*100).toFixed(0) : 0}% faster than {m?.bc?.["1"] || "—"} min</span></div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Peak vs Off-Peak</div>
                <div className="stat-value-row"><span className="stat-value">{m?.peakAvg || 0}<span style={{fontSize:12}}> min</span></span><span className="stat-change" style={{color:"#e6533c"}}>vs {m?.offpeakAvg || 0} min off-peak</span></div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Orders Per Rider</div>
                <div className="stat-value-row"><span className="stat-value">{m?.opr || 0}</span><span className="stat-change" style={{color:"#2ecc40"}}>{m?.riders} riders active</span></div>
              </div>
              <div className="stat-item">
                <div className="stat-label">SLA Compliance ({SLA}min)</div>
                <div className="stat-value-row"><span className="stat-value">{m?.ontimePct || 0}%</span><span className="stat-change" style={{color: m && m.ontimePct >= 50 ? "#26bf94":"#e6533c"}}>{m?.ontime || 0} on-time / {m?.delayed || 0} delayed</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 4: Map + Full Orders Table */}
        <div className="row-map">
          {/* Map */}
          <div className="card">
            <div className="card-head">
              <div className="card-title"><I.MapPin size={15} /> Delivery Route Map</div>
              <div className="map-legend">
                <div className="map-legend-item"><div className="legend-dot" style={{background:"#26bf94"}}></div> On Time</div>
                <div className="map-legend-item"><div className="legend-dot" style={{background:"#e6533c"}}></div> Delayed</div>
                <div className="map-legend-item"><div className="legend-dot" style={{background:"#f5b849"}}></div> Active</div>
              </div>
            </div>
            <div className="map-wrap">
              <DeliveryMap orders={processed} latest={latest} />
              {latest && (
                <div className="route-overlay">
                  <div className="route-title"><I.Navigation size={13} /> Active Delivery</div>
                  <div className="route-row"><span>Order</span><strong>#{latest.order_id}</strong></div>
                  <div className="route-row"><span>To</span><strong>{latest.drop_location.split(",")[0]}</strong></div>
                  <div className="route-row"><span>Distance</span><strong>{latest.distance_km} km</strong></div>
                  <div className="route-row"><span>ETA</span><strong>{latest.delivery_duration_min} min</strong></div>
                </div>
              )}
            </div>
          </div>

          {/* Full Table */}
          <div className="card" id="all-orders-section">
            <div className="card-head"><div className="card-title"><I.Package size={15} /> All Orders</div><span style={{fontSize:11,color:"#9ca3af",background:"#f5f6f8",padding:"3px 10px",borderRadius:100}}>{processed.length} orders</span></div>
            <div className="tbl-scroll">
              <table>
                <thead><tr><th>#</th><th>Location</th><th>Dist</th><th>Duration</th><th>Status</th><th>Batch</th><th>Rider</th><th>Peak</th></tr></thead>
                <tbody>
                  {processed.slice().reverse().slice(0,30).map((o, idx) => (
                    <tr key={o.order_id} className={streaming && idx < 2 ? "new-row" : ""}>
                      <td style={{fontWeight:600}}>#{o.order_id}</td>
                      <td>{o.drop_location.split(",")[0]}</td>
                      <td>{o.distance_km} km</td>
                      <td style={{color: o.delivery_duration_min > SLA ? "#e6533c" : "#26bf94", fontWeight:600}}>{o.delivery_duration_min} min</td>
                      <td><span className={`badge ${o.delivery_duration_min > SLA ? "danger" : "success"}`}>{o.delivery_duration_min > SLA ? "Delayed" : "On Time"}</span></td>
                      <td><span className={`badge ${o.batch_size === 2 ? "purple" : "info"}`}>{o.batch_size === 2 ? "Batch" : "Single"}</span></td>
                      <td><span className="rider-tag">R{o.rider_id}</span></td>
                      <td><span className={`badge ${o.is_peak_hour ? "warning" : "success"}`}>{o.is_peak_hour ? "Peak" : "Off"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
