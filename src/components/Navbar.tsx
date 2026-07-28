import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getNavbarBootstrapData } from "@/lib/bootstrap";
import qubiLogo from "@/assets/qubi-logo.png";
import { Menu, X, ChevronDown } from "lucide-react";
import { getNavbarData, type NavbarLink, type NavbarSectionData } from "@/lib/strapi";

const isPathActive = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

const DropdownMenu = ({
  label,
  items,
}: {
  label: string;
  items: NavbarLink[];
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const isActive = items.some((item) => isPathActive(pathname, item.href));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        className={`flex items-center gap-1 text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${label} menu`}
        type="button"
      >
        {label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-44 bg-background border border-border rounded-xl shadow-lg py-1 z-50">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`block px-4 py-2.5 text-sm transition-colors hover:bg-surface-elevated ${
                isPathActive(pathname, item.href) ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const bootstrappedNavSections = getNavbarBootstrapData();
  const [navSections, setNavSections] = useState<NavbarSectionData[]>(bootstrappedNavSections ?? []);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenSections, setMobileOpenSections] = useState<Set<number>>(new Set());
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const fetchNavItems = async () => {
      try {
        const sections = await getNavbarData();
        if (!cancelled) {
          setNavSections(sections);
        }
      } catch (error) {
        console.error("Failed to fetch navbar items:", error);
        if (!cancelled && bootstrappedNavSections?.length) {
          // Fall back to bootstrap data if fetch fails
          setNavSections(bootstrappedNavSections);
        }
      }
    };

    fetchNavItems();

    return () => {
      cancelled = true;
    };
  }, [bootstrappedNavSections]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleMobileSection = (index: number) => {
    setMobileOpenSections((prev) => {
      const updated = new Set(prev);
      if (updated.has(index)) {
        updated.delete(index);
      } else {
        updated.add(index);
      }
      return updated;
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-background backdrop-blur-xl border-b border-border transform-none translate-y-0">
      <div className="container mx-auto flex items-center justify-between h-[76px] px-4 lg:px-8 w-full">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 bg-background" aria-label="Qubi Flow Orchestrator home">
          <img src={qubiLogo} alt="Qubi Flow Orchestrator" width="120" height="100" className="h-14 lg:h-16 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {navSections.map((section) => {
            // Direct link (no dropdown)
            if (section.href) {
              return (
                <Link
                  key={section.title}
                  to={section.href}
                  className={`text-sm font-medium transition-colors ${
                    isPathActive(location.pathname, section.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {section.title}
                </Link>
              );
            }
            // Dropdown menu
            return <DropdownMenu key={section.title} label={section.title} items={section.items} />;
          })}
        </div>

        <div className="hidden md:flex items-center justify-end flex-shrink-0">
          <Button asChild variant="hero" size="lg">
            <a href="https://meetings.hubspot.com/maheshv" target="_blank" rel="noopener noreferrer">
              Book a Demo
            </a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-foreground z-[9999] flex-shrink-0"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          type="button"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-navigation" className="md:hidden bg-background border-b border-border px-4 pb-4 z-[9998] absolute top-[76px] left-0 right-0">
          {navSections.map((section, index) => {
            // Direct link (no dropdown)
            if (section.href) {
              return (
                <Link
                  key={section.title}
                  to={section.href}
                  className={`block py-3 text-sm font-medium transition-colors ${
                    isPathActive(location.pathname, section.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {section.title}
                </Link>
              );
            }

            // Dropdown menu
            return (
              <div key={section.title}>
                <button
                  className={`flex items-center justify-between w-full py-3 text-sm font-medium transition-colors ${
                    section.items.some((l) => isPathActive(location.pathname, l.href))
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => toggleMobileSection(index)}
                  aria-expanded={mobileOpenSections.has(index)}
                  aria-label={`${section.title} menu`}
                  type="button"
                >
                  {section.title}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${mobileOpenSections.has(index) ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileOpenSections.has(index) && (
                  <div className="pl-4 mb-1">
                    {section.items.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`block py-2 text-sm transition-colors ${
                          isPathActive(location.pathname, link.href)
                            ? "text-primary"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <Button asChild variant="hero" size="lg" className="w-full mt-2">
            <a href="https://meetings.hubspot.com/maheshv" target="_blank" rel="noopener noreferrer" className="block w-full">
              Book a Demo
            </a>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
