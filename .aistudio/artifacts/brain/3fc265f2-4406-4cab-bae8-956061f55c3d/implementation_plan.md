# Security X — Plataforma e Glossário de Vulnerabilidades em Sistemas de Informação

Plataforma educacional full-stack interativa projetada para estudantes de segurança da informação e computação, combinando uma experiência de catálogo no estilo streaming, busca instantânea de vulnerabilidades, envio comunitário de sugestões e painel administrativo completo com persistência compatível com PostgreSQL.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Decisões Alinhadas nas Perguntas de Clarificação (Fase 1):**
> - **Identidade Visual**: *Cyber Dark Moderno* com superfícies escuras refinadas (slate profundo), acentos luminosos ciano/esmeralda/âmbar para severidade e tipografia de alto contraste sem poluição visual.
> - **Mostruário Estilo Streaming**: Fileiras temáticas em carrossel horizontal navegável (estilo Netflix) categorizadas por domínio de ameaça (ex.: OWASP Top 10, Segurança de Redes, Falhas de Autenticação, Criptografia, Engenharia Social) com cartões expansíveis e modal detalhado.
> - **Estratégia de Banco de Dados**: Backend Node.js/Express com persistência transacional local estruturada com schema relacional formal, gerador e exportador DDL para PostgreSQL (`schema.sql`), permitindo execução imediata no applet com migração direta para Cloud SQL / PostgreSQL.

- **Fluxo das 4 Abas Solicitadas**:
  - **Aba 1 (Scroll 1 - Hero & Busca)**: Título oficial *"Security X"*, descrição institucional para estudantes, barra de busca em tempo real com filtros rápidos e botão flutuante no canto inferior direito que encaminha diretamente para a Aba 3.
  - **Aba 2 (Scroll 2 - Catálogo de Streaming)**: Vitrine visual em carrosséis temáticos e grade fluida com termos técnicos, gravidade (Baixa, Média, Alta, Crítica), resumo prático, CVE/CWE associados e clique para inspeção profunda.
  - **Aba 3 (Página Separada - Central de Sugestões)**: Formulário para estudantes sugerirem novas fragilidades, exemplos práticos ou melhorias em termos existentes, com validação de campos e histórico de envios.
  - **Aba 4 (Página Separada - Painel Administrativo)**: Gestão completa (CRUD) de vulnerabilidades (adicionar novos termos, editar, definir categoria e gravidade, excluir) e moderação de sugestões enviadas por estudantes.

---

### 1. Overview & Core Concept

- **O que a aplicação faz**: Apresenta de forma acessível e visualmente envolvente um glossário vivo de fragilidades em sistemas de informação. Estudantes podem buscar termos por nome, CVE, protocolo ou categoria, explorar fileiras temáticas interativas como em catálogos de streaming de vídeo, abrir fichas detalhadas com cenários reais de ataque e medidas de mitigação, enviar sugestões e gerenciar termos via painel administrativo.
- **Público-Alvo**: Estudantes de Engenharia de Software, Ciência da Computação, Segurança da Informação, redes e desenvolvedores em início de carreira buscando entender vulnerabilidades sem o peso de relatórios excessivamente herméticos.
- **Valor Principal**: Didática clara com exemplos práticos do mundo real, analogias compreensíveis, categorização visual imediata por risco e autonomia para a comunidade sugerir novos conceitos.

---

### 2. User Experience & Visual Design

#### A. Fluxos do Usuário

1. **Exploração da Página Inicial (Abas 1 e 2 em Scroll Contínuo)**:
   - O estudante acessa a página e visualiza a seção de topo com a identidade *Security X* e o texto oficial de apresentação:
     *"Esse site tem como objetivo apresentar um glossário de fragilidades em sistemas da informação, além de mostrar exemplos e dar explicações acerca dessas mesmas vulnerabilidades de forma acessível e facilitada. Tendo como público alvo os estudantes da área"*
   - Digita na barra de pesquisa (ex.: "SQL", "Phishing", "Buffer", "CWE-79") e vê filtragem reativa instantânea.
   - Ao rolar para a Seção 2, descobre o mostruário de streaming: carrosséis deslizáveis (OWASP Web, Ameaças de Rede, Falhas de Autenticação, Ataques a APIs, etc.).
   - Ao clicar em um card, um modal de alta densidade exibe:
     - Nome técnico e sinônimos populares
     - Nível de severidade (Informativo, Baixo, Médio, Alto, Crítico)
     - Explicação didática descomplicada
     - Exemplo prático de código ou cenário real de invasão
     - Estratégias recomendadas de mitigação e prevenção
     - Identificadores de referência (CWE, OWASP Top 10)
   - Em qualquer ponto da página inicial, o botão flutuante no canto inferior direito permite ir com um clique para a **Central de Sugestões** (Aba 3).

