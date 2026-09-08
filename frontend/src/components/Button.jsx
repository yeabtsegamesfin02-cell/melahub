export default function Button({ children, variant = 'primary', onClick, type = 'button' }) {
  const styles = {
    primary: {
      background: '#0f766e',
      color: '#fff',
    },
    secondary: {
      background: '#e2e8f0',
      color: '#0f172a',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        ...styles[variant],
        border: 'none',
        borderRadius: '10px',
        padding: '0.8rem 1.1rem',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
