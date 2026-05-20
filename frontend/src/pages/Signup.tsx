// src/pages/Signup.tsx
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      await signup(data.name, data.email, data.password);
      navigate("/signin");
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.logo}>WebGen</h2>
          <h1 style={styles.title}>Create your account</h1>
          <p style={styles.subtitle}>Start building websites with AI</p>
        </div>

        {/* Server Error */}
        {serverError && <div style={styles.serverError}>{serverError}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          {/* Name */}
          <div style={styles.field}>
            <label style={styles.label}>Name</label>
            <input
              style={{
                ...styles.input,
                ...(errors.name ? styles.inputError : {}),
              }}
              placeholder="John Doe"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Min 2 characters" },
                maxLength: { value: 50, message: "Max 50 characters" },
              })}
            />
            {errors.name && (
              <p style={styles.errorMsg}>{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {}),
              }}
              type="email"
              placeholder="john@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p style={styles.errorMsg}>{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {}),
              }}
              type="password"
              placeholder="Min. 6 characters"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />
            {errors.password && (
              <p style={styles.errorMsg}>{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.submitBtn,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/signin" style={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, sans-serif",
    padding: "20px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
  },
  header: {
    marginBottom: "28px",
  },
  logo: {
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "-1px",
    color: "#111827",
    marginBottom: "20px",
  },
  title: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: "6px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
  },
  serverError: {
    backgroundColor: "#fff1f1",
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
    gap: "18px",
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
    backgroundColor: "#fff",
    fontFamily: "Inter, sans-serif",
  },
  inputError: {
    border: "1px solid #dc2626",
  },
  errorMsg: {
    fontSize: "12px",
    color: "#dc2626",
    margin: 0,
  },
  submitBtn: {
    background: "#4a90ac",
    color: "#fff",
    border: "none",
    padding: "13px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 600,
    marginTop: "4px",
    fontFamily: "Inter, sans-serif",
  },
  footerText: {
    textAlign: "center",
    fontSize: "13px",
    color: "#64748b",
    marginTop: "24px",
  },
  link: {
    color: "#4a90ac",
    textDecoration: "none",
    fontWeight: 600,
  },
};