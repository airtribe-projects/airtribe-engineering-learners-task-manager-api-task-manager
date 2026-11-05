export default function StatsPanel({ stats, onBuild, building }) {
  return (
    <aside className="stats">
      <div>
        <div className="stats__big">{stats?.total_chunks ?? "—"}</div>
        <div className="muted">indexed chunks</div>
      </div>
      <div className="stats__meta">
        <div className="muted">{stats?.embedding_model ?? "no index"}</div>
        <button
          className="btn btn--ghost"
          onClick={onBuild}
          disabled={building}
        >
          {building ? "Rebuilding…" : "Rebuild index"}
        </button>
      </div>
    </aside>
  );
}
