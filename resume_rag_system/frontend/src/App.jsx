import { useEffect, useState } from "react";
import { api } from "./api.js";
import MatcherForm from "./components/MatcherForm.jsx";
import MatchList from "./components/MatchList.jsx";
import StatsPanel from "./components/StatsPanel.jsx";
import CandidatesPanel from "./components/CandidatesPanel.jsx";

const TABS = [
  { id: "match", label: "Match" },
  { id: "candidates", label: "Candidates" },
];

export default function App() {
  const [tab, setTab] = useState("match");
  const [stats, setStats] = useState(null);
  const [jds, setJds] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [building, setBuilding] = useState(false);

  async function refreshStats() {
    try {
      setStats(await api.stats());
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    refreshStats();
    api.jds().then((d) => setJds(d.jds)).catch((e) => setError(e.message));
  }, []);

  async function handleBuild() {
    setBuilding(true);
    setError(null);
    try {
      await api.build();
      await refreshStats();
    } catch (e) {
      setError(e.message);
    } finally {
      setBuilding(false);
    }
  }

  async function handleMatch(payload) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await api.match(payload));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>Resume RAG</h1>
          <p className="muted">
            Hybrid semantic + keyword search over indexed resumes.
          </p>
        </div>
        <StatsPanel
          stats={stats}
          onBuild={handleBuild}
          building={building}
        />
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? "tab--active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {error && <div className="banner banner--error">{error}</div>}

      {tab === "match" && (
        <main className="grid">
          <section className="card">
            <MatcherForm jds={jds} onSubmit={handleMatch} loading={loading} />
          </section>
          <section className="card">
            <MatchList result={result} loading={loading} />
          </section>
        </main>
      )}

      {tab === "candidates" && (
        <main>
          <CandidatesPanel />
        </main>
      )}
    </div>
  );
}