2. **Envio de Sugestões (Aba 3 - Tela Dedicada)**:
   - Formulário com campos estruturados: Nome do Termo/Fragilidade, Categoria, Gravidade estimada, Descrição explicativa, Exemplo do mundo real e Nome/E-mail do estudante (opcional).
   - Validação imediata de preenchimento e feedback visual com confirmação de envio.

3. **Painel do Administrador (Aba 4 - Tela Dedicada)**:
   - Visão geral com métricas reais (total de vulnerabilidades, sugestões pendentes, categorias ativas).
   - Tabela de gerenciamento com ações de Adicionar Nova Fragilidade, Editar existente e Excluir.
   - Aba interna para revisar as sugestões enviadas pelos estudantes, com opção de aprovar (transformando a sugestão diretamente em um novo termo publicado no catálogo) ou descartar.
   - Botão para exportar o script SQL (`schema.sql` e `seeds.sql`) pronto para importação no PostgreSQL.

#### B. Identidade Visual & Tema

- **Diretriz Estética**: *Cyber Dark* moderno e refinado. Fundo escuro profundo inspirado em consoles e interfaces de segurança modernas (Tailwind `#090D16` e `#0F172A`), com superfícies de cards em `#131C31` e bordas ultrafinas (`border-slate-800`).
- **Paleta de Cores (60-30-10)**:
  - *60% Tela Neutra*: Slate escuro profundo (`#090D16` / `bg-slate-950`).
  - *30% Superfícies Estruturais*: Superfícies de cards (`#0F172A`), divisores finos (`#1E293B`) e texto de corpo claro e legível (`#E2E8F0` / `#94A3B8`).
  - *10% Acentos Semânticos*:
    - Crítica: Coral Vermelho (`#EF4444`) com indicador de alto risco.
    - Alta: Âmbar Intenso (`#F59E0B`).
    - Média: Ciano Cibernético (`#06B6D4`).
    - Baixa / Informativa: Esmeralda Suave (`#10B981`).
    - Primária / Ação: Violeta Elétrico / Índigo (`#6366F1`).
- **Tipografia**:
  - *Títulos e Display*: `Outfit` / `Plus Jakarta Sans` com pesos 600 e 700 para impacto moderno e legibilidade.
  - *Corpo e Didática*: `DM Sans` / `Plus Jakarta Sans` para leitura fluida e confortável de explicações técnicas.
  - *Identificadores e Código*: `font-mono tabular-nums` para CVEs, CWEs e snippets de exemplo.
- **Disciplina Anti-Slop**:
  - Sem tags de status fictícias ("ONLINE // LATENCY: 2ms") ou comentários de código em títulos.
  - Zero pílulas desordenadas: metadados exibidos com separadores tipográficos limpos (`·` ou `/`).
  - Navegação do topo seguindo o contrato de 3 zonas: Logotipo *Security X* à esquerda, links das abas ao centro, botão de ação à direita.

---

### 3. Key Product Decisions & Trade-Offs

- **Decisão 1: Arquitetura Full-Stack com API Express e Vite**:
  - *Abordagem*: Servidor Express em Node.js servindo endpoints REST em `/api/*`, integrado ao ciclo de desenvolvimento do Vite e servindo a aplicação React completa.
  - *Justificativa*: Atende perfeitamente ao requisito explícito de ter "back-end, API e Front-end utilizando HTML, Node.JS, JS, CSS e Postgre".
- **Decisão 2: Modelo de Banco de Dados e Compatibilidade PostgreSQL**:
  - *Abordagem*: Criação de esquema de banco de dados relacional formal estruturado em SQL compatível com PostgreSQL (`CREATE TABLE vulnerabilities (...)`, `CREATE TABLE suggestions (...)`, `CREATE TABLE categories (...)`), acompanhado de persistência transacional e endpoint de exportação de dados DDL/DML para PostgreSQL.
  - *Justificativa*: Garante que a aplicação funcione de ponta a ponta instantaneamente sem depender de provisionamento prévio, mas com 100% de compatibilidade e scripts para PostgreSQL.
- **Decisão 3: Experiência de Catálogo Estilo Streaming na Seção 2**:
  - *Abordagem*: Fileiras horizontais agrupadas por categoria (ex.: *Top 10 OWASP*, *Ataques de Rede & Camada de Transporte*, *Falhas de Controle de Acesso*, *Injeções & Parser*, *Criptografia & Sessões*) com controles de rolagem lateral suave (setas de navegação e arraste) e cards que expandem no hover revelando sinopse rápida e severidade.
  - *Justificativa*: Transforma o estudo de vulnerabilidades em uma experiência visual familiar e atrativa para estudantes, fugindo de glossários monótonos em lista simples.

