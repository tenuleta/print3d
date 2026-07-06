import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    setEditing(false);
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, background: colors.card, borderColor: colors.cardBorder }}>
        <div style={styles.header}>
          <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h2 style={{ ...styles.name, color: colors.text }}>{user?.name}</h2>
            <span style={styles.role}>{user?.role}</span>
          </div>
        </div>

        <div style={{ ...styles.divider, background: colors.divider }} />

        <div style={styles.section}>
          <h3 style={{ ...styles.sectionTitle, color: colors.text }}>Account Information</h3>
          
          <div style={styles.field}>
            <label style={styles.label}>Name</label>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ ...styles.input, background: colors.input, borderColor: colors.inputBorder, color: colors.text }}
              />
            ) : (
              <p style={{ ...styles.value, color: colors.text }}>{user?.name}</p>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            {editing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ ...styles.input, background: colors.input, borderColor: colors.inputBorder, color: colors.text }}
              />
            ) : (
              <p style={{ ...styles.value, color: colors.text }}>{user?.email}</p>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Member Since</label>
            <p style={{ ...styles.value, color: colors.text }}>
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div style={styles.actions}>
          {editing ? (
            <>
              <button onClick={handleSave} style={styles.saveBtn}>Save Changes</button>
              <button onClick={() => setEditing(false)} style={{ ...styles.cancelBtn, borderColor: colors.cardBorder, color: colors.textSecondary }}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} style={styles.editBtn}>Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: '0 auto', padding: '32px 24px' },
  card: {
    borderRadius: 16,
    padding: 32,
    border: '1px solid',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 28,
    fontWeight: 700,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 4,
  },
  role: {
    background: 'rgba(99, 102, 241, 0.1)',
    color: '#6366f1',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    margin: '24px 0',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#64748b',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  value: {
    fontSize: 15,
    margin: 0,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1.5px solid',
    fontSize: 14,
    boxSizing: 'border-box',
  },
  actions: {
    display: 'flex',
    gap: 12,
  },
  editBtn: {
    padding: '10px 24px',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '10px 24px',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '10px 24px',
    borderRadius: 8,
    border: '1.5px solid',
    background: 'transparent',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
