type Tone = 'success' | 'info' | 'warning' | 'danger' | 'neutral';

const palette: Record<Tone, { bg: string; color: string }> = {
  success: { bg: 'rgba(168, 215, 41, 0.20)', color: '#5a7a14' },
  info: { bg: 'rgba(59, 130, 246, 0.14)', color: '#1d4ed8' },
  warning: { bg: 'rgba(245, 158, 11, 0.16)', color: '#b45309' },
  danger: { bg: 'rgba(239, 68, 68, 0.14)', color: '#b91c1c' },
  neutral: { bg: 'rgba(107, 114, 128, 0.14)', color: '#374151' },
};

export default function StatusBadge({ tone = 'neutral', children }: { tone?: Tone; children: React.ReactNode }) {
  const p = palette[tone];
  return (
    <span
      style={{
        background: p.bg,
        color: p.color,
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: '0.7rem',
        fontWeight: 600,
        textTransform: 'capitalize',
        display: 'inline-block',
        lineHeight: 1.5,
      }}
    >
      {children}
    </span>
  );
}
