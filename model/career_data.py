import json
import sqlite3
from settings import CAREER_DB_PATH

DB_PATH = CAREER_DB_PATH
careers = []

REQUIRED_COLUMNS = {
    "career_name": "TEXT PRIMARY KEY",
    "domain": "TEXT",
    "interest_alignment": "TEXT",
    "cognitive_style_required": "TEXT",
    "motivation_alignment": "TEXT",
    "work_style": "TEXT",
    "learning_style": "TEXT",
    "core_skills": "TEXT",
    "typical_responsibilities": "TEXT",
}

DEFAULT_CAREERS = [
    {
        "career_name": "Backend Engineer",
        "domain": "Technology & Engineering",
        "interest_alignment": ["Technology & Engineering"],
        "cognitive_style_required": [
            "Analytical",
            "Systems-Oriented",
            "Detail-Focused",
        ],
        "motivation_alignment": [
            "Problem Solving",
            "Innovation",
            "Learning Mastery",
        ],
        "work_style": {
            "team_orientation": "Balanced",
            "structure_preference": "Semi-Structured",
            "risk_tolerance": "Moderate",
        },
        "learning_style": ["Hands-On", "Self-Directed"],
        "core_skills": [
            "Data Structures",
            "Algorithms",
            "APIs",
            "Databases",
            "System Design",
        ],
        "typical_responsibilities": [
            "Design scalable backend systems",
            "Build APIs and services",
            "Optimize system performance",
            "Maintain server-side logic",
        ],
    },
    {
        "career_name": "Data Scientist",
        "domain": "Technology & Engineering",
        "interest_alignment": [
            "Technology & Engineering",
            "Research & Academia",
        ],
        "cognitive_style_required": ["Analytical", "Detail-Focused"],
        "motivation_alignment": ["Problem Solving", "Learning Mastery"],
        "work_style": {
            "team_orientation": "Balanced",
            "structure_preference": "Semi-Structured",
            "risk_tolerance": "Moderate",
        },
        "learning_style": ["Theoretical", "Hands-On"],
        "core_skills": [
            "Statistics",
            "Machine Learning",
            "Python",
            "Data Analysis",
            "Data Visualization",
        ],
        "typical_responsibilities": [
            "Analyze complex datasets",
            "Build predictive models",
            "Identify trends and insights",
            "Communicate findings to stakeholders",
        ],
    },
    {
        "career_name": "Product Manager",
        "domain": "Business & Strategy",
        "interest_alignment": [
            "Business & Strategy",
            "Technology & Engineering",
        ],
        "cognitive_style_required": ["Strategic", "Big-Picture"],
        "motivation_alignment": ["Leadership", "Impact Creation"],
        "work_style": {
            "team_orientation": "Strongly Team-Oriented",
            "structure_preference": "Flexible",
            "risk_tolerance": "Moderate",
        },
        "learning_style": ["Collaborative", "Self-Directed"],
        "core_skills": [
            "Product Strategy",
            "User Research",
            "Roadmapping",
            "Stakeholder Communication",
        ],
        "typical_responsibilities": [
            "Define product vision",
            "Coordinate cross-functional teams",
            "Prioritize product features",
            "Ensure product-market fit",
        ],
    },
    {
        "career_name": "UX/UI Designer",
        "domain": "Creative & Design",
        "interest_alignment": ["Creative & Design"],
        "cognitive_style_required": ["Creative", "Big-Picture"],
        "motivation_alignment": ["Innovation", "Impact Creation"],
        "work_style": {
            "team_orientation": "Balanced",
            "structure_preference": "Flexible",
            "risk_tolerance": "Low",
        },
        "learning_style": ["Hands-On", "Collaborative"],
        "core_skills": [
            "User Research",
            "Wireframing",
            "Prototyping",
            "Visual Design",
        ],
        "typical_responsibilities": [
            "Design user interfaces",
            "Conduct user testing",
            "Improve user experience",
            "Collaborate with developers",
        ],
    },
    {
        "career_name": "AI Researcher",
        "domain": "Research & Academia",
        "interest_alignment": [
            "Research & Academia",
            "Technology & Engineering",
        ],
        "cognitive_style_required": ["Analytical", "Systems-Oriented"],
        "motivation_alignment": ["Learning Mastery", "Innovation"],
        "work_style": {
            "team_orientation": "Balanced",
            "structure_preference": "Highly Structured",
            "risk_tolerance": "Moderate",
        },
        "learning_style": ["Theoretical", "Self-Directed"],
        "core_skills": [
            "Machine Learning",
            "Mathematics",
            "Research Methods",
            "Deep Learning",
        ],
        "typical_responsibilities": [
            "Develop new AI algorithms",
            "Publish research papers",
            "Experiment with models",
            "Advance AI technologies",
        ],
    },
]


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def ensure_careers_schema(cursor):
    cursor.execute("PRAGMA table_info(careers)")
    existing_columns = {row[1] for row in cursor.fetchall()}

    for column_name, column_type in REQUIRED_COLUMNS.items():
        if column_name not in existing_columns:
            cursor.execute(
                f"ALTER TABLE careers ADD COLUMN {column_name} {column_type}"
            )


def init_database():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS careers (
            career_name TEXT PRIMARY KEY,
            domain TEXT,
            interest_alignment TEXT,
            cognitive_style_required TEXT,
            motivation_alignment TEXT,
            work_style TEXT,
            learning_style TEXT,
            core_skills TEXT,
            typical_responsibilities TEXT
        )
        """
    )

    ensure_careers_schema(cursor)
    cursor.execute("UPDATE careers SET domain = 'General' WHERE domain IS NULL")

    conn.commit()
    conn.close()

    if not career_exists("Backend Engineer"):
        for career in DEFAULT_CAREERS:
            add_career(career)


def load_careers():
    init_database()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM careers")
    rows = cursor.fetchall()
    conn.close()

    loaded_careers = []
    for row in rows:
        loaded_careers.append(
            {
                "career_name": row["career_name"],
                "domain": row["domain"],
                "interest_alignment": json.loads(row["interest_alignment"]),
                "cognitive_style_required": json.loads(
                    row["cognitive_style_required"]
                ),
                "motivation_alignment": json.loads(row["motivation_alignment"]),
                "work_style": json.loads(row["work_style"]),
                "learning_style": json.loads(row["learning_style"]),
                "core_skills": json.loads(row["core_skills"]),
                "typical_responsibilities": json.loads(
                    row["typical_responsibilities"]
                ),
            }
        )

    careers.clear()
    careers.extend(loaded_careers)


def save_careers():
    pass


def career_exists(name):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT career_name FROM careers WHERE LOWER(career_name) = LOWER(?)",
        (name,),
    )
    result = cursor.fetchone()
    conn.close()
    return result is not None


def add_career(career):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT OR REPLACE INTO careers (
            career_name,
            domain,
            interest_alignment,
            cognitive_style_required,
            motivation_alignment,
            work_style,
            learning_style,
            core_skills,
            typical_responsibilities
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            career["career_name"],
            career.get("domain", "General"),
            json.dumps(career["interest_alignment"]),
            json.dumps(career["cognitive_style_required"]),
            json.dumps(career["motivation_alignment"]),
            json.dumps(career["work_style"]),
            json.dumps(career["learning_style"]),
            json.dumps(career["core_skills"]),
            json.dumps(career.get("typical_responsibilities", [])),
        ),
    )
    conn.commit()
    conn.close()

    for index, existing_career in enumerate(careers):
        if existing_career["career_name"].lower() == career["career_name"].lower():
            careers[index] = career
            break
    else:
        careers.append(career)
