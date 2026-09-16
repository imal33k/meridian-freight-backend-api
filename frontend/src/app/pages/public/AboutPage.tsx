import { ShieldCheck, Globe2, Users, Target } from 'lucide-react';
import { images } from '../../data/images';

const values = [
  { icon: <ShieldCheck size={20} />, title: 'Reliability', description: 'We commit to realistic timelines and communicate proactively when circumstances change.' },
  { icon: <Globe2 size={20} />, title: 'Global reach, local expertise', description: 'Deep knowledge of Nigerian customs procedures paired with established international carrier relationships.' },
  { icon: <Users size={20} />, title: 'Customer partnership', description: 'We work alongside first-time exporters and established trading companies alike.' },
  { icon: <Target size={20} />, title: 'Operational precision', description: 'Every shipment is tracked, documented and accounted for from pickup to delivery.' },
];

const milestones = [
  { year: '2014', label: 'Founded in Lagos as a customs brokerage for local exporters.' },
  { year: '2017', label: 'Opened dedicated ocean freight desk for West Africa \u2013 Europe lanes.' },
  { year: '2020', label: 'Extended operations to air freight and Asia sourcing routes.' },
  { year: '2023', label: 'Launched bonded warehousing facility at Oshodi Industrial Estate.' },
  { year: '2026', label: 'Introduced digital shipment tracking and the customer portal.' },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-line bg-white">
        <div className="container-page grid gap-10 py-14 lg:grid-cols-12 lg:items-center lg:py-20">
          <div className="lg:col-span-6">
            <p className="font-mono text-xs uppercase tracking-wider text-cargo">About Meridian Freight</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              Twelve years moving Nigerian trade to and from the world.
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink-mid">
              Meridian Freight &amp; Logistics started as a small customs brokerage serving exporters at Apapa
              Port. Today we coordinate ocean, air and road freight, documentation and warehousing for
              businesses trading between Nigeria, West Africa, Europe, Asia and the Middle East.
            </p>
          </div>
          <div className="lg:col-span-6">
            <img
              src={images.handshakeNairobi}
              alt="Business partners shaking hands after concluding a trade agreement"
              className="h-[380px] w-full rounded-sm border border-line object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Our mission</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-mid">
              To make international trade accessible to Nigerian businesses of every size, by handling the
              logistics, documentation and customs complexity that otherwise slow shipments down.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Our vision</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-mid">
              A digital-first freight partner where every customer can see exactly what stage their shipment
              has reached, without needing to call or wait for an email reply.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-dim py-16 lg:py-20">
        <div className="container-page">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">What guides our work</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="flex flex-col gap-3 bg-white p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-ink text-white">{v.icon}</span>
                <h3 className="font-display text-lg font-semibold text-ink">{v.title}</h3>
                <p className="text-[15px] leading-relaxed text-ink-mid">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">Our history</h2>
        <ol className="mt-10 flex flex-col gap-0 border-l border-line pl-8">
          {milestones.map((m) => (
            <li key={m.year} className="relative pb-9 last:pb-0">
              <span className="absolute -left-[41px] top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-cargo bg-white" />
              <p className="font-mono text-sm text-cargo">{m.year}</p>
              <p className="mt-1 max-w-xl text-[15px] text-ink-mid">{m.label}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
