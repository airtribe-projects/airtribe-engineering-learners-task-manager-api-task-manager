"""
generate_dataset.py — produce 30+ diverse resume text files and 5+ JDs.

This is part of the Milestone 2 deliverables: a reproducible synthetic
dataset that exercises the RAG pipeline across many roles and seniorities.
Run once (or any time you want a fresh dataset):

    python generate_dataset.py
"""

from __future__ import annotations

import json
import random
from pathlib import Path
from textwrap import dedent

ROOT = Path(__file__).resolve().parent
RESUMES_DIR = ROOT / "data" / "resumes"
JD_DIR = ROOT / "data" / "job_descriptions"


# ---------------------------------------------------------------------------
# Personas: 32 candidates, deliberately diverse in role, seniority, education.
# ---------------------------------------------------------------------------

PERSONAS = [
    # name, role, years, edu, primary_stack, secondary_stack, domain
    ("Aarav Patel",        "Senior Machine Learning Engineer", 8,  "MS",       ["Python", "PyTorch", "TensorFlow", "Transformers", "HuggingFace", "MLOps"], ["AWS", "Docker", "Kubernetes"], "fintech"),
    ("Sara Lindberg",      "ML Research Scientist",            6,  "PhD",      ["Python", "PyTorch", "NLP", "Transformers", "RAG", "LangChain"], ["LLM evaluation", "Statistics"], "research lab"),
    ("Diego Hernandez",    "Senior Backend Engineer (Python)", 9,  "BS",       ["Python", "FastAPI", "Django", "PostgreSQL", "Redis", "Kafka"], ["Docker", "AWS", "GraphQL"], "e-commerce"),
    ("Mei Tanaka",         "Backend Engineer (Go)",            5,  "BS",       ["Go", "gRPC", "PostgreSQL", "Kafka", "Redis"], ["Kubernetes", "Terraform"], "logistics"),
    ("Olivia Brennan",     "Frontend Engineer (React)",        4,  "BS",       ["JavaScript", "TypeScript", "React", "Redux", "Next.js"], ["GraphQL", "Jest"], "media"),
    ("Noah Kowalski",      "Senior Frontend Engineer",         7,  "BS",       ["TypeScript", "React", "Next.js", "Vue", "Webpack"], ["Node.js", "REST"], "saas"),
    ("Priya Iyer",         "Full-Stack Engineer",              5,  "BS",       ["Python", "Django", "React", "PostgreSQL"], ["Docker", "AWS"], "edtech"),
    ("Tomás Ferreira",     "Full-Stack Engineer",              3,  "BS",       ["JavaScript", "Node.js", "Express", "React", "MongoDB"], ["AWS"], "startup"),
    ("Hannah O'Connor",    "Data Engineer",                    6,  "MS",       ["Python", "SQL", "Spark", "Airflow", "Snowflake", "dbt"], ["AWS", "Kafka"], "retail"),
    ("Wei Zhang",          "Senior Data Engineer",             10, "MS",       ["Python", "Scala", "Spark", "Kafka", "Hadoop", "Airflow"], ["GCP", "BigQuery"], "ad-tech"),
    ("Linda Mwangi",       "Data Scientist",                   5,  "MS",       ["Python", "Pandas", "Scikit-learn", "Statistics", "SQL"], ["Tableau", "AWS"], "healthcare"),
    ("Felix Ostrowski",    "Senior Data Scientist",            8,  "PhD",      ["Python", "Scikit-learn", "PyTorch", "Statistics", "NLP"], ["Spark", "MLOps"], "insurance"),
    ("Ravi Subramanian",   "DevOps Engineer",                  4,  "BS",       ["Linux", "Bash", "Docker", "Kubernetes", "Terraform"], ["AWS", "Jenkins", "CI/CD"], "fintech"),
    ("Chloé Dubois",       "Senior SRE",                       9,  "BS",       ["Kubernetes", "Terraform", "Prometheus", "Linux", "Go"], ["AWS", "CI/CD"], "telecom"),
    ("Marcus Webb",        "Cloud Architect",                  12, "MS",       ["AWS", "Azure", "Terraform", "Kubernetes", "Python"], ["Networking", "Security"], "consulting"),
    ("Amelia Foster",      "Mobile Engineer (iOS)",            6,  "BS",       ["Swift", "iOS", "SwiftUI", "Objective-C"], ["REST", "GraphQL"], "consumer apps"),
    ("Jin Park",           "Mobile Engineer (Android)",        4,  "BS",       ["Kotlin", "Android", "Java"], ["REST", "Firebase"], "fintech"),
    ("Nadia Ali",          "Security Engineer",                7,  "MS",       ["Python", "Linux", "Networking", "Security", "Bash"], ["AWS", "Kubernetes"], "defense"),
    ("Ben Carter",         "QA Automation Engineer",           5,  "BS",       ["Python", "Selenium", "Pytest", "JavaScript"], ["CI/CD", "Docker"], "saas"),
    ("Isabella Rossi",     "Senior NLP Engineer",              7,  "MS",       ["Python", "PyTorch", "Transformers", "NLP", "HuggingFace", "RAG", "LangChain", "OpenAI"], ["AWS", "Docker"], "legal-tech"),
    ("Daniel Cohen",       "Computer Vision Engineer",         6,  "MS",       ["Python", "PyTorch", "Computer Vision", "TensorFlow", "OpenCV"], ["CUDA", "Docker"], "robotics"),
    ("Yuki Sato",          "MLOps Engineer",                   5,  "BS",       ["Python", "MLOps", "Kubernetes", "Airflow", "Docker"], ["AWS", "Terraform"], "fintech"),
    ("Sofia Garcia",       "Junior Software Engineer",         2,  "BS",       ["Python", "JavaScript", "React", "SQL"], ["Git", "Linux"], "startup"),
    ("Liam O'Brien",       "Engineering Manager",              13, "MS",       ["Python", "Java", "Leadership", "Mentoring", "Agile", "Scrum"], ["AWS", "System design"], "enterprise"),
    ("Zoe Anderson",       "Staff Software Engineer",          14, "MS",       ["Python", "Go", "Distributed systems", "PostgreSQL", "Kafka"], ["AWS", "Kubernetes"], "infra"),
    ("Hiroshi Yamada",     "Database Engineer",                8,  "MS",       ["PostgreSQL", "MySQL", "SQL", "Python", "Redis"], ["AWS", "Linux"], "fintech"),
    ("Anika Sharma",       "AI Product Engineer",              4,  "BS",       ["Python", "OpenAI", "Anthropic", "LangChain", "RAG", "Transformers"], ["FastAPI", "React"], "consumer ai"),
    ("Lucas Müller",       "Embedded Systems Engineer",        7,  "MS",       ["C++", "C", "Embedded", "Linux", "Python"], ["RTOS", "ARM"], "automotive"),
    ("Grace Thompson",     "Technical Program Manager",        10, "MBA",      ["Agile", "Scrum", "Leadership", "Communication", "SQL"], ["Python", "AWS"], "enterprise"),
    ("Omar Haddad",        "Blockchain Engineer",              5,  "BS",       ["Solidity", "Rust", "JavaScript", "Node.js"], ["Ethereum", "Smart contracts"], "web3"),
    ("Eva Novak",          "Game Developer",                   6,  "BS",       ["C++", "C#", "Unity", "Unreal", "Game design"], ["Python"], "gaming"),
    ("Kavya Rao",          "Junior Data Scientist",            1,  "MS",       ["Python", "Pandas", "Scikit-learn", "SQL", "Statistics"], ["Tableau"], "consulting"),
]


