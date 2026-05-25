"use client";

export function TileOpt({ emoji, label, selected, onClick }: { emoji: string; label: string; selected: boolean; onClick: () => void }) {
  return (
    <div className={selected ? "tile tile-sel" : "tile"} onClick={onClick}>
      <div className="tile-icon">{emoji}</div>
      <span style={{ fontSize: 14, fontWeight: selected ? 500 : 400, flex: 1 }}>{label}</span>
      <div className="tile-check">{selected ? "v" : ""}</div>
    </div>
  );
}
