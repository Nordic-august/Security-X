# Security X — Glossário de Fragilidades em Sistemas de Informação

> Plataforma educacional full-stack interativa para estudo e conscientização sobre fragilidades e vulnerabilidades em sistemas de informação, desenhada para estudantes universitários, analistas de segurança e pesquisadores. Apresenta catálogo no estilo streaming (com carrosséis e cards expansíveis), área da comunidade com autenticação de estudantes e perfis personalizáveis, e painel administrativo protegido e discreto.

---

## 📋 Sumário
1. [Visão Geral & Recursos](#-visão-geral--recursos)
2. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
3. [Pré-requisitos](#-pré-requisitos)
4. [Instalação & Execução Passo a Passo](#-instalação--execução-passo-a-passo)
   - [Passo 1: Obter o projeto e acessar o diretório](#passo-1-obter-o-projeto-e-acessar-o-diretório)
   - [Passo 2: Configuração de Variáveis de Ambiente](#passo-2-configuração-de-variáveis-de-ambiente)
   - [Passo 3: Instalação das Dependências](#passo-3-instalação-das-dependências)
   - [Passo 4: Execução em Modo de Desenvolvimento](#passo-4-execução-em-modo-de-desenvolvimento)
   - [Passo 5: Build para Produção](#passo-5-build-para-produção)
   - [Passo 6: Execução em Produção](#passo-6-execução-em-produção)
5. [Acessos & Credenciais](#-acessos--credenciais)
   - [Painel do Administrador (Invisível)](#painel-do-administrador-invisível)
   - [Portal do Estudante (Comunidade)](#portal-do-estudante-comunidade)
6. [Banco de Dados & PostgreSQL](#-banco-de-dados--postgresql)
7. [Estrutura do Projeto](#-estrutura-do-projeto)
8. [Scripts Disponíveis](#-scripts-disponíveis)
9. [Solução de Problemas Comuns](#-solução-de-problemas-comuns)

---

## 🚀 Visão Geral & Recursos

O **Security X** organiza o conhecimento de cibersegurança em quatro áreas fundamentais:
- **Aba 1 (Scroll Superior):** Hero com apresentação oficial, barra de busca inteligente em tempo real e filtros de gravidade (*Crítica*, *Alta*, *Média*, *Baixa*).
- **Aba 2 (Scroll Inferior):** Catálogo temático no formato streaming (estilo Netflix), organizado por carrosséis (*OWASP Top 10*, *Segurança em Redes*, *Autenticação & Controle de Acesso*, *Engenharia Social*, etc.) com modais de detalhamento técnico, CWE, vetores de ataque, código vulnerável e mitigação recomendada.
- **Aba 3 (Separada):** Central de Sugestões dos Estudantes, vinculada à conta do usuário para envio de novas vulnerabilidades à moderação.
- **Aba 4 (Separada & Oculta):** Painel Exclusivo de Administração com moderação de sugestões, CRUD de fragilidades do catálogo, personalização dinâmica das características e textos do site, e exportador relacional PostgreSQL.
- **Área de Perfil do Estudante:** Gestão de perfil com alteração de senha segura, alteração de nome de usuário, escolha de avatares cyber temáticos predefinidos e painel de status das contribuições (*Aprovadas*, *Em Análise*, *Rejeitadas*).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion.
- **Backend & Servidor:** Node.js, Express 4, TypeScript via `tsx`.
- **Bundler & Build Tool:** Vite 8.
- **Persistência de Dados:** Motor de dados em memória persistido em JSON (`data/security_x_store.json`), com esquema relacional compatível e exportador nativo DDL/DML para **PostgreSQL**.

---

## 📦 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- **Node.js**: versão **18.0.0** ou superior (recomendado: Node.js 20 LTS ou 22 LTS).
  - Verifique com: `node -v`
- **npm**: versão **9.0.0** ou superior (acompanha o Node.js).
  - Verifique com: `npm -v`
- **Git** (opcional, para clonar o repositório).
- **PostgreSQL** (opcional, caso deseje importar o script de banco relacional exportado).

---

## 💻 Instalação & Execução Passo a Passo

### Passo 1: Obter o projeto e acessar o diretório

Abra o seu terminal e navegue até a pasta do projeto:

```bash
cd /caminho/para/o/projeto
```

---

### Passo 2: Configuração de Variáveis de Ambiente

O projeto possui um arquivo de exemplo `.env.example`. Crie o seu arquivo `.env`:

**No Linux/macOS:**
```bash
cp .env.example .env
```

**No Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**No Windows (CMD):**
```cmd
copy .env.example .env
```

Conteúdo básico do arquivo `.env`:
```env
PORT=3000
NODE_ENV=development
```

*(Opcional: se for utilizar recursos de IA do Google AI Studio, adicione `GEMINI_API_KEY="sua_chave"`)*

---

### Passo 3: Instalação das Dependências

Instale todas as dependências declaradas no `package.json`:

```bash
npm install
```

Caso queira uma instalação estrita e limpa baseada no lockfile:
```bash
npm ci
```

---

### Passo 4: Execução em Modo de Desenvolvimento

Para rodar a aplicação em desenvolvimento com hot-reload e compilação em tempo real:

```bash
npm run dev
```

O servidor Express inicializará o backend junto aos middlewares do Vite. Você verá a saída:
```text
[Security X] Servidor full-stack ativo na porta 3000
```

Abra o navegador no endereço:
👉 **`http://localhost:3000`**

---

### Passo 5: Build para Produção

Para compilar e otimizar os arquivos TypeScript, React e estilos Tailwind CSS para produção:

```bash
npm run build
```

Este comando:
1. Executa o Vite Build (`vite build`).
2. Empacota e minifica os bundles JavaScript e CSS.
3. Gera a pasta de saída **`dist/`** com todos os assets estáticos prontos para produção.

*(Opcional: você pode verificar se há erros de tipo antes do build executando `npm run lint`)*

---

### Passo 6: Execução em Produção

Após ter executado `npm run build`, você pode subir a aplicação em modo de produção:

**No Linux/macOS:**
```bash
NODE_ENV=production npm start
```

**No Windows (PowerShell):**
```powershell
$env:NODE_ENV="production"; npm start
```

**No Windows (CMD):**
```cmd
set NODE_ENV=production && npm start
```

**Ou via Node diretamente:**
```bash
NODE_ENV=production npx tsx server.ts
```

Nesse modo, o Express servirá os arquivos compilados da pasta `dist/` estaticamente com máxima performance.

---

## 🔐 Acessos & Credenciais

### Painel do Administrador (Invisível)

O painel administrativo do Security X foi projetado para ser **totalmente invisível para usuários comuns** e estudantes. Para acessá-lo:

1. **Pelo Atalho de Teclado:** Pressione **`Ctrl + Shift + A`** (no Windows/Linux) ou **`Cmd + Shift + A`** (no Mac) em qualquer página do site.
2. **Pela URL:** Adicione `#admin` ao final do endereço:
   - Exemplo: `http://localhost:3000/#admin`
3. **Pelo Microcadeado Secreto:** Clique no pequeno ícone de cadeado que fica ao lado dos direitos autorais no canto direito do Rodapé (Footer).

**Credenciais Exclusivas de Administrador:**
- **Usuário:** `Secutiry159`
- **Senha:** `159_753.`

*No painel admin você pode aprovar/rejeitar sugestões, criar novas fragilidades, alterar os textos do site em tempo real e exportar a base para PostgreSQL.*

---

### Portal do Estudante (Comunidade)

- Para cadastrar uma nova conta de estudante: clique em **"Entrar / Cadastrar"** no canto superior direito do cabeçalho (Navbar).
- **Dados necessários para cadastro:** apenas um **e-mail real válido** (com domínio e formato verificado), um **nome de usuário**, sua **senha** e a escolha de um **avatar cyber**.
- Após entrar, o botão da Navbar mostrará o seu avatar e nome, dando acesso ao seu **Perfil de Estudante**, onde é possível acompanhar o andamento de suas sugestões e alterar a senha da conta.

---

## 🗄️ Banco de Dados & PostgreSQL

O Security X opera por padrão com um banco de dados autônomo e resiliente que inicializa automaticamente em `data/security_x_store.json`, sem exigir a instalação prévia de um servidor externo.

Entretanto, o sistema foi integralmente modelado com base nas normas relacionais do **PostgreSQL**.

### Arquivos SQL Disponíveis:
- `src/db/schema.sql`: Definição DDL completa das tabelas (`categories`, `vulnerabilities`, `suggestions`, `users`, `site_settings`), índices e restrições de integridade.
- `src/db/seeds.sql`: Inserção inicial das categorias e das 19 vulnerabilidades catalogadas (baseadas na UFPR, OWASP Top 10 e MITRE CWE).

### Como exportar para PostgreSQL:
1. Acesse o Painel de Administrador (`#admin`).
2. Acesse a aba **"Banco de Dados & PostgreSQL"**.
3. Clique em **"Exportar DDL & DML PostgreSQL (.sql)"**.
4. O arquivo `security_x_postgresql_dump.sql` será baixado com todos os dados atuais prontos para importação em qualquer instância de PostgreSQL (`psql -U postgres -d security_x -f security_x_postgresql_dump.sql`).

---

## 📂 Estrutura do Projeto

```text
├── data/
│   └── security_x_store.json      # Armazenamento persistente local
├── public/
│   └── assets/                    # PDFs e recursos públicos
├── src/
│   ├── assets/
│   │   ├── avatars/               # Galeria de avatares temáticos dos estudantes
│   │   └── images/                # Banners e imagens visuais
│   ├── components/
│   │   ├── AdminLogin.tsx          # Tela de login secreta para administradores
│   │   ├── AdminView.tsx           # Painel de operações administrativas e configurações
│   │   ├── AvatarDisplay.tsx       # Renderizador de avatares com badges
│   │   ├── FloatingSuggestionButton.tsx # Balão flutuante inferior para sugestões
│   │   ├── Footer.tsx              # Rodapé com microcadeado discreto
│   │   ├── HeroSection.tsx         # Aba 1: Título oficial, descrição, busca e filtros
│   │   ├── Navbar.tsx              # Barra de navegação com acesso ao perfil do estudante
│   │   ├── StreamingCatalog.tsx    # Aba 2: Carrosséis temáticos no estilo Netflix
│   │   ├── StudentAuthModal.tsx    # Modal de login/cadastro de estudantes
│   │   ├── StudentProfileView.tsx  # Tela de perfil, troca de senha e sugestões do estudante
│   │   ├── SuggestionsView.tsx     # Aba 3: Formulário de envio de novas fragilidades
│   │   └── VulnerabilityModal.tsx  # Modal de aprofundamento e detalhes da falha
│   ├── db/
│   │   ├── schema.sql              # Esquema DDL do PostgreSQL
│   │   ├── seeds.sql               # Carga inicial de dados SQL
│   │   └── store.ts                # Motor de persistência, auth hashes e exportador SQL
│   ├── App.tsx                     # Orquestrador de rotas e estado global
│   ├── index.css                   # Importação do Tailwind CSS v4
│   ├── main.tsx                    # Ponto de entrada do React
│   └── types.ts                    # Definições de tipos TypeScript
├── .env.example                    # Modelo de variáveis de ambiente
├── index.html                      # Ponto de entrada HTML do cliente
├── metadata.json                   # Metadados da aplicação
├── package.json                    # Dependências e scripts
├── server.ts                       # Backend full-stack Express integrado ao Vite
├── tsconfig.json                   # Configuração do TypeScript
└── vite.config.ts                  # Configuração do Vite e plugins
```

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor backend com Vite em modo desenvolvimento (`localhost:3000`). |
| `npm run build` | Compila o frontend TypeScript/React e gera os artefatos otimizados na pasta `dist/`. |
| `npm run start` | Executa o servidor backend em modo de produção. |
| `npm run preview` | Pré-visualiza localmente a versão compilada estática. |
| `npm run lint` | Valida a integridade dos tipos TypeScript (`tsc --noEmit`). |
| `npm run clean` | Remove a pasta `dist/` gerada no build. |

---

## ❓ Solução de Problemas Comuns

### 1. "Port 3000 is already in use"
Se a porta 3000 já estiver sendo utilizada por outro processo:
- No Linux/macOS: execute `fuser -k 3000/tcp` ou `lsof -ti:3000 | xargs kill -9`.
- No Windows: execute `netstat -ano | findstr :3000` e termine o PID correspondente via Gerenciador de Tarefas ou `taskkill /PID <PID> /F`.
- Ou simplesmente defina outra porta no arquivo `.env`: `PORT=3001`.

### 2. "E-mail inválido ao tentar se cadastrar como estudante"
O sistema exige formatos de e-mail autênticos para garantir a qualidade das sugestões acadêmicas. Use um e-mail com estrutura completa (ex: `seu.nome@faculdade.edu.br` ou `estudante@dominio.com`).

### 3. "Não consigo encontrar a tela de Admin no menu"
Isto é intencional: por diretriz de segurança e privacidade, a tela de admin não é exibida na navegação pública para estudantes. Pressione **`Ctrl + Shift + A`** ou acesse **`http://localhost:3000/#admin`**.

---

<div align="center">
  <sub>Security X • Desenvolvido para a formação e capacitação de futuros profissionais de Segurança da Informação.</sub>
</div>
