import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { colors } = useTheme();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      nav('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.leftPanel}>
        <div style={styles.brandContent}>
          <div style={styles.brandIcon}>&#9670;</div>
          <h1 style={styles.brandTitle}>Welcome </h1>
          <p style={styles.brandSubtitle}>Sign in to manage your 3D printing orders, track progress, and get instant quotes.</p>

        </div>
      </div>
      <div style={{ ...styles.rightPanel, background: colors.bg }}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={{ ...styles.formTitle, color: colors.text }}>Sign In</h2>
          <p style={{ ...styles.formSubtitle, color: colors.textSecondary }}>Enter your credentials to access your account</p>

          {error && (
            <div style={styles.error}>
              <span style={styles.errorIcon}>&#9888;</span>
              {error}
            </div>
          )}

          <div style={styles.field}>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              style={{ ...styles.input, background: colors.input, borderColor: colors.inputBorder, color: colors.text }}
            />
          </div>

          <div style={styles.field}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{ ...styles.input, background: colors.input, borderColor: colors.inputBorder, color: colors.text }}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p style={{ ...styles.switchText, color: colors.textSecondary }}>
            Don't have an account? <Link to="/register" style={styles.switchLink}>Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: 'calc(100vh - 64px)',
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    position: 'relative',
    overflow: 'hidden',
  },
  brandContent: {
    maxWidth: 400,
    zIndex: 1,
  },
  brandIcon: {
    fontSize: 48,
    color: '#6366f1',
    marginBottom: 20,
  },
  brandTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 800,
    marginBottom: 12,
    letterSpacing: '-0.02em',
  },
  brandSubtitle: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 1.7,
    marginBottom: 32,
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    color: '#cbd5e1',
    fontSize: 14,
  },
  featureDot: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: 700,
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    marginBottom: 28,
  },
  field: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: '1.5px solid',
    fontSize: 14,
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%',
    padding: '13px 0',
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    marginTop: 8,
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
  },
  error: {
    background: '#fef2f2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 14,
    border: '1px solid #fecaca',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  errorIcon: {
    fontSize: 16,
  },
  switchText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
  },
  switchLink: {
    color: '#6366f1',
    fontWeight: 600,
  },
};
