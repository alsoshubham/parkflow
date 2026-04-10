import { useState } from 'react';
import { Search, MapPin, Clock, Car, Filter, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LOTS, SPOTS, getDashboardStats } from '../../store/mockData';

export default function FindParking() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [fromTime, setFromTime] = useState('09:00');
  const [toTime, setToTime] = useState('12:00');
  const [maxPrice, setMaxPrice] = useState(200);
  const [selected, setSelected] = useState(null);

  const filtered = LOTS.filter(lot =>
    lot.name.toLowerCase().includes(query.toLowerCase()) ||
    lot.address.toLowerCase().includes(query.toLowerCase())
  ).filter(lot => lot.pricePerHour <= maxPrice);

  const getAvailability = (lotId) => {
    const stats = getDashboardStats(SPOTS.filter(s => s.lotId === lotId));
    return stats;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Find Parking</h1>
        <p className="page-subtitle">Search available spots by location, time, and budget</p>
      </div>

      {/* Search Filters */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: 14, alignItems: 'end', flexWrap: 'wrap' }}>
          <div className="form-group">
            <label className="form-label">Location</label>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="form-input"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name or area..."
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">From</label>
            <input type="time" className="form-input" value={fromTime} onChange={e => setFromTime(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">To</label>
            <input type="time" className="form-input" value={toTime} onChange={e => setToTime(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Max ₹/hr: {maxPrice}</label>
            <input type="range" min={20} max={200} step={10} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--color-blue)', marginTop: 6 }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}><strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> lots found</p>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}><Filter size={12} />Sorted by availability</span>
      </div>

      {/* Lot Results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map(lot => {
          const avail = getAvailability(lot.id);
          const pct = Math.round((avail.occupied / avail.total) * 100);
          const fillColor = pct > 85 ? 'var(--color-red)' : pct > 60 ? 'var(--color-amber)' : 'var(--color-emerald)';
          const isSelected = selected === lot.id;

          // Calculate hours
          const [fh, fm] = fromTime.split(':').map(Number);
          const [th, tm] = toTime.split(':').map(Number);
          const hours = Math.max(1, (th * 60 + tm - fh * 60 - fm) / 60);
          const estimate = Math.round(lot.pricePerHour * hours);

          return (
            <div
              key={lot.id}
              className={`parking-lot-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelected(isSelected ? null : lot.id)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Car size={20} color="var(--color-blue-light)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{lot.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <MapPin size={11} color="var(--text-muted)" />
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{lot.address}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: avail.available > 5 ? 'var(--color-emerald)' : 'var(--color-amber)' }} />
                      <span style={{ color: 'var(--color-emerald-light)', fontWeight: 600 }}>{avail.available} spots available</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <Clock size={13} />₹{lot.pricePerHour}/hr
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <Navigation size={13} />~2.4 km away
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Occupancy</span>
                      <span style={{ fontWeight: 600, color: fillColor }}>{pct}%</span>
                    </div>
                    <div className="lot-availability-bar" style={{ height: 6 }}>
                      <div className="lot-availability-fill" style={{ width: `${pct}%`, background: fillColor }} />
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', minWidth: 140 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>₹{estimate}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>est. for {hours.toFixed(1)}h</div>
                  <button
                    className="btn btn-primary"
                    onClick={e => { e.stopPropagation(); navigate(`/book/${lot.id}`, { state: { lot, date, fromTime, toTime, hours, estimate } }); }}
                    disabled={avail.available === 0}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
