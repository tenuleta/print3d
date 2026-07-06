import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle, colors } = useTheme();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav style={{ ...styles.nav, background: colors.navBg }}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>&#9670;</span>
          Print3D
        </Link>
        <div style={styles.links}>
          <Link to="/materials" style={styles.navLink}>Materials</Link>
          {user ? (
            <>
              <Link to="/" style={styles.navLink}>Dashboard</Link>
              {!isAdmin && <Link to="/orders/new" style={styles.navLink}>New Order</Link>}
              {!isAdmin && <Link to="/orders" style={styles.navLink}>My Orders</Link>}
              {isAdmin && <Link to="/admin/orders" style={styles.navLink}>Orders</Link>}
              {isAdmin && <Link to="/admin/users" style={styles.navLink}>Users</Link>}
              <Link to="/profile" style={styles.navLink}>Profile</Link>
              <div style={styles.userBadge}>
                <span style={styles.avatar}>{user.name.charAt(0).toUpperCase()}</span>
                <span style={styles.userName}>{user.name}</span>
              </div>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>Register</Link>
            </>
          )}
          <button onClick={toggle} style={styles.themeBtn} title={dark ? 'Light mode' : 'Dark mode'}>
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    height: 64,
  },
  logo: {
    fontSize: 22,
    fontWeight: 800,
    color: '#fff',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    letterSpacing: '-0.02em',
  },
  logoIcon: {
    color: '#6366f1',
    fontSize: 20,
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  navLink: {
    color: '#cbd5e1',
    padding: '8px 14px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
    padding: '4px 12px 4px 4px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
  },
  userName: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: 500,
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#fca5a5',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '7px 16px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    marginLeft: 4,
  },
  registerBtn: {
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: '#fff',
    padding: '8px 20px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
    marginLeft: 4,
    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
  },
  themeBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 8,
    fontSize: 16,
    cursor: 'pointer',
    marginLeft: 4,
  },
};
