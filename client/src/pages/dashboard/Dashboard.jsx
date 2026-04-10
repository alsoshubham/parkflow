import { useState, useEffect } from 'react';
import { Car, ParkingSquare, CheckCircle, Clock, TrendingUp, DollarSign, Activity, Zap } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { SPOTS, LOTS, ACTIVITY_FEED, REVENUE_CHART, getDashboardStats } from '../../store/mockData';
import { useAuth } from '../../contexts/AuthContext';

function StatCard({ label, value, change, color, icon: Icon, prefix = '' }) {
  return (
    <div className={`glass-card stat-card ${color}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{prefix}{value}</div>
      {change && <div className={`stat-change ${change < 0 ? 'negative' : ''}`}><TrendingUp size={12} />{change > 0 ? '+' : ''}{change}% vs yesterday</div>}
      <div className="stat-icon"><Icon size={48} /></div>
    </div>
  );
}

function OccupancyGrid({ spots, lotId }) {
  const filtered = lotId ? spots.filter(s => s.lotId === lotId) : spots.slice(0, 80);
  return (
    <div className="occupancy-grid">
      {filtered.map(spot => (
        <div
          key={spot.id}
          className={`spot-cell spot-${spot.status}`}
          title={`${spot.label} — ${spot.status}`}
        >
          {spot.label.replace(/[A-Za-z]+\d*/, m => m.length > 3 ? m.slice(-2) : m)}
        </div>
      ))}
    </div>
  );
}

function ActivityFeed({ items }) {
  return (
    <div style={{ padding: '4px 20px 20px' }}>
      {items.map(item => (
        <div key={item.id} className="activity-item">
          <div className={`activity-dot ${item.type}`} />
          <div>
            <div className="activity-text">{item.text}</div>
            <div className="activity-time">{item.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [spots, setSpots] = useState(SPOTS);
  const [selectedLot, setSelectedLot] = useState('l1');
  const [tick, setTick] = useState(0);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSpots(prev => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * next.length);
        const statuses = ['available', 'occupied', 'reserved'];
        next[idx] = { ...next[idx], status: statuses[Math.floor(Math.random() * statuses.length)] };
        return next;
      });
      setTick(t => t + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = getDashboardStats(spots);
  const lotSpots = spots.filter(s => s.lotId === selectedLot);
  const lotStats = getDashboardStats(lotSpots);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back, {user?.name} · Real-time parking overview</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'rgba(16,185,129,0.1)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.3)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-emerald)', boxShadow: '0 0 8px var(--color-emerald-glow)', animation: 'pulse-dot 2s infinite', display: 'inline-block' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-emerald-light)' }}>Live · Updates every 4s</span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <StatCard label="Total Spots" value={stats.total.toLocaleString()} color="blue" icon={ParkingSquare} change={null} />
        <StatCard label="Available" value={stats.available.toLocaleString()} change={5} color="emerald" icon={CheckCircle} />
        <StatCard label="Occupied" value={stats.occupied.toLocaleString()} change={-2} color="red" icon={Car} />
        <StatCard label="Reserved" value={stats.reserved.toLocaleString()} change={8} color="amber" icon={Clock} />
        <StatCard label="Occupancy Rate" value={`${stats.occupancyRate}%`} change={3} color="purple" icon={Activity} />
        <StatCard label="Today's Revenue" value="₹86,420" change={12} color="emerald" icon={DollarSign} />
      </div>

      {/* Main Grid */}
      <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
        {/* Occupancy Grid */}
        <div className="glass-card" style={{ gridColumn: 'span 1' }}>
          <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 16 }}>Live Spot Map</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{lotStats.occupied} occupied / {lotStats.total} total</p>
            </div>
            <select
              className="form-input form-select"
              style={{ width: 'auto', fontSize: 12, padding: '6px 32px 6px 12px' }}
              value={selectedLot}
              onChange={e => setSelectedLot(e.target.value)}
            >
              {LOTS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, padding: '12px 20px 0', flexWrap: 'wrap' }}>
            {[['spot-available','Available'],['spot-occupied','Occupied'],['spot-reserved','Reserved'],['spot-maintenance','Maintenance']].map(([cls,label]) => (
              <div key={cls} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className={`spot-cell ${cls}`} style={{ width: 14, height: 14, borderRadius: 3, fontSize: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{label}</span>
              </div>
            ))}
          </div>
          <OccupancyGrid spots={spots} lotId={selectedLot} />
        </div>

        {/* Revenue Chart + Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="glass-card">
            <div style={{ padding: '20px 20px 0' }}>
              <h3 style={{ fontWeight: 700, fontSize: 16 }}>Revenue (7 days)</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>₹86,500 avg/day</p>
            </div>
            <div style={{ height: 140, padding: '12px 8px 8px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_CHART}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#revenueGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card" style={{ flex: 1 }}>
            <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontWeight: 700, fontSize: 16 }}>Activity Feed</h3>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--color-emerald-light)' }}>
                <Zap size={11} /> Live
              </span>
            </div>
            <ActivityFeed items={ACTIVITY_FEED.slice(0, 5)} />
          </div>
        </div>
      </div>

      {/* Lots Summary */}
      <div className="glass-card">
        <div style={{ padding: '20px' }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Parking Lots Overview</h3>
          <div className="grid-4" style={{ gap: 16 }}>
            {LOTS.map(lot => {
              const ls = getDashboardStats(spots.filter(s => s.lotId === lot.id));
              const pct = Math.round((ls.occupied / ls.total) * 100);
              const fillColor = pct > 85 ? 'var(--color-red)' : pct > 60 ? 'var(--color-amber)' : 'var(--color-emerald)';
              return (
                <div key={lot.id} style={{ padding: 16, background: 'var(--bg-glass)', borderRadius: 12, border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: 'var(--text-primary)' }}>{lot.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>{lot.address}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{ls.occupied}/{ls.total}</span>
                    <span style={{ fontWeight: 700, color: fillColor }}>{pct}%</span>
                  </div>
                  <div className="lot-availability-bar">
                    <div className="lot-availability-fill" style={{ width: `${pct}%`, background: fillColor }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>₹{lot.pricePerHour}/hr · {ls.available} available</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
