import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const { colors } = useTheme();

  return (
    <div style={styles.container}>
      <div style={{ ...styles.hero, background: colors.heroBg }}>
        <div>
          <h1 style={{ ...styles.greeting, color: colors.heroText }}>Welcome back, {user?.name}!</h1>
          <p style={styles.role}>
            <span style={styles.roleBadge}>{user?.role}</span>
            <span style={{ color: colors.heroSub }}>Manage your 3D printing workflow</span>
          </p>
        </div>
      </div>

      <div style={styles.grid}>
        {user?.role !== 'admin' && (
          <>
            <Link to="/orders/new" style={styles.cardLink}>
              <div style={{ ...styles.card, background: colors.card, borderColor: colors.cardBorder }}>
                <div style={{ ...styles.cardIcon, background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>&#9650;</div>
                <h3 style={{ ...styles.cardTitle, color: colors.text }}>New Order</h3>
                <p style={{ ...styles.cardDesc, color: colors.textSecondary }}>Upload your STL file, choose material and quality, get an instant quote.</p>
                <span style={styles.cardAction}>Place Order &rarr;</span>
              </div>
            </Link>
            <Link to="/orders" style={styles.cardLink}>
              <div style={{ ...styles.card, background: colors.card, borderColor: colors.cardBorder }}>
                <div style={{ ...styles.cardIcon, background: 'linear-gradient(135deg, #10b981, #059669)' }}>&#9776;</div>
                <h3 style={{ ...styles.cardTitle, color: colors.text }}>My Orders</h3>
                <p style={{ ...styles.cardDesc, color: colors.textSecondary }}>Track your print orders and check their current status.</p>
                <span style={styles.cardAction}>View Orders &rarr;</span>
              </div>
            </Link>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <Link to="/admin/orders" style={styles.cardLink}>
              <div style={{ ...styles.card, background: colors.card, borderColor: colors.cardBorder }}>
                <div style={{ ...styles.cardIcon, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>&#9881;</div>
                <h3 style={{ ...styles.cardTitle, color: colors.text }}>Manage Orders</h3>
                <p style={{ ...styles.cardDesc, color: colors.textSecondary }}>View all orders, update statuses, monitor the print queue.</p>
                <span style={styles.cardAction}>All Orders &rarr;</span>
              </div>
            </Link>
            <Link to="/admin/users" style={styles.cardLink}>
              <div style={{ ...styles.card, background: colors.card, borderColor: colors.cardBorder }}>
                <div style={{ ...styles.cardIcon, background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>&#9679;</div>
                <h3 style={{ ...styles.cardTitle, color: colors.text }}>Manage Users</h3>
                <p style={{ ...styles.cardDesc, color: colors.textSecondary }}>View all registered users and their roles.</p>
                <span style={styles.cardAction}>All Users &rarr;</span>
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 900, margin: '0 auto', padding: '32px 24px' },
  hero: {
    marginBottom: 32,
    padding: '32px 36px',
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 8,
    letterSpacing: '-0.02em',
  },
  role: {
    fontSize: 15,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  roleBadge: {
    background: 'rgba(99, 102, 241, 0.2)',
    color: '#a5b4fc',
    padding: '3px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 20,
  },
  cardLink: { textDecoration: 'none' },
  card: {
    borderRadius: 16,
    padding: 28,
    border: '1px solid',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 1.6,
    marginBottom: 16,
  },
  cardAction: {
    color: '#6366f1',
    fontWeight: 600,
    fontSize: 14,
  },
};
