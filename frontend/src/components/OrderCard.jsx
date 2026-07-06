import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function OrderCard({ order, admin, onStatusChange, onCancel }) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [cancelling, setCancelling] = useState(false);
  
  const statusConfig = {
    pending: { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
    printing: { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
    shipped: { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0' },
    cancelled: { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
  };
  const sc = statusConfig[order.status] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const updated = await api.cancelOrder(order.id);
      if (onCancel) onCancel(order.id, updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(false);
    }
  };

  const isCustomer = user?.role === 'customer';
  const canCancel = isCustomer && order.status === 'pending';

  return (
    <div style={{ ...styles.card, background: colors.card, borderColor: colors.cardBorder }}>
      <div style={{ ...styles.header, borderBottomColor: colors.divider }}>
        <div style={styles.headerLeft}>
          <span style={{ ...styles.orderId, color: colors.text }}>#{order.id}</span>
          <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color, borderColor: sc.border }}>
            {order.status}
          </span>
        </div>
        <span style={styles.date}>{new Date(order.created_at).toLocaleDateString()}</span>
      </div>

      <div style={styles.body}>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>File</span>
          <span style={{ ...styles.infoValue, color: colors.text }}>{order.filename}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Material</span>
          <span style={{ ...styles.infoValue, color: colors.text }}>{order.material_name} ({order.material_color})</span>
        </div>
        <div style={styles.infoGrid}>
          <div style={styles.infoBlock}>
            <span style={styles.infoLabel}>Quality</span>
            <span style={{ ...styles.infoValue, color: colors.text }}>{order.quality}</span>
          </div>
          <div style={styles.infoBlock}>
            <span style={styles.infoLabel}>Infill</span>
            <span style={{ ...styles.infoValue, color: colors.text }}>{order.infill}%</span>
          </div>
          <div style={styles.infoBlock}>
            <span style={styles.infoLabel}>Volume</span>
            <span style={{ ...styles.infoValue, color: colors.text }}>{order.volume_cm3?.toFixed(2)} cm³</span>
          </div>
        </div>
      </div>

      <div style={{ ...styles.footer, borderTopColor: colors.divider }}>
        <span style={styles.price}>{(order.quote_cents / 100).toFixed(2)} ETB</span>
        <div style={styles.actions}>
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              style={styles.cancelBtn}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
          {admin && onStatusChange && (
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
              style={{ ...styles.select, background: colors.input, borderColor: colors.inputBorder, color: colors.text }}
            >
              <option value="pending">Pending</option>
              <option value="printing">Printing</option>
              <option value="shipped">Shipped</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}
        </div>
      </div>

      {admin && (
        <div style={{ ...styles.userRow, borderTopColor: colors.divider }}>
          {order.user_name} ({order.user_email})
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    borderRadius: 14,
    border: '1px solid',
    padding: 20,
    marginBottom: 14,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'all 0.2s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottom: '1px solid',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  orderId: {
    fontWeight: 700,
    fontSize: 16,
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'capitalize',
    border: '1px solid',
  },
  date: {
    fontSize: 13,
    color: '#94a3b8',
  },
  body: {
    marginBottom: 14,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
  },
  infoGrid: {
    display: 'flex',
    gap: 24,
    marginTop: 8,
  },
  infoBlock: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 500,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTop: '1px solid',
    flexWrap: 'wrap',
    gap: 12,
  },
  price: {
    fontSize: 22,
    fontWeight: 800,
    color: '#6366f1',
    letterSpacing: '-0.02em',
  },
  actions: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    padding: '8px 16px',
    borderRadius: 8,
    border: '1.5px solid #fecaca',
    background: '#fef2f2',
    color: '#dc2626',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  select: {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1.5px solid',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },
  userRow: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid',
  },
};
