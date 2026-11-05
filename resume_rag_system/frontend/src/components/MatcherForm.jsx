import { useEffect, useState } from "react";

const EDU_OPTIONS = [
  { value: "", label: "Any" },
  { value: "BACHELOR", label: "Bachelor's" },
  { value: "MASTER", label: "Master's" },
  { value: "PHD", label: "PhD" },
];

const EMPTY = {
  title: "",
  description: "",
  must_have_skills: "",
  nice_to_have_skills: "",
  min_years_experience: 0,
  min_education: "",
  top_k: 10,
  semantic_weight: 0.65,
  apply_hard_filters: true,
};

export default function MatcherForm({ jds, onSubmit, loading }) {
  const [form, setForm] = useState(EMPTY);
  const [selectedJd, setSelectedJd] = useState("");

  useEffect(() => {
    if (!selectedJd) return;
    const jd = jds.find((j) => j.id === selectedJd);
    if (!jd) return;
    setForm({
      title: jd.title || "",
      description: jd.description || "",
      must_have_skills: (jd.must_have_skills || []).join(", "),
      nice_to_have_skills: (jd.nice_to_have_skills || []).join(", "),
      min_years_experience: jd.min_years_experience || 0,
      min_education: jd.min_education || "",
      top_k: 10,
      semantic_weight: 0.65,
      apply_hard_filters: true,
    });
  }, [selectedJd, jds]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const toList = (s) =>
      s
        .split(",")
        .map((x) => x.trim().toLowerCase())
        .filter(Boolean);
    onSubmit({
      title: form.title,
      description: form.description,
      must_have_skills: toList(form.must_have_skills),
      nice_to_have_skills: toList(form.nice_to_have_skills),
      min_years_experience: Number(form.min_years_experience) || 0,
      min_education: form.min_education,
      top_k: Number(form.top_k) || 10,
      semantic_weight: Number(form.semantic_weight) || 0.65,
      apply_hard_filters: form.apply_hard_filters,
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Job description</h2>

      <label className="form__row">
        <span>Load a saved JD</span>
        <select
          value={selectedJd}
          onChange={(e) => setSelectedJd(e.target.value)}
        >
          <option value="">— pick one —</option>
          {jds.map((jd) => (
            <option key={jd.id} value={jd.id}>
              {jd.title || jd.id}
            </option>
          ))}
        </select>
      </label>

      <label className="form__row">
        <span>Title</span>
        <input
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Senior Machine Learning Engineer"
        />
      </label>

      <label className="form__row">
        <span>Description</span>
        <textarea
          rows={6}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Paste the JD prose here…"
        />
      </label>

      <label className="form__row">
        <span>Must-have skills (comma separated)</span>
        <input
          value={form.must_have_skills}
          onChange={(e) => update("must_have_skills", e.target.value)}
          placeholder="python, pytorch, transformers"
        />
      </label>

      <label className="form__row">
        <span>Nice-to-have skills</span>
        <input
          value={form.nice_to_have_skills}
          onChange={(e) => update("nice_to_have_skills", e.target.value)}
          placeholder="langchain, rag, aws"
        />
      </label>

      <div className="form__grid">
        <label className="form__row">
          <span>Min years experience</span>
          <input
            type="number"
            min={0}
            value={form.min_years_experience}
            onChange={(e) => update("min_years_experience", e.target.value)}
          />
        </label>

        <label className="form__row">
          <span>Min education</span>
          <select
            value={form.min_education}
            onChange={(e) => update("min_education", e.target.value)}
          >
            {EDU_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="form__row">
          <span>Top-K</span>
          <input
            type="number"
            min={1}
            max={50}
            value={form.top_k}
            onChange={(e) => update("top_k", e.target.value)}
          />
        </label>

        <label className="form__row">
          <span>Semantic weight ({form.semantic_weight})</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={form.semantic_weight}
            onChange={(e) => update("semantic_weight", e.target.value)}
          />
        </label>
      </div>

      <label className="form__check">
        <input
          type="checkbox"
          checked={form.apply_hard_filters}
          onChange={(e) => update("apply_hard_filters", e.target.checked)}
        />
        <span>Apply hard filters (years / education)</span>
      </label>

      <button className="btn btn--primary" disabled={loading} type="submit">
        {loading ? "Matching…" : "Find candidates"}
      </button>
    </form>
  );
}
