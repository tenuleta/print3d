import { useTheme } from '../context/ThemeContext';

export default function QuoteCard({ order }) {
  const { colors } = useTheme();
  if (!order) return null;
  return (
    <div style={{ ...styles.card, background: colors.card, borderColor: colors.cardBorder }}>
      <h4 style={{ ...styles.title, color: colors.text }}>Quote Summary</h4>
      <div style={{ ...styles.divider, background: colors.divider }} />
      <div style={styles.rows}>
        <div style={styles.row}>
          <span style={styles.label}>File</span>
          <span style={{ ...styles.value, color: colors.text }}>{order.filename}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Material</span>
          <span style={{ ...styles.value, color: colors.text }}>{order.material_name} ({order.material_color})</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Quality</span>
          <span style={{ ...styles.value, color: colors.text }}>{order.quality}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Infill</span>
          <span style={{ ...styles.value, color: colors.text }}>{order.infill}%</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Volume</span>
          <span style={{ ...styles.value, color: colors.text }}>{order.volume_cm3?.toFixed(2)} cm³</span>
        </div>
        <div style={{ ...styles.divider, background: colors.divider }} />
        <div style={styles.totalRow}>
          <span style={{ ...styles.totalLabel, color: colors.text }}>Total</span>
          <span style={styles.totalValue}>{(order.quote_cents / 100).toFixed(2)} ETB</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: 420,
    margin: '20px auto',
    padding: 24,
    borderRadius: 16,
    border: '2px solid',
    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.12)',
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    margin: '12px 0',
  },
  rows: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
  },
  label: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 500,
  },
  value: {
    fontSize: 13,
    fontWeight: 600,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 700,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 800,
    color: '#6366f1',
    letterSpacing: '-0.02em',
  },
};
