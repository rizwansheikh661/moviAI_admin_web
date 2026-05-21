'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageHeader from '@/components/PageHeader';
import { settingsApi } from '@/lib/api/resources';
import { ApiError } from '@/lib/api/client';

type GenericObj = Record<string, unknown>;

const DEFAULT_FLAGS = ['surge', 'loyalty', 'whatsapp', 'email_otp', 'phone_otp', 'google_oauth', 'apple_oauth'];

function asString(v: unknown, fb = ''): string {
  return v === null || v === undefined ? fb : String(v);
}
function asBool(v: unknown, fb = false): boolean {
  return typeof v === 'boolean' ? v : fb;
}

export default function AdminSettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => settingsApi.get().then((r) => r.data),
  });

  const [general, setGeneral] = useState<GenericObj>({});
  const [fareDefaults, setFareDefaults] = useState<GenericObj>({});
  const [matching, setMatching] = useState<GenericObj>({});
  const [featureFlags, setFeatureFlags] = useState<GenericObj>({});

  useEffect(() => {
    if (!data) return;
    setGeneral((data.general as GenericObj) ?? {});
    setFareDefaults((data.fareDefaults as GenericObj) ?? {});
    setMatching((data.matching as GenericObj) ?? {});
    setFeatureFlags((data.featureFlags as GenericObj) ?? {});
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      settingsApi.update({
        general,
        fareDefaults,
        matching,
        featureFlags,
      }),
    onSuccess: () => {
      toast.success('Settings saved. Changes are now live across the platform.');
      qc.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't save settings. Please try again."),
  });

  const updateGeneral = (k: string, v: unknown) => setGeneral((prev) => ({ ...prev, [k]: v }));
  const updateFare = (k: string, v: unknown) => setFareDefaults((prev) => ({ ...prev, [k]: v }));
  const updateMatching = (k: string, v: unknown) => setMatching((prev) => ({ ...prev, [k]: v }));
  const toggleFlag = (k: string) => setFeatureFlags((prev) => ({ ...prev, [k]: !asBool(prev[k]) }));

  const flagKeys = Array.from(new Set([...DEFAULT_FLAGS, ...Object.keys(featureFlags)]));

  if (isLoading) return <div className="text-center text-muted py-5">Loading settings…</div>;
  if (isError) {
    return (
      <div className="alert alert-danger" role="alert">
        We couldn't load settings. {(error as Error)?.message}
      </div>
    );
  }

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
            <Field label="App name" value={asString(general.app_name, 'MoviAI')} onChange={(v) => updateGeneral('app_name', v)} />
            <SelectField
              label="Currency"
              value={asString(general.currency, 'EUR')}
              onChange={(v) => updateGeneral('currency', v)}
              options={[{ v: 'EUR', l: 'EUR — Euro' }]}
              disabled
            />
            <SelectField
              label="Default locale"
              value={asString(general.locale, 'en')}
              onChange={(v) => updateGeneral('locale', v)}
              options={[
                { v: 'en', l: 'English' },
                { v: 'de', l: 'Deutsch' },
                { v: 'fr', l: 'Français' },
              ]}
            />
            <SelectField
              label="Timezone"
              value={asString(general.timezone, 'Europe/Berlin')}
              onChange={(v) => updateGeneral('timezone', v)}
              options={[
                { v: 'Europe/Berlin', l: 'Europe/Berlin' },
                { v: 'Europe/Paris', l: 'Europe/Paris' },
                { v: 'Europe/London', l: 'Europe/London' },
                { v: 'Europe/Madrid', l: 'Europe/Madrid' },
              ]}
            />
            <Field label="Support email" value={asString(general.support_email)} onChange={(v) => updateGeneral('support_email', v)} />
            <Field label="Support phone" value={asString(general.support_phone)} onChange={(v) => updateGeneral('support_phone', v)} />
          </div>
        </Section>

        <Divider />

        <Section title="Fare defaults">
          <div className="row g-3">
            <Field label="Base amount (€)" type="number" value={asString(fareDefaults.base_amount)} onChange={(v) => updateFare('base_amount', Number(v))} />
            <Field label="Per km (€)" type="number" value={asString(fareDefaults.per_km)} onChange={(v) => updateFare('per_km', Number(v))} />
            <Field label="Per minute (€)" type="number" value={asString(fareDefaults.per_minute)} onChange={(v) => updateFare('per_minute', Number(v))} />
            <Field label="Minimum fare (€)" type="number" value={asString(fareDefaults.min_fare)} onChange={(v) => updateFare('min_fare', Number(v))} />
            <Field label="Tax %" type="number" value={asString(fareDefaults.tax_pct)} onChange={(v) => updateFare('tax_pct', Number(v))} />
          </div>
        </Section>

        <Divider />

        <Section title="Matching">
          <div className="row g-3">
            <Field label="Offer TTL (seconds)" type="number" value={asString(matching.offer_ttl_sec)} onChange={(v) => updateMatching('offer_ttl_sec', Number(v))} />
            <Field label="Max candidates" type="number" value={asString(matching.max_candidates)} onChange={(v) => updateMatching('max_candidates', Number(v))} />
            <Field label="Radius steps (m)" value={asString(matching.radius_steps_m)} onChange={(v) => updateMatching('radius_steps_m', v)} />
          </div>
        </Section>

        <Divider />

        <Section title="Feature flags">
          <div className="row g-2">
            {flagKeys.map((key) => (
              <div key={key} className="col-12 col-md-6">
                <div
                  className="d-flex align-items-center justify-content-between p-3"
                  style={{
                    background: '#fff',
                    border: '1px solid var(--brand-border)',
                    borderRadius: 10,
                  }}
                >
                  <span style={{ fontSize: '0.88rem', color: 'var(--brand-secondary)', textTransform: 'capitalize' }}>
                    {key.replace(/_/g, ' ')}
                  </span>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={asBool(featureFlags[key])}
                      onChange={() => toggleFlag(key)}
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
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
          >
            {saveMutation.isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h6 style={{ color: 'var(--brand-secondary)', fontWeight: 700, marginBottom: 12 }}>{title}</h6>
      {children}
    </div>
  );
}

function Divider() {
  return <hr style={{ margin: '1.5rem 0', borderColor: 'var(--brand-border)' }} />;
}

function Field({
  label, value, onChange, type = 'text',
}: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="col-md-6">
      <label className="form-label" style={{ fontSize: '0.78rem' }}>{label}</label>
      <input className="form-control" value={value} type={type} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function SelectField({
  label, options, value, onChange, disabled,
}: {
  label: string;
  options: { v: string; l: string }[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="col-md-6">
      <label className="form-label" style={{ fontSize: '0.78rem' }}>{label}</label>
      <select className="form-select" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.v} value={o.v}>{o.l}</option>
        ))}
      </select>
    </div>
  );
}
