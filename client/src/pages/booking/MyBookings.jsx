import { useState, useEffect } from 'react';
import { CalendarCheck, Filter, Search, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

export default function MyBookings() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState([]);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    Promise.all([
      api.get('/bookings'),
      api.get('/lots')
    ]).then(([bkData, lotData]) => {
      setBookings(bkData);
      setLots(lotData);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) return <div style={{ padding: 40, color: '#fff' }}>Loading bookings...</div>;

  const filtered = bookings.filter(b => {
    const matchFilter = filter === 'all' || b.status === filter;
    const matchSearch = b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicleNo.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getLotName = (id) => lots.find(l => l.id === id)?.name || id;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">{isAdmin ? 'All Bookings' : 'My Bookings'}</h1>
            <p className="page-subtitle">{filtered.length} bookings found</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total', val: bookings.length, color: 'blue' },
          { label: 'Confirmed', val: bookings.filter(b=>b.status==='confirmed').length, color: 'emerald' },
          { label: 'Completed', val: bookings.filter(b=>b.status==='completed').length, color: 'amber' },
          { label: 'Cancelled', val: bookings.filter(b=>b.status==='cancelled').length, color: 'red' },
        ].map(({ label, val, color }) => (
          <div key={label} className={`glass-card stat-card ${color}`}>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{val}</div>
            <div className="stat-icon"><CalendarCheck size={48} /></div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by booking ID or vehicle..." style={{ paddingLeft: 36 }} />
        </div>
        <div className="tab-list">
          {['all','confirmed','completed','cancelled'].map(s => (
            <button key={s} className={`tab-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Lot</th>
                <th>Vehicle</th>
                <th>Date / Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--color-blue-light)' }}>{b.id}</td>
                  <td style={{ fontSize: 13 }}>{getLotName(b.lotId)}</td>
                  <td style={{ fontWeight: 600 }}>{b.vehicleNo}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{b.startTime.replace('T',' ')} – {b.endTime.split('T')[1]}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-emerald-light)' }}>₹{b.amount}</td>
                  <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                  <td><span className={`badge badge-${b.paymentStatus}`}>{b.paymentStatus}</span></td>
                  <td><button className="btn btn-ghost btn-sm"><Eye size={13} /> View</button></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No bookings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
