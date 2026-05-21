import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import WebsiteTemplate from "../components/WebsiteTemplate";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

interface FormData {
  businessName: string;
  businessType: string;
  description: string;
}

interface Generated {
  title: string;
  tagline: string;
  about: string;
  services: string[];
}

export default function Generate() {
  const navigate = useNavigate();
  const [generated, setGenerated] = useState<Generated | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [formData, setFormData] = useState<FormData | null>(null);
  const { fetchWebsites } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onGenerate = async (data: FormData) => {
    console.log("onGenerate called", data);
    setGenerating(true);
    setServerError("");
    setGenerated(null);
    setFormData(data);

    try {
      const res = await api.post("/websites/generate", data);
      setGenerated(res.data.generated);
    } catch (e: any) {
      setServerError(
        e.response?.data?.message || "Generation failed. Please try again.",
      );
    } finally {
      console.log("finally called — setting generating to false");
      setGenerating(false);
    }
  };

  const onSave = async () => {
    if (!generated || !formData) return;
    setSaving(true);
    setServerError("");
    try {
      await api.post("/websites", {
        ...formData,
        ...generated,
      });
      toast.success("Website saved successfully!");
      await fetchWebsites(1);
      navigate("/dashboard");
    } catch (e: any) {
      setServerError(
        e.response?.data?.message || "Failed to save. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <h2 style={styles.logo}>WebGen</h2>
        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </nav>

      <main style={styles.main}>
        {/* Form Section */}
        <div style={styles.formSection}>
          <h1 style={styles.title}>Generate Website</h1>
          <p style={styles.subtitle}>
            Fill in your business details and let AI do the rest
          </p>

          {serverError && <div style={styles.serverError}>{serverError}</div>}

          <form onSubmit={handleSubmit(onGenerate)} style={styles.form}>
            {/* Business Name */}
            <div style={styles.field}>
              <label style={styles.label}>Business Name</label>
              <input
                style={{
                  ...styles.input,
                  ...(errors.businessName ? styles.inputError : {}),
                }}
                placeholder="e.g. Maitry Jewels"
                {...register("businessName", {
                  required: "Business name is required",
                  minLength: { value: 2, message: "Min 2 characters" },
                  maxLength: { value: 100, message: "Max 100 characters" },
                })}
              />
              {errors.businessName && (
                <p style={styles.errorMsg}>{errors.businessName.message}</p>
              )}
            </div>

            {/* Business Type */}
            <div style={styles.field}>
              <label style={styles.label}>Business Type</label>
              <input
                style={{
                  ...styles.input,
                  ...(errors.businessType ? styles.inputError : {}),
                }}
                placeholder="e.g. Jewellery, Restaurant, Tech"
                {...register("businessType", {
                  required: "Business type is required",
                  minLength: { value: 2, message: "Min 2 characters" },
                  maxLength: { value: 100, message: "Max 100 characters" },
                })}
              />
              {errors.businessType && (
                <p style={styles.errorMsg}>{errors.businessType.message}</p>
              )}
            </div>

            {/* Description */}
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                style={{
                  ...styles.textarea,
                  ...(errors.description ? styles.inputError : {}),
                }}
                placeholder="Tell us about your business..."
                rows={4}
                {...register("description", {
                  required: "Description is required",
                  minLength: { value: 10, message: "Min 10 characters" },
                  maxLength: { value: 500, message: "Max 500 characters" },
                })}
              />
              {errors.description && (
                <p style={styles.errorMsg}>{errors.description.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={generating}
              style={{
                ...styles.generateBtn,
                opacity: generating ? 0.7 : 1,
                cursor: generating ? "not-allowed" : "pointer",
              }}
            >
              {generating ? "Generating..." : "Generate Website"}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        {generating && (
          <div style={styles.loadingPreview}>
            <p style={styles.loadingText}>
              ✨ AI is generating your website...
            </p>
          </div>
        )}

        {generated && formData && (
          <div style={styles.previewSection}>
            {/* Save Bar */}
            <div style={styles.saveBar}>
              <div>
                <p style={styles.saveTitle}>Preview looks good?</p>
                <p style={styles.saveSubtitle}>Save it to your dashboard</p>
              </div>
              <div style={styles.saveActions}>
                <button
                  style={styles.regenerateBtn}
                  onClick={handleSubmit(onGenerate)}
                  disabled={generating}
                >
                  Regenerate
                </button>
                <button
                  style={{
                    ...styles.saveBtn,
                    opacity: saving ? 0.7 : 1,
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                  onClick={onSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Website"}
                </button>
              </div>
            </div>

            {/* Website Template Preview */}
            <WebsiteTemplate
              title={generated.title}
              tagline={generated.tagline}
              about={generated.about}
              services={generated.services}
              businessName={formData.businessName}
            />
          </div>
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
    maxWidth: "860px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  formSection: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "40px",
    marginBottom: "32px",
    boxShadow: "0 4px 20px rgba(15,23,42,0.04)",
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
    marginBottom: "28px",
  },
  serverError: {
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
  generateBtn: {
    background: "#4a90ac",
    color: "#fff",
    border: "none",
    padding: "13px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
  },

  // Loading
  loadingPreview: {
    textAlign: "center",
    padding: "60px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    marginBottom: "32px",
  },
  loadingText: {
    fontSize: "16px",
    color: "#64748b",
    fontWeight: 500,
  },

  // Preview
  previewSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0px",
  },
  saveBar: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px 16px 0 0",
    padding: "20px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "none",
  },
  saveTitle: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#0f172a",
    marginBottom: "2px",
  },
  saveSubtitle: {
    fontSize: "13px",
    color: "#64748b",
  },
  saveActions: {
    display: "flex",
    gap: "12px",
  },
  regenerateBtn: {
    background: "transparent",
    border: "1px solid #e2e8f0",
    color: "#334155",
    padding: "10px 20px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  saveBtn: {
    background: "#4a90ac",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
};
