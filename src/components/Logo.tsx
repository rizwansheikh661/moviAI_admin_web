export type LogoSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<LogoSize, { fontSize: string; letterSpacing: string }> = {
  sm: { fontSize: '1.25rem', letterSpacing: '-0.02em' },
  md: { fontSize: '1.75rem', letterSpacing: '-0.02em' },
  lg: { fontSize: '2.5rem', letterSpacing: '-0.025em' },
};

export default function Logo({ size = 'md' }: { size?: LogoSize }) {
  const { fontSize, letterSpacing } = sizeMap[size];
  return (
    <span
      style={{
        fontFamily: 'Inter, sans-serif',
        fontWeight: 800,
        fontSize,
        letterSpacing,
        fontStyle: 'italic',
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      <span style={{ color: 'var(--brand-primary)' }}>Movi</span>
      <span style={{ color: 'var(--brand-secondary)' }}>AI</span>
    </span>
  );
}
