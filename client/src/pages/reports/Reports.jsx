import { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, ParkingSquare, CreditCard, CalendarCheck } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import { api } from '../../utils/api';

const REVENUE_CHART = [
  { day: 'Mon', revenue: 8200, bookings: 42 },
  { day: 'Tue', revenue: 9400, bookings: 51 },
  { day: 'Wed', revenue: 7800, bookings: 38 },
  { day: 'Thu', revenue: 11200, bookings: 62 },
  { day: 'Fri', revenue: 14600, bookings: 80 },
  { day: 'Sat', revenue: 18900, bookings: 105 },
  { day: 'Sun', revenue: 16400, bookings: 91 },
];

const MONTHLY_REVENUE = [
  { month: 'Nov', revenue: 285000 },
  { month: 'Dec', revenue: 312000 },
  { month: 'Jan', revenue: 298000 },
  { month: 'Feb', revenue: 334000 },
  { month: 'Mar', revenue: 356000 },
  { month: 'Apr', revenue: 189000 },
];

const OCCUPANCY_TREND = [
  { hour: '06:00', nexus: 22, techpark: 18, city: 35, airport: 45 },
  { hour: '08:00', nexus: 68, techpark: 75, city: 52, airport: 62 },
  { hour: '10:00', nexus: 82, techpark: 90, city: 64, airport: 58 },
  { hour: '12:00', nexus: 76, techpark: 88, city: 79, airport: 72 },
  { hour: '14:00', nexus: 70, techpark: 85, city: 68, airport: 68 },
  { hour: '16:00', nexus: 85, techpark: 78, city: 72, airport: 75 },
  { hour: '18:00', nexus: 92, techpark: 60, city: 88, airport: 80 },
  { hour: '20:00', nexus: 78, techpark: 30, city: 72, airport: 70 },
  { hour: '22:00', nexus: 45, techpark: 15, city: 40, airport: 55 },
];

const TABS = ['Revenue', 'Occupancy', 'Bookings'];

const BOOKING_FUNNEL = [
  { stage: 'Searches', value: 2840 },
  { stage: 'Spot Views', value: 1920 },
  { stage: 'Bookings Started', value: 680 },
  { stage: 'Payment Initiated', value: 540 },
  { stage: 'Confirmed', value: 468 },
];

export default function Reports() {
  const [tab, setTab] = useState('Revenue');
  const [summary, setSummary] = useState(null);
  const [revenueByLot, setRevenueByLot] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/reports/summary'),
      api.get('/reports/revenue-by-lot')
    ]).then(([sumData, revData]) => {
      setSummary(sumData);
      setRevenueByLot(revData.map((item, i) => ({
        ...item,
        color: ['#3b82f6','#8b5cf6','#10b981','#f59e0b'][i % 4]
      })));
      setLoading(false);
    }).catch(console.error);
  }, []);

  const handleExport = () => {
    const csv = 'Day,Revenue,Bookings\n' + REVENUE_CHART.map(r => `${r.day},${r.revenue},${r.bookings}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'parkflow_report.csv';
    a.click();
  };

  if (loading) return <div style={{ padding: 40, color: '#fff' }}>Loading reports...</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Reports & Analytics</h1>
            <p className="page-subtitle">Revenue, occupancy trends, and booking insights</p>
          </div>
          <button className="btn btn-ghost" onClick={handleExport}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="glass-card stat-card emerald">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">₹{(summary.totalRevenue || 0).toLocaleString()}</div>
          <div className="stat-change"><TrendingUp size={12} />+6.5% vs last month</div>
          <div className="stat-icon"><CreditCard size={48} /></div>
        </div>
        <div className="glass-card stat-card blue">
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value">{summary.totalBookings}</div>
          <div className="stat-change"><TrendingUp size={12} />+12% this month</div>
          <div className="stat-icon"><CalendarCheck size={48} /></div>
        </div>
        <div className="glass-card stat-card amber">
          <div className="stat-label">System Users</div>
          <div className="stat-value">{summary.totalUsers}</div>
          <div className="stat-icon"><ParkingSquare size={48} /></div>
        </div>
        <div className="glass-card stat-card purple" style={{ '--color-purple': '#8b5cf6' }}>
          <div className="stat-label">Active Lots</div>
          <div className="stat-value">{summary.totalLots}</div>
          <div className="stat-icon"><BarChart3 size={48} /></div>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="tab-list" style={{ marginBottom: 24 }}>
        {TABS.map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {/* Revenue Tab */}
      {tab === 'Revenue' && (
        <div>
          <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Weekly Revenue</h3>
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_CHART}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Monthly Trend</h3>
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MONTHLY_REVENUE}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Revenue by Lot</h3>
            <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={revenueByLot} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="revenue" label={({ name, value }) => `${name} ₹${value}`}>
                    {revenueByLot.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Occupancy Tab */}
      {tab === 'Occupancy' && (
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Occupancy by Hour (%)</h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20 }}>Across all lots for today</p>
          <div style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={OCCUPANCY_TREND}>
                <defs>
                  <linearGradient id="nexusG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="techG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="cityG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="airG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0,100]} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
                <Legend />
                <Area type="monotone" dataKey="nexus" name="Nexus Mall" stroke="#3b82f6" fill="url(#nexusG)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="techpark" name="Tech Park" stroke="#8b5cf6" fill="url(#techG)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="city" name="City Centre" stroke="#10b981" fill="url(#cityG)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="airport" name="Airport Hub" stroke="#f59e0b" fill="url(#airG)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {tab === 'Bookings' && (
        <div className="grid-2" style={{ gap: 20 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Booking Funnel</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20 }}>User conversion stages</p>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BOOKING_FUNNEL} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="stage" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip contentStyle={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {BOOKING_FUNNEL.map((_, i) => (
                      <Cell key={i} fill={['#3b82f6','#60a5fa','#8b5cf6','#f59e0b','#10b981'][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Daily Bookings (This Week)</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20 }}>Bookings vs. max capacity</p>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_CHART}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="bookings" name="Bookings" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
