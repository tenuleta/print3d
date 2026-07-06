import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useTheme } from '../context/ThemeContext';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { colors } = useTheme();

  useEffect(() => {
    api.getUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ ...styles.title, color: colors.text }}>All Users</h2>
        <p style={{ ...styles.subtitle, color: colors.textSecondary }}>Registered users and their roles</p>
      </div>

      {loading && (
        <div style={{ ...styles.loading, color: colors.textSecondary }}>
          <div style={styles.spinner} />
          <p>Loading users...</p>
        </div>
      )}
      {error && (
        <div style={styles.error}>
          <span>&#9888;</span> {error}
        </div>
      )}
      {!loading && users.length === 0 && (
        <div style={{ ...styles.empty, background: colors.card, borderColor: colors.cardBorder }}>
          <h3 style={{ color: colors.text }}>No users found</h3>
        </div>
      )}

      <div style={styles.grid}>
        {users.map((u) => (
          <div key={u.id} style={{ ...styles.card, background: colors.card, borderColor: colors.cardBorder }}>
            <div style={{ ...styles.cardHeader, borderBottomColor: colors.divider }}>
              <div style={styles.avatar}>{u.name.charAt(0).toUpperCase()}</div>
              <div>
                <strong style={{ ...styles.name, color: colors.text }}>{u.name}</strong>
                <span style={{
                  ...styles.badge,
                  background: u.role === 'admin' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: u.role === 'admin' ? '#6366f1' : '#059669',
                }}>{u.role}</span>
              </div>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Email</span>
                <span style={{ ...styles.infoValue, color: colors.text }}>{u.email}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Joined</span>
                <span style={{ ...styles.infoValue, color: colors.text }}>{new Date(u.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 850, margin: '0 auto', padding: '32px 24px' },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 14 },
  loading: {
    textAlign: 'center',
    padding: 48,
  },
  spinner: {
    width: 36,
    height: 36,
    border: '3px solid #e2e8f0',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    margin: '0 auto 12px',
    animation: 'spin 0.8s linear infinite',
  },
  error: {
    background: '#fef2f2',
    color: '#dc2626',
    padding: '14px 18px',
    borderRadius: 12,
    border: '1px solid #fecaca',
    fontSize: 14,
    marginBottom: 16,
  },
  empty: {
    textAlign: 'center',
    padding: 48,
    borderRadius: 16,
    border: '1px solid',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 16,
  },
  card: {
    borderRadius: 14,
    border: '1px solid',
    padding: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'all 0.2s',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottom: '1px solid',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 700,
    flexShrink: 0,
  },
  name: {
    fontSize: 15,
    display: 'block',
    marginBottom: 4,
  },
  badge: {
    padding: '2px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  cardBody: {},
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 0',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: 500,
  },
};
