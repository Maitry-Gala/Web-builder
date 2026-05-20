import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token]);

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <h2 style={styles.logo}>WebGen</h2>

        <div style={styles.navActions}>
          <button
            style={styles.loginBtn}
            onClick={() => navigate("/signin")}
          >
            Sign in
          </button>

          <button
            style={styles.signupBtn}
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <main style={styles.hero}>
        <span style={styles.badge}>AI WEBSITE BUILDER</span>

        <h1 style={styles.heading}>
          Create your business
          <br />
          website in minutes
        </h1>

        <p style={styles.subheading}>
          Generate website content instantly using AI. Simple, clean and fully
          editable.
        </p>

        <div style={styles.heroButtons}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate("/signup")}
          >
            Start Free
            <ArrowRight size={18} />
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/signin")}
          >
            Sign in
          </button>
        </div>
      </main>

      {/* FEATURES */}
      <section style={styles.features}>
        {features.map((feature) => (
          <div key={feature.title} style={styles.card}>
            <h3 style={styles.cardTitle}>{feature.title}</h3>

            <p style={styles.cardDesc}>{feature.desc}</p>
          </div>
        ))}
      </section>
      <footer style={styles.footer}>
         <p>© 2026 WebGen AI. All rights reserved.</p>
       </footer>
    </div>
  );
}

const features = [
  {
    title: "Instant Generation",
    desc: "Generate website titles, about sections and services in seconds.",
  },
  {
    title: "Easy Editing",
    desc: "Update and customize every generated section anytime.",
  },
  {
    title: "Dashboard Access",
    desc: "Manage multiple generated websites from one place.",
  },
];

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#0f172a",
    fontFamily: "Inter, sans-serif",
    padding: "0 24px",
  },

  nav: {
    maxWidth: "1150px",
    margin: "0 auto",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    fontSize: "24px",
    fontWeight: 700,
    letterSpacing: "-1px",
  },

  navActions: {
    display: "flex",
    gap: "12px",
  },

  loginBtn: {
    border: "none",
    background: "transparent",
    color: "#334155",
    fontSize: "15px",
    fontWeight: 500,
    cursor: "pointer",
    padding: "10px 14px",
  },

  signupBtn: {
    border: "none",
    background: "#111827",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "12px",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
  },

  hero: {
    maxWidth: "900px",
    margin: "0 auto",
    textAlign: "center",
    paddingTop: "120px",
    paddingBottom: "100px",
  },

  badge: {
    display: "inline-block",
    fontSize: "15px",
    fontWeight: 600,
    letterSpacing: "1.5px",
    color: "#4a90ac",
    marginBottom: "10px",
  },

  heading: {
    fontSize: "72px",
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: "-3px",
    marginBottom: "24px",
  },

  subheading: {
    maxWidth: "620px",
    margin: "0 auto",
    fontSize: "18px",
    lineHeight: 1.7,
    color: "#64748b",
    marginBottom: "40px",
  },

  heroButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
  },

  primaryBtn: {
    border: "none",
    background: "#4a90ac",
    color: "#fff",
    padding: "15px 24px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 10px 30px rgba(79,70,229,0.18)",
  },

  secondaryBtn: {
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#0f172a",
    padding: "15px 24px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },

  features: {
    maxWidth: "1150px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: "20px",
    paddingBottom: "80px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "32px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 20px rgba(15,23,42,0.04)",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "12px",
  },

  cardDesc: {
    fontSize: "15px",
    color: "#64748b",
    lineHeight: 1.7,
  },
  footer: {
     textAlign: "center",
     padding: "24px",
     fontSize: "13px",
     color: "#aaa",
     borderTop: "1px solid #f0f0f0",
   },
};