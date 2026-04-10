import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@parkflow.io', password: 'admin123', desc: 'Full system access' },
  { role: 'Operator', email: 'operator@parkflow.io', password: 'op123', desc: 'Lot management' },
  { role: 'Guard', email: 'guard@parkflow.io', password: 'guard123', desc: 'Entry/exit console' },
  { role: 'Driver', email: 'driver@parkflow.io', password: 'driver123', desc: 'Book parking' },
];

const ROLE_COLORS = { Admin: '#8b5cf6', Operator: '#3b82f6', Guard: '#06b6d4', Driver: '#10b981' };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@parkflow.io');
  const [password, setPassword] = useState('admin123');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('Admin');

  const handleDemoSelect = (acc) => {
    setSelected(acc.role);
    setEmail(acc.email);
    setPassword(acc.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back! 🚗');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="login-page">
      {/* Background glows */}
      <div className="login-bg-glow" style={{ background: '#3b82f6', top: '-200px', left: '-200px' }} />
      <div className="login-bg-glow" style={{ background: '#8b5cf6', bottom: '-200px', right: '-150px' }} />

      <div className="login-card animate-slide-up">
        {/* Logo */}
        <div className="login-logo">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(59,130,246,0.4)',
            }}>
              <Car size={26} color="white" />
            </div>
            <span style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>
              Park<span style={{ color: '#60a5fa' }}>Flow</span>
            </span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Smart Parking Management Platform</p>
        </div>

        <div className="glass-card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>Sign In</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>Select a demo role or enter credentials</p>

          {/* Demo Role Selector */}
          <div className="demo-roles-grid" style={{ marginBottom: 24 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.role}
                className={`demo-role-card ${selected === acc.role ? 'selected' : ''}`}
                onClick={() => handleDemoSelect(acc)}
                type="button"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: ROLE_COLORS[acc.role], boxShadow: `0 0 6px ${ROLE_COLORS[acc.role]}` }} />
                  <span className="demo-role-name">{acc.role}</span>
                </div>
                <div className="demo-role-email">{acc.desc}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@parkflow.io"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                    }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full btn-lg"
              disabled={loading}
              style={{ justifyContent: 'center', width: '100%', position: 'relative' }}
            >
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Authenticating...
                </span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={16} />
                  Sign In to ParkFlow
                </span>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 16 }}>
          © 2024 ParkFlow · Smart Parking Solutions
        </p>
      </div>
    </div>
  );
}
