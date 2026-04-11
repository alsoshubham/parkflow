import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, CreditCard, Car, MapPin, Clock, QrCode, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

const STEPS = ['Select Spot', 'Your Details', 'Payment'];

function QRCodeDisplay({ bookingId }) {
  // SVG-based QR code pattern
  const size = 160;
  const cells = [];
  for (let r = 0; r < 20; r++) {
    for (let c = 0; c < 20; c++) {
      const fill = ((r + c + bookingId.charCodeAt(r % bookingId.length)) % 3) === 0;
      if (fill) cells.push({ r, c });
    }
  }
  const cellSize = size / 20;
  return (
    <div className="qr-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Corner markers */}
        <rect x={0} y={0} width={4 * cellSize} height={4 * cellSize} fill="#000" />
        <rect x={cellSize} y={cellSize} width={2 * cellSize} height={2 * cellSize} fill="#fff" />
        <rect x={16 * cellSize} y={0} width={4 * cellSize} height={4 * cellSize} fill="#000" />
        <rect x={17 * cellSize} y={cellSize} width={2 * cellSize} height={2 * cellSize} fill="#fff" />
        <rect x={0} y={16 * cellSize} width={4 * cellSize} height={4 * cellSize} fill="#000" />
        <rect x={cellSize} y={17 * cellSize} width={2 * cellSize} height={2 * cellSize} fill="#fff" />
        {cells.map(({ r, c }) => (
          <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} fill="#000" />
        ))}
      </svg>
    </div>
  );
}

