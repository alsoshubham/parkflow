import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Eye, EyeOff, Zap, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const DEMO_ACCOUNTS = [
  { role: 'Admin',    email: 'admin@parkflow.io',    password: 'admin123',   desc: 'Full system access' },
  { role: 'Operator', email: 'operator@parkflow.io', password: 'op123',      desc: 'Lot management' },
  { role: 'Guard',    email: 'guard@parkflow.io',    password: 'guard123',   desc: 'Entry/exit console' },
  { role: 'Driver',   email: 'driver@parkflow.io',   password: 'driver123',  desc: 'Book parking' },
];

const ROLE_COLORS = { Admin: '#8b5cf6', Operator: '#3b82f6', Guard: '#06b6d4', Driver: '#10b981' };

export default function LoginModal({ onClose }) {
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
      onClose();
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="lm-overlay" onClick={onClose}>
      <div className="lm-box" onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button className="lm-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {/* Logo */}
        <div className="lm-logo">
          <div className="lm-logo-icon">
            <Car size={22} color="white" />
          </div>
          <span>Park<span>Flow</span></span>
        </div>
        <p className="lm-tagline">Smart Parking Management Platform</p>

        <h2 className="lm-title">Sign In</h2>
        <p className="lm-sub">Select a demo role or enter credentials</p>

        {/* Demo Role Selector */}
        <div className="lm-roles">
          {DEMO_ACCOUNTS.map(acc => (
            <button
              key={acc.role}
              type="button"
              className={`lm-role-card ${selected === acc.role ? 'selected' : ''}`}
              onClick={() => handleDemoSelect(acc)}
              style={selected === acc.role ? { borderColor: ROLE_COLORS[acc.role], background: `${ROLE_COLORS[acc.role]}18` } : {}}
            >
              <div className="lm-role-dot" style={{ background: ROLE_COLORS[acc.role], boxShadow: `0 0 6px ${ROLE_COLORS[acc.role]}` }} />
              <div>
                <div className="lm-role-name">{acc.role}</div>
                <div className="lm-role-desc">{acc.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="lm-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@parkflow.io"
              required
            />
          </div>
          <div className="lm-field">
            <label>Password</label>
            <div className="lm-pass-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button type="button" className="lm-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" className="lm-submit" disabled={loading}>
            {loading ? (
              <><span className="lm-spinner" /> Authenticating...</>
            ) : (
              <><Zap size={15} /> Sign In to ParkFlow</>
            )}
          </button>
        </form>

        <p className="lm-footer-note">© 2024 ParkFlow · Smart Parking Solutions</p>
      </div>
    </div>
  );
}
