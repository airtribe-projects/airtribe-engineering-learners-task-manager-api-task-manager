import MatchCard from "./MatchCard.jsx";

export default function MatchList({ result, loading }) {
  if (loading) return <div className="placeholder">Searching the index…</div>;
  if (!result)
    return (
      <div className="placeholder">
        Submit a job description to see ranked candidates.
      </div>
    );

  const { top_matches: matches = [], diagnostics = {} } = result;

  return (
    <div className="results">
      <header className="results__header">
        <h2>Top matches</h2>
        <div className="diag">
          <span>{matches.length} shown</span>
          <span>•</span>
          <span>
            {diagnostics.candidates_after_filters}/{diagnostics.candidates_considered}{" "}
            after filters
          </span>
          <span>•</span>
          <span>{diagnostics.total_latency_ms} ms</span>
        </div>
      </header>

      {matches.length === 0 ? (
        <div className="placeholder">
          No candidates matched the hard filters. Try loosening the years /
          education requirement.
        </div>
      ) : (
        <ol className="results__list">
          {matches.map((m, idx) => (
            <MatchCard key={m.candidate_name} match={m} rank={idx + 1} />
          ))}
        </ol>
      )}
    </div>
  );
}
