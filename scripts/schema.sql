-- dev-codigo — Esquema de Base de Datos para Neon PostgreSQL

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    github_id INT UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS progress (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(50) NOT NULL, -- 'git' | 'ansible' | 'aap' | 'php' | 'python'
    completed_days JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de días completados e.g. [1, 2]
    updated_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user ON progress (user_id);
