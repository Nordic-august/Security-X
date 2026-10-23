-- ====================================================================
-- Security X - Schema Relacional PostgreSQL (Atualizado)
-- Glossário de Fragilidades, Usuários/Estudantes e Configurações
-- ====================================================================

-- 1. Tabela de Categorias Temáticas (para fileiras estilo Streaming)
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    badge_label VARCHAR(50),
    sort_order INT DEFAULT 0
);

-- 2. Tabela de Vulnerabilidades e Fragilidades (Terminologias do Glossário)
CREATE TABLE IF NOT EXISTS vulnerabilities (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    short_summary TEXT NOT NULL,
    detailed_description TEXT NOT NULL,
    practical_example TEXT NOT NULL,
    mitigation TEXT NOT NULL,
    cwe_id VARCHAR(50),
    owasp_reference VARCHAR(100),
    attack_vector VARCHAR(100),
    impact_scope VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Nova Tabela de Usuários / Estudantes (Cadastro com e-mail real e perfil)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_id VARCHAR(50) DEFAULT 'avatar-cyber-hacker',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Sugestões dos Estudantes (Comunidade com vínculo de usuário)
CREATE TABLE IF NOT EXISTS suggestions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    term_title VARCHAR(150) NOT NULL,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
    severity VARCHAR(20) DEFAULT 'Medium' CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    description TEXT NOT NULL,
    example TEXT,
    student_name VARCHAR(100),
    student_email VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de Configurações Dinâmicas do Site (Editável pelo Admin)
CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(50) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices recomendados para busca de alta performance no catálogo
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_category ON vulnerabilities(category_id);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON vulnerabilities(severity);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_title ON vulnerabilities(title);
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions(status);
CREATE INDEX IF NOT EXISTS idx_suggestions_user_id ON suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
