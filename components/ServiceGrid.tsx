import Card from "./Card";
import { ServiceIcon } from "./icons";
import { SERVICES } from "@/lib/site";

export default function ServiceGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((service, i) => (
        <Card
          key={service.slug}
          href={`/services/${service.slug}/`}
          dataEvent="service_page_cta_clicked"
          className={i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}
        >
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-[var(--r-sm)] border border-[var(--border)] text-white">
                <ServiceIcon name={service.icon} />
              </div>
              <h3 className="text-lg font-semibold text-white">{service.name}</h3>
              <p className="mt-2 text-sm text-white/55">{service.oneLiner}</p>
            </div>
            <span className="mt-6 inline-flex items-center text-sm font-medium text-white/70 transition-colors group-hover:text-white">
              Learn more
              <span aria-hidden="true" className="ml-1 transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
