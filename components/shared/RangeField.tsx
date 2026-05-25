"use client";

import { GOLD, MUTED } from "@/lib/constants";

type RangeFieldProps = {
  field: {
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
    marks: { v: number; l: string }[];
  };
  value: number | null | undefined;
  onChange: (v: number) => void;
};

export function RangeField({ field, value, onChange }: RangeFieldProps) {
  const defVal = field.min + Math.round((field.max - field.min) / 2 / field.step) * field.step;
  const val = value !== null && value !== undefined ? value : defVal;
  const pct = Math.round(((val - field.min) / (field.max - field.min)) * 100);
  const bg = `linear-gradient(90deg, ${GOLD} ${pct}%, #E8DCC8 ${pct}%)`;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span className="lbl" style={{ margin: 0 }}>{field.label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: GOLD }}>{val} {field.unit}</span>
      </div>
      <input
        type="range"
        className="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={val}
        style={{ background: bg }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        {field.marks.map((m) => (
          <span key={m.v} style={{ fontSize: 10, color: MUTED }}>{m.l}</span>
        ))}
      </div>
    </div>
  );
}
