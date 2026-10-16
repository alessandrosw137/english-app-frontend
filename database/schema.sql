-- ========================================================
-- ENGLISH APP - POSTGRESQL INITIALIZATION SCHEMA
-- Database: english_app
-- ========================================================

-- Ensure database exists (for command-line executions where psql connects to postgres default db)
SELECT 'CREATE DATABASE english_app'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'english_app')\gexec

-- Connect to english_app if running through interactive psql
\c english_app;

-- 1. TABLA DE USUARIOS (users)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    google_id VARCHAR(255),
    avatar_url TEXT,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. TABLA DE ESTADÍSTICAS DEL USUARIO (user_stats)
CREATE TABLE IF NOT EXISTS user_stats (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    exp INT DEFAULT 0,
    rank VARCHAR(50) DEFAULT 'Bronce',
    streak_days INT DEFAULT 0,
    last_login TIMESTAMP DEFAULT NOW()
);

-- 3. TABLA DE PROGRESO POR MÓDULOS (module_progress)
CREATE TABLE IF NOT EXISTS module_progress (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id VARCHAR(100) NOT NULL,
    current_level INT DEFAULT 1,
    completed_nodes JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT uq_user_module UNIQUE (user_id, module_id)
);

-- 4. TABLA DE HISTORIAL TOEFL (toefl_history)
CREATE TABLE IF NOT EXISTS toefl_history (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    exam_type VARCHAR(100) DEFAULT 'Sentence Completion',
    completed_at TIMESTAMP DEFAULT NOW()
);

-- ========================================================
-- ÍNDICES PARA ALTO RENDIMIENTO
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_user_mod ON module_progress(user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_updated ON module_progress(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_toefl_history_user_id ON toefl_history(user_id);
CREATE INDEX IF NOT EXISTS idx_toefl_history_completed ON toefl_history(completed_at DESC);
