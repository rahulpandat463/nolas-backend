'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import './globals.css';

// SVG Icon Components
const HeroIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

const ServicesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const CustomersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const AboutUsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const BenefitsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

function LayoutShell({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'hero';

  const menuItems = [
    { id: 'hero',      name: 'Hero Section', Icon: HeroIcon },
    { id: 'services',  name: 'Services',     Icon: ServicesIcon },
    { id: 'customers', name: 'Our Customers',Icon: CustomersIcon },
    { id: 'about-us',  name: 'About Us',     Icon: AboutUsIcon },
    { id: 'benefits',  name: 'Benefits',     Icon: BenefitsIcon },
  ];

  return (
    <div className="layout-container">
      {/* ── Sticky Navbar ── */}
      <header className="navbar">
        <div className="nav-brand">
          <div className="nav-brand-logo">N</div>
          Nolas Capital
          <span className="nav-brand-badge">Admin</span>
        </div>

        <div className="nav-right">
          <div className="nav-divider" />
          <div className="profile-chip">
            <div className="profile-avatar">A</div>
            <span className="profile-name">Admin</span>
          </div>
        </div>
      </header>

      {/* ── Main Body ── */}
      <div className="main-wrapper">
        {/* ── Left Sidebar ── */}
        <aside className="sidebar">
          <div>
            <p className="sidebar-section-label">Navigation</p>
            <nav className="sidebar-menu">
              {menuItems.map(({ id, name, Icon }) => (
                <Link
                  key={id}
                  href={`/?tab=${id}`}
                  className={`menu-item ${activeTab === id ? 'active' : ''}`}
                >
                  <span className="menu-icon-wrap">
                    <Icon />
                  </span>
                  <span>{name}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="sidebar-bottom">
            <div className="sidebar-user-card">
              <div className="sidebar-user-avatar">A</div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">Administrator</div>
                <div className="sidebar-user-role">Super Admin</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Content Area ── */}
        <main className="content-area">{children}</main>
      </div>

      {/* ── Sticky Footer ── */}
      <footer className="footer">
        <div>&copy; 2026 Nolas Capital. All rights reserved.</div>
        <div className="status-badge">
          <span className="status-dot"></span>
          <span>System Online</span>
        </div>
      </footer>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={
          <div style={{ padding: '2rem', color: '#111', fontFamily: 'sans-serif' }}>
            Loading...
          </div>
        }>
          <LayoutShell>{children}</LayoutShell>
        </Suspense>
      </body>
    </html>
  );
}
