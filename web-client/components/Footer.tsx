
import Link from "next/link";

const companyLinks = [
  { label: "Liquidity", href: "/" },
  { label: "Strategies", href: "/" },
  { label: "OTC", href: "/" },
  { label: "Ventures", href: "/" },
  { label: "Insights", href: "/" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "X", href: "https://x.com" },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-white text-[#171717]">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="border-r border-[#171717]/[0.045] last:border-r-0"
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[2000px] px-5 sm:px-8 lg:px-[3%]">
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-12 py-8 sm:py-14 md:grid-cols-12 md:gap-8 lg:py-12">
          {/* Brand */}
          <div className="md:col-span-7 lg:col-span-8">
            <Link
              href="/"
              aria-label="UniWorkSL home"
              className="group inline-flex items-center gap-2"
            >
              {/* UniWork logo mark */}
            <div className="flex items-center justify-center text-[#37352f]">
              <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 3D Box Outer Shell */}
                <path d="M50 10L85 28V72L50 90L15 72V28L50 10Z" stroke="currentColor" strokeWidth="7" strokeLinejoin="round"/>
                {/* 3D Box Inner Y-Lines */}
                <path d="M15 28L50 48L85 28" stroke="currentColor" strokeWidth="7" strokeLinejoin="round"/>
                <path d="M50 48V90" stroke="currentColor" strokeWidth="7" strokeLinejoin="round"/>
                {/* Stylized 'U' embedded on the right face */}
                <path d="M62 43V60C62 65 73 65 73 60V38" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div> 

              <span className="text-[27px] font-medium tracking-[-1.2px] sm:text-[30px]">
                UniWorkSL
              </span>
            </Link>

            <p className="mt-3 text-[9px]tracking-[0.22em] text-[#686868] sm:text-[16px] font-normal">
              The First Dedicated Student Task Network in Sri Lanka
            </p>

            <p className="mt-4 max-w-[480px] text-[14px] leading-[1.9] text-[#858585] sm:text-[14px]">
             Bridging the gap between flexible student income and on-demand help for individuals and businesses.
            </p>
          </div>

          {/* Company links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-5 lg:col-span-4 lg:grid-cols-2 lg:gap-12">
            <div>
              <h3 className="mb-6 text-[11px] uppercase tracking-[0.2em] text-[#636262] font-medium">
                Company
              </h3>

              <nav
                aria-label="Company"
                className="flex flex-col items-start gap-[14px]"
              >
                {companyLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[14px] text-[#555] transition-colors duration-200 hover:text-[#4b5dc2] sm:text-[15px]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Connect */}
            <div>
              <h3 className="mb-6 text-[11px] uppercase tracking-[0.2em] text-[#636262] font-medium">
                Connect
              </h3>

              <nav
                aria-label="Social media"
                className="flex flex-col items-start gap-[14px]"
              >
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 text-[14px] text-[#555] transition-colors duration-200 hover:text-[#4b5dc2] sm:text-[15px]"
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className="text-[13px] text-[#A3A3A3] hover:text-[#4b5dc2] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div className="h-px w-full bg-[#171717]/15" />

        {/* Copyright */}
        <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-[10px] tracking-[0.13em] text-[#777] sm:text-[11px] sm:tracking-[0.16em]">
            © UniWorkSL 2026 // All Rights Reserved
          </p>

          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center gap-3 text-[10px] tracking-[0.13em] text-[#777] sm:gap-4 sm:text-[11.5px] sm:tracking-[0.16em]"
          >
            <Link
              href="/"
              className="transition-colors hover:text-[#B18B42]"
            >
              Disclaimer
            </Link>

            <span aria-hidden="true">·</span>

            <Link
              href="/"
              className="transition-colors hover:text-[#B18B42]"
            >
              Privacy
            </Link>

            <span aria-hidden="true">·</span>

            <Link
              href="/"
              className="transition-colors hover:text-[#B18B42]"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}