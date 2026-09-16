import { Ship, Plane, Truck, FileCheck, Warehouse, PackageSearch, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { images } from '../../data/images';

const services = [
  {
    icon: <Ship size={22} />,
    title: 'Ocean freight forwarding',
    description:
      'Full container load (FCL) and less-than-container load (LCL) sea freight booked with established carriers across our West Africa, Europe, Asia and Middle East lanes.',
    points: ['FCL and LCL booking', 'Container tracking', 'Marine insurance arrangement', 'Port handling coordination'],
  },
  {
    icon: <Plane size={22} />,
    title: 'Air freight',
    description:
      'Priority air cargo for time-sensitive, high-value or perishable shipments, with express clearance on arrival.',
    points: ['Express and standard air freight', 'Perishables handling', 'Airport-to-airport or door-to-door'],
  },
  {
    icon: <Truck size={22} />,
    title: 'Freight forwarding & inland haulage',
    description:
      'Coordinated road transport from origin warehouse to port, and from port of arrival to final delivery address.',
    points: ['Cross-border ECOWAS trucking', 'Last-mile delivery', 'Fleet-partner coordination'],
  },
  {
    icon: <FileCheck size={22} />,
    title: 'Customs & documentation assistance',
    description:
      'Preparation and submission of commercial invoices, packing lists, certificates of origin and customs entries on your behalf.',
    points: ['HS code classification', 'SONCAP & NAFDAC certificate support', 'Customs entry filing'],
  },
  {
    icon: <Warehouse size={22} />,
    title: 'Warehousing',
    description:
      'Bonded and general warehousing at our Oshodi facility, with inventory handling, repackaging and consolidation.',
    points: ['Bonded storage', 'Inventory handling', 'Repackaging & labelling'],
  },
  {
    icon: <PackageSearch size={22} />,
    title: 'Cargo consolidation',
    description:
      'LCL groupage services for smaller exporters who don\u2019t need a full container, sharing space and cost with other shippers.',
    points: ['Shared container space', 'Lower cost for small volumes', 'Flexible pickup scheduling'],
  },
];

export default function ServicesPage() {
  return (
    <div>
      <section className="border-b border-line bg-white">
        <div className="container-page grid gap-10 py-14 lg:grid-cols-12 lg:items-center lg:py-16">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-wider text-cargo">Services</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              Freight, customs and warehousing handled by one team.
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-mid">
              Whichever mode your shipment needs — sea, air or road — we coordinate carriers, customs and
              final delivery so you deal with a single point of contact.
            </p>
          </div>
          <div className="lg:col-span-5">
            <img
              src={images.stackedContainers}
              alt="Stacked shipping containers ready for loading at a port"
              className="h-64 w-full rounded-sm border border-line object-cover lg:h-80"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="flex flex-col gap-16">
          {services.map((s) => (
            <div
              key={s.title}
              className="grid gap-8 border-b border-line pb-16 last:border-0 last:pb-0 lg:grid-cols-12 lg:items-start"
            >
              <div className="lg:col-span-1">
                <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-ink text-white">
                  {s.icon}
                </span>
              </div>
              <div className="lg:col-span-7">
                <h2 className="font-display text-2xl font-semibold text-ink">{s.title}</h2>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-mid">{s.description}</p>
              </div>
              <div className="lg:col-span-4">
                <ul className="flex flex-col gap-2.5 border-l border-line pl-5">
                  {s.points.map((p) => (
                    <li key={p} className="text-sm text-ink-mid">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-16 text-white">
        <div className="container-page flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight">Not sure which service you need?</h2>
            <p className="mt-2 max-w-md text-[15px] text-white/70">
              Book a short call and we'll help you plan the right transport method and documentation for your shipment.
            </p>
          </div>
          <Button as="link" to="/book-a-call" size="lg">
            Book a call <ArrowRight size={17} />
          </Button>
        </div>
      </section>
    </div>
  );
}
