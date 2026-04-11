import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Search, CheckCircle, XCircle, Shield, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

const ROLE_COLORS = { Admin: 'admin', Operator: 'operator', Guard: 'guard', Driver: 'driver' };

function UserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState(user || { name: '', email: '', phone: '', role: 'Driver', status: 'active', password: '123' });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontWeight: 700, fontSize: 18 }}>{user ? 'Edit User' : 'Add User'}</h3>
          <button className="icon-btn" onClick={onClose}><XCircle size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input type="email" className="form-input" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="user@parkflow.io" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 98765 43210" />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-input form-select" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option>Admin</option>
                  <option>Operator</option>
                  <option>Guard</option>
                  <option>Driver</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            {!user && (
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input className="form-input" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Initial password" />
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><CheckCircle size={15} />Save User</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users').then(data => {
      setUsers(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleSave = async (form) => {
    try {
      if (!modal?.id) {
        const newUser = await api.post('/users', form);
        setUsers(prev => [...prev, newUser]);
        toast.success('User created');
      } else {
        const updatedUser = await api.put(`/users/${modal.id}`, form);
        setUsers(prev => prev.map(u => u.id === modal.id ? updatedUser : u));
        toast.success('User updated');
      }
    } catch (e) {
      toast.error(e.message || 'Error saving user');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User removed');
    } catch (e) {
      toast.error('Error removing user');
    }
  };

  const toggleStatus = async (id) => {
    try {
      const user = users.find(u => u.id === id);
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      const updatedUser = await api.put(`/users/${id}`, { status: newStatus });
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      toast.success('Status updated');
    } catch (e) {
      toast.error('Error updating status');
    }
  };

  if (loading) return <div style={{ padding: 40, color: '#fff' }}>Loading users...</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">{users.length} total users · {users.filter(u => u.status === 'active').length} active</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Stats by Role */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {['Admin','Operator','Guard','Driver'].map(role => (
          <div key={role} className={`glass-card stat-card ${role === 'Admin' ? 'purple' : role === 'Operator' ? 'blue' : role === 'Guard' ? 'blue' : 'emerald'}`} style={role === 'Admin' ? {'--color-purple': '#8b5cf6'} : {}}>
            <div className="stat-label">{role}s</div>
            <div className="stat-value">{users.filter(u => u.role === role).length}</div>
            <div className="stat-icon"><Shield size={48} /></div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." style={{ paddingLeft: 36 }} />
        </div>
        <div className="tab-list">
          {['all','Admin','Operator','Guard','Driver'].map(r => (
            <button key={r} className={`tab-btn ${roleFilter === r ? 'active' : ''}`} onClick={() => setRoleFilter(r)}>
              {r === 'all' ? 'All' : r}
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
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 11 }}>
                        {u.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={12} />{u.email}</span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={12} />{u.phone || '—'}</span>
                  </td>
                  <td><span className={`badge badge-${ROLE_COLORS[u.role]}`}>{u.role}</span></td>
                  <td>
                    <button onClick={() => toggleStatus(u.id)} className={`badge badge-${u.status}`} style={{ cursor: 'pointer', background: 'transparent' }}>
                      {u.status}
                    </button>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.created}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setModal(u)}><Edit size={12} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <UserModal user={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  );
}
