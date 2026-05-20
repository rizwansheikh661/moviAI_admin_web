'use client';

import { ReactNode } from 'react';
import { Modal as RBModal } from 'react-bootstrap';

type Props = {
  show: boolean;
  onHide: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'lg' | 'xl';
};

export default function Modal({ show, onHide, title, children, footer, size }: Props) {
  return (
    <RBModal show={show} onHide={onHide} size={size} centered>
      <RBModal.Header closeButton style={{ borderBottom: '1px solid var(--brand-border)' }}>
        <RBModal.Title
          style={{
            color: 'var(--brand-secondary)',
            fontWeight: 700,
            fontSize: '1rem',
          }}
        >
          {title}
        </RBModal.Title>
      </RBModal.Header>
      <RBModal.Body style={{ padding: '1.25rem 1.5rem' }}>{children}</RBModal.Body>
      {footer && (
        <RBModal.Footer style={{ borderTop: '1px solid var(--brand-border)' }}>
          {footer}
        </RBModal.Footer>
      )}
    </RBModal>
  );
}
