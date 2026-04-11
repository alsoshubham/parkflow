import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ParkingSquare, MapPin, DollarSign, CheckCircle, XCircle } from 'lucide-react';

import toast from 'react-hot-toast';

function LotModal({ lot, onClose, onSave }) {
  const [form, setForm] = useState(lot || { name: '', address: '', pricePerHour: 40, totalSpots: 50, status: 'active' });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    toast.success(lot ? 'Lot updated successfully' : 'Lot created successfully');
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontWeight: 700, fontSize: 18 }}>{lot ? 'Edit Lot' : 'Add Parking Lot'}</h3>
          <button className="icon-btn" onClick={onClose}><XCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Lot Name *</label>
              <input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. City Centre Parking" />
            </div>
            <div className="form-group">
              <label className="form-label">Address *</label>
              <input className="form-input" required value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Full address" />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Price/Hour (₹)</label>
                <input type="number" className="form-input" value={form.pricePerHour} onChange={e => setForm({...form, pricePerHour: +e.target.value})} min={10} />
              </div>
              <div className="form-group">
                <label className="form-label">Total Spots</label>
                <input type="number" className="form-input" value={form.totalSpots} onChange={e => setForm({...form, totalSpots: +e.target.value})} min={1} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><CheckCircle size={15} />Save Lot</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LotManagement() {
  const [lots, setLots] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | lot object
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    import('../../utils/api').then(({ api }) => {
      api.get('/lots').then(data => {
        setLots(data);
        setLoading(false);
      });
    });
  }, []);

  const handleSave = async (form) => {
    const { api } = await import('../../utils/api');
    if (modal === 'add') {
      const newLot = await api.post('/lots', { ...form, zones: ['A'] });
      setLots(prev => [...prev, newLot]);
    } else {
      const updatedLot = await api.put(`/lots/${modal.id}`, form);
      setLots(prev => prev.map(l => l.id === modal.id ? updatedLot : l));
    }
  };

  const handleDelete = async (id) => {
    const { api } = await import('../../utils/api');
    await api.delete(`/lots/${id}`);
    setLots(prev => prev.filter(l => l.id !== id));
    toast.success('Lot removed');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Lot Management</h1>
            <p className="page-subtitle">Manage parking facilities and pricing rules</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            <Plus size={16} /> Add Lot
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="glass-card stat-card blue">
          <div className="stat-label">Total Lots</div>
          <div className="stat-value">{lots.length}</div>
          <div className="stat-icon"><ParkingSquare size={48} /></div>
        </div>
        <div className="glass-card stat-card emerald">
          <div className="stat-label">Active Lots</div>
          <div className="stat-value">{lots.filter(l => l.status === 'active').length}</div>
          <div className="stat-icon"><CheckCircle size={48} /></div>
        </div>
        <div className="glass-card stat-card amber">
          <div className="stat-label">Total Capacity</div>
          <div className="stat-value">{lots.reduce((a, l) => a + l.totalSpots, 0)}</div>
          <div className="stat-icon"><ParkingSquare size={48} /></div>
        </div>
        <div className="glass-card stat-card purple" style={{ '--color-purple': '#8b5cf6' }}>
          <div className="stat-label">Avg Price/Hour</div>
          <div className="stat-value">₹{Math.round(lots.reduce((a, l) => a + l.pricePerHour, 0) / (lots.length || 1))}</div>
          <div className="stat-icon"><DollarSign size={48} /></div>
        </div>
      </div>

      {/* Lot Cards */}
      <div className="grid-2" style={{ gap: 20 }}>
        {lots.map(lot => {
          const ls = { available: lot.totalSpots || 0, occupied: 0 };
          const pct = 0;
          const fillColor = 'var(--color-emerald)';
          return (
            <div key={lot.id} className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ParkingSquare size={22} color="var(--color-blue-light)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{lot.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <MapPin size={11} color="var(--text-muted)" />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{lot.address}</span>
                    </div>
                  </div>
                </div>
                <span className={`badge badge-${lot.status}`}>{lot.status}</span>
              </div>

              <div className="grid-3" style={{ gap: 12, marginBottom: 16 }}>
                <div style={{ textAlign: 'center', padding: 10, background: 'var(--bg-glass)', borderRadius: 8 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-blue-light)' }}>{lot.totalSpots}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total</div>
                </div>
                <div style={{ textAlign: 'center', padding: 10, background: 'var(--bg-glass)', borderRadius: 8 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-emerald-light)' }}>{ls.available}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Available</div>
                </div>
                <div style={{ textAlign: 'center', padding: 10, background: 'var(--bg-glass)', borderRadius: 8 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-amber-light)' }}>₹{lot.pricePerHour}/hr</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Rate</div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Occupancy</span>
                  <span style={{ fontWeight: 700, color: fillColor }}>{pct}%</span>
                </div>
                <div className="lot-availability-bar" style={{ height: 8 }}>
                  <div className="lot-availability-fill" style={{ width: `${pct}%`, background: fillColor }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setModal(lot)}><Edit size={13} /> Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(lot.id)}><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && <LotModal lot={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  );
}
