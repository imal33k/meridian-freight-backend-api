import { Link } from 'react-router-dom';
import { ArrowRight, Ship, Plane, Truck, FileCheck, Warehouse, PackageSearch } from 'lucide-react';
import Button from '../../components/ui/Button';
import { images } from '../../data/images';
import { destinations } from '../../data/destinations';

const services = [
  { icon: <Ship size={20} />, title: 'Ocean freight', description: 'FCL and LCL sea freight across West Africa, Europe, Asia and the Middle East.' },
  { icon: <Plane size={20} />, title: 'Air freight', description: 'Time-critical air cargo with priority handling for perishables and high-value goods.' },
  { icon: <Truck size={20} />, title: 'Road & inland haulage', description: 'Cross-border trucking and last-mile delivery within Nigeria and ECOWAS states.' },
  { icon: <FileCheck size={20} />, title: 'Customs & documentation', description: 'End-to-end brokerage, tariff classification and regulatory certificate handling.' },
  { icon: <Warehouse size={20} />, title: 'Warehousing', description: 'Bonded and general warehousing with consolidation and repackaging services.' },
  { icon: <PackageSearch size={20} />, title: 'Cargo consolidation', description: 'LCL groupage for smaller exporters shipping less than a full container.' },
];

const process = [
  { step: '01', title: 'Submit a request', description: 'Tell us what you\u2019re shipping, from where, and to where.' },
  { step: '02', title: 'Receive a quote', description: 'Our operations team reviews the request and provides pricing.' },
  { step: '03', title: 'Confirm & book', description: 'Accept the quote and we schedule pickup and carrier booking.' },
  { step: '04', title: 'Track to delivery', description: 'Follow every milestone from pickup to final delivery.' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-white">
        <div className="container-page grid gap-10 py-14 lg:grid-cols-12 lg:items-center lg:py-20">
          <div className="lg:col-span-6">
            <p className="font-mono text-xs uppercase tracking-wider text-cargo">Import &amp; export logistics</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Your goods, moving with certainty from Lagos to the world.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-mid">
              Meridian Freight handles export, import, customs documentation and shipment tracking for
              businesses trading between Nigeria and international markets — with visibility at every stage.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as="link" to="/track" size="lg">
                Track a shipment <ArrowRight size={17} />
              </Button>
              <Button as="link" to="/book-a-call" variant="ghost" size="lg">
                Book a call
              </Button>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
              <div>
                <dt className="text-xs text-ink-mid">Trade lanes</dt>
                <dd className="font-display text-2xl font-semibold text-ink">10+</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-mid">Years operating</dt>
                <dd className="font-display text-2xl font-semibold text-ink">12</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-mid">Shipments handled</dt>
                <dd className="font-display text-2xl font-semibold text-ink">4,800+</dd>
              </div>
            </dl>
          </div>
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-sm border border-line">
              <img
                src={images.heroCargoShip}
                alt="Container ship loaded with cargo departing a port"
                className="h-[420px] w-full object-cover lg:h-[520px]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-ink/85 px-5 py-4 backdrop-blur-sm">
                <p className="font-mono text-xs text-white/60">Live example · EXP-2026-001293</p>
                <p className="mt-1 text-sm font-medium text-white">Lagos, Nigeria → Southampton, UK · In transit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-line bg-ink">
        <div className="container-page flex flex-wrap items-center justify-between gap-6 py-6 text-sm text-white/60">
          <p>Freight patterns informed by DHL, Flexport, Kuehne+Nagel, Maersk and DSV.</p>
          <p className="font-mono text-xs">RC 1834729 · Licensed Freight Agent · Est. 2014</p>
        </div>
      </section>

      {/* Services */}
      <section className="container-page py-16 lg:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              What we handle for you
            </h2>
            <p className="mt-2 max-w-xl text-[15px] text-ink-mid">
              From first pickup to final delivery, one team coordinates freight, paperwork and storage.
            </p>
          </div>
          <Link to="/services" className="flex items-center gap-1.5 text-sm font-medium text-cargo hover:text-cargo-dark">
            View all services <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="flex flex-col gap-3 bg-white p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-ink text-white">{s.icon}</span>
              <h3 className="font-display text-lg font-semibold text-ink">{s.title}</h3>
              <p className="text-[15px] leading-relaxed text-ink-mid">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-line bg-white py-16 lg:py-24">
        <div className="container-page">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Quote, book, and track — in one place
          </h2>
          <p className="mt-2 max-w-xl text-[15px] text-ink-mid">
            A structured process replaces scattered calls and spreadsheets, from your first request through delivery.
          </p>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <li key={p.step} className="relative pl-0">
                <p className="font-mono text-sm text-cargo">{p.step}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">{p.title}</h3>
                <p className="mt-1.5 text-[15px] text-ink-mid">{p.description}</p>
                {i < process.length - 1 && (
                  <span className="absolute -right-4 top-1 hidden text-ink-mid/30 lg:block">
                    <ArrowRight size={16} />
                  </span>
                )}
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <Button as="link" to="/register" variant="secondary">
              Create a customer account <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* Destinations preview */}
      <section className="container-page py-16 lg:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Where we operate
            </h2>
            <p className="mt-2 max-w-xl text-[15px] text-ink-mid">
              Established lanes across West Africa, Europe, Asia and the Middle East.
            </p>
          </div>
          <Link to="/destinations" className="flex items-center gap-1.5 text-sm font-medium text-cargo hover:text-cargo-dark">
            Browse destinations <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-mid">
                <th className="py-3 font-medium">Country</th>
                <th className="py-3 font-medium">Primary port</th>
                <th className="py-3 font-medium">Services</th>
                <th className="py-3 font-medium">Typical lead time</th>
              </tr>
            </thead>
            <tbody>
              {destinations.slice(0, 6).map((d) => (
                <tr key={d.id} className="border-b border-line/70">
                  <td className="py-3.5 font-medium text-ink">{d.country}</td>
                  <td className="py-3.5 text-[15px] text-ink-mid">{d.port}</td>
                  <td className="py-3.5 text-[15px] capitalize text-ink-mid">{d.services.join(', ')}</td>
                  <td className="py-3.5 text-[15px] text-ink-mid">{d.leadTimeDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink py-16 text-white lg:py-20">
        <div className="container-page grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to move your next shipment?
            </h2>
            <p className="mt-3 max-w-md text-[15px] text-white/70">
              Speak with our operations team about your export or import requirements, or create an account to
              submit a request directly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Button as="link" to="/book-a-call" size="lg">
              Book a call <ArrowRight size={17} />
            </Button>
            <Button as="link" to="/contact" variant="outline-light" size="lg">
              Contact us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
