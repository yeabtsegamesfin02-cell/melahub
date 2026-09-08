export default function SearchBar({ value, onChange, placeholder = 'Search opportunities...' }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '0.9rem 1rem',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        fontSize: '1rem',
      }}
    />
  );
}
