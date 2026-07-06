import { useState, useEffect } from 'react';
import { api } from '../api/client';
import OrderCard from '../components/OrderCard';
import { useTheme } from '../context/ThemeContext';

export default function MyOrders() {
  const { colors } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');

  useEffect(() => {
    api.getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = (id, updated) => {
    setOrders(prev => prev.map(o => o.id === id ? updated : o));
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (materialFilter !== 'all' && order.material_name !== materialFilter) return false;
    return true;
  });

  const materials = [...new Set(orders.map(o => o.material_name))];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ ...styles.title, color: colors.text }}>My Orders</h2>
        <p style={{ ...styles.subtitle, color: colors.textSecondary }}>Track and manage your 3D print orders</p>
      </div>

      {orders.length > 0 && (
        <div style={{ ...styles.filters, background: colors.filterBg, borderColor: colors.cardBorder }}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ ...styles.filterSelect, background: colors.input, borderColor: colors.inputBorder, color: colors.text }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="printing">Printing</option>
              <option value="shipped">Shipped</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Material</label>
            <select
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              style={{ ...styles.filterSelect, background: colors.input, borderColor: colors.inputBorder, color: colors.text }}
            >
              <option value="all">All Materials</option>
              {materials.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          {(statusFilter !== 'all' || materialFilter !== 'all') && (
            <button
              onClick={() => { setStatusFilter('all'); setMaterialFilter('all'); }}
              style={{ ...styles.clearBtn, borderColor: colors.cardBorder, color: colors.textSecondary }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {loading && (
        <div style={{ ...styles.loading, color: colors.textSecondary }}>
          <div style={styles.spinner} />
          <p>Loading your orders...</p>
        </div>
      )}
      {error && (
        <div style={styles.error}>
          <span>&#9888;</span> {error}
        </div>
      )}
      {!loading && orders.length === 0 && (
        <div style={{ ...styles.empty, background: colors.card, borderColor: colors.cardBorder }}>
          <div style={styles.emptyIcon}>&#128230;</div>
          <h3 style={{ color: colors.text }}>No orders yet</h3>
          <p style={{ color: colors.textSecondary }}>Place your first order to get started.</p>
          <a href="/orders/new" style={styles.emptyBtn}>Place an Order</a>
        </div>
      )}
      {!loading && filteredOrders.length === 0 && orders.length > 0 && (
        <div style={{ ...styles.empty, background: colors.card, borderColor: colors.cardBorder }}>
          <div style={styles.emptyIcon}>&#128269;</div>
          <h3 style={{ color: colors.text }}>No matching orders</h3>
          <p style={{ color: colors.textSecondary }}>Try adjusting your filters.</p>
        </div>
      )}
      {filteredOrders.map((o) => <OrderCard key={o.id} order={o} onCancel={handleCancel} />)}
    </div>
  );
}

const styles = {
  container: { maxWidth: 750, margin: '0 auto', padding: '32px 24px' },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 14 },
  filters: {
    display: 'flex',
    gap: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    border: '1px solid',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  filterGroup: {
    flex: 1,
    minWidth: 140,
  },
  filterLabel: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#64748b',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  filterSelect: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1.5px solid',
    fontSize: 14,
    cursor: 'pointer',
  },
  clearBtn: {
    padding: '10px 20px',
    borderRadius: 8,
    border: '1.5px solid',
    background: 'transparent',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
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
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyBtn: {
    display: 'inline-block',
    marginTop: 16,
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: '#fff',
    padding: '10px 24px',
    borderRadius: 10,
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 14,
  },
};
