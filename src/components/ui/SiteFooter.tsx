import { brand, footer } from "@/data/content";

/** Подвал: бейдж сотрудника слева, навигация справа — как в шапке. */
export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-panel/70">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-16 sm:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="text-[17px] font-medium tracking-[-0.02em]">
              {brand.name}
            </p>
            <p className="mono-label mt-4 leading-[1.9]">
              {brand.role}
              <br />
              {brand.employeeId}
            </p>
            <p className="mono-label mt-6">{brand.tagline}</p>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="mono-label">{column.title}</p>
              <ul className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[14.5px] text-graphite underline-offset-[6px] transition-colors duration-200 hover:text-ink hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mono-label mt-16 border-t border-rule pt-7">
          {footer.legal}
        </p>
      </div>
    </footer>
  );
}
