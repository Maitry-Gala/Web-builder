// src/pages/WebsiteEdit.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import toast from "react-hot-toast";

interface FormData {
  businessName: string;
  businessType: string;
  description: string;
  title: string;
  tagline: string;
  about: string;
  services: string;
}

export default function WebsiteEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // Fetch existing website and prefill form
  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        const res = await api.get(`/websites/${id}`);
        const w = res.data.website;

        // Prefill form with existing data
        reset({
          businessName: w.businessName,
          businessType: w.businessType,
          description:  w.description,
          title:        w.title,
          tagline:      w.tagline,
          about:        w.about,
          services:     w.services.join(", "), // array → comma separated string for editing
        });
      } catch (e: any) {
        setServerError("Failed to load website.");
      } finally {
        setLoading(false);
      }
    };

    fetchWebsite();
  }, [id]);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setServerError("");
    setSuccessMsg("");

    try {
      await api.put(`/websites/${id}`, {
        ...data,
        services: data.services.split(",").map((s) => s.trim()).filter(Boolean),
        // convert comma string back to array → ["Personal Training", "Yoga"]
      });

      toast.success("Website updated successfully!");
      // After 1.5s redirect to view page
      setTimeout(() => {
        navigate(`/dashboard/website/${id}`);
      }, 1500);

    } catch (e: any) {
      setServerError(
        e.response?.data?.message || "Failed to update. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <nav style={styles.nav}>
          <h2 style={styles.logo}>WebGen</h2>
        </nav>
        <div style={styles.centered}>
          <p style={styles.mutedText}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <h2 style={styles.logo}>WebGen</h2>
        <button
          style={styles.backBtn}
          onClick={() => navigate(`/dashboard/website/${id}`)}
        >
          ← Back to Website
        </button>
      </nav>

      <main style={styles.main}>
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Edit Website</h1>
            <p style={styles.subtitle}>
              Update your website details below
            </p>
          </div>

          {/* Success */}
          {successMsg && (
            <div style={styles.successBox}>{successMsg}</div>
          )}

          {/* Error */}
          {serverError && (
            <div style={styles.errorBox}>{serverError}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            {/* Row 1 — Business Name + Type */}
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Business Name</label>
                <input
                  style={{
                    ...styles.input,
                    ...(errors.businessName ? styles.inputError : {}),
                  }}
                  {...register("businessName", {
                    required: "Required",
                    minLength: { value: 2, message: "Min 2 characters" },
                  })}
                />
                {errors.businessName && (
                  <p style={styles.errorMsg}>{errors.businessName.message}</p>
                )}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Business Type</label>
                <input
                  style={{
                    ...styles.input,
                    ...(errors.businessType ? styles.inputError : {}),
                  }}
                  {...register("businessType", {
                    required: "Required",
                    minLength: { value: 2, message: "Min 2 characters" },
                  })}
                />
                {errors.businessType && (
                  <p style={styles.errorMsg}>{errors.businessType.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                style={{
                  ...styles.textarea,
                  ...(errors.description ? styles.inputError : {}),
                }}
                rows={3}
                {...register("description", {
                  required: "Required",
                  minLength: { value: 10, message: "Min 10 characters" },
                })}
              />
              {errors.description && (
                <p style={styles.errorMsg}>{errors.description.message}</p>
              )}
            </div>

            {/* Title */}
            <div style={styles.field}>
              <label style={styles.label}>Website Title</label>
              <input
                style={{
                  ...styles.input,
                  ...(errors.title ? styles.inputError : {}),
                }}
                {...register("title", {
                  required: "Required",
                  minLength: { value: 2, message: "Min 2 characters" },
                })}
              />
              {errors.title && (
                <p style={styles.errorMsg}>{errors.title.message}</p>
              )}
            </div>

            {/* Tagline */}
            <div style={styles.field}>
              <label style={styles.label}>Tagline</label>
              <input
                style={{
                  ...styles.input,
                  ...(errors.tagline ? styles.inputError : {}),
                }}
                {...register("tagline", {
                  required: "Required",
                  minLength: { value: 2, message: "Min 2 characters" },
                })}
              />
              {errors.tagline && (
                <p style={styles.errorMsg}>{errors.tagline.message}</p>
              )}
            </div>

            {/* About */}
            <div style={styles.field}>
              <label style={styles.label}>About Section</label>
              <textarea
                style={{
                  ...styles.textarea,
                  ...(errors.about ? styles.inputError : {}),
                }}
                rows={4}
                {...register("about", {
                  required: "Required",
                  minLength: { value: 10, message: "Min 10 characters" },
                })}
              />
              {errors.about && (
                <p style={styles.errorMsg}>{errors.about.message}</p>
              )}
            </div>

            {/* Services */}
            <div style={styles.field}>
              <label style={styles.label}>Services</label>
              <p style={styles.hint}>Separate each service with a comma</p>
              <input
                style={{
                  ...styles.input,
                  ...(errors.services ? styles.inputError : {}),
                }}
                placeholder="Personal Training, Yoga Classes, Cardio"
                {...register("services", {
                  required: "Required",
                })}
              />
              {errors.services && (
                <p style={styles.errorMsg}>{errors.services.message}</p>
              )}
            </div>

            {/* Buttons */}
            <div style={styles.btnRow}>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={() => navigate(`/dashboard/website/${id}`)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  ...styles.saveBtn,
                  opacity: saving ? 0.7 : 1,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
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
  main: {
    maxWidth: "760px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 4px 20px rgba(15,23,42,0.04)",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    marginBottom: "6px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
  },
  successBox: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#16a34a",
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    marginBottom: "20px",
  },
  errorBox: {
    background: "#fff1f1",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#334155",
  },
  hint: {
    fontSize: "12px",
    color: "#94a3b8",
    margin: 0,
  },
  input: {
    padding: "12px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    outline: "none",
    color: "#0f172a",
    fontFamily: "Inter, sans-serif",
  },
  textarea: {
    padding: "12px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    outline: "none",
    color: "#0f172a",
    fontFamily: "Inter, sans-serif",
    resize: "vertical",
  },
  inputError: {
    border: "1px solid #dc2626",
  },
  errorMsg: {
    fontSize: "12px",
    color: "#dc2626",
    margin: 0,
  },
  btnRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "8px",
  },
  cancelBtn: {
    background: "transparent",
    border: "1px solid #e2e8f0",
    color: "#334155",
    padding: "12px 24px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  saveBtn: {
    background: "#4a90ac",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
  },
  centered: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
  },
  mutedText: {
    fontSize: "15px",
    color: "#94a3b8",
  },
};