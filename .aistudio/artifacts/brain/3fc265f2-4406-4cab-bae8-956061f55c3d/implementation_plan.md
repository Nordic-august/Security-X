# Security X — Expansão com Vulnerabilidades Digitais (Artigo UFPR) e Portal Administrativo Restrito

Plano de evolução da plataforma Security X para integrar as vulnerabilidades contemporâneas derivadas do artigo científico *"Transformação, plataformas e vulnerabilidades digitais: proposição de uma abordagem para estudos de tecnologia"* (Botelho-Francisco, UFPR, 2025), acompanhado da segregação arquitetural do Painel Administrativo com autenticação restrita via login e senha exclusivos.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Decisões Alinhadas nas Perguntas de Clarificação (Fase 1):**
> - **Distribuição dos Novos Termos**: As novas fragilidades e conceitos fundamentados no artigo científico da UFPR serão distribuídos dentro das 5 categorias temáticas existentes do catálogo streaming (OWASP Web, Redes & Infraestrutura, Autenticação & Acesso, Criptografia & Dados, APIs & Microsserviços/IA), enriquecendo o repertório técnico e epistemológico sem romper o formato visual familiar.
> - **Acesso Restrito ao Painel Administrativo**: Criação de uma tela de login dedicada (`/admin/login` ou rota visual isolada), exigindo autenticação obrigatória com as credenciais especificadas pelo usuário:
>   - **Login**: `Secutiry159`
>   - **Senha**: `159_753.`
> - **Proteção do Painel**: O painel administrativo deixará de ser uma aba pública comum na barra de navegação; o menu principal terá apenas o link discreto "Acesso Restrito", e todas as rotas administrativas e ações de mutação na API exigirão validação de credencial/token de sessão.

---

### 1. Prévia do Site com as Novas Informações (Artigo UFPR)

