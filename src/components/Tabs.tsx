'use client';

export type TabDef = { key: string; label: string; icon?: string };

type Props = {
  tabs: TabDef[];
  activeKey: string;
  onChange: (key: string) => void;
};

export default function Tabs({ tabs, activeKey, onChange }: Props) {
  return (
    <div
      className="d-inline-flex flex-wrap gap-1 p-1 mb-3"
      style={{
        background: 'var(--brand-bg-page)',
        border: '1px solid var(--brand-border)',
        borderRadius: 999,
      }}
    >
      {tabs.map((t) => {
        const active = t.key === activeKey;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            style={{
              border: 'none',
              borderRadius: 999,
              padding: '0.45rem 0.95rem',
              fontSize: '0.82rem',
              fontWeight: active ? 700 : 500,
              background: active ? 'var(--brand-primary)' : 'transparent',
              color: active ? '#0a1633' : 'var(--brand-text)',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {t.icon && <i className={`bi bi-${t.icon}`} />}
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
