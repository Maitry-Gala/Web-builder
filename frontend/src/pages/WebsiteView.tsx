import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import WebsiteTemplate from "../components/WebsiteTemplate";

interface Website {
  id: string;
  title: string;
  tagline: string;
  about: string;
  services: string[];
  businessName: string;
  businessType: string;
  description: string;
  createdAt: string;
}

export default function WebsiteView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        const res = await api.get(`/websites/${id}`);
        setWebsite(res.data.website);
      } catch (e: any) {
        if (e.response?.status === 404) {
          setError("Website not found.");
        } else if (e.response?.status === 403) {
          setError("You don't have access to this website.");
        } else {
          setError("Failed to load website. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWebsite();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.page}>
        <nav style={styles.nav}>
          <h2 style={styles.logo}>WebGen</h2>
        </nav>
        <div style={styles.centered}>
          <p style={styles.mutedText}>Loading website...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <nav style={styles.nav}>
          <h2 style={styles.logo}>WebGen</h2>
          <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </nav>
        <div style={styles.centered}>
          <p style={styles.errorText}>{error}</p>
          <button
            style={styles.backDashBtn}
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <h2 style={styles.logo}>WebGen</h2>
        <div style={styles.navActions}>
          <button
            style={styles.editBtn}
            onClick={() => navigate(`/dashboard/edit/${id}`)}
          >
            Edit Website
          </button>
          <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      {/* Website Template */}
      {website && (
        <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto" }}>
        <WebsiteTemplate
          title={website.title}
          tagline={website.tagline}
          about={website.about}
          services={website.services}
          businessName={website.businessName}
        />
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "Inter, sans-serif",
    color: "#0f172a",
  },
  nav: {
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    padding: "0 40px",
    height: "68px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "-1px",
  },
  navActions: {
    display: "flex",
    gap: "12px",
  },
  editBtn: {
    background: "#4a90ac",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  backBtn: {
    background: "transparent",
    border: "1px solid #e2e8f0",
    color: "#334155",
    padding: "8px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  centered: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "16px",
  },
  mutedText: {
    fontSize: "15px",
    color: "#94a3b8",
  },
  errorText: {
    fontSize: "15px",
    color: "#dc2626",
    fontWeight: 500,
  },
  backDashBtn: {
    background: "#4a90ac",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
};
