import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car, MapPin, Search, ChevronRight, ArrowRight,
  ParkingSquare, Navigation, Ban, Shield,
  Facebook, Twitter, Instagram, Youtube,
  Users, BarChart3, CreditCard, Smartphone
} from 'lucide-react';
import LoginModal from '../../components/common/LoginModal';

export default function LandingPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const openLogin = () => setModalOpen(true);

  return (
    <div className="lp">
      {/* ══════ NAVBAR ══════ */}
      <nav className="lp-nav">
        <div className="lp-wrap lp-nav-inner">
          <div className="lp-logo">
            <div className="lp-logo-icon"><Car size={18} color="white" /></div>
            <span>Park<span className="lp-accent">Flow</span></span>
          </div>
          <div className="lp-nav-links">
            <a href="#hero">Home</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#benefits">Benefits</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </div>
          <button className="lp-login-btn" onClick={openLogin}>
            Login / Sign Up
          </button>
        </div>
      </nav>

      {/* ══════ HERO ══════ */}
      <section className="lp-hero" id="hero">
        {/* Hero background image */}
        <div className="lp-hero-img" />

        <div className="lp-wrap lp-hero-content">
          <div className="lp-hero-text">
            <h1>Smart Parking for<br/><span className="lp-accent">Smarter Cities</span></h1>
            <p className="lp-hero-hindi">स्मार्ट पार्किंग, स्मार्ट शहर</p>
            <p className="lp-hero-sub">Find, book, and pay for parking in seconds. Real-time availability across all locations.</p>
            <div className="lp-hero-btns">
              <button className="lp-btn-primary" onClick={openLogin}>
                Find Parking Now
              </button>
              <button className="lp-btn-outline" onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* ══════ HOW IT WORKS ══════ */}
      <section className="lp-section lp-section-light" id="how-it-works">
        <div className="lp-wrap">
          <h2 className="lp-section-title">How It Works</h2>
          <p className="lp-section-sub">Simple, Smart, Seamless</p>

          <div className="lp-steps">
            {/* Step 1 - Find & Book */}
            <div className="lp-step">
              <div className="lp-step-sign parking">
                <ParkingSquare size={36} />
              </div>
              <h3>1. Find & Book</h3>
              <p>Search for real-time spots and reserve instantly via web or app.</p>
            </div>

            <div className="lp-step-arrow"><ChevronRight size={28} /></div>

            {/* Step 2 - Navigate */}
            <div className="lp-step">
              <div className="lp-step-sign direction">
                <Navigation size={36} />
              </div>
              <h3>2. Navigate</h3>
              <p>Follow turn-by-turn directions to your guaranteed space.</p>
            </div>

            <div className="lp-step-arrow"><ChevronRight size={28} /></div>

            {/* Step 3 - Park & Go */}
            <div className="lp-step">
              <div className="lp-step-sign nostopping">
                <Ban size={36} />
              </div>
              <h3>3. Park & Go</h3>
              <p>Contactless entry, automatic payment, and secure parking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ BENEFITS ══════ */}
      <section className="lp-section lp-section-benefits" id="benefits">
        <div className="lp-wrap">
          <h2 className="lp-section-title dark">Benefits</h2>
          <p className="lp-section-sub dark">Chaos vs Order: A Smarter Way Forward</p>

          <div className="lp-compare">
            <div className="lp-compare-card chaos">
              <h3>The Old Way <span className="chaos-label">(Chaos)</span></h3>
              <div className="lp-compare-visual">
                <div className="chaos-icons">
                  <Car size={20} /><Car size={18} /><Car size={22} /><Car size={16} />
                  <Car size={19} /><Car size={17} /><Car size={21} /><Car size={15} />
                </div>
              </div>
              <ul className="lp-compare-list bad">
                <li>Endless circling for spots</li>
                <li>Stress and frustration</li>
                <li>Pollution and traffic</li>
                <li>Wasted time and fuel</li>
                <li>No guaranteed parking</li>
              </ul>
            </div>

            <div className="lp-compare-vs">VS</div>

            <div className="lp-compare-card order">
              <h3>ParkFlow <span className="order-label">(Order)</span></h3>
              <div className="lp-compare-visual">
                <div className="order-grid">
                  {Array.from({length: 8}).map((_, i) => (
                    <div key={i} className="order-spot">
                      <Car size={14} />
                    </div>
                  ))}
                </div>
              </div>
              <ul className="lp-compare-list good">
                <li>Guaranteed spots instantly</li>
                <li>Peace of mind</li>
                <li>Cleaner, greener city</li>
                <li>Save time and money</li>
                <li>Smart, secure parking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FEATURES ══════ */}
      <section className="lp-section lp-section-light" id="features">
        <div className="lp-wrap">
          <h2 className="lp-section-title">Why Choose ParkFlow?</h2>
          <p className="lp-section-sub">Smart features for a smarter parking experience</p>

          <div className="lp-features-grid">
            {[
              { icon: MapPin, title: 'Live Availability', desc: 'Real-time spot maps across all locations with instant updates.', color: '#e67e22' },
              { icon: CreditCard, title: 'Digital Payments', desc: 'Pay via UPI, cards, or net banking with instant receipts.', color: '#27ae60' },
              { icon: Smartphone, title: 'QR Code Entry', desc: 'Contactless gate access with auto-generated QR codes.', color: '#3498db' },
              { icon: Shield, title: 'Secure & Safe', desc: 'CCTV monitoring, guard patrols, and 24/7 customer support.', color: '#8e44ad' },
              { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Revenue reports, occupancy trends, and booking insights.', color: '#e74c3c' },
              { icon: Users, title: 'Multi-Role Access', desc: 'Admin, operator, guard, and driver roles with permissions.', color: '#2c3e50' },
            ].map((f, i) => (
              <div key={i} className="lp-feature-card">
                <div className="lp-feature-icon" style={{ background: f.color }}>
                  <f.icon size={22} color="white" />
                </div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="lp-cta">
        <div className="lp-wrap lp-cta-inner">
          <h2>Ready to park smarter?</h2>
          <p>Join thousands of drivers who save time every day with ParkFlow.</p>
          <button className="lp-btn-primary large" onClick={openLogin}>
            Get Started — It's Free <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="lp-footer" id="contact">
        <div className="lp-wrap">
          <div className="lp-footer-grid">
            <div className="lp-footer-col">
              <h4>Company</h4>
              <a href="#">Home</a>
              <a href="#">About Us</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="lp-footer-col">
              <h4>Support</h4>
              <a href="#">Find Parking</a>
              <a href="#">Partner Parking</a>
              <a href="#">Resources</a>
              <a href="#">Privacy Policy</a>
            </div>
            <div className="lp-footer-col">
              <h4>Resources</h4>
              <a href="#">About</a>
              <a href="#">Resources</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="lp-footer-col">
              <h4>Stay Connected</h4>
              <div className="lp-social-icons">
                <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
              </div>
              <div className="lp-newsletter">
                <input placeholder="Newsletter Signup" />
                <button><ArrowRight size={14} /></button>
              </div>
            </div>
          </div>
          <div className="lp-footer-bottom">
            © 2024 ParkFlow. All rights reserved.
          </div>
        </div>
      </footer>
      {/* ══════ LOGIN MODAL ══════ */}
      {modalOpen && <LoginModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
