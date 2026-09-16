import { Link } from 'react-router-dom';
import { ShipWheel, Mail, Phone, MapPin } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="border-t border-line-dark bg-ink text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/10">
              <ShipWheel size={18} strokeWidth={2} className="text-white" />
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight">
              MERIDIAN <span className="text-cargo">FREIGHT</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/60">
            Import and export logistics for African and international trade — freight forwarding, customs
            documentation, warehousing and shipment visibility from origin to delivery.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">Company</h3>
          <ul className="mt-4 flex flex-col gap-3 text-[15px] text-white/70">
            <li><Link to="/about" className="hover:text-white">About us</Link></li>
            <li><Link to="/services" className="hover:text-white">Services</Link></li>
            <li><Link to="/destinations" className="hover:text-white">Destinations</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">Customers</h3>
          <ul className="mt-4 flex flex-col gap-3 text-[15px] text-white/70">
            <li><Link to="/track" className="hover:text-white">Track a shipment</Link></li>
            <li><Link to="/book-a-call" className="hover:text-white">Book a call</Link></li>
            <li><Link to="/register" className="hover:text-white">Create an account</Link></li>
            <li><Link to="/login" className="hover:text-white">Log in to portal</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">Get in touch</h3>
          <ul className="mt-4 flex flex-col gap-3 text-[15px] text-white/70">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-white/40" />
              14 Marina Trade Centre, Lagos Island, Lagos, Nigeria
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0 text-white/40" />
              <a href="tel:+2342017001200" className="hover:text-white">+234 201 700 1200</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="shrink-0 text-white/40" />
              <a href="mailto:operations@meridianfreight.com" className="hover:text-white">
                operations@meridianfreight.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Meridian Freight &amp; Logistics Ltd. All rights reserved.</p>
          <p className="font-mono">RC 1834729 · NAFDAC Licensed Freight Agent</p>
        </div>
      </div>
    </footer>
  );
}