O artigo científico examina como a transformação digital e a plataformização criam vulnerabilidades multidimensionais (técnico-científicas, materiais, geopolíticas, socioculturais e socioeconômicas). Com base nisso, o catálogo será expandido com **7 novas fragilidades fundamentais**:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│              PRÉVIA DAS NOVAS VULNERABILIDADES NO CATÁLOGO STREAMING             │
├─────────────────────────────────────────────────┬────────────────┬───────────────┤
│ Termo / Vulnerabilidade                         │ Categoria      │ Severidade    │
├─────────────────────────────────────────────────┼────────────────┼───────────────┤
│ 1. Racismo Algorítmico & Vieses em Machine      │ APIs & Cloud   │ Crítica       │
│    Learning (IA)                                │                │               │
│ 2. Envenenamento de Dados em IA (Data Poisoning │ APIs & Cloud   │ Alta          │
│    & Adversarial Machine Learning)              │                │               │
│ 3. Dataficação Abusiva & Capitalismo de         │ Criptografia & │ Alta          │
│    Vigilância (Zuboff / Couldry)                │ Dados          │               │
│ 4. Plataformização Monopolista & Lock-in de     │ Redes &        │ Média         │
│    Infraestrutura (Dependência Big Techs)       │ Infraestrutura │               │
│ 5. Vulnerabilidades em IoT & Indústria 4.0      │ Redes &        │ Alta          │
│    (Hiperconexão e Sensores Desprotegidos)      │ Infraestrutura │               │
│ 6. Obsolescência e Insegurança em               │ Redes &        │ Média         │
│    Materialidades Digitais (Hardware/Datacenters│ Infraestrutura │               │
│ 7. Manipulação Algorítmica e Dark Patterns      │ OWASP Top 10   │ Alta          │
│    (Engenharia Social Automatizada)             │                │               │
└─────────────────────────────────────────────────┴────────────────┴───────────────┘
```

#### Fichas Detalhadas das Novas Vulnerabilidades (Prévia de Conteúdo):

1. **Racismo Algorítmico & Vieses em Sistemas de IA (Machine Learning)**
   - *Categoria*: Segurança de APIs & Microsserviços / Inteligência Artificial
   - *Severidade*: Crítica | *CWE*: CWE-1039 / Algorithmic Bias
   - *Resumo Didático*: Falha sistêmica onde algoritmos treinados com bases desbalanceadas perpetuam e amplificam discriminações raciais, de gênero ou socioeconômicas em triagens automáticas, reconhecimento facial e concessão de serviços.
   - *Exemplo*: Algoritmo de reconhecimento facial em portais universitários com taxa de erro 34% maior em estudantes de pele escura, bloqueando acesso legítimo a exames e salas.
   - *Mitigação*: Auditorias algorítmicas de paridade, curadoria ética de datasets de treino e testes cegos de explicabilidade (XAI).

2. **Envenenamento de Dados em IA (Data Poisoning & Adversarial ML)**
   - *Categoria*: Segurança de APIs & Microsserviços
   - *Severidade*: Alta | *CWE*: CWE-1039
   - *Resumo Didático*: Inserção deliberada de dados maliciosos durante o treinamento ou fine-tuning de um modelo preditivo para criar backdoors ou induzir decisões errôneas específicas.
   - *Exemplo*: Invasor introduz amostras de spam rotuladas falsamente como e-mails legítimos no repositório de treinamento de um filtro corporativo, permitindo phishing direcionado sem detecção.
   - *Mitigação*: Validação criptográfica da proveniência dos datasets, filtragem estatística de anomalias no pipeline de ingestão e treinamento adversário.

3. **Dataficação Abusiva & Capitalismo de Vigilância**
   - *Categoria*: Criptografia & Vazamento de Dados
   - *Severidade*: Alta | *CWE*: CWE-359 (Exposição de Dados Privados)
   - *Resumo Didático*: Coleta desproporcional e opaca de rastros digitais (metadados, localização, biometria comportamental) para traçar perfis psicológicos e monetizar a atenção sem consentimento autêntico.
   - *Exemplo*: Aplicativo acadêmico que, além de notas, coleta silenciosamente geolocalização em segundo plano, identificadores de Wi-Fi e histórico de navegação, vendendo os dados para corretores de publicidade.
   - *Mitigação*: Princípio do *Privacy by Design*, minimização estrita de dados (LGPD/GDPR) e criptografia ponta a ponta com consentimento granular.

4. **Plataformização Monopolista & Lock-in de Infraestrutura**
   - *Categoria*: Redes & Infraestrutura
   - *Severidade*: Média | *CWE*: CWE-1188 (Insecure Default Infrastructure Dependency)
   - *Resumo Didático*: Concentração das tecnologias essenciais em ecossistemas fechados de Big Techs do Norte Global, reduzindo a soberania tecnológica de instituições e gerando pontos únicos de falha global.
   - *Exemplo*: Queda ou alteração unilateral de termos de serviço de um único provedor de nuvem que desativa simultaneamente hospitais, faculdades e sistemas governamentais dependentes de suas APIs proprietárias.
   - *Mitigação*: Adoção de arquiteturas multi-cloud, padrões abertos interoperáveis e fortalecimento de infraestruturas locais autônomas.

5. **Vulnerabilidades em IoT & Indústria 4.0 (Sensores e Dispositivos Hiperconectados)**
   - *Categoria*: Redes & Infraestrutura
   - *Severidade*: Alta | *CWE*: CWE-1274 (Insecure IoT Device Architecture)
   - *Resumo Didático*: Fragilidade em dispositivos inteligentes (câmeras, sensores industriais, atuadores e eletrodomésticos) com firmware desatualizado, credenciais de fábrica estáticas e falta de suporte a patches.
   - *Exemplo*: Câmeras IP de laboratórios universitários infectadas por botnets Mirai através da porta Telnet com senha padrão `admin:123456`, usadas em ataques DDoS globais.
   - *Mitigação*: Segmentação de rede em VLANs isoladas para dispositivos IoT, desativação de portas inseguras (Telnet/UPnP) e obrigatoriedade de troca de senhas no primeiro boot.

6. **Obsolescência e Insegurança em Materialidades Digitais (Hardware & Datacenters)**
   - *Categoria*: Redes & Infraestrutura
   - *Severidade*: Média | *CWE*: CWE-1189
   - *Resumo Didático*: Riscos decorrentes da camada física dos sistemas computacionais — desde vazamentos por canais laterais (Spectre/Meltdown no processador) até descarte físico incorreto de discos e dependência de cabos submarinos.
   - *Exemplo*: Servidores antigos mantidos em produção com vulnerabilidades conhecidas no firmware IPMI/BMC, permitindo controle remoto da placa-mãe mesmo com o sistema operacional desligado.
   - *Mitigação*: Sanitização e destruição criptográfica de mídias descontinuadas, monitoramento de canais laterais de CPU e planos de redundância física.

7. **Manipulação Algorítmica e Dark Patterns (Engenharia Social Automatizada)**
   - *Categoria*: OWASP Top 10 Web / Engenharia Social
   - *Severidade*: Alta | *CWE*: CWE-1021
   - *Resumo Didático*: Desenho intencional de fluxos de interface que induzem o usuário a conceder permissões excessivas, realizar compras indesejadas ou expor credenciais mediante estímulos cognitivos enganosos.
   - *Exemplo*: Pop-up com botão falso de "Fechar" que, ao ser clicado, na verdade aceita instalação de extensão maliciosa no navegador ou desativa autenticação de dois fatores.
   - *Mitigação*: Padrões de design ético, auditorias de UX voltadas à segurança e aplicação de regras regulatórias contra interfaces coercitivas.

---

### 2. Arquitetura do Portal Administrativo Restrito (Login & Senha)

#### A. Fluxo de Autenticação Segura

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ACESSO PÚBLICO (Estudantes)                     │
│  - Aba 1: Hero & Busca                                                 │
│  - Aba 2: Catálogo Streaming (Fileiras Temáticas)                      │
│  - Aba 3: Central de Sugestões                                         │
│  - Topbar Link: "Acesso Restrito" (abre o Portal de Login)             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Clique em "Acesso Restrito"
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     PORTAL DE LOGIN ADMINISTRATIVO                     │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Formulário Seguro de Autenticação:                             │  │
│  │  - Usuário: Secutiry159                                          │  │
│  │  - Senha:   159_753.                                             │  │
│  │  [ Botão: Autenticar Acesso Administrativo ]                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ POST /api/admin/login
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               SESSÃO ADMINISTRATIVA AUTENTICADA (Aba 4)                │
│  - Gerenciamento Total de Vulnerabilidades (Criar, Editar, Excluir)    │
│  - Moderação de Sugestões de Estudantes (Aprovar / Rejeitar)           │
│  - Exportação e Manutenção do Banco PostgreSQL                         │
│  - Botão visível de "Encerrar Sessão / Logout"                         │
└────────────────────────────────────────────────────────────────────────┘
```

#### B. Componentes Técnicos do Login

1. **Endpoint de Autenticação no Backend (`server.ts`)**:
   - `POST /api/admin/login`: Valida rigorosamente as credenciais fornecidas (`Secutiry159` e `159_753.`).
   - Retorna token de sessão assinado e perfil de administrador com timestamp de expiração.
   - Middleware de autorização para proteger rotas mutáveis (`POST /api/vulnerabilities`, `PUT /api/vulnerabilities/:id`, `DELETE /api/vulnerabilities/:id`, `PATCH /api/suggestions/:id/status`).
2. **Componente de Login no Frontend (`src/components/AdminLoginModal.tsx` ou tela de login dedicada)**:
   - Interface Cyber Dark sofisticada com proteção visual de senha (mostrar/ocultar senha), validação em tempo real e bloqueio de tentativas sucessivas com atraso artificial (anti-força bruta).
3. **Persistência de Sessão**:
   - Armazenamento em `sessionStorage` seguro (limpa ao fechar a guia) com botão de logout explícito no painel.

---

### 3. Key Product Decisions & Trade-Offs

- **Decisão 1: Distribuição das novas vulnerabilidades nas categorias existentes**:
  - *Abordagem*: Alocar os novos termos nas categorias pré-estabelecidas com tags explícitas referenciando o artigo da UFPR e os conceitos de plataformização/IA.
  - *Justificativa*: Mantém a consistência da experiência de catálogo streaming familiar aos estudantes enquanto expande a profundidade acadêmica do site.
- **Decisão 2: Segregação e Proteção do Painel Administrativo**:
  - *Abordagem*: Remover o acesso irrestrito da barra pública. Apenas usuários autenticados com o login `Secutiry159` e senha `159_753.` terão acesso à interface administrativa e aos endpoints de mutação.
  - *Justificativa*: Atende expressamente ao requisito de segurança e privacidade dos dados do catálogo solicitado pelo usuário.

---

### 4. Technical Architecture & File Updates

1. `src/db/seeds.sql` e `src/db/store.ts`:
   - Adicionar os 7 novos registros completos de vulnerabilidades com metadados do artigo científico da UFPR.
2. `server.ts`:
   - Implementar rota `POST /api/admin/login` e middleware de validação de autenticação para proteger operações administrativas.
3. `src/components/Navbar.tsx`:
   - Atualizar a navegação: se desautenticado, exibir link discreto "Acesso Restrito"; se autenticado, exibir "Painel Admin" com botão de logout rápido.
4. `src/components/AdminLogin.tsx`:
   - Nova tela / modal de autenticação dedicada com os campos de Login e Senha solicitados.
5. `src/components/AdminView.tsx`:
   - Integrar logout seguro e validação de sessão ativa antes de permitir visualização de termos e moderação.
6. `src/App.tsx`:
   - Gerenciar estado global de autenticação `isAdminAuthenticated` e roteamento seguro.
