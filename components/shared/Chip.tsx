"use client";

export function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <span className={selected ? "chip chip-sel" : "chip"} onClick={onClick}>
      <span className="chip-dot" />
      {label}
    </span>
  );
}
