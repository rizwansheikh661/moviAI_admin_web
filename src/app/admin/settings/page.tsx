'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';

const TABS = ['Profile', 'Branding', 'Notifications', 'Team'] as const;
type Tab = (typeof TABS)[number];

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<Tab>('Profile');

  return (
    <div>
      <PageHeader title="Settings" subtitle="Your tenant workspace" />

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
          {tab === 'Profile' && (
            <div className="row g-3" style={{ maxWidth: 640 }}>
              <Field label="Workspace name" value="CityRide UK" />
              <Field label="Slug" value="cityride-uk" mono />
              <Field label="Country" value="United Kingdom" />
              <Field label="Currency" value="GBP" />
              <Field label="Timezone" value="Europe/London" />
              <Field label="Support email" value="support@cityride.uk" />
              <div className="col-12 d-flex justify-content-end pt-2">
                <button className="btn btn-primary btn-sm">Save changes</button>
              </div>
            </div>
          )}
          {tab === 'Branding' && (
            <div className="row g-3" style={{ maxWidth: 640 }}>
              <Field label="Brand name" value="CityRide" />
              <Field label="Primary color" value="#a8d729" />
              <div className="col-12">
                <label className="form-label">Logo</label>
                <div
                  className="d-flex align-items-center gap-3 p-3"
                  style={{ background: '#fff', border: '1px dashed var(--brand-border-strong)', borderRadius: 10 }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 8,
                      background: 'var(--brand-bg-page)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand-secondary)',
                      fontSize: '1.4rem',
                    }}
                  >
                    <i className="bi bi-image" />
                  </div>
                  <div className="flex-grow-1">
                    <div style={{ fontSize: '0.82rem', color: 'var(--brand-secondary)', fontWeight: 600 }}>No logo uploaded</div>
                    <small style={{ color: 'var(--brand-text-muted)' }}>PNG or SVG, max 2 MB</small>
                  </div>
                  <button className="btn btn-outline-secondary btn-sm">Upload</button>
                </div>
              </div>
            </div>
          )}
          {tab === 'Notifications' && (
            <div className="row g-3" style={{ maxWidth: 640 }}>
              <Toggle label="Email alerts for ride cancellations" enabled />
              <Toggle label="Daily revenue digest" enabled />
              <Toggle label="Driver onboarding completion" enabled={false} />
              <Toggle label="Weekly performance report" enabled />
            </div>
          )}
          {tab === 'Team' && (
            <div className="text-center" style={{ color: 'var(--brand-text-muted)', padding: '2rem 0' }}>
              <i className="bi bi-people" style={{ fontSize: '1.5rem', display: 'block', marginBottom: 8 }} />
              <div style={{ fontSize: '0.85rem' }}>Team management coming in Phase 2</div>
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
