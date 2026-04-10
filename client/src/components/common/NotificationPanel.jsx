import { useNotifications } from '../../contexts/NotificationContext';
import { Bell, X, Car, CreditCard, AlertTriangle, LogIn, LogOut, CheckCircle } from 'lucide-react';

const TYPE_ICONS = {
  booking: { icon: Car, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  payment: { icon: CreditCard, color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  alert: { icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  entry: { icon: LogIn, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  exit: { icon: LogOut, color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' },
};

export default function NotificationPanel() {
  const { notifications, panelOpen, setPanelOpen, markAllRead, markRead, unreadCount } = useNotifications();

  return (
    <>
      {panelOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 140 }}
          onClick={() => setPanelOpen(false)}
        />
      )}
      <div className={`notification-panel ${panelOpen ? 'open' : ''}`}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bell size={18} color="var(--color-blue-light)" />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Notifications</span>
            {unreadCount > 0 && (
              <span style={{ background: 'var(--color-blue)', color: 'white', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{unreadCount}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {unreadCount > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={markAllRead}>
                <CheckCircle size={13} />
                Mark all read
              </button>
            )}
            <button className="icon-btn" onClick={() => setPanelOpen(false)}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No notifications</div>
          ) : (
            notifications.map(n => {
              const typeInfo = TYPE_ICONS[n.type] || TYPE_ICONS.alert;
              const Icon = typeInfo.icon;
              return (
                <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`} onClick={() => markRead(n.id)}>
                  <div className="notif-icon" style={{ background: typeInfo.bg }}>
                    <Icon size={16} color={typeInfo.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <div className="notif-title">{n.title}</div>
                      {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-blue)', flexShrink: 0, marginTop: 4 }} />}
                    </div>
                    <div className="notif-desc">{n.desc}</div>
                    <div className="notif-time">{n.time}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
