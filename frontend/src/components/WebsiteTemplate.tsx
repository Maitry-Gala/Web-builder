interface Props {
  title: string;
  tagline: string;
  about: string;
  services: string[];
  businessName: string;
}

export default function WebsiteTemplate({
  title,
  tagline,
  about,
  services = [],
  businessName,
}: Props) {
  return (
    <div style={styles.site}>
      {/* Site Navbar */}
      <nav style={styles.siteNav}>
        <span style={styles.siteLogo}>{businessName}</span>
        <div style={styles.siteNavLinks}>
          <a href="#about" style={styles.siteNavLink}>
            About
          </a>
          <a href="#services" style={styles.siteNavLink}>
            Services
          </a>
          <a href="#contact" style={styles.siteNavLink}>
            Contact
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.siteHero}>
        <h1 style={styles.siteTitle}>{title}</h1>
        <p style={styles.siteTagline}>{tagline}</p>
        <button style={styles.siteBtn}>Get Started</button>
      </section>

      {/* About */}
      <section id="about" style={styles.siteSection}>
        <div style={styles.siteSectionInner}>
          <h2 style={styles.siteSectionTitle}>About Us</h2>
          <p style={styles.siteSectionText}>{about}</p>
        </div>
      </section>

      {/* Services */}
      <section id="services" style={styles.siteServiceSection}>
        <div style={styles.siteSectionInner}>
          <h2 style={styles.siteSectionTitle}>Our Services</h2>
          <div style={styles.servicesGrid}>
            {services.map((service, index) => (
              <div key={index} style={styles.serviceCard}>
                <span style={styles.serviceNumber}>0{index + 1}</span>
                <p style={styles.serviceName}>{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.siteFooter}>
        <p>© 2026 {businessName}. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  site: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    overflow: "hidden",
    fontFamily: "Inter, sans-serif",
  },

  // Site Navbar
  siteNav: {
    background: "#0f172a",
    padding: "20px 48px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  siteLogo: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: 700,
    letterSpacing: "-0.5px",
  },
  siteNavLinks: {
    display: "flex",
    gap: "28px",
  },
  siteNavLink: {
    color: "#94a3b8",
    fontSize: "14px",
    textDecoration: "none",
    fontWeight: 500,
  },

  // Hero
  siteHero: {
    background: "#0f172a",
    padding: "80px 48px",
    textAlign: "center",
  },
  siteTitle: {
    fontSize: "48px",
    fontWeight: 800,
    color: "#ffffff",
    letterSpacing: "-2px",
    lineHeight: 1.1,
    marginBottom: "20px",
  },
  siteTagline: {
    fontSize: "18px",
    color: "#94a3b8",
    marginBottom: "36px",
    maxWidth: "500px",
    margin: "0 auto 36px",
    lineHeight: 1.6,
  },
  siteBtn: {
    background: "#4a90ac",
    color: "#ffffff",
    border: "none",
    padding: "14px 32px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },

  // Sections
  siteSection: {
    padding: "64px 48px",
    background: "#ffffff",
  },
  siteServiceSection: {
    padding: "64px 48px",
    background: "#f8fafc",
  },
  siteSectionInner: {
    maxWidth: "720px",
    margin: "0 auto",
  },
  siteSectionTitle: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.5px",
    marginBottom: "20px",
  },
  siteSectionText: {
    fontSize: "16px",
    color: "#475569",
    lineHeight: 1.8,
  },

  // Services Grid
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginTop: "8px",
  },
  serviceCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "24px",
  },
  serviceNumber: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#4a90ac",
    letterSpacing: "1px",
    display: "block",
    marginBottom: "10px",
  },
  serviceName: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#0f172a",
  },

  // Footer
  siteFooter: {
    background: "#0f172a",
    padding: "24px 48px",
    textAlign: "center",
    fontSize: "13px",
    color: "#475569",
  },
};