SUMMARY_TEMPLATES = [
    "{role} with {years}+ years of experience delivering production systems in {domain}. Strong in {stack0} and {stack1}, with a track record of shipping reliable software at scale.",
    "Pragmatic {role} ({years} yrs) specialising in {stack0}. Comfortable owning a feature end-to-end across {stack1} and partnering with product to ship outcomes, not just code.",
    "{role} who has spent {years} years in {domain}. Deep expertise in {stack0}, working knowledge of {stack1}, and a habit of writing testable, observable code.",
]

EXPERIENCE_TEMPLATES = [
    [
        ("Senior {role}", "{company}", "Jan {start} – Present",
         ["Led design and rollout of {stack0}-based services handling millions of requests/day.",
          "Mentored {n} engineers and ran the team's hiring loop.",
          "Drove a {pct}% reduction in latency by re-architecting the {stack1} layer.",
          "Owned the on-call rotation and the SLO dashboards."]),
        ("{role}", "{prev_company}", "Jun {prev_start} – Dec {prev_end}",
         ["Shipped features in {stack0} used by {users}+ active users.",
          "Built CI/CD pipelines that cut deploy time by {pct}%.",
          "Partnered with data and product to define metrics and instrumentation."]),
    ],
    [
        ("{role}", "{company}", "Mar {start} – Present",
         ["Designed and implemented {stack0} components for the core platform.",
          "Reduced infra cost by {pct}% by tuning {stack1} workloads.",
          "Wrote integration tests and runbooks adopted across the team."]),
        ("Junior {role}", "{prev_company}", "Sep {prev_start} – Feb {prev_end}",
         ["Contributed to {stack0} services and internal tooling.",
          "Participated in design reviews and on-call shadowing."]),
    ],
]

