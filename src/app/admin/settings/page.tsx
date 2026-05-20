'use client';

import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import { APP_NAME, SUPPORT_EMAIL } from '@/config/app';

const FEATURE_FLAGS = [
  { key: 'surge', label: 'Surge', enabled: true },
  { key: 'loyalty', label: 'Loyalty', enabled: false },
  { key: 'whatsapp', label: 'WhatsApp', enabled: true },
  { key: 'email_otp', label: 'Email OTP', enabled: true },
  { key: 'phone_otp', label: 'Phone OTP', enabled: true },
  { key: 'google_oauth', label: 'Google OAuth', enabled: true },
  { key: 'apple_oauth', label: 'Apple OAuth', enabled: false },
];

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader title="Platform Settings" subtitle="Global configuration for MoviAI" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card"
        style={{ padding: '1.5rem 1.75rem' }}
      >
        <Section title="General">
          <div className="row g-3">
            <Field label="App name" defaultValue={APP_NAME} />
            <SelectField label="Currency" disabled options={[{ v: 'EUR', l: 'EUR — Euro' }]} value="EUR" />
            <SelectField
              label="Default locale"
              options={[
                { v: 'en', l: 'English' },
                { v: 'de', l: 'Deutsch' },
                { v: 'fr', l: 'Français' },
              ]}
              value="en"
            />
            <SelectField
              label="Timezone"
              options={[
                { v: 'Europe/Berlin', l: 'Europe/Berlin' },
                { v: 'Europe/Paris', l: 'Europe/Paris' },
                { v: 'Europe/London', l: 'Europe/London' },
                { v: 'Europe/Madrid', l: 'Europe/Madrid' },
              ]}
              value="Europe/Berlin"
            />
            <Field label="Support email" defaultValue={SUPPORT_EMAIL} />
            <Field label="Support phone" defaultValue="+49 30 1234 5678" />
          </div>
        </Section>

        <Divider />

        <Section title="Fare defaults">
          <div className="row g-3">
            <Field label="Base amount (€)" type="number" defaultValue="3.00" />
            <Field label="Per km (€)" type="number" defaultValue="1.20" />
            <Field label="Per minute (€)" type="number" defaultValue="0.30" />
            <Field label="Minimum fare (€)" type="number" defaultValue="5.00" />
            <Field label="Tax %" type="number" defaultValue="19.00" />
          </div>
        </Section>

        <Divider />

        <Section title="Matching">
          <div className="row g-3">
            <Field label="Offer TTL (seconds)" type="number" defaultValue="12" />
            <Field label="Max candidates" type="number" defaultValue="50" />
            <Field label="Radius steps (m)" defaultValue="2000,5000,10000" />
          </div>
        </Section>

        <Divider />

        <Section title="Feature flags">
          <div className="row g-2">
            {FEATURE_FLAGS.map((f) => (
              <div key={f.key} className="col-12 col-md-6">
                <div
                  className="d-flex align-items-center justify-content-between p-3"
                  style={{
                    background: '#fff',
                    border: '1px solid var(--brand-border)',
                    borderRadius: 10,
                  }}
                >
                  <span style={{ fontSize: '0.88rem', color: 'var(--brand-secondary)' }}>
                    {f.label}
                  </span>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultChecked={f.enabled}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div className="d-flex justify-content-end pt-3 mt-3" style={{ borderTop: '1px solid var(--brand-border)' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => alert('Settings saved. Real wiring next PR.')}
          >
            Save changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h6 style={{ color: 'var(--brand-secondary)', fontWeight: 700, marginBottom: 12 }}>
        {title}
      </h6>
      {children}
    </div>
  );
}

function Divider() {
  return <hr style={{ margin: '1.5rem 0', borderColor: 'var(--brand-border)' }} />;
}

function Field({
  label,
  defaultValue,
  type = 'text',
}: {
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div className="col-md-6">
      <label className="form-label" style={{ fontSize: '0.78rem' }}>
        {label}
      </label>
      <input className="form-control" defaultValue={defaultValue} type={type} />
    </div>
  );
}

function SelectField({
  label,
  options,
  value,
  disabled,
}: {
  label: string;
  options: { v: string; l: string }[];
  value: string;
  disabled?: boolean;
}) {
  return (
    <div className="col-md-6">
      <label className="form-label" style={{ fontSize: '0.78rem' }}>
        {label}
      </label>
      <select className="form-select" defaultValue={value} disabled={disabled}>
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </div>
  );
}
