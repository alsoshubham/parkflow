import { useState } from 'react';
import { ShieldCheck, LogIn, LogOut, Car, Clock, Search, Hash, Activity, AlertTriangle } from 'lucide-react';
import { LOTS, SESSIONS } from '../../store/mockData';
import { useNotifications } from '../../contexts/NotificationContext';
import toast from 'react-hot-toast';

export default function GuardConsole() {
  const { addNotification } = useNotifications();
  const [sessions, setSessions] = useState(SESSIONS);
  const [entryVehicle, setEntryVehicle] = useState('');
  const [entryLot, setEntryLot] = useState('l1');
  const [exitSearch, setExitSearch] = useState('');
  const [mode, setMode] = useState('entry');

  const activeSessions = sessions.filter(s => s.status === 'active');
  const closedSessions = sessions.filter(s => s.status === 'closed');

  const handleEntry = (e) => {
    e.preventDefault();
    if (!entryVehicle.trim()) return;
    const newSession = {
      id: `S${Date.now()}`,
      vehicleNo: entryVehicle.toUpperCase(),
      lotId: entryLot,
      spotId: `${entryLot}-A${Math.floor(Math.random() * 20) + 1}`,
      entryTime: new Date().toISOString().slice(0, 16),
      exitTime: null,
      status: 'active',
      guardId: 'u3',
      amount: null,
    };
    setSessions(prev => [newSession, ...prev]);
    addNotification({ type: 'entry', title: 'Vehicle Entry', desc: `${newSession.vehicleNo} entered ${LOTS.find(l => l.id === entryLot)?.name}` });
    toast.success(`✅ ${newSession.vehicleNo} entered successfully`);
    setEntryVehicle('');
  };

  const handleExit = (sessionId) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        const entry = new Date(s.entryTime);
        const now = new Date();
        const hours = Math.max(1, Math.round((now - entry) / (1000 * 60 * 60)));
        const lot = LOTS.find(l => l.id === s.lotId);
        const amount = hours * (lot?.pricePerHour || 40);
        addNotification({ type: 'exit', title: 'Vehicle Exited', desc: `${s.vehicleNo} – ₹${amount} charged` });
        toast.success(`🚗 ${s.vehicleNo} exited – ₹${amount} charged`);
        return { ...s, exitTime: now.toISOString().slice(0, 16), status: 'closed', amount };
      }
      return s;
    }));
  };

  const lotName = (id) => LOTS.find(l => l.id === id)?.name || id;

  const filteredExit = exitSearch
    ? activeSessions.filter(s => s.vehicleNo.toLowerCase().includes(exitSearch.toLowerCase()))
    : activeSessions;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Guard Console</h1>
            <p className="page-subtitle">Fast entry/exit logging · {activeSessions.length} active sessions</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'rgba(6,182,212,0.1)', borderRadius: 10, border: '1px solid rgba(6,182,212,0.3)' }}>
            <ShieldCheck size={16} color="#67e8f9" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#67e8f9' }}>Guard Mode Active</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="glass-card stat-card emerald">
          <div className="stat-label">Active Sessions</div>
          <div className="stat-value">{activeSessions.length}</div>
          <div className="stat-icon"><Activity size={48} /></div>
        </div>
        <div className="glass-card stat-card blue">
          <div className="stat-label">Today's Entries</div>
          <div className="stat-value">{sessions.length}</div>
          <div className="stat-icon"><LogIn size={48} /></div>
        </div>
        <div className="glass-card stat-card amber">
          <div className="stat-label">Exits Today</div>
          <div className="stat-value">{closedSessions.length}</div>
          <div className="stat-icon"><LogOut size={48} /></div>
        </div>
        <div className="glass-card stat-card purple" style={{ '--color-purple': '#8b5cf6' }}>
          <div className="stat-label">Revenue Collected</div>
          <div className="stat-value">₹{closedSessions.reduce((s, c) => s + (c.amount || 0), 0)}</div>
          <div className="stat-icon"><Car size={48} /></div>
        </div>
      </div>

      {/* Entry / Exit Actions */}
      <div className="grid-2" style={{ gap: 20, marginBottom: 24 }}>
        {/* Entry Panel */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogIn size={18} color="var(--color-emerald-light)" />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>Log Entry</h3>
          </div>

          <form onSubmit={handleEntry}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Vehicle Number *</label>
                <input
                  className="form-input"
                  value={entryVehicle}
                  onChange={e => setEntryVehicle(e.target.value.toUpperCase())}
                  placeholder="KA01AB1234"
                  required
                  style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.05em' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Parking Lot</label>
                <select className="form-input form-select" value={entryLot} onChange={e => setEntryLot(e.target.value)}>
                  {LOTS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-success w-full" style={{ justifyContent: 'center', padding: '14px', fontSize: 15 }}>
                <LogIn size={18} /> Log Vehicle Entry
              </button>
            </div>
          </form>
        </div>

        {/* Exit Panel */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogOut size={18} color="var(--color-blue-light)" />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>Log Exit</h3>
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Search Vehicle</label>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="form-input"
                value={exitSearch}
                onChange={e => setExitSearch(e.target.value.toUpperCase())}
                placeholder="Search by vehicle number..."
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>

          <div style={{ maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredExit.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No active sessions found</div>
            ) : (
              filteredExit.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-glass)', borderRadius: 10, border: '1px solid var(--border-glass)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{s.vehicleNo}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {lotName(s.lotId)} · {s.spotId} · {s.entryTime.split('T')[1]}
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => handleExit(s.id)}>
                    <LogOut size={13} /> Exit
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Active Sessions Table */}
      <div className="glass-card">
        <div style={{ padding: '20px 20px 0' }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>All Sessions</h3>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Vehicle</th>
                <th>Lot</th>
                <th>Spot</th>
                <th>Entry</th>
                <th>Exit</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--color-blue-light)' }}>{s.id}</td>
                  <td style={{ fontWeight: 700 }}>{s.vehicleNo}</td>
                  <td style={{ fontSize: 13 }}>{lotName(s.lotId)}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.spotId}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.entryTime?.split('T')[1] || '-'}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.exitTime?.split('T')[1] || '—'}</td>
                  <td style={{ fontWeight: 700, color: s.amount ? 'var(--color-emerald-light)' : 'var(--text-muted)' }}>{s.amount ? `₹${s.amount}` : '—'}</td>
                  <td><span className={`badge ${s.status === 'active' ? 'badge-available' : 'badge-completed'}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
