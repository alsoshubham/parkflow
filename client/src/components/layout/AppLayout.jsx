import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ParkingSquare, Search, CalendarCheck, CreditCard,
  ShieldCheck, Users, BarChart3, Bell, Menu, X, LogOut, Car
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationPanel from '../common/NotificationPanel';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin','Operator','Guard','Driver'] },
  { path: '/lots', label: 'Lot Management', icon: ParkingSquare, roles: ['Admin','Operator'] },
  { path: '/find-parking', label: 'Find Parking', icon: Search, roles: ['Admin','Operator','Driver'] },
  { path: '/my-bookings', label: 'My Bookings', icon: CalendarCheck, roles: ['Admin','Driver'] },
  { path: '/payments', label: 'Payments', icon: CreditCard, roles: ['Admin','Operator','Driver'] },
  { path: '/guard', label: 'Guard Console', icon: ShieldCheck, roles: ['Admin','Guard'] },
  { path: '/reports', label: 'Reports', icon: BarChart3, roles: ['Admin','Operator'] },
  { path: '/users', label: 'User Management', icon: Users, roles: ['Admin'] },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { unreadCount, setPanelOpen } = useNotifications();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleNav = NAV_ITEMS.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const avatarInitials = user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'U';

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Car size={20} color="white" />
          </div>
          <span className="sidebar-logo-text">Park<span>Flow</span></span>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Navigation</span>
          {visibleNav.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info-card">
            <div className="user-avatar">{avatarInitials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="user-name truncate">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
            <button onClick={handleLogout} className="icon-btn btn-icon" title="Logout" style={{ width: 32, height: 32 }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 95, backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <button className="icon-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none' }} id="mobile-menu-btn">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="topbar-search">
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input placeholder="Search lots, bookings, vehicles..." />
          </div>

          <div className="topbar-actions">
            <button className="icon-btn" onClick={() => setPanelOpen(true)} id="notifications-btn">
              <Bell size={18} />
              {unreadCount > 0 && <span className="notification-dot" />}
            </button>
            <div className="user-avatar" style={{ cursor: 'pointer' }}>{avatarInitials}</div>
          </div>
        </header>

        <main className="page-content animate-fade-in">
          <Outlet />
        </main>
      </div>

      <NotificationPanel />

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
