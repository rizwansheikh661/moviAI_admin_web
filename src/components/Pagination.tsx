'use client';

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
};

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pages = buildPageList(page, totalPages);

  return (
    <div
      className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-3 mt-2"
      style={{ borderTop: '1px solid var(--brand-border)', fontSize: '0.8rem' }}
    >
      <div className="d-flex align-items-center gap-2" style={{ color: 'var(--brand-text-muted)' }}>
        <span>
          Showing <strong style={{ color: 'var(--brand-secondary)' }}>{from}</strong>–
          <strong style={{ color: 'var(--brand-secondary)' }}>{to}</strong> of{' '}
          <strong style={{ color: 'var(--brand-secondary)' }}>{total}</strong>
        </span>
        {onPageSizeChange && (
          <>
            <span className="ms-2">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="form-select form-select-sm"
              style={{ width: 72, fontSize: '0.78rem', padding: '0.25rem 1.5rem 0.25rem 0.5rem' }}
            >
              {pageSizeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <div className="d-flex align-items-center gap-1">
        <PagerBtn disabled={page <= 1} onClick={() => onPageChange(page - 1)} title="Previous">
          <i className="bi bi-chevron-left" />
        </PagerBtn>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} style={{ padding: '0 6px', color: 'var(--brand-text-muted)' }}>
              …
            </span>
          ) : (
            <PagerBtn key={p} active={p === page} onClick={() => onPageChange(p)}>
              {p}
            </PagerBtn>
          )
        )}
        <PagerBtn disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} title="Next">
          <i className="bi bi-chevron-right" />
        </PagerBtn>
      </div>
    </div>
  );
}

function PagerBtn({
  children,
  active,
  disabled,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        minWidth: 28,
        height: 28,
        padding: '0 8px',
        fontSize: '0.78rem',
        fontWeight: active ? 700 : 500,
        borderRadius: 7,
        border: `1px solid ${active ? 'var(--brand-primary)' : 'var(--brand-border)'}`,
        background: active ? 'var(--brand-primary)' : '#fff',
        color: active ? '#0a1633' : 'var(--brand-secondary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </button>
  );
}

function buildPageList(page: number, totalPages: number): (number | '…')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | '…')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) pages.push('…');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push('…');
  pages.push(totalPages);
  return pages;
}
