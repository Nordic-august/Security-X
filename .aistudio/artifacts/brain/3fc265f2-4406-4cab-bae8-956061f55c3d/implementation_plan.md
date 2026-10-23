# Security X — Autenticação de Estudantes, Perfil de Usuário & Configurações Dinâmicas pelo Admin

Plano de arquitetura para implementar autenticação obrigatória de estudantes para o envio de sugestões, tela de perfil completa com personalização e rastreio de sugestões, separação estrita da rota do painel administrativo e customização de atributos do site (título, descrição, textos) diretamente pelo painel admin, com persistência relacional no PostgreSQL.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Decisões Alinhadas nas Perguntas de Clarificação (Fase 1):**
> - **Posicionamento de Acesso na Navbar**: O canto superior direito da barra de navegação pública (onde antes ficava o botão "Enviar Sugestão") passará a abrigar o **Acesso do Usuário/Estudante** (`Entrar / Criar Conta` quando deslogado; `Avatar + Nome de Usuário` com menu de perfil quando logado).
> - **Botão Flutuante de Sugestões**: Mantido fixo no canto inferior direito para acesso rápido à Aba 3. Caso o estudante não esteja logado ao tentar sugerir, será orientado a fazer login ou cadastro rápido.
> - **Seleção de Fotos de Perfil**: Uso exclusivo de avatares temáticos predefinidos armazenados em uma pasta dedicada na linha de código (`src/assets/avatars/`), com catálogo visual (Hacker Ético, Analista SecOps, Criptógrafo, Pesquisadora Cyber, Sentinela Digital) selecionáveis na tela de perfil.
> - **Separação Estrita de Rotas e Telas**: As rotas públicas de autenticação do estudante (`/api/auth/*`) serão totalmente desacopladas do login administrativo (`/api/admin/*`). O painel administrativo continuará invisível e inacessível ao público geral, acessível apenas via credenciais exclusivas (`Secutiry159` / `159_753.`).
> - **Customização pelo Admin**: Inclusão de uma nova aba no Painel Administrativo ("Configurações do Site") para que o admin possa alterar diretamente em tempo de execução o nome do site, descrição do glossário, subtítulo hero e referências.

---

### 1. Overview & Core Concept

- **O que a aplicação passa a oferecer**:
  1. **Cadastro e Login de Estudantes/Comunidade**:
     - Cadastro simples e seguro exigindo apenas: Nome de Usuário, E-mail (com validação estrita de e-mails reais: formato RFC 5322 e domínios válidos) e Senha.
     - Login com e-mail ou nome de usuário e senha.
     - Sessão do estudante mantida com token seguro.
  2. **Central de Sugestões Protegida**:
     - Somente estudantes logados podem submeter novas fragilidades, garantindo rastreabilidade, combate a spam e crédito autoral.
  3. **Área de Perfil do Estudante**:
     - Alteração de Senha (com confirmação da senha atual e validação da nova).
     - Alteração de Nome de Usuário.
     - Troca de Foto de Perfil através da galeria de avatares predefinidos.
     - Dashboard pessoal de sugestões: lista em tempo real com separação clara entre **Sugestões Aprovadas** (publicadas no catálogo) e **Aguardando Moderação do Admin** (com notas do admin e data de envio).
  4. **Configurações Dinâmicas do Site (Admin)**:
     - Gestão no Painel Administrativo para editar nome do site, texto do hero, missão institucional e rodapé com reflexo instantâneo no frontend e no banco de dados.

---

### 2. User Experience & Visual Design

#### A. Fluxo de Navegação & Acesso do Usuário

1. **Topo da Página (Navbar)**:
   - *Estado Deslogado*: Exibe botão elegante `Entrar / Cadastrar` com ícone de usuário no canto superior direito.
   - *Estado Logado*: Exibe o avatar circular do estudante, seu nome de usuário e um menu rápido com opções: `Meu Perfil & Sugestões`, `Sugerir Nova Fragilidade` e `Sair da Conta`.
2. **Modal / Tela de Autenticação do Estudante**:
   - Abas intuitivas de **Entrar** e **Criar Conta**.
   - Validação de e-mail em tempo real (exige domínio válido com `@` e `.`, rejeitando formatos incorretos).
   - Feedback de erro claro e imediato.