---

### 4. Technical Architecture & Data Strategy

#### Diagrama de Arquitetura do Sistema

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Tailwind)                     │
│                                                                        │
│  ┌───────────────────────┐  ┌────────────────────────────────────────┐ │
│  │     Top Navigation    │  │  Abas de Navegação:                    │ │
│  │   "Security X" Brand  │  │  [Início (Scroll)] [Sugestões] [Admin] │ │
│  └───────────────────────┘  └────────────────────────────────────────┘ │
│                                                                        │
│  [Aba 1 & 2 - Página Inicial em Scroll Contínuo]                       │
│  ├─ Seção 1 (Scroll): Hero + Descrição Oficial + Busca + Filtros       │
│  │                    + Botão Flutuante (Canto Inferior Direito) ──┐   │
│  └─ Seção 2 (Scroll): Fileiras de Streaming (Carrosséis por Categoria)│   │
│                       └─ Card Click -> Modal de Detalhes da Falha     │   │
│                                                                        │
│  [Aba 3 - Tela Dedicada] <─────────────────────────────────────────────┘
│  └─ Formulário de Sugestões da Comunidade (Validação + Feedback)       │
│                                                                        │
│  [Aba 4 - Tela Dedicada]                                               │
│  └─ Painel Administrativo (CRUD de Vulnerabilidades + Sugestões)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Requisições HTTP (JSON REST API)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND API (Node.js + Express)                 │
│                                                                        │
│  Rotas REST da API:                                                    │
│  ├── GET    /api/vulnerabilities           (Listagem com busca e filtro)│
│  ├── POST   /api/vulnerabilities           (Criação pelo Admin)        │
│  ├── PUT    /api/vulnerabilities/:id       (Atualização pelo Admin)    │
│  ├── DELETE /api/vulnerabilities/:id       (Exclusão pelo Admin)       │
│  ├── GET    /api/categories                (Categorias temáticas)      │
│  ├── GET    /api/suggestions               (Listagem de sugestões)     │
│  ├── POST   /api/suggestions               (Envio por estudantes)      │
│  ├── PATCH  /api/suggestions/:id/status    (Aprovação/Rejeição Admin)  │
│  └── GET    /api/database/export-sql       (Download do DDL PostgreSQL)│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      CAMADA DE PERSISTÊNCIA & POSTGRESQL                │
│                                                                        │
│  ├── src/db/schema.sql      (Definição DDL relacional para PostgreSQL) │
│  ├── src/db/seeds.sql       (Dados iniciais com +15 vulnerabilidades)  │
│  └── src/db/store.ts        (Repositório transacional em Node.js com   │
│                              persistência em disco e suporte a SQL)    │
└────────────────────────────────────────────────────────────────────────┘
```

#### Modelo de Dados Relacional (PostgreSQL)

```sql
-- Schema Relacional PostgreSQL
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50)
);

CREATE TABLE vulnerabilities (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category_id VARCHAR(50) REFERENCES categories(id),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    short_summary TEXT NOT NULL,
    detailed_description TEXT NOT NULL,
    practical_example TEXT NOT NULL,
    mitigation TEXT NOT NULL,
    cwe_id VARCHAR(50),
    owasp_reference VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suggestions (
    id VARCHAR(50) PRIMARY KEY,
    term_title VARCHAR(150) NOT NULL,
    category_id VARCHAR(50),
    severity VARCHAR(20),
    description TEXT NOT NULL,
    example TEXT,
    student_name VARCHAR(100),
    student_email VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Mapeamento de Interação dos Componentes

- **Busca em Tempo Real**: Filtra instantaneamente os títulos, resumos e tags no catálogo de streaming sem recarregar a página.
- **Carrosséis de Streaming**: Controles táteis de avançar/voltar por categoria, contadores de itens e abertura suave do modal de detalhamento da falha.
- **Botão Flutuante de Sugestões**: Posicionado fixo no canto inferior direito (`fixed bottom-6 right-6`), com ícone indicativo e texto de atalho, levando suavemente para a Aba 3 de Sugestões.
- **Painel Administrativo com Abas Internas**:
  - *Gerenciar Termos*: Tabela paginada com busca, modal para criar/editar com preview em tempo real e confirmação segura de exclusão.
  - *Moderar Sugestões*: Botões de "Aprovar como Vulnerabilidade" e "Rejeitar", facilitando a incorporação imediata de colaborações dos estudantes ao catálogo.
  - *Banco de Dados*: Exportação com um clique do script DDL e DML SQL para PostgreSQL.
