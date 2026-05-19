'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';

const TABS = ['Platform', 'Branding', 'Integrations', 'Security'] as const;
type Tab = (typeof TABS)[number];

export default function SuperSettingsPage() {
  const [tab, setTab] = useState<Tab>('Platform');

  return (
    <div>
      <PageHeader title="Settings" subtitle="Platform-wide configuration" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card"
        style={{ padding: 0 }}
      >
        <div className="d-flex gap-1 px-3 pt-2" style={{ borderBottom: '1px solid var(--brand-border)' }}>
          {TABS.map((t) => {
            const active = t === tab;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '0.6rem 0.9rem',
                  fontSize: '0.82rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? 'var(--brand-secondary)' : 'var(--brand-text-muted)',
                  borderBottom: active ? '2px solid var(--brand-primary)' : '2px solid transparent',
                  marginBottom: -1,
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="p-4">
          {tab === 'Platform' && (
            <div className="row g-3" style={{ maxWidth: 640 }}>
              <Field label="Platform name" value="MoviAI" />
              <Field label="Default currency" value="EUR" />
              <Field label="Default timezone" value="Europe/Berlin" />
              <Field label="Default locale" value="en-GB" />
              <div className="col-12 d-flex justify-content-end pt-2">
                <button className="btn btn-primary btn-sm">Save changes</button>
              </div>
            </div>
          )}
          {tab === 'Branding' && (
            <div className="row g-3" style={{ maxWidth: 640 }}>
              <Field label="Brand name" value="MoviAI" />
              <Field label="Primary color" value="#a8d729" />
              <Field label="Secondary color" value="#0a1633" />
              <Field label="Logo URL" value="/logo.svg" mono />
              <div className="col-12 d-flex justify-content-end pt-2">
                <button className="btn btn-primary btn-sm">Save changes</button>
              </div>
            </div>
          )}
          {tab === 'Integrations' && (
            <div className="d-flex flex-column gap-2" style={{ maxWidth: 640 }}>
              <IntegrationRow name="Stripe" status="Connected" icon="credit-card" />
              <IntegrationRow name="Google Maps" status="Connected" icon="map" />
              <IntegrationRow name="MSG91 SMS" status="Connected" icon="chat-dots" />
              <IntegrationRow name="Postmark Email" status="Connected" icon="envelope" />
              <IntegrationRow name="Pusher Channels" status="Pending" icon="broadcast" />
              <IntegrationRow name="WhatsApp Business" status="Not configured" icon="whatsapp" />
            </div>
          )}
          {tab === 'Security' && (
            <div className="row g-3" style={{ maxWidth: 640 }}>
              <Toggle label="Require 2FA for all super admins" enabled />
              <Toggle label="IP allowlist for super admin login" enabled={false} />
              <Toggle label="Audit log retention (365 days)" enabled />
              <Toggle label="Force password rotation every 90 days" enabled={false} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="col-md-6">
      <label className="form-label">{label}</label>
      <input
        className="form-control"
        defaultValue={value}
        style={{ fontFamily: mono ? 'ui-monospace, monospace' : undefined, fontSize: '0.85rem' }}
      />
    </div>
  );
}

function IntegrationRow({ name, status, icon }: { name: string; status: string; icon: string }) {
  const connected = status === 'Connected';
  return (
    <div
      className="d-flex align-items-center justify-content-between p-3"
      style={{ background: '#fff', border: '1px solid var(--brand-border)', borderRadius: 10 }}
    >
      <div className="d-flex align-items-center gap-3">
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'var(--brand-bg-page)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-secondary)',
          }}
        >
          <i className={`bi bi-${icon}`} />
        </span>
        <div>
          <div style={{ fontWeight: 600, color: 'var(--brand-secondary)', fontSize: '0.88rem' }}>{name}</div>
          <div style={{ fontSize: '0.72rem', color: connected ? '#16a34a' : 'var(--brand-text-muted)' }}>
            <i className={`bi bi-${connected ? 'check-circle-fill' : 'circle'} me-1`} /> {status}
          </div>
        </div>
      </div>
      <button className="btn btn-outline-secondary btn-sm">{connected ? 'Configure' : 'Connect'}</button>
    </div>
  );
}

function Toggle({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="col-12 d-flex align-items-center justify-content-between p-3" style={{ background: '#fff', border: '1px solid var(--brand-border)', borderRadius: 10 }}>
      <span style={{ fontSize: '0.88rem', color: 'var(--brand-secondary)' }}>{label}</span>
      <div className="form-check form-switch m-0">
        <input className="form-check-input" type="checkbox" defaultChecked={enabled} style={{ cursor: 'pointer' }} />
      </div>
    </div>
  );
}