export default function BookingFlow() {
  const { state } = useLocation();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const lot = state?.lot;
  const date = state?.date || new Date().toISOString().split('T')[0];
  const fromTime = state?.fromTime || '09:00';
  const toTime = state?.toTime || '12:00';
  const hours = state?.hours || 3;
  const estimate = state?.estimate || 120;

  const [step, setStep] = useState(0);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [vehicleNo, setVehicleNo] = useState('KA01AB1234');
  const [vehicleType, setVehicleType] = useState('Car');
  const [cardNo, setCardNo] = useState('4242 4242 4242 4242');
  const [cardName, setCardName] = useState(user?.name || '');
  const [expiry, setExpiry] = useState('12/26');
  const [cvv, setCvv] = useState('');
  const [payMethod, setPayMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [availableSpots, setAvailableSpots] = useState([]);

  useEffect(() => {
    if (lot) {
      setAvailableSpots(
        Array.from({ length: Math.min(40, lot.totalSpots || 40) }).map((_, i) => ({
          id: `${lot.id}-${i + 1}`,
          label: `A${i + 1}`,
          status: Math.random() > 0.3 ? 'available' : 'occupied'
        })).filter(s => s.status === 'available')
      );
    }
  }, [lot]);

  if (!lot) return (
    <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
      <p>No lot selected. <button className="btn btn-primary btn-sm" onClick={() => navigate('/find-parking')}>Find Parking</button></p>
    </div>
  );

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
        const booking = await api.post('/bookings', {
            lotId: lot.id,
            vehicleNo,
            startTime: `${date}T${fromTime}:00Z`,
            endTime: `${date}T${toTime}:00Z`,
            amount: estimate
        });
        
        await api.post('/payments', {
            bookingId: booking.id,
            amount: estimate,
            method: payMethod === 'card' ? 'Card' : payMethod === 'upi' ? 'UPI' : 'Net Banking',
            status: 'success'
        });
        
        setBookingId(booking.id);
        setStep(3);
        addNotification({ type: 'booking', title: 'Booking Confirmed!', desc: `${booking.id} for ${lot.name} – ₹${estimate}` });
        toast.success('Booking confirmed! 🎉');
    } catch (e) {
        toast.error('Booking failed: ' + e.message);
    } finally {
        setProcessing(false);
    }
  };

  if (step === 3 && bookingId) {
    return (
      <div style={{ maxWidth: 540, margin: '0 auto' }} className="animate-fade-in">
        <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', border: '2px solid var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Check size={30} color="var(--color-emerald)" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>{bookingId}</p>

          <div style={{ margin: '0 auto 24px', display: 'inline-block' }}>
            <QRCodeDisplay bookingId={bookingId} />
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>Show this QR at the gate for entry</p>

          <div style={{ background: 'var(--bg-glass)', borderRadius: 12, padding: 16, marginBottom: 24, textAlign: 'left' }}>
            {[
              ['Lot', lot.name],
              ['Spot', selectedSpot?.label || 'Auto-assigned'],
              ['Vehicle', vehicleNo],
              ['Date', date],
              ['Time', `${fromTime} – ${toTime}`],
              ['Amount', `₹${estimate}`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-ghost" onClick={() => navigate('/my-bookings')}><Clock size={15} />My Bookings</button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}><Check size={15} />Done</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Book Parking</h1>
        <p className="page-subtitle">{lot.name} · {date} · {fromTime}–{toTime}</p>
      </div>

      {/* Wizard Steps */}
      <div className="wizard-steps" style={{ marginBottom: 32 }}>
        {STEPS.map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div className={`wizard-step ${i < step ? 'done' : i === step ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="wizard-step-circle">
                {i < step ? <Check size={16} /> : i + 1}
              </div>
              <span className="wizard-step-label">{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`wizard-connector ${i < step ? 'done' : ''}`} style={{ flex: 1, height: 1, background: i < step ? 'var(--color-emerald)' : 'var(--border-glass)', margin: '0 12px' }} />}
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 28 }}>
        {/* Step 0 - Spot Selection */}
        {step === 0 && (
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Select a Spot</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
              {availableSpots.length} spots available · Click to select
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))', gap: 10, marginBottom: 24 }}>
              {availableSpots.slice(0, 40).map(spot => (
                <div
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot)}
                  className="spot-cell spot-available"
                  style={{
                    cursor: 'pointer', padding: '10px 4px', fontSize: 11, fontWeight: 700,
                    border: selectedSpot?.id === spot.id ? '2px solid var(--color-blue)' : '1px solid rgba(16,185,129,0.4)',
                    boxShadow: selectedSpot?.id === spot.id ? '0 0 12px var(--color-blue-glow)' : 'none',
                    background: selectedSpot?.id === spot.id ? 'rgba(59,130,246,0.2)' : 'rgba(16,185,129,0.2)',
                    color: selectedSpot?.id === spot.id ? 'var(--color-blue-light)' : 'var(--color-emerald-light)',
                    textAlign: 'center', borderRadius: 8,
                  }}
                >
                  {spot.label}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" disabled={!selectedSpot} onClick={() => setStep(1)}>
                Continue <Check size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 1 - Vehicle Details */}
        {step === 1 && (
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Vehicle Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              <div className="form-group">
                <label className="form-label">Vehicle Number Plate *</label>
                <input className="form-input" value={vehicleNo} onChange={e => setVehicleNo(e.target.value.toUpperCase())} placeholder="KA01AB1234" required />
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select className="form-input form-select" value={vehicleType} onChange={e => setVehicleType(e.target.value)}>
                  <option>Car</option>
                  <option>Motorcycle</option>
                  <option>SUV</option>
                  <option>Electric Vehicle</option>
                </select>
              </div>
            </div>

            <div style={{ background: 'var(--bg-glass)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Booking Summary</div>
              {[['Lot', lot.name], ['Spot', selectedSpot?.label], ['Duration', `${hours.toFixed(1)} hours`], ['Rate', `₹${lot.pricePerHour}/hr`]].map(([k,v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <hr className="divider" style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: 'var(--color-emerald-light)' }}>₹{estimate}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setStep(0)}>Back</button>
              <button className="btn btn-primary" disabled={!vehicleNo} onClick={() => setStep(2)}>Continue <CreditCard size={15} /></button>
            </div>
          </div>
        )}

        {/* Step 2 - Payment */}
        {step === 2 && (
          <form onSubmit={handlePayment}>
            <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Payment</h3>

            {/* Method selector */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {[['card', '💳 Card'],['upi', '📱 UPI'],['netbanking', '🏦 Net Banking']].map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPayMethod(val)}
                  className="btn btn-ghost btn-sm"
                  style={payMethod === val ? { borderColor: 'var(--color-blue)', color: 'var(--color-blue-light)', background: 'rgba(59,130,246,0.1)' } : {}}
                >
                  {label}
                </button>
              ))}
            </div>

            {payMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input className="form-input" value={cardNo} onChange={e => setCardNo(e.target.value)} placeholder="1234 5678 9012 3456" />
                </div>
                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input className="form-input" value={cardName} onChange={e => setCardName(e.target.value)} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Expiry</label>
                    <input className="form-input" value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input className="form-input" value={cvv} onChange={e => setCvv(e.target.value)} placeholder="•••" maxLength={4} />
                  </div>
                </div>
              </div>
            )}

            {payMethod === 'upi' && (
              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">UPI ID</label>
                <input className="form-input" placeholder="yourname@upi" />
              </div>
            )}

            {payMethod === 'netbanking' && (
              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Select Bank</label>
                <select className="form-input form-select">
                  <option>SBI Bank</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button type="submit" className="btn btn-success btn-lg" disabled={processing} style={{ minWidth: 180, justifyContent: 'center' }}>
                {processing ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                    Processing...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CreditCard size={16} /> Pay ₹{estimate}
                  </span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
