"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export function inputClass() {
  return "w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition-colors focus:border-[#0a7ea4] focus:ring-2 focus:ring-[#0a7ea4]/15";
}

export function sectionClass() {
  return "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e5e7eb] sm:p-8";
}

export function FormField({ label, id, required, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[#0b1a33]">
        {label}
        {required ? <span className="text-[#b03a2e]"> *</span> : null}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-[#6b7280]">{hint}</p> : null}
    </div>
  );
}

export function SectionHeader({ title, description }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#0b1a33]">{title}</h2>
      {description ? <p className="mt-1 text-sm text-[#6b7280]">{description}</p> : null}
    </div>
  );
}

export function YesNoSelect({ id, value, onChange, required }) {
  return (
    <select id={id} value={value} onChange={onChange} className={inputClass()} required={required}>
      <option value="">Select</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  );
}

export function CheckboxGroup({ options, values, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 text-sm text-[#1f2937]">
          <input
            type="checkbox"
            checked={values.includes(option)}
            onChange={(event) => onChange(option, event.target.checked)}
            className="h-4 w-4 rounded border-[#d1d5db] text-[#0a7ea4] focus:ring-[#0a7ea4]"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

export async function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function FileUploadField({ id, label, required, value, onChange, accept, hint }) {
  return (
    <FormField label={label} id={id} required={required} hint={hint}>
      <input
        id={id}
        type="file"
        accept={accept || "*/*"}
        onChange={onChange}
        className={inputClass()}
        required={required && !value}
      />
      {value ? (
        typeof value === "string" && value.startsWith("data:image") ? (
          <img
            src={value}
            alt={`${label} preview`}
            className="mt-3 h-32 w-full rounded-lg border border-[#e5e7eb] object-cover"
          />
        ) : (
          <p className="mt-2 text-xs text-[#0a7ea4]">Document uploaded</p>
        )
      ) : null}
    </FormField>
  );
}

export function MultiPhotoUpload({ id, label, required, values, onChange, hint }) {
  return (
    <FormField label={label} id={id} required={required} hint={hint}>
      <input
        id={id}
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        className={inputClass()}
        required={required && values.length === 0}
      />
      {values.length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {values.map((src, index) => (
            <img
              key={`${id}-${index}`}
              src={src}
              alt={`${label} ${index + 1}`}
              className="h-24 w-full rounded-lg border border-[#e5e7eb] object-cover"
            />
          ))}
        </div>
      ) : null}
    </FormField>
  );
}

export function OtpVerificationField({
  label,
  valueId,
  otpId,
  value,
  otp,
  verified,
  onValueChange,
  onOtpChange,
  onVerifiedChange,
  type,
  required,
  inputType = "text",
  placeholder,
}) {
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  async function sendOtp() {
    if (!value.trim()) {
      toast.error(`Enter ${label.toLowerCase()} first`);
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/partner/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", type, value }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send OTP");
      toast.success(`OTP sent to ${label.toLowerCase()}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  }

  async function verifyOtp() {
    if (!otp.trim()) {
      toast.error("Enter OTP");
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch("/api/partner/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", type, value, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid OTP");
      onVerifiedChange(true);
      toast.success(`${label} verified successfully`);
    } catch (error) {
      onVerifiedChange(false);
      toast.error(error.message);
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="space-y-3">
      <FormField label={label} id={valueId} required={required}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={valueId}
            type={inputType}
            value={value}
            onChange={onValueChange}
            placeholder={placeholder}
            className={inputClass()}
            required={required}
            disabled={verified}
          />
          <button
            type="button"
            onClick={sendOtp}
            disabled={sending || verified}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[#0a7ea4] px-4 py-3 text-sm font-semibold text-[#0a7ea4] transition hover:bg-[#0a7ea4]/5 disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send OTP"}
          </button>
        </div>
      </FormField>

      <FormField label={`${label} OTP`} id={otpId}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={otpId}
            type="text"
            value={otp}
            onChange={onOtpChange}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className={inputClass()}
            disabled={verified}
          />
          <button
            type="button"
            onClick={verifyOtp}
            disabled={verifying || verified}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#0a7ea4] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#086688] disabled:opacity-60"
          >
            {verified ? "Verified" : verifying ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
        {verified ? (
          <p className="mt-1 text-xs font-medium text-[#0a7ea4]">Verification complete</p>
        ) : null}
      </FormField>
    </div>
  );
}