COMPANIES = ["Acme Systems", "Northwind", "Globex", "Initech", "Hooli", "Vandelay",
             "Wayne Tech", "Stark Industries", "Umbrella Labs", "Pied Piper",
             "Soylent", "Cyberdyne", "Massive Dynamic", "Tyrell", "Aperture"]

EDU_LINES = {
    "BS":  "Bachelor of Science in {field}\n{school} | {grad}",
    "MS":  "Master of Science in {field}\n{school} | {grad}",
    "PhD": "Ph.D. in {field}\n{school} | {grad}",
    "MBA": "Master of Business Administration\n{school} | {grad}",
}
FIELDS = ["Computer Science", "Software Engineering", "Data Science", "Electrical Engineering", "Information Systems"]
SCHOOLS = ["State University", "City Tech Institute", "National University",
           "Polytechnic University", "Metropolitan College"]


def _email(name: str) -> str:
    handle = name.lower().replace("'", "").replace(" ", ".").replace("ó", "o").replace("é", "e").replace("ü", "u").replace("ñ", "n").replace("í", "i")
    return f"{handle}@example.com"


def _phone(rng: random.Random) -> str:
    return f"({rng.randint(200, 999)}) {rng.randint(200, 999)}-{rng.randint(1000, 9999)}"


def build_resume(idx: int, persona) -> str:
    name, role, years, edu, primary, secondary, domain = persona
    rng = random.Random(idx * 17 + 3)
    cur_year = 2026
    start = cur_year - max(2, years - 2)
    prev_end = start - 1
    prev_start = prev_end - max(1, years - 3)

    company = rng.choice(COMPANIES)
    prev_company = rng.choice([c for c in COMPANIES if c != company])
    pct = rng.choice([20, 30, 40, 50, 60])
    users = rng.choice(["50K", "100K", "500K", "1M", "5M"])
    n = rng.choice([2, 3, 4, 5])

    template = rng.choice(EXPERIENCE_TEMPLATES)
    exp_blocks = []
    for title, c_template, dates, bullets in template:
        title = title.format(role=role)
        c = c_template.format(company=company, prev_company=prev_company)
        d = dates.format(start=start, prev_start=prev_start, prev_end=prev_end)
        rendered = [b.format(stack0=primary[0], stack1=primary[1] if len(primary) > 1 else primary[0],
                             pct=pct, users=users, n=n) for b in bullets]
        exp_blocks.append((title, c, d, rendered))

    summary = rng.choice(SUMMARY_TEMPLATES).format(
        role=role, years=years, domain=domain,
        stack0=primary[0],
        stack1=primary[1] if len(primary) > 1 else primary[0],
    )

    edu_block = EDU_LINES[edu].format(
        field=rng.choice(FIELDS),
        school=rng.choice(SCHOOLS),
        grad=cur_year - years - rng.randint(0, 2),
    )

    skills_line = ", ".join(primary + secondary)

    out = []
    out.append(name.upper())
    out.append(f"{_email(name)} | {_phone(rng)} | linkedin.com/in/{name.lower().replace(' ', '-')}")
    out.append("")
    out.append("PROFESSIONAL SUMMARY")
    out.append(summary)
    out.append("")
    out.append("TECHNICAL SKILLS")
    out.append(f"- Core: {', '.join(primary)}")
    out.append(f"- Additional: {', '.join(secondary)}")
    out.append(f"- All: {skills_line}")
    out.append("")
    out.append("PROFESSIONAL EXPERIENCE")
    for title, c, d, bullets in exp_blocks:
        out.append(f"{title} | {c} | {d}")
        for b in bullets:
            out.append(f"- {b}")
        out.append("")
    out.append("EDUCATION")
    out.append(edu_block)
    out.append("")
    out.append("CERTIFICATIONS")
    out.append(f"- {primary[0]} Professional Certification ({cur_year - rng.randint(1, 4)})")
    out.append("")
    out.append("PROJECTS")
    out.append(f"- {role} side project showcasing {primary[0]} and {secondary[0] if secondary else primary[0]}.")
    return "\n".join(out)


def write_resumes() -> int:
    RESUMES_DIR.mkdir(parents=True, exist_ok=True)
    for path in RESUMES_DIR.glob("*.txt"):
        path.unlink()
    for i, persona in enumerate(PERSONAS):
        name = persona[0]
        slug = name.lower().replace("'", "").replace(" ", "_").replace("ó", "o").replace("é", "e").replace("ü", "u").replace("ñ", "n").replace("í", "i")
        text = build_resume(i, persona)
        (RESUMES_DIR / f"resume_{slug}.txt").write_text(text, encoding="utf-8")
    return len(PERSONAS)


