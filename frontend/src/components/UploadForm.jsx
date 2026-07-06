import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useTheme } from '../context/ThemeContext';

export default function UploadForm({ onQuote }) {
  const { colors } = useTheme();
  const [file, setFile] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [materialId, setMaterialId] = useState('');
  const [quality, setQuality] = useState('standard');
  const [infill, setInfill] = useState(20);
  const [color, setColor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.getMaterials().then(setMaterials).catch(() => setError('Failed to load materials'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !materialId) { setError('Select a file and material'); return; }
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('stl_file', file);
      fd.append('material_id', materialId);
      fd.append('quality', quality);
      fd.append('infill', String(infill));
      fd.append('color', color);
      const order = await api.createOrder(fd);
      setResult(order);
      if (onQuote) onQuote(order);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ ...styles.form, background: colors.card, borderColor: colors.cardBorder }}>
      <div style={styles.header}>
        <h3 style={{ ...styles.title, color: colors.text }}>Upload STL File</h3>
        <p style={{ ...styles.subtitle, color: colors.textSecondary }}>Configure your print settings below</p>
      </div>

      {error && (
        <div style={styles.error}>
          <span style={styles.errorIcon}>&#9888;</span>
          {error}
        </div>
      )}
      {result && (
        <div style={styles.success}>
          <span style={styles.successIcon}>&#10003;</span>
          Order #{result.id} created! Quote: <strong>{(result.quote_cents / 100).toFixed(2)} ETB</strong>
        </div>
      )}

      <div style={styles.field}>
        <label>STL File</label>
        <div style={styles.fileDrop}>
          <input
            type="file"
            accept=".stl"
            onChange={(e) => setFile(e.target.files[0])}
            style={styles.fileInput}
            id="stl-upload"
          />
          <label htmlFor="stl-upload" style={{ ...styles.fileLabel, background: colors.input, borderColor: colors.inputBorder, color: colors.textSecondary }}>
            <span style={styles.fileIcon}>&#9650;</span>
            {file ? file.name : 'Click to select or drag STL file'}
          </label>
        </div>
      </div>

      <div style={styles.field}>
        <label>Material</label>
        <select value={materialId} onChange={(e) => setMaterialId(e.target.value)} style={{ ...styles.select, background: colors.input, borderColor: colors.inputBorder, color: colors.text }}>
          <option value="">-- Select Material --</option>
          {materials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} — {m.color} ({(m.price_per_cm3 / 100).toFixed(2)} ETB/cm³)
            </option>
          ))}
        </select>
      </div>

      <div style={styles.row}>
        <div style={styles.half}>
          <label>Quality</label>
          <select value={quality} onChange={(e) => setQuality(e.target.value)} style={{ ...styles.select, background: colors.input, borderColor: colors.inputBorder, color: colors.text }}>
            <option value="draft">Draft</option>
            <option value="standard">Standard</option>
            <option value="fine">Fine</option>
          </select>
        </div>
        <div style={styles.half}>
          <label>Infill — {infill}%</label>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={infill}
            onChange={(e) => setInfill(Number(e.target.value))}
            style={styles.range}
          />
        </div>
      </div>

      <div style={styles.field}>
        <label>Color (optional)</label>
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Color"
          style={{ ...styles.input, background: colors.input, borderColor: colors.inputBorder, color: colors.text }}
        />
      </div>

      <button type="submit" disabled={submitting} style={styles.btn}>
        {submitting ? 'Submitting...' : 'Place Order'}
      </button>
    </form>
  );
}

const styles = {
  form: {
    maxWidth: 540,
    margin: '0 auto',
    padding: 32,
    borderRadius: 16,
    border: '1px solid',
    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  field: {
    marginBottom: 20,
  },
  fileDrop: {
    position: 'relative',
  },
  fileInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
    top: 0,
    left: 0,
  },
  fileLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '16px 20px',
    border: '2px dashed',
    borderRadius: 12,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  fileIcon: {
    color: '#6366f1',
    fontSize: 18,
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: '1.5px solid',
    fontSize: 14,
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: '1.5px solid',
    fontSize: 14,
    boxSizing: 'border-box',
  },
  row: {
    display: 'flex',
    gap: 16,
    marginBottom: 20,
  },
  half: {
    flex: 1,
  },
  range: {
    width: '100%',
    marginTop: 8,
    accentColor: '#6366f1',
  },
  btn: {
    width: '100%',
    padding: '14px 0',
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
  errorIcon: { fontSize: 16 },
  success: {
    background: '#f0fdf4',
    color: '#166534',
    padding: '12px 16px',
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 14,
    border: '1px solid #bbf7d0',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  successIcon: { fontSize: 16, color: '#16a34a' },
};
