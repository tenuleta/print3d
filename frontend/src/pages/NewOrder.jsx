import UploadForm from '../components/UploadForm';
import { useTheme } from '../context/ThemeContext';

export default function NewOrder() {
  const { colors } = useTheme();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ ...styles.title, color: colors.text }}>Place a New Order</h2>
        <p style={{ ...styles.subtitle, color: colors.textSecondary }}>Upload your STL file and configure your print settings</p>
      </div>
      <UploadForm />
    </div>
  );
}

const styles = {
  container: { maxWidth: 620, margin: '0 auto', padding: '32px 24px' },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 14 },
};