# ---------------------------------------------------------------------------
# Job descriptions
# ---------------------------------------------------------------------------

JOB_DESCRIPTIONS = [
    {
        "id": "jd_ml_engineer",
        "title": "Senior Machine Learning Engineer",
        "description": dedent("""
            We are looking for a Senior Machine Learning Engineer with at least 5 years of experience
            shipping production ML systems. You will design, train, and deploy models powering our
            personalization stack. The ideal candidate is fluent in Python and PyTorch, has hands-on
            experience with Transformers and HuggingFace, and has built or operated MLOps tooling.
            Bonus: experience with RAG pipelines, vector databases, and large language models.
        """).strip(),
        "must_have_skills": ["python", "pytorch", "transformers", "mlops"],
        "nice_to_have_skills": ["huggingface", "rag", "langchain", "aws"],
        "min_years_experience": 5,
        "min_education": "BACHELOR",
    },
    {
        "id": "jd_backend_python",
        "title": "Senior Python Backend Engineer",
        "description": dedent("""
            Senior backend engineer to own our payments service. Must have 5+ years of Python in
            production, deep PostgreSQL knowledge, and experience with FastAPI or Django. You should
            be comfortable with Kafka, Redis, and event-driven architectures. We deploy on AWS via
            Docker and Kubernetes.
        """).strip(),
        "must_have_skills": ["python", "postgresql", "fastapi", "kafka"],
        "nice_to_have_skills": ["redis", "aws", "docker", "kubernetes"],
        "min_years_experience": 5,
        "min_education": "BACHELOR",
    },
    {
        "id": "jd_data_engineer",
        "title": "Data Engineer",
        "description": dedent("""
            Data engineer to build batch and streaming pipelines on top of Spark, Kafka, and Airflow.
            Strong SQL and Python required. You will own data quality, dbt models, and the warehouse
            (Snowflake). 4+ years of experience expected.
        """).strip(),
        "must_have_skills": ["python", "sql", "spark", "airflow"],
        "nice_to_have_skills": ["snowflake", "dbt", "kafka"],
        "min_years_experience": 4,
        "min_education": "BACHELOR",
    },
    {
        "id": "jd_frontend_react",
        "title": "Senior Frontend Engineer (React)",
        "description": dedent("""
            Senior frontend engineer to lead our React/Next.js platform. 5+ years of TypeScript and
            React in production, comfort with Redux and modern build tooling. You'll partner with
            design on a shared component library.
        """).strip(),
        "must_have_skills": ["typescript", "react", "next.js"],
        "nice_to_have_skills": ["redux", "graphql"],
        "min_years_experience": 5,
        "min_education": "BACHELOR",
    },
    {
        "id": "jd_devops_sre",
        "title": "Site Reliability Engineer",
        "description": dedent("""
            SRE with 5+ years operating Kubernetes in production. Strong Linux fundamentals, Terraform
            for IaC, and experience with CI/CD pipelines. You will own SLOs, incident response, and
            capacity planning. AWS preferred.
        """).strip(),
        "must_have_skills": ["kubernetes", "terraform", "linux", "ci/cd"],
        "nice_to_have_skills": ["aws", "go", "python"],
        "min_years_experience": 5,
        "min_education": "BACHELOR",
    },
    {
        "id": "jd_nlp_llm",
        "title": "NLP / LLM Application Engineer",
        "description": dedent("""
            Engineer to build LLM-powered product features. Hands-on with HuggingFace, Transformers,
            and at least one orchestration framework (LangChain or LlamaIndex). Experience designing
            RAG pipelines and integrating with OpenAI or Anthropic APIs is essential. 3+ years.
        """).strip(),
        "must_have_skills": ["python", "transformers", "langchain", "rag"],
        "nice_to_have_skills": ["huggingface", "openai", "anthropic"],
        "min_years_experience": 3,
        "min_education": "BACHELOR",
    },
]


def write_jds() -> int:
    JD_DIR.mkdir(parents=True, exist_ok=True)
    for path in JD_DIR.glob("*.json"):
        path.unlink()
    for jd in JOB_DESCRIPTIONS:
        (JD_DIR / f"{jd['id']}.json").write_text(json.dumps(jd, indent=2), encoding="utf-8")
    return len(JOB_DESCRIPTIONS)


if __name__ == "__main__":
    n_resumes = write_resumes()
    n_jds = write_jds()
    print(f"Wrote {n_resumes} resumes to {RESUMES_DIR}")
    print(f"Wrote {n_jds} job descriptions to {JD_DIR}")
