export default function MatchCard({ match, rank }) {
  const scoreClass =
    match.match_score >= 75
      ? "score score--high"
      : match.match_score >= 50
      ? "score score--mid"
      : "score score--low";

  return (
    <li className="match">
      <header className="match__header">
        <div>
          <span className="match__rank">#{rank}</span>
          <h3>{match.candidate_name}</h3>
          <p className="muted">
            {match.years_experience} yrs · {match.highest_education || "—"}
          </p>
        </div>
        <div className={scoreClass}>{match.match_score}</div>
      </header>

      <p className="match__reasoning">{match.reasoning}</p>

      <div className="chips">
        {match.matched_skills.map((s) => (
          <span key={s} className="chip chip--good">
            {s}
          </span>
        ))}
        {match.missing_must_have?.map((s) => (
          <span key={s} className="chip chip--bad">
            missing: {s}
          </span>
        ))}
      </div>

      {match.relevant_excerpts?.length > 0 && (
        <details className="match__excerpts">
          <summary>Show matching excerpts</summary>
          <ul>
            {match.relevant_excerpts.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </details>
      )}

      <footer className="match__footer muted">
        <span>semantic {match.semantic_score.toFixed(2)}</span>
        <span>keyword {match.keyword_score.toFixed(2)}</span>
        <span title={match.resume_path}>
          {match.resume_path.split(/[\\/]/).pop()}
        </span>
      </footer>
    </li>
  );
}
