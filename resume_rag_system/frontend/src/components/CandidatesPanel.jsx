import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function CandidatesPanel() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(null);
  const [resumeText, setResumeText] = useState("");

  useEffect(() => {
    api
      .candidates()
      .then((d) => setRows(d.candidates))
      .catch((e) => setError(e.message));
  }, []);

  async function openCandidate(name) {
    setOpen(name);
    setResumeText("Loading…");
    try {
      const { content } = await api.resume(name);
      setResumeText(content);
    } catch (e) {
      setResumeText(`Failed to load: ${e.message}`);
    }
  }

  if (error) return <div className="banner banner--error">{error}</div>;
  if (!rows) return <div className="placeholder">Loading…</div>;
  if (rows.length === 0)
    return (
      <div className="placeholder">
        Index is empty. Click <strong>Rebuild index</strong> in the header.
      </div>
    );

  return (
    <div className="grid">
      <section className="card">
        <h2>{rows.length} candidates</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Years</th>
              <th>Education</th>
              <th>Skills</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={c.candidate_name}
                className={open === c.candidate_name ? "row--active" : ""}
                onClick={() => openCandidate(c.candidate_name)}
              >
                <td>{c.candidate_name}</td>
                <td>{c.years_experience}</td>
                <td>{c.highest_education || "—"}</td>
                <td className="muted">
                  {c.skills.slice(0, 5).join(", ")}
                  {c.skills.length > 5 ? "…" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="card">
        <h2>{open || "Select a candidate"}</h2>
        {open ? (
          <pre className="resume">{resumeText}</pre>
        ) : (
          <div className="placeholder">
            Click a row to preview the raw resume text.
          </div>
        )}
      </section>
    </div>
  );
}
