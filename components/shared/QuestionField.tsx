"use client";

import { Chip } from "./Chip";
import { TileOpt } from "./TileOpt";
import { RangeField } from "./RangeField";
import type { Question } from "@/lib/questions";

type QuestionFieldProps = {
  q: Question;
  value: unknown;
  onChange: (v: unknown) => void;
};

export function QuestionField({ q, value, onChange }: QuestionFieldProps) {
  if (q.type === "range") {
    return <RangeField field={q} value={typeof value === "number" ? value : null} onChange={(v) => onChange(v)} />;
  }

  if (q.type === "chips") {
    const multi = q.multi;
    function isSel(opt: string) {
      return multi ? Array.isArray(value) && (value as string[]).includes(opt) : value === opt;
    }
    function toggle(opt: string) {
      if (multi) {
        const arr = Array.isArray(value) ? (value as string[]) : [];
        onChange(arr.includes(opt) ? arr.filter((x) => x !== opt) : arr.concat([opt]));
      } else {
        onChange(value === opt ? null : opt);
      }
    }
    return (
      <div>
        <span className="lbl">{q.label}{multi ? " (plusieurs choix)" : ""}</span>
        <div className="chips-wrap">
          {q.opts.map((opt) => (
            <Chip key={opt} label={opt} selected={isSel(opt)} onClick={() => toggle(opt)} />
          ))}
        </div>
      </div>
    );
  }

  if (q.type === "tiles") {
    const multi = q.multi;
    function isSel(v: string) {
      return multi ? Array.isArray(value) && (value as string[]).includes(v) : value === v;
    }
    function toggle(v: string) {
      if (multi) {
        const arr = Array.isArray(value) ? (value as string[]) : [];
        onChange(arr.includes(v) ? arr.filter((x) => x !== v) : arr.concat([v]));
      } else {
        onChange(value === v ? null : v);
      }
    }
    return (
      <div>
        <span className="lbl">{q.label}{multi ? " (plusieurs choix)" : ""}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {q.opts.map((opt) => (
            <TileOpt key={opt.v} emoji={opt.e} label={opt.l} selected={isSel(opt.v)} onClick={() => toggle(opt.v)} />
          ))}
        </div>
      </div>
    );
  }

  return null;
}
