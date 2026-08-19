import { useCallback, useEffect, useRef, useState } from 'react';
import { products, services, primaryLinks } from '../data/navigation.ts';
import type { NavItem } from '../data/navigation.ts';
import { contact, countries, credentials } from '../data/company.ts';

/* -------------------------------------------------------------------------
   Inline icons — a handful of trivial shapes, kept local so the island does
   not pull an icon library into the client bundle.
   ------------------------------------------------------------------------- */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const ChevronDown = ({ className = '' }: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" {...stroke} className={className} aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const ExternalLink = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M15 3h6v6M10 14 21 3M18 13v7H4V6h7" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M12 22s8-3.4 8-10V5l-8-3-8 3v7c0 6.6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const Burger = ({ open }: { open: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
  </svg>
);

/* ------------------------------------------------------------------------- */

type MenuKey = 'products' | 'services' | 'regions';

interface LogoImage {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

interface Props {
  currentPath: string;
  /** Pre-optimised logo URLs, built in BaseLayout — see the note there. */
  logo: LogoImage;
}

const isActive = (currentPath: string, href: string) =>
  href !== '/' && currentPath.startsWith(href);

export default function Navbar({ currentPath, logo }: Props) {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MenuKey | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /* Hover opens the menu; a short close delay stops it flickering when the
     pointer crosses the gap between the trigger and the panel. */
  const openWithHover = useCallback((key: MenuKey) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(key);
  }, []);

  const closeWithDelay = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  }, []);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Escape closes whatever is open. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenMenu(null);
      setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  /* Click outside the header closes any open dropdown. */
  useEffect(() => {
    if (!openMenu) return;
    const onClick = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [openMenu]);

  /* Lock body scroll and trap focus while the mobile drawer is open. */
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter(
        /* Collapsed accordion sections stay mounted so they can animate, and
           are marked inert while closed. They still match the selector, but
           they cannot take focus — leaving them in would hand the trap a
           dead end and swallow the Tab. */
        (el) => !el.closest('[inert]'),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  const menuItems: Record<'products' | 'services', NavItem[]> = { products, services };

  /* The panel is always mounted and toggled with data-state, never mounted and
     unmounted. React tearing the node out on close would cut the exit
     transition off at the first frame, so the menu would ease open and then
     vanish — the asymmetry is exactly what makes a dropdown feel cheap.
     `.menu-panel` (global.css) owns the fade, the 6px drop, and the deferred
     visibility; `inert` keeps a closed panel out of the tab order and the
     accessibility tree. It also means every nav link is now in the served
     HTML rather than appearing only after a hover. */
  const renderMegaMenu = (key: 'products' | 'services', open: boolean) => (
    <div
      id={`megamenu-${key}`}
      data-state={open ? 'open' : 'closed'}
      inert={!open}
      className="menu-panel absolute inset-x-0 top-full z-40 border-b border-ink-200 bg-white shadow-menu"
      onMouseEnter={() => openWithHover(key)}
      onMouseLeave={closeWithDelay}
    >
      <div className="container-prime grid gap-8 py-8 lg:grid-cols-[1fr_17rem] lg:py-10">
        <ul className="grid gap-1 sm:grid-cols-2">
          {menuItems[key].map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                aria-label={
                  item.external ? `${item.label} — opens the PrimeTrack Rwanda site` : undefined
                }
                className="group flex flex-col gap-1 rounded-card px-4 py-3 transition-colors duration-[var(--duration-fast)] hover:bg-ink-50"
                onClick={() => setOpenMenu(null)}
              >
                <span className="flex items-center gap-1.5 text-h4 text-ink-950 group-hover:text-prime-700">
                  {item.label}
                  {item.external && <ExternalLink />}
                </span>
                <span className="text-small text-ink-600">{item.descriptor}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Trust rail — verified credentials only. */}
        <div className="rounded-panel bg-ink-950 p-6 text-ink-300">
          <p className="text-label uppercase text-prime-400">Why PrimeTrack</p>
          <ul className="mt-4 flex flex-col gap-3">
            {credentials.slice(0, 3).map((c) => (
              <li key={c.title} className="flex items-start gap-2.5 text-small">
                <span className="mt-0.5 shrink-0 text-prime-400">
                  <ShieldIcon />
                </span>
                <span className="text-ink-200">{c.title}</span>
              </li>
            ))}
          </ul>
          <a
            href="/why-choose-primetrack/"
            className="mt-5 inline-flex items-center gap-1.5 text-small font-semibold text-prime-400 hover:text-prime-300"
            onClick={() => setOpenMenu(null)}
          >
            See all seven advantages
            <ArrowRight />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <header
      ref={headerRef}
      /* Solid background, deliberately: `backdrop-filter` would make the header
         a containing block for fixed-position descendants, which collapses the
         mobile drawer into the 64px header box. It is also cheaper to paint. */
      className={`sticky top-0 z-50 border-b border-ink-100 bg-white transition-shadow duration-[var(--duration-base)] ${
        scrolled ? 'shadow-card' : ''
      }`}
    >
      <div className="container-prime">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <a href="/" className="flex items-center" aria-label="PrimeTrack Telematics — home">
            {/* alt is empty on purpose: the link already carries the accessible
                name, and a second one would be announced twice. */}
            <img
              src={logo.src}
              srcSet={logo.srcSet}
              width={logo.width}
              height={logo.height}
              alt=""
              decoding="sync"
              className="h-11 w-auto shrink-0"
            />
          </a>

          {/* ---------- Desktop navigation ---------- */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {(['products', 'services'] as const).map((key) => (
                <li
                  key={key}
                  onMouseEnter={() => openWithHover(key)}
                  onMouseLeave={closeWithDelay}
                  /* Tabbing out of the trigger and its panel closes the menu. */
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenMenu(null);
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={openMenu === key}
                    aria-controls={`megamenu-${key}`}
                    onClick={() => setOpenMenu(openMenu === key ? null : key)}
                    className="flex items-center gap-1.5 rounded-full px-4 py-2 text-small font-semibold text-ink-800 transition-colors duration-[var(--duration-fast)] hover:bg-ink-50 hover:text-prime-700"
                  >
                    {key === 'products' ? 'Products' : 'Services'}
                    <ChevronDown
                      className={`transition-transform duration-[var(--duration-base)] ${
                        openMenu === key ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* The panel lives inside its own <li> so that keyboard focus
                      moves from the trigger straight into the menu, rather than
                      through the rest of the header first. It still spans the
                      full width because it positions against the header. */}
                  {renderMegaMenu(key, openMenu === key)}
                </li>
              ))}

              {primaryLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive(currentPath, link.href) ? 'page' : undefined}
                    className={`rounded-full px-4 py-2 text-small font-semibold transition-colors duration-[var(--duration-fast)] hover:bg-ink-50 hover:text-prime-700 ${
                      isActive(currentPath, link.href) ? 'text-prime-700' : 'text-ink-800'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------- Desktop utilities ---------- */}
          <div className="hidden items-center gap-2 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => openWithHover('regions')}
              onMouseLeave={closeWithDelay}
            >
              <button
                type="button"
                aria-expanded={openMenu === 'regions'}
                aria-controls="menu-regions"
                onClick={() => setOpenMenu(openMenu === 'regions' ? null : 'regions')}
                className="flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-2 text-small font-semibold text-ink-700 transition-colors hover:border-ink-400"
              >
                <GlobeIcon />
                NGA
                <ChevronDown
                  className={`transition-transform duration-[var(--duration-base)] ${
                    openMenu === 'regions' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <ul
                id="menu-regions"
                data-state={openMenu === 'regions' ? 'open' : 'closed'}
                inert={openMenu !== 'regions'}
                className="menu-panel absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-card border border-ink-200 bg-white py-1.5 shadow-menu"
              >
                {countries.map((c) => (
                  <li key={c.code}>
                    <a
                      href={c.href}
                      target={c.external ? '_blank' : undefined}
                      rel={c.external ? 'noopener noreferrer' : undefined}
                      className="flex items-center justify-between gap-2 px-4 py-2.5 text-small text-ink-700 transition-colors duration-[var(--duration-fast)] hover:bg-ink-50"
                      onClick={() => setOpenMenu(null)}
                    >
                      <span>
                        <span className="font-semibold text-ink-950">{c.code}</span>
                        <span className="ml-2 text-ink-500">{c.label}</span>
                      </span>
                      {c.external && <ExternalLink />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={`tel:${contact.phones[0].tel}`}
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-small font-semibold text-ink-700 transition-colors hover:text-prime-700 xl:flex"
            >
              <PhoneIcon />
              {contact.phones[0].display}
            </a>

            <a
              href="/contact-prime/"
              /* Black on brand orange — white on #ff7000 is 2.8:1 and even prime-600 is
                 only 3.7:1. Matches Button.astro's primary variant. */
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-prime-500 px-5 py-2.5 text-small font-semibold text-ink-950 transition duration-[var(--duration-base)] ease-[var(--ease-prime)] hover:-translate-y-0.5 hover:bg-prime-400 hover:shadow-lift active:translate-y-0 active:shadow-none"
            >
              Contact us
              <ArrowRight />
            </a>
          </div>

          {/* ---------- Mobile trigger ---------- */}
          <button
            type="button"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-ink-900 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Burger open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* ---------- Mobile drawer ----------
           Mounted always, shown with data-state, for the same reason as the
           mega-menus: an exit transition needs the node to still exist. It is
           `visibility: hidden` while closed, so it takes no pointer events,
           holds nothing focusable, and costs no paint. */}
      <div
        id="mobile-nav"
        ref={drawerRef}
        data-state={mobileOpen ? 'open' : 'closed'}
        inert={!mobileOpen}
        className="menu-panel menu-drawer fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto overscroll-contain bg-white lg:hidden"
      >
          <nav aria-label="Mobile" className="container-prime flex flex-col gap-1 py-6">
            {(['products', 'services'] as const).map((key) => (
              <div key={key} className="border-b border-ink-100">
                <button
                  type="button"
                  aria-expanded={mobileSection === key}
                  aria-controls={`mobile-${key}`}
                  onClick={() => setMobileSection(mobileSection === key ? null : key)}
                  className="flex min-h-14 w-full items-center justify-between py-3 text-left text-h4 text-ink-950"
                >
                  {key === 'products' ? 'Products' : 'Services'}
                  <ChevronDown
                    className={`transition-transform duration-[var(--duration-base)] ${
                      mobileSection === key ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {/* `.accordion` animates grid-template-rows 0fr → 1fr, which
                    resolves to the content's real height — no JS measurement,
                    no max-height guess that either clips long sections or
                    leaves short ones easing through empty space. */}
                <div
                  className="accordion"
                  data-state={mobileSection === key ? 'open' : 'closed'}
                  inert={mobileSection !== key}
                >
                  {/* The row track collapses the grid item's CONTENT to zero,
                      but padding is outside that and would hold the closed
                      section open by its own height. So the item is this bare
                      wrapper, and all spacing lives on the list inside it. */}
                  <div>
                    <ul id={`mobile-${key}`} className="flex flex-col pb-3">
                      {menuItems[key].map((item) => (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            target={item.external ? '_blank' : undefined}
                            rel={item.external ? 'noopener noreferrer' : undefined}
                            className="flex min-h-12 flex-col justify-center gap-0.5 rounded-card px-3 py-2.5 transition-colors duration-[var(--duration-fast)] hover:bg-ink-50"
                            onClick={() => setMobileOpen(false)}
                          >
                            <span className="flex items-center gap-1.5 font-semibold text-ink-900">
                              {item.label}
                              {item.external && <ExternalLink />}
                            </span>
                            <span className="text-small text-ink-500">{item.descriptor}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}

            {primaryLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive(currentPath, link.href) ? 'page' : undefined}
                className="flex min-h-14 items-center border-b border-ink-100 py-3 text-h4 text-ink-950"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}

            <div className="mt-6 flex flex-col gap-3">
              <a
                href="/contact-prime/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-prime-500 px-6 py-3 font-semibold text-ink-950 transition-colors duration-[var(--duration-base)] hover:bg-prime-400"
                onClick={() => setMobileOpen(false)}
              >
                Contact us
                <ArrowRight />
              </a>
              {contact.phones.map((phone) => (
                <a
                  key={phone.tel}
                  href={`tel:${phone.tel}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink-200 px-6 py-3 font-semibold text-ink-900"
                >
                  <PhoneIcon />
                  {phone.display}
                </a>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-label uppercase text-ink-500">Region</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {countries.map((c) => (
                  <li key={c.code}>
                    <a
                      href={c.href}
                      target={c.external ? '_blank' : undefined}
                      rel={c.external ? 'noopener noreferrer' : undefined}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-ink-200 px-4 py-2 text-small font-semibold text-ink-700"
                      onClick={() => setMobileOpen(false)}
                    >
                      {c.code}
                      <span className="font-normal text-ink-500">{c.label}</span>
                      {c.external && <ExternalLink />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
      </div>
    </header>
  );
}
