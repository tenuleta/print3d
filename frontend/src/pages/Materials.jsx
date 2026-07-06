import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useTheme } from '../context/ThemeContext';

export default function Materials() {
  const { colors } = useTheme();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getMaterials()
      .then(setMaterials)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const materialInfo = {
    'PLA': {
      description: 'Biodegradable thermoplastic derived from renewable resources like corn starch.',
      properties: ['Easy to print', 'Low warping', 'Biodegradable', 'Good for prototypes'],
      useCases: ['Prototypes', 'Display models', 'Educational models', 'Low-stress parts'],
    },
    'ABS': {
      description: 'Strong, durable thermoplastic with good impact resistance.',
      properties: ['High strength', 'Heat resistant', 'Impact resistant', 'Slightly flexible'],
      useCases: ['Functional parts', 'Automotive parts', 'Enclosures', 'Mechanical parts'],
    },
    'PETG': {
      description: 'Clear, strong filament with excellent chemical resistance.',
      properties: ['Food safe', 'Chemical resistant', 'Durable', 'Slightly flexible'],
      useCases: ['Food containers', 'Medical devices', 'Outdoor parts', 'Mechanical parts'],
    },
    'Resin': {
      description: 'High-detail photopolymer resin for SLA printing.',
      properties: ['Ultra high detail', 'Smooth surface', 'Brittle', 'UV curable'],
      useCases: ['Jewelry', 'Miniatures', 'Dental models', 'Detailed figurines'],
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ ...styles.title, color: colors.text }}>Materials</h2>
        <p style={{ ...styles.subtitle, color: colors.textSecondary }}>Learn about our available 3D printing materials</p>
      </div>

      {loading && <div style={{ ...styles.loading, color: colors.textSecondary }}>Loading materials...</div>}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        {materials.map((material) => {
          const info = materialInfo[material.name] || {
            description: 'High-quality 3D printing material.',
            properties: ['Durable', 'Good finish'],
            useCases: ['General purpose printing'],
          };

          return (
            <div key={material.id} style={{ ...styles.card, background: colors.card, borderColor: colors.cardBorder }}>
              <div style={styles.cardHeader}>
                <h3 style={{ ...styles.materialName, color: colors.text }}>{material.name}</h3>
                <span style={styles.color}>{material.color}</span>
              </div>
              
              <p style={{ ...styles.description, color: colors.textSecondary }}>{info.description}</p>

              <div style={styles.section}>
                <h4 style={{ ...styles.sectionTitle, color: colors.text }}>Properties</h4>
                <ul style={styles.list}>
                  {info.properties.map((prop, i) => (
                    <li key={i} style={{ ...styles.listItem, color: colors.textSecondary }}>{prop}</li>
                  ))}
                </ul>
              </div>

              <div style={styles.section}>
                <h4 style={{ ...styles.sectionTitle, color: colors.text }}>Best For</h4>
                <ul style={styles.list}>
                  {info.useCases.map((use, i) => (
                    <li key={i} style={{ ...styles.listItem, color: colors.textSecondary }}>{use}</li>
                  ))}
                </ul>
              </div>

              <div style={{ ...styles.price, borderTopColor: colors.divider }}>
                <span style={styles.priceLabel}>Price:</span>
                <span style={styles.priceValue}>{(material.price_per_cm3 / 100).toFixed(2)} ETB/cm³</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1000, margin: '0 auto', padding: '32px 24px' },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 8 },
  subtitle: { fontSize: 15 },
  loading: { textAlign: 'center', padding: 48 },
  error: {
    background: '#fef2f2',
    color: '#dc2626',
    padding: '14px 18px',
    borderRadius: 12,
    border: '1px solid #fecaca',
    marginBottom: 16,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 20,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    border: '1px solid',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  materialName: {
    fontSize: 20,
    fontWeight: 700,
  },
  color: {
    background: 'rgba(99, 102, 241, 0.1)',
    color: '#6366f1',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  description: {
    fontSize: 14,
    lineHeight: 1.6,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    fontSize: 14,
    padding: '4px 0',
    paddingLeft: 16,
    position: 'relative',
  },
  price: {
    marginTop: 16,
    paddingTop: 16,
    borderTop: '1px solid',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 600,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 700,
    color: '#6366f1',
  },
};