3. **Tela de Perfil do Usuário (`Aba de Perfil`)**:
   - Cartão com Avatar selecionado, Nome de Usuário, E-mail cadastrado e data de criação da conta.
   - **Seletor Visual de Avatares**: Grid com prévias visuais dos avatares da pasta `src/assets/avatars/` para troca com 1 clique.
   - **Formulário de Alteração de Nome**: Atualização simples de `username`.
   - **Formulário de Segurança (Troca de Senha)**: Campo de senha atual, nova senha e confirmação com alternadores de visibilidade (olho).
   - **Painel "Minhas Contribuições"**:
     - Seção de Sugestões Aprovadas (com link direto para a ficha correspondente no catálogo).
     - Seção de Sugestões Pendentes (com badge "Aguardando Moderação do Admin").
     - Seção de Sugestões Rejeitadas (com justificativa do administrador).
4. **Painel de Configurações do Site no Admin**:
   - Sub-aba interna no Painel Administrativo com formulário para editar:
     - `site_title`: Nome do portal (padrão: "Security X")
     - `site_description`: Texto descritivo oficial para estudantes
     - `hero_badge`: Texto do kicker superior
     - Botão "Salvar e Publicar Alterações no Site".

---

### 3. Modelo de Banco de Dados & Esquema SQL (PostgreSQL)

O esquema relacional será atualizado com duas novas tabelas fundamentais:

```sql
-- 1. Nova Tabela de Usuários / Estudantes
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255) DEFAULT '/assets/avatars/avatar_1.svg',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Atualização da Tabela de Sugestões com Chave Estrangeira do Usuário
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

-- 3. Nova Tabela de Configurações Dinâmicas do Site
CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(50) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_suggestions_user_id ON suggestions(user_id);
```

---

### 4. Technical Architecture & Endpoints

#### Rotas da API Backend (`server.ts`):

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ROTAS PÚBLICAS DO ESTUDANTE                     │
│  ├── POST   /api/auth/register       (Cria conta: email real, user, pw)│
│  ├── POST   /api/auth/login          (Autentica estudante: token JWT)  │
│  ├── GET    /api/auth/me             (Dados do perfil e sessão ativa)  │
│  ├── PUT    /api/auth/profile        (Atualiza username e avatar)      │
│  ├── PUT    /api/auth/password       (Altera senha com validação atual)│
│  ├── GET    /api/auth/my-suggestions (Sugestões aprovadas e pendentes) │
│  └── GET    /api/auth/avatars        (Lista avatares predefinidos)     │
├────────────────────────────────────────────────────────────────────────┤
│                     CONFIGURAÇÕES DINÂMICAS DO SITE                    │
│  ├── GET    /api/site-settings       (Público: carrega textos do site) │
│  └── PUT    /api/site-settings       (Admin: atualiza nome, glossário) │
├────────────────────────────────────────────────────────────────────────┤
│                  ROTA INVISÍVEL E EXCLUSIVA DO ADMIN                   │
│  ├── POST   /api/admin/login         (Secutiry159 / 159_753. inalterado)│
│  └── [CRUD de vulnerabilidades e moderação preservados]                │
└────────────────────────────────────────────────────────────────────────┘
```

#### Arquitetura de Pastas e Componentes:

- `src/assets/avatars/`: Diretório contendo os avatares predefinidos (ex.: `cyber_1.svg`, `cyber_2.svg`, `cyber_3.svg`, `cyber_4.svg`, `cyber_5.svg`, `cyber_6.svg`).
- `src/components/StudentAuthModal.tsx`: Modal com abas de Login e Cadastro para estudantes.
- `src/components/StudentProfileView.tsx`: Tela completa de perfil com troca de senha, nome, avatar e histórico de sugestões.
- `src/components/AdminView.tsx`: Nova sub-aba "Configurações do Site" para alterar nome, descrição e textos do glossário.
- `src/db/schema.sql` e `src/db/seeds.sql`: Atualizados com as tabelas `users`, `site_settings` e chaves estrangeiras.
- `src/db/store.ts`: Repositório com suporte a gestão de usuários, hashing de senhas, consulta por usuário e configurações do site.
