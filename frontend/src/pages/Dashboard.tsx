import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/axios";

interface Website {
  id: string;
  title: string;
  businessName: string;
  businessType: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [websites, setWebsites] = useState<Website[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchWebsite = async (currentPage: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/websites?page=${currentPage}&limit=10`);
      setWebsites(res.data.websites);
      setPagination(res.data.pagination);
    } catch (e) {
      setError("Failed o load  websites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsite(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this website?",
    );
    if (confirmed) return;

    setDeletingId(id);
    try {
      await api.delete("/websites/${id}");
      fetchWebsite(page);
    } catch (e) {
      alert("Failed to delete. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-Us", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
 <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <h2 style={styles.logo}>WebGen</h2>
        <div style={styles.navRight}>
          <span style={styles.greeting}>Hi, {user?.name} 👋</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <main style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Websites</h1>
            <p style={styles.subtitle}>
              {pagination?.total ?? 0} website{pagination?.total !== 1 ? "s" : ""} generated
            </p>
          </div>
          <button
            style={styles.generateBtn}
            onClick={() => navigate("/dashboard/generate")}
          >
            + Generate New
          </button>
        </div>

        {/* Error */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Loading */}
        {loading ? (
          <div style={styles.centered}>
            <p style={styles.mutedText}>Loading websites...</p>
          </div>
        ) : websites.length === 0 ? (
          // Empty state
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>No websites yet</p>
            <p style={styles.emptySubtitle}>
              Generate your first AI website to get started
            </p>
            <button
              style={styles.generateBtn}
              onClick={() => navigate("/dashboard/generate")}
            >
              + Generate New
            </button>
          </div>
        ) : (
          <>
            {/* Table */}
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>Website Name</th>
                    <th style={styles.th}>Business Type</th>
                    <th style={styles.th}>Created</th>
                    <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {websites.map((website, index) => (
                    <tr
                      key={website.id}
                      style={{
                        ...styles.tableRow,
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                      }}
                    >
                      <td style={styles.td}>
                        <p style={styles.websiteName}>{website.title}</p>
                        <p style={styles.businessName}>{website.businessName}</p>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.badge}>{website.businessType}</span>
                      </td>
                      <td style={styles.td}>
                        <p style={styles.mutedText}>{formatDate(website.createdAt)}</p>
                      </td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        <div style={styles.actions}>
                          <button
                            style={styles.viewBtn}
                            onClick={() => navigate(`/dashboard/website/${website.id}`)}
                          >
                            View
                          </button>
                          <button
                            style={styles.editBtn}
                            onClick={() => navigate(`/dashboard/edit/${website.id}`)}
                          >
                            Edit
                          </button>
                          <button
                            style={{
                              ...styles.deleteBtn,
                              opacity: deletingId === website.id ? 0.6 : 1,
                            }}
                            onClick={() => handleDelete(website.id)}
                            disabled={deletingId === website.id}
                          >
                            {deletingId === website.id ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  style={{
                    ...styles.pageBtn,
                    opacity: pagination.hasPrevPage ? 1 : 0.4,
                    cursor: pagination.hasPrevPage ? "pointer" : "not-allowed",
                  }}
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  ← Prev
                </button>

                {/* Page numbers */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    style={{
                      ...styles.pageBtn,
                      ...(p === page ? styles.activePage : {}),
                    }}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}

                <button
                  style={{
                    ...styles.pageBtn,
                    opacity: pagination.hasNextPage ? 1 : 0.4,
                    cursor: pagination.hasNextPage ? "pointer" : "not-allowed",
                  }}
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
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

  // Navbar
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
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  greeting: {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: 500,
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid #e2e8f0",
    color: "#334155",
    padding: "8px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },

  // Main
  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
  },
  title: {
    fontSize: "26px",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
  },
  generateBtn: {
    background: "#4a90ac",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },

  // Error
  errorBox: {
    background: "#fff1f1",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    marginBottom: "24px",
  },

  // Empty state
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#0f172a",
  },
  emptySubtitle: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "8px",
  },

  // Table
  tableWrapper: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHead: {
    background: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
  },
  th: {
    padding: "14px 20px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
    textAlign: "left",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  tableRow: {
    borderBottom: "1px solid #f1f5f9",
    transition: "background 0.15s",
  },
  td: {
    padding: "16px 20px",
    fontSize: "14px",
    verticalAlign: "middle",
  },
  websiteName: {
    fontWeight: 600,
    color: "#0f172a",
    marginBottom: "2px",
  },
  businessName: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  badge: {
    background: "#f0f9ff",
    color: "#4a90ac",
    border: "1px solid #bae6fd",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 500,
  },
  mutedText: {
    fontSize: "13px",
    color: "#94a3b8",
  },

  // Actions
  actions: {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
  },
  viewBtn: {
    background: "#4a90ac",
    color: "#fff",
    border: "none",
    padding: "7px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  editBtn: {
    background: "transparent",
    color: "#334155",
    border: "1px solid #e2e8f0",
    padding: "7px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  deleteBtn: {
    background: "transparent",
    color: "#dc2626",
    border: "1px solid #fecaca",
    padding: "7px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },

  // Pagination
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginTop: "32px",
  },
  pageBtn: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    color: "#334155",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  activePage: {
    background: "#4a90ac",
    color: "#ffffff",
    border: "1px solid #4a90ac",
  },
  centered: {
    textAlign: "center",
    padding: "60px 0",
  },
};