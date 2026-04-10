import { useState } from 'react';
import { CreditCard, Search, Download, Eye, TrendingUp } from 'lucide-react';
import { PAYMENTS, BOOKINGS, LOTS } from '../../store/mockData';
import { useAuth } from '../../contexts/AuthContext';

export default function Payments() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const isAdmin = ['Admin', 'Operator'].includes(user?.role);
  const payments = isAdmin ? PAYMENTS : PAYMENTS.filter(p => p.userId === user?.id);

  const filtered = payments.filter(p => {
    const matchFilter = filter === 'all' || p.status === filter;
    const matchSearch =
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.txnId.toLowerCase().includes(search.toLowerCase()) ||
      p.bookingId.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getLotFromBooking = (bookingId) => {
    const b = BOOKINGS.find(bk => bk.id === bookingId);
    if (!b) return '-';
    return LOTS.find(l => l.id === b.lotId)?.name || '-';
  };

  const total = filtered.reduce((s, p) => s + (p.status === 'success' ? p.amount : 0), 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Payments</h1>
            <p className="page-subtitle">Transaction history and receipts</p>
          </div>
          <button className="btn btn-ghost"><Download size={15} />Export CSV</button>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="glass-card stat-card emerald">
          <div className="stat-label">Total Collected</div>
          <div className="stat-value">₹{total.toLocaleString()}</div>
          <div className="stat-icon"><CreditCard size={48} /></div>
        </div>
        <div className="glass-card stat-card blue">
          <div className="stat-label">Transactions</div>
          <div className="stat-value">{payments.filter(p=>p.status==='success').length}</div>
          <div className="stat-icon"><TrendingUp size={48} /></div>
        </div>
        <div className="glass-card stat-card red">
          <div className="stat-label">Failed</div>
          <div className="stat-value">{payments.filter(p=>p.status==='failed').length}</div>
          <div className="stat-icon"><CreditCard size={48} /></div>
        </div>
        <div className="glass-card stat-card amber">
          <div className="stat-label">Methods</div>
          <div className="stat-value">{[...new Set(payments.map(p=>p.method))].length}</div>
          <div className="stat-icon"><CreditCard size={48} /></div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID or booking..." style={{ paddingLeft: 36 }} />
        </div>
        <div className="tab-list">
          {['all','success','failed'].map(s => (
            <button key={s} className={`tab-btn ${filter===s?'active':''}`} onClick={()=>setFilter(s)}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
          ))}
        </div>
      </div>

      <div className="glass-card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Booking</th>
                <th>Lot</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Txn ID</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--color-blue-light)' }}>{p.id}</td>
                  <td style={{ fontSize: 12, color: 'var(--color-amber-light)' }}>{p.bookingId}</td>
                  <td style={{ fontSize: 12 }}>{getLotFromBooking(p.bookingId)}</td>
                  <td>
                    <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:13 }}>
                      {p.method === 'Card' ? '💳' : p.method === 'UPI' ? '📱' : '🏦'}
                      {p.method}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: p.status==='success' ? 'var(--color-emerald-light)' : 'var(--color-red-light)' }}>
                    ₹{p.amount}
                  </td>
                  <td><span className={`badge badge-${p.status === 'success' ? 'paid' : 'failed'}`}>{p.status}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.createdAt.replace('T',' ')}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{p.txnId}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
