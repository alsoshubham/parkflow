import { useState, useEffect } from 'react';
import { Car, ParkingSquare, CheckCircle, Clock, TrendingUp, DollarSign, Activity, Zap } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

const REVENUE_CHART = [
  { day: 'Mon', revenue: 8200 },
  { day: 'Tue', revenue: 9400 },
  { day: 'Wed', revenue: 7800 },
  { day: 'Thu', revenue: 11200 },
  { day: 'Fri', revenue: 14600 },
  { day: 'Sat', revenue: 18900 },
  { day: 'Sun', revenue: 16400 },
];

const ACTIVITY_FEED = [
  { id: 1, type: 'entry', text: 'Vehicle entered Nexus Mall Parking', time: '2 min ago' },
  { id: 2, type: 'booking', text: 'New booking confirmed for Airport Express', time: '5 min ago' },
  { id: 3, type: 'payment', text: 'Payment received via Card', time: '12 min ago' },
];

function StatCard({ label, value, change, color, icon: Icon, prefix = '' }) {
  return (
    <div className={`glass-card stat-card ${color}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{prefix}{value}</div>
      {change != null && <div className={`stat-change ${change < 0 ? 'negative' : ''}`}><TrendingUp size={12} />{change > 0 ? '+' : ''}{change}% vs yesterday</div>}
      <div className="stat-icon"><Icon size={48} /></div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/reports/summary'),
      api.get('/lots')
    ]).then(([sumData, lotsData]) => {
      setSummary(sumData);
      setLots(lotsData);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) return <div style={{ padding: 40, color: '#fff' }}>Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back, {user?.name} · Real-time overview</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'rgba(16,185,129,0.1)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.3)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-emerald)', boxShadow: '0 0 8px var(--color-emerald-glow)', animation: 'pulse-dot 2s infinite', display: 'inline-block' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-emerald-light)' }}>Live</span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <StatCard label="Total Lots" value={summary.totalLots} color="blue" icon={ParkingSquare} change={null} />
        <StatCard label="Active Sessions" value={summary.activeSessions} color="emerald" icon={Car} change={null} />
        <StatCard label="Total Bookings" value={summary.totalBookings} color="amber" icon={Clock} change={null} />
        <StatCard label="System Users" value={summary.totalUsers} color="purple" icon={Activity} change={null} />
        <StatCard label="Total Revenue" value={summary.totalRevenue.toLocaleString()} prefix="₹" color="emerald" icon={DollarSign} change={null} />
      </div>

      <div className="grid-2" style={{ gap: 20, marginBottom: 20, marginTop: 20 }}>
        {/* Revenue Chart + Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="glass-card">
            <div style={{ padding: '20px 20px 0' }}>
              <h3 style={{ fontWeight: 700, fontSize: 16 }}>Revenue (7 days)</h3>
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
        </div>

        {/* Activity */}
        <div className="glass-card" style={{ flex: 1 }}>
          <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>Recent Activity (Demo)</h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--color-emerald-light)' }}>
              <Zap size={11} /> Live
            </span>
          </div>
          <div style={{ padding: '4px 20px 20px' }}>
            {ACTIVITY_FEED.map(item => (
              <div key={item.id} className="activity-item">
                <div className={`activity-dot ${item.type}`} />
                <div>
                  <div className="activity-text">{item.text}</div>
                  <div className="activity-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lots Summary */}
      <div className="glass-card">
        <div style={{ padding: '20px' }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Parking Facilities</h3>
          <div className="grid-4" style={{ gap: 16 }}>
            {lots.map(lot => {
              return (
                <div key={lot.id} style={{ padding: 16, background: 'var(--bg-glass)', borderRadius: 12, border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: 'var(--text-primary)' }}>{lot.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>{lot.address}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Capacity</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-emerald)' }}>{lot.totalSpots}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>₹{lot.pricePerHour}/hr</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
