# Novidades no Wallarm node (se estiver atualizando a partir de um node EOL)

Esta página lista as mudanças disponíveis ao atualizar o node da versão depreciada (3.6 e inferior) para a versão 4.8. As mudanças listadas estão disponíveis tanto para os nodes Wallarm regulares (cliente) quanto multi-tenant.

!!! warning "Nodes Wallarm 3.6 ou inferiores estão descontinuados"
    Os nodes Wallarm 3.6 e inferiores são recomendados para serem atualizados, pois estão [descontinuados](../versioning-policy.md#version-list).

    A configuração do node e a filtragem de tráfego foram significativamente simplificadas no node Wallarm da versão 4.x. Algumas configurações do node 4.x são **incompatíveis** com os nodes de versões anteriores. Antes de atualizar os módulos, revise cuidadosamente a lista de alterações e [recomendações gerais](../general-recommendations.md).

## Instalador all-in-one

Agora, ao instalar e atualizar o node Wallarm como um módulo dinâmico para NGINX em vários ambientes, você pode usar o **instalador all-in-one** projetado para simplificar e padronizar o processo de instalação. Este instalador identifica automaticamente as versões do seu sistema operacional e NGINX e instala todas as dependências necessárias.

O instalador simplifica o processo executando automaticamente as seguintes ações:

1. Verificando a versão do seu sistema operacional e NGINX.
1. Adicionando repositórios Wallarm para o sistema operacional e versão NGINX detectados.
1. Instalando pacotes Wallarm desses repositórios.
1. Conectando o módulo Wallarm instalado ao seu NGINX.
1. Conectando o node de filtragem ao Wallarm Cloud usando o token fornecido.

[Veja detalhes sobre como implantar o node com o instalador all-in-one →](../../installation/nginx/all-in-one.md)

## Alterações importantes devido às métricas excluídas

A partir da versão 4.0, o node Wallarm não coleta as seguintes métricas collectd:

* `curl_json-wallarm_nginx/gauge-requests` - você pode usar a métrica [`curl_json-wallarm_nginx/gauge-abnormal`](../../admin-en/monitoring/available-metrics.md#number-of-requests) como alternativa
* `curl_json-wallarm_nginx/gauge-attacks`
* `curl_json-wallarm_nginx/gauge-blocked`
* `curl_json-wallarm_nginx/gauge-time_detect`
* `curl_json-wallarm_nginx/derive-requests`
* `curl_json-wallarm_nginx/derive-attacks`
* `curl_json-wallarm_nginx/derive-blocked`
* `curl_json-wallarm_nginx/derive-abnormal`
* `curl_json-wallarm_nginx/derive-requests_lost`
* `curl_json-wallarm_nginx/derive-tnt_errors`
* `curl_json-wallarm_nginx/derive-api_errors`
* `curl_json-wallarm_nginx/derive-segfaults`
* `curl_json-wallarm_nginx/derive-memfaults`
* `curl_json-wallarm_nginx/derive-softmemfaults`
* `curl_json-wallarm_nginx/derive-time_detect`

## Limites de taxa

A falta de limitação de taxa adequada tem sido um problema significativo para a segurança da API, pois os invasores podem lançar solicitações de alto volume causando uma negação de serviço (DoS) ou sobrecarregar o sistema, prejudicando os usuários legítimos.

Com o recurso de limitação de taxa do Wallarm, suportado desde o node Wallarm 4.6, as equipes de segurança podem gerenciar efetivamente a carga do serviço e evitar falsos alarmes, garantindo que o serviço permaneça disponível e seguro para os usuários legítimos. Este recurso oferece vários limites de conexão com base em parâmetros de solicitação e sessão, incluindo limitação de taxa baseada em IP tradicional, campos JSON, dados codificados em base64, cookies, campos XML e muito mais.

Por exemplo, você pode limitar as conexões API para cada usuário, impedindo que façam milhares de solicitações por minuto. Isso sobrecarregaria seus servidores e poderia causar a queda do serviço. Implementando a limitação de taxa, você pode proteger seus servidores de sobrecarga e garantir que todos os usuários tenham acesso justo à API.

Você pode configurar facilmente os limites de taxa na interface de usuário do Wallarm Console → **Regras** → **Definir limite de taxa** especificando o escopo do limite de taxa, taxa, burst, delay e código de resposta para seu caso de uso específico.

[Guia de configuração do limite de taxa →](../../user-guides/rules/rate-limiting.md)

Embora a regra de limitação de taxa seja o método recomendado para configurar o recurso, você também pode configurar os limites de taxa usando as novas diretivas NGINX:

* [`wallarm_rate_limit`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit)
* [`wallarm_rate_limit_enabled`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_enabled)
* [`wallarm_rate_limit_log_level`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_log_level)
* [`wallarm_rate_limit_status_code`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_status_code)
* [`wallarm_rate_limit_shm_size`](../../admin-en/configure-parameters-en.md#wallarm_rate_limit_shm_size)

## Detecção de novos tipos de ataque

O Wallarm detecta novos tipos de ataque:

* [Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa1-broken-object-level-authorization.md) (BOLA), também conhecida como [Insecure Direct Object References](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/04-Testing_for_Insecure_Direct_Object_References) (ou IDOR), tornou-se uma das vulnerabilidades de API mais comuns. Quando um aplicativo inclui uma vulnerabilidade IDOR / BOLA, há uma grande probabilidade de expor informações sensíveis ou dados para invasores. Tudo o que os invasores precisam fazer é trocar o ID de seu próprio recurso na chamada da API por um ID de um recurso pertencente a outro usuário. A ausência de verificações adequadas de autorização permite que os invasores tenham acesso ao recurso especificado. Assim, todo endpoint da API que recebe um ID de um objeto e realiza qualquer tipo de ação no objeto pode ser um alvo de ataque.

    Para evitar a exploração desta vulnerabilidade, o node Wallarm 4.2 e superiores contém um [novo gatilho](../../admin-en/configuration-guides/protecting-against-bola.md) que você pode usar para proteger seus endpoints de ataques BOLA. O gatilho monitora o número de solicitações a um endpoint específico e cria um evento de ataque BOLA quando os limites do gatilho são excedidos.
* [Mass Assignment](../../attacks-vulns-list.md#mass-assignment)

    Durante um ataque de Mass Assignment, os invasores tentam vincular os parâmetros de solicitação HTTP a variáveis ​​ou objetos de código de programa. Se uma API for vulnerável e permitir a vinculação, os invasores podem alterar propriedades sensíveis do objeto que não se destinam a ser expostas, o que pode levar a escalada de privilégios, contornar mecanismos de segurança e muito mais.
* [SSRF](../../attacks-vulns-list.md#serverside-request-forgery-ssrf)

    Um ataque SSRF bem-sucedido pode permitir que um invasor faça solicitações em nome do servidor da web atacado; isso potencialmente leva a revelar as portas de rede do aplicativo da web em uso, varrer as redes internas, e contornar a autorização.

## Verificando a força do JSON Web Token

[JSON Web Token (JWT)](https://jwt.io/) é um padrão de autenticação popular usado para trocar dados entre recursos como APIs de forma segura. A comprometimento do JWT é um objetivo comum dos invasores, pois a violação dos mecanismos de autenticação fornece a eles acesso total a aplicativos da web e APIs. Quanto mais fracos os JWTs, maior a chance de serem comprometidos.

A partir da versão 4.4, você pode habilitar o Wallarm para detectar as seguintes fraquezas JWT:

* JWTs não criptografados
* JWTs assinados usando chaves secretas comprometidas

Para habilitar, use o gatilho [**Weak JWT**](../../user-guides/triggers/trigger-examples.md#detect-weak-jwts).

## Verificando JSON Web Tokens para ataques

O JSON Web Token (JWT) é um dos métodos de autenticação mais populares. Isso o torna uma ferramenta favorita para realizar ataques (como SQLi ou RCE) que são muito difíceis de encontrar porque os dados do JWT são codificados e podem estar localizados em qualquer lugar na solicitação.

O node Wallarm 4.2 e acima encontra o JWT em qualquer lugar da solicitação, [decodifica](../../user-guides/rules/request-processing.md#jwt) e bloqueia (no [modo de filtração](../../admin-en/configure-wallarm-mode.md) apropriado) quaisquer tentativas de ataque por este método de autenticação.

## Suporte para opções de instalação

* Controlador de Ingresso Wallarm baseado na última versão do Controlador de Ingresso NGINX da comunidade, 1.9.5.

    [Instruções sobre migração para o controlador de ingresso Wallarm →](ingress-controller.md)
* Adicionado suporte para AlmaLinux, Rocky Linux e Oracle Linux 8.x no lugar do CentOS 8.x [descontinuado](https://www.centos.org/centos-linux-eol/).

    Os pacotes do node Wallarm para os sistemas operacionais alternativos serão armazenados no repositório CentOS 8.x.
* Adicionado suporte para Debian 11 Bullseye
* Adicionado suporte para Ubuntu 22.04 LTS (jammy)
* Suporte removido para CentOS 6.x (CloudLinux 6.x)
* Suporte removido para Debian 9.x
* Suporte removido para Debian 10.x para Wallarm ser instalado como o módulo para NGINX estável ou NGINX Plus.
* Suporte removido para o sistema operacional Ubuntu 16.04 LTS (xenial)
* A versão de Envoy usada na [imagem Docker baseada em Envoy do Wallarm](../../admin-en/installation-guides/envoy/envoy-docker.md) aumentou para [1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4)

[Veja a lista completa de opções de instalação suportadas →](../../installation/supported-deployment-options.md)

## Novo método para implantação de node Wallarm sem servidor

O novo método de implantação permite que você configure o node CD Wallarm fora de sua infraestrutura em 15 minutos. Você só precisa apontar para o domínio a ser protegido e adicionar o registro CNAME Wallarm aos registros DNS do domínio.

[Instruções de implantação do node CDN](../../installation/cdn-node.md)

## Requisitos do sistema para a instalação do node de filtragem

* O node de filtragem agora suporta [lista de permissões, lista de negação e lista cinza](../../user-guides/ip-lists/overview.md) de endereços IP. O Wallarm Console permite adicionar IPs únicos e **países** ou **data centers** a qualquer tipo de lista de IPs.

    O node Wallarm baixa uma lista atual de endereços IP registrados em países, regiões ou data centers incluídos na lista de permissões, lista de negação ou lista cinza do armazenamento GCP. Por padrão, o acesso a esse armazenamento pode estar restrito em seu sistema. Permitir acesso ao armazenamento GCP é um novo requisito para a máquina virtual instalar o node de filtragem.

    [Faixa de endereços IP do GCP que devem ser permitidos →](https://www.gstatic.com/ipranges/goog.json)
* O node de filtragem agora envia dados para a nuvem usando `us1.api.wallarm.com:443` (US Cloud) e `api.wallarm.com:443` (EU Cloud) em vez de `us1.api.wallarm.com:444` e `api.wallarm.com:444`.

    Se o seu servidor com o node implantado tiver acesso limitado aos recursos externos e o acesso for concedido a cada recurso separadamente, após a atualização para a versão 4.x, a sincronização entre o node de filtragem e a nuvem será interrompida. O node atualizado precisa ter acesso concedido ao endpoint da API com a nova porta.

## Unificação do registro dos nodes na Wallarm Cloud por tokens

Com o novo lançamento do Wallarm node, o registro baseado em e-mail e senha dos nodes Wallarm na nuvem foi removido. Agora é obrigatório mudar para o novo método de registro de node baseado em token para continuar com o Wallarm node 4.8.

O novo lançamento permite que você registre o node Wallarm na nuvem Wallarm pelo **token** em [qualquer plataforma suportada](../../installation/supported-deployment-options.md), garantindo uma conexão mais segura e rápida com a nuvem Wallarm da seguinte maneira:

* Contas de usuário dedicadas com o papel **Implantar** permitindo apenas instalar o node não são mais necessárias.
* Os dados dos usuários permanecem armazenados de forma segura na nuvem Wallarm.
* A autenticação de dois fatores ativada para as contas de usuário não impede que os nodes sejam registrados na nuvem Wallarm.
* Os módulos de processamento de tráfego inicial e pós-análise de solicitações implantados em servidores separados podem ser registrados na nuvem por um token de node.

Alterações no método de registro do node resultam em algumas atualizações nos tipos de nodes:

* O node que suporta o registro unificado por token tem o tipo **Node Wallarm**. O script a ser executado no servidor para registrar o node é nomeado `register-node`.

    Anteriormente, o node Wallarm era denominado [**node nuvem**](/2.18/user-guides/nodes/cloud-node/). Ele também suportava registro por token, mas com um script diferente chamado de `addcloudnode`.

    O node nuvem não precisa ser migrado para o novo tipo de node.
* O [**node regular**](/2.18/user-guides/nodes/regular-node/) que suporta o registro por "e-mail-senha" passado para o script `addnode` está descontinuado.

    A partir da versão 4.0, o registro do node implantado como NGINX, módulo NGINX Plus ou contêiner Docker é da seguinte forma:

    1. Crie o **Node Wallarm** no Wallarm Console e copie o token gerado.
    1. Execute o script `register-node` com o token do node passado ou execute o contêiner Docker com a variável `WALLARM_API_TOKEN` definida.

    !!! info "Suporte ao node regular"
        O tipo de node regular está descontinuado no lançamento 4.x e será removido em lançamentos futuros.

        Recomenda-se substituir o node regular pelo **Node Wallarm** antes que o tipo regular seja removido. Você encontrará as instruções apropriadas nos guias de atualização do node.

## Módulo Terraform para implantação do Wallarm na AWS

A partir do lançamento 4.0, você pode implantar facilmente o Wallarm na [AWS](https://aws.amazon.com/) a partir do ambiente baseado em Infraestrutura como Código (IaC) usando o [módulo Wallarm do Terraform](https://registry.terraform.io/modules/wallarm/wallarm/aws/).

O módulo Wallarm Terraform é a solução escalável que atende aos melhores padrões do setor de segurança e failover garantindo. Durante sua implantação, você pode escolher a opção de implantação **proxy** ou **espelho** com base em seus requisitos para o fluxo de tráfego.

Também preparamos exemplos de uso para ambas as opções de implantação, envolvendo configurações básicas de implantação e também avançadas compatíveis com soluções como AWS VPC Traffic Mirroring.

[Documentação sobre o módulo Wallarm Terraform para AWS](../../installation/cloud-platforms/aws/terraform-module/overview.md)

## Coleta de estatísticas de solicitações bloqueadas de fontes em blacklist

A partir da versão 4.8, os nodes filtrantes do Wallarm baseados em NGINX agora coletam estatísticas de solicitações que foram bloqueadas quando sua fonte é encontrada na lista de proibidos, aprimorando sua capacidade de avaliar a força do ataque. Isso inclui acesso às estatísticas de solicitações bloqueadas e suas amostras, ajudando você a minimizar a atividade não notada. Você pode encontrar esses dados na seção **Eventos** da interface do usuário do Wallarm Console.

Ao usar o bloqueio automático de IP (por exemplo, com o gatilho de força bruta configurado), agora você pode analisar as solicitações de disparo iniciais e as amostras de solicitações bloqueadas subsequentes. Para solicitações bloqueadas devido à inclusão manual de suas fontes na lista de privação, a nova funcionalidade aprimora a visibilidade das ações das fontes bloqueadas.

Introduzimos novas [tags e filtros de pesquisa](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) na seção **Eventos** para acessar facilmente os dados recém-introduzidos:

* Utilize a pesquisa `blocked_source` para identificar solicitações que foram bloqueadas devido à inclusão manual de endereços IP, sub-redes, países, VPNs e muito mais.
* Empregue a pesquisa `multiple_payloads` para identificar solicitações bloqueadas pelo gatilho **Número de cargas úteis maliciosas**. Este gatilho é projetado para adicionar à lista de negação as fontes que originam solicitações maliciosas contendo várias cargas úteis, uma característica comum dos perpetradores de ataques múltiplos.
* Além disso, as tags de pesquisa `api_abuse`, `brute`, `dirbust` e `bola` agora abrangem solicitações cujas fontes foram adicionadas automaticamente à lista de negações pelos gatilhos Wallarm relevantes para seus respectivos tipos de ataque.

Esta mudança introduz os novos parâmetros de configuração que por padrão são configurados como `on` para habilitar a funcionalidade, mas podem ser alterados para `off` para desabilitá-la:

* A diretiva NGINX [`wallarm_acl_export_enable`](../../admin-en/configure-parameters-en.md#wallarm_acl_export_enable).
* O valor [`controller.config.wallarm-acl-export-enable`](../../admin-en/configure-kubernetes-en.md#global-controller-settings) para o gráfico do Controlador de Ingresso NGINX.
* O valor do gráfico [`config.wallarm.aclExportEnable`](../../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#configwallarmaclexportenable) e a anotação do pod [`sidecar.wallarm.io/wallarm-acl-export-enable`](../../installation/kubernetes/sidecar-proxy/pod-annotations.md) para a solução do Controlador Sidecar.

## Imagem Wallarm AWS distribuída com o script `cloud-init.py` pronto para uso

Se você seguir a abordagem de Infraestrutura como Código (IaC), pode precisar usar o script [`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html) para implantar o node Wallarm na AWS. A partir do lançamento 4.0, o Wallarm distribui sua imagem na nuvem AWS com o script `cloud-init.py` pronto para uso.

[Especificação do script `cloud-init` do Wallarm](../../installation/cloud-platforms/cloud-init.md)

## Configuração simplificada do node multi-tenant

Para os [nodes multi-tenant](../../installation/multi-tenant/overview.md), os inquilinos e os aplicativos são agora definidos cada um com sua própria diretiva:

* A diretiva NGINX [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) e o parâmetro do Envoy [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#partner_client_id_param) foram adicionados para configurar o identificador exclusivo de um inquilino.
* O comportamento da diretiva NGINX [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) e do parâmetro do Envoy [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#application_param) foi alterado. Agora é **apenas** usado para configurar um ID de aplicação.

[Instruções de atualização do node multi-tenant](../multi-tenant.md)

## Modos de Filtragem

* Novo modo de filtragem **safe blocking**.

    Este modo permite uma redução significativa do número de [falsos positivos](../../about-wallarm/protecting-against-attacks.md#false-positives) bloqueando apenas solicitações maliciosas originadas de [endereços IP listados cinza](../../user-guides/ip-lists/graylist.md).
* A análise das fontes de requisição é agora realizada apenas nos modos `safe_blocking` e `block`.
    
    * Se o node Wallarm operando no modo `off` ou `monitoring` detectar a solicitação originada do IP [lista de negação](../../user-guides/ip-lists/denylist.md), ele não bloqueará essa solicitação.
    * O node Wallarm operando no modo `monitoring` envia todos os ataques originados dos [endereços IP da lista de permissões](../../user-guides/ip-lists/allowlist.md) para a nuvem Wallarm.

[Mais detalhes sobre os modos do node Wallarm →](../../admin-en/configure-wallarm-mode.md)

## Controle de Fonte de Requisição

Os seguintes parâmetros para controle da fonte de requisição foram descontinuados:

* Todas as diretivas `acl` do NGINX, parâmetros do Envoy e variáveis ​​de ambiente usados ​​para configurar a lista de negação de endereços IP. A configuração manual de IP na lista de negação não é mais necessária.

    [Detalhes sobre a migração da configuração da lista de negação →](../migrate-ip-lists-to-node-3.md)

Existem os seguintes novos recursos para controle da fonte da requisição:

* Seção do Wallarm Console para controle total da lista de permissões, lista de negação e lista cinza de endereços IP.
* Suporte para novo [modo de filtragem](../../admin-en/configure-wallarm-mode.md) `safe_blocking` e [lista de endereços IP cinza](../../user-guides/ip-lists/graylist.md).

    O modo **safe blocking** permite uma redução significativa do número de [falsos positivos](../../about-wallarm/protecting-against-attacks.md#false-positives) bloqueando apenas solicitações maliciosas originadas de endereços IP cinza.

    Para a lista de endereços IP cinza automática, existe um novo [gatilho **Adicionar à lista cinza**](../../user-guides/triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) lançado.
* Permissibilidade automática de [Endereços IP do Scanner de Vulnerabilidade Wallarm](../../about-wallarm/detecting-vulnerabilities.md#vunerability-scanner). A permissibilidade manual dos endereços IP do Scanner não é mais necessária.
* Capacidade de permitir, negar ou adicionar à lista cinza uma sub-rede, IPs da rede Tor, IPs da VPN, um grupo de endereços IP registrados em um país, região ou data center específicos.
* Capacidade de permitir, negar ou adicionar à lista cinza fontes de solicitações para aplicativos específicos.
* Nova diretiva NGINX e parâmetro Envoy `disable_acl` para desabilitar a análise de origem da solicitação.

    [Detalhes sobre a diretiva `disable_acl` do NGINX →](../../admin-en/configure-parameters-en.md#disable_acl)

    [Detalhes sobre o parâmetro `disable_acl` do Envoy →](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

[Detalhes sobre como adicionar IPs à lista de permissões, lista de negações e lista cinza →](../../user-guides/ip-lists/overview.md)

## Novo módulo para descoberta de inventário de API

Novos nodes Wallarm são distribuídos com o módulo **API Discovery** que identifica a API do aplicativo automaticamente. O módulo está desativado por padrão.

[Detalhes sobre o módulo API Discovery →](../../about-wallarm/api-discovery.md)

## Análise de ataque aprimorada com a biblioteca libdetection

A análise de ataques realizada pelo Wallarm foi aprimorada envolvendo uma camada adicional de validação de ataques. O node Wallarm 4.4 e superior em todos os fatores de forma (incluindo Envoy) são distribuídos com a biblioteca libdetection habilitada por padrão. Esta biblioteca realiza uma validação secundária totalmente baseada em gramática de todos os [ataques SQLi](../../attacks-vulns-list.md#sql-injection), reduzindo o número de falsos positivos detectados entre as injeções SQL.

!!! warning "Aumento do consumo de memória"
    Com a biblioteca **libdetection** habilitada, a quantidade de memória consumida pelos processos NGINX/Envoy e Wallarm pode aumentar cerca de 10%.

[Detalhes sobre como o Wallarm detecta ataques →](../../about-wallarm/protecting-against-attacks.md)

## A regra permitindo a detecção de ataques `overlimit_res` ajustados

Introduzimos a nova [regra que permite a detecção de ataques `overlimit_res` ajustados](../../user-guides/rules/configure-overlimit-res-detection.md).

O ajuste da detecção de ataque `overlimit_res` por meio de arquivos de configuração NGINX e Envoy é considerado obsoleto:

* A regra permite definir um único limite de tempo de processamento de solicitação, assim como a diretiva NGINX `wallarm_process_time_limit` e o parâmetro Envoy `process_time_limit` faziam antes.
* A regra permite bloquear ou passar os ataques `overlimit_res` de acordo com o [modo de filtragem do node](../../admin-en/configure-wallarm-mode.md), em vez da configuração da diretiva NGINX `wallarm_process_time_limit_block` e do parâmetro Envoy `process_time_limit_block`.

Os parâmetros listados foram descontinuados e serão removidos em futuras versões. Recomenda-se transferir a configuração de detecção de ataque `overlimit_res` das diretivas para a regra antes. Instruções relevantes são fornecidas para cada [opção de implantação do node](../general-recommendations.md#update-process).

Se os parâmetros listados são explicitamente especificados nos arquivos de configuração e a regra ainda não foi criada, o node processa as solicitações conforme definido nos arquivos de configuração.

## Nova página de bloqueio

A página de bloqueio de amostra `/usr/share/nginx/html/wallarm_blocked.html` foi atualizada. Na nova versão do node, ela tem um novo layout e suporta a personalização do logotipo e do e-mail de suporte.

A nova página de bloqueio com o novo layout fica assim por padrão:

![Página de bloqueio do Wallarm](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

[Mais detalhes sobre a configuração da página de bloqueio →](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)

## Novos parâmetros para configuração básica do node

* Novas variáveis ​​de ambiente a serem passadas para o contêiner Docker Wallarm baseado em NGINX:

    * `WALLARM_APPLICATION` para definir o identificador do aplicativo protegido a ser usado na nuvem Wallarm.
    * `NGINX_PORT` para definir uma porta que o NGINX usará dentro do contêiner Docker.

    [Instruções sobre a implantação do contêiner Docker Wallarm baseado em NGINX →](../../admin-en/installation-docker-en.md)
* Novos parâmetros do arquivo `node.yaml` para configurar a sincronização da nuvem Wallarm e dos nodes filtrantes: `api.local_host` e `api.local_port`. Os novos parâmetros permitem especificar um endereço IP local e uma porta da interface de rede para enviar solicitações para a API Wallarm.

    [Veja a lista completa de parâmetros `node.yaml` para configurar a sincronização da nuvem Wallarm e dos nodes filtrantes →](../../admin-en/configure-cloud-node-synchronization-en.md#access-parameters)

## Desativando conexões IPv6 para o contêiner Docker Wallarm baseado em NGINX

A imagem Docker do Wallarm baseada em NGINX 4.2 e superior suporta a nova variável de ambiente `DISABLE_IPV6`. Esta variável permite que você impeça o NGINX de processar conexões IPv6, de modo que ele só pode processar conexões IPv4.

## Parâmetros, arquivos e métricas renomeados

* As seguintes diretivas NGINX e parâmetros do Envoy foram renomeados:

    * NGINX: `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * NGINX: `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * NGINX: `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * NGINX: `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)
    * Envoy: `lom` → [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * Envoy: `instance` → [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)
    * Envoy: seção `tsets` → `rulesets`, e correspondentemente as entradas `tsN` nesta seção → `rsN`
    * Envoy: `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * Envoy: `ts` → [`ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)

    Os parâmetros com os nomes anteriores ainda são compatíveis, mas serão descontinuados em lançamentos futuros. A lógica do parâmetro não mudou.
* A [anotação](../../admin-en/configure-kubernetes-en.md#ingress-annotations) Ingress `nginx.ingress.kubernetes.io/wallarm-instance` foi renomeada para `nginx.ingress.kubernetes.io/wallarm-application`.

    A anotação com o nome anterior ainda é compatível, mas será descontinuada em lançamentos futuros. A lógica da anotação não mudou.
* O arquivo com a compilação do conjunto de regras personalizado `/etc/wallarm/lom` foi renomeado para `/etc/wallarm/custom_ruleset`. No sistema de arquivos das novas versões do node, existe apenas o arquivo com o novo nome.

    Os valores padrão da diretiva NGINX [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path) e o parâmetro Envoy [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings) foram alterados adequadamente. O novo valor padrão é `/etc/wallarm/custom_ruleset`.
* O arquivo de chave privada `/etc/wallarm/license.key` foi renomeado para `/etc/wallarm/private.key`. A partir da versão do node 4.0, o novo nome é usado por padrão.
* A métrica collectd `gauge-lom_id` foi renomeada para `gauge-custom_ruleset_id`.

    Nas novas versões do node, o serviço collectd coleta tanto a métrica depreciada quanto a nova. A coleta da métrica depreciada será interrompida em lançamentos futuros.

    [Todas as métricas collectd →](../../admin-en/monitoring/available-metrics.md#nginx-metrics-and-nginx-wallarm-module-metrics)
* O [arquivo de log](../../admin-en/configure-logging.md) `/var/log/wallarm/addnode_loop.log` nos contêineres Docker foi renomeado para `/var/log/wallarm/registernode_loop.log`.

## Parâmetros do serviço de estatísticas

* A métrica Prometheus `wallarm_custom_ruleset_id` foi aprimorada com a adição de um atributo `format`. Este novo atributo representa o formato do conjunto de regras personalizado. Enquanto isso, o valor principal continua sendo a versão de construção do conjunto de regras personalizado. Aqui está um exemplo do valor atualizado de `wallarm_custom_ruleset_id`:

    ```
    wallarm_custom_ruleset_id{format="51"} 386
    ```
* O serviço de estatísticas Wallarm retorna os novos parâmetros `rate_limit` com os dados do módulo de [limitação de taxa Wallarm](#rate-limits). Os novos parâmetros cobrem solicitações rejeitadas e atrasadas, bem como indicam quaisquer problemas com a operação do módulo.
* O número de solicitações originadas de IPs na lista de proibições agora é exibido na saída do serviço de estatísticas, no novo parâmetro `blocked_by_acl` e nos parâmetros existentes `requests`, `blocked`.
* O serviço retorna mais um novo parâmetro `custom_ruleset_ver` que aponta para o [conjunto de regras personalizado](../../glossary-en.md#custom-ruleset-the-former-term-is-lom) que está sendo usado pelos nodes Wallarm.
* Os seguintes parâmetros de estatísticas do node foram renomeados:

    * `lom_apply_time` → `custom_ruleset_apply_time`
    * `lom_id` → `custom_ruleset_id`

    Nas novas versões do node, o endpoint `http://127.0.0.8/wallarm-status` retorna temporariamente tanto os parâmetros depreciados quanto os novos. Os parâmetros depreciados serão removidos da saída do serviço em lançamentos futuros.

[Detalhes sobre o serviço de estatísticas →](../../admin-en/configure-statistics-service.md)

## Novas variáveis para configurar o formato de log do node

As seguintes [variáveis de log do node](../../admin-en/configure-logging.md#filter-node-variables) foram alteradas:

* `wallarm_request_time` foi renomeado para `wallarm_request_cpu_time`

    Esta variável representa o tempo em segundos que a CPU passou processando a solicitação.

    A variável com o nome anterior está descontinuada e será removida em futuras versões. A lógica da variável não mudou.
* `wallarm_request_mono_time` foi adicionado

    Esta variável representa o tempo em segundos que a CPU passou processando a solicitação + tempo na fila.

## Aumentando o desempenho omitindo a busca de ataques em solicitações de IPs na lista de proibições

A nova diretiva [`wallarm_acl_access_phase`](../../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) permite que você aumente o desempenho do node Wallarm omitindo a etapa de busca de ataque durante a análise de solicitações de IPs [listados para negação](../../user-guides/ip-lists/denylist.md). Esta opção de configuração é útil se houver muitos IPs na lista de proibição (por exemplo, países inteiros) produzindo tráfego intenso que carrega pesadamente a CPU da máquina de trabalho.

## Agrupamento fácil de instâncias de nodes

Agora você pode facilmente agrupar instâncias de nodes usando um [**API token**](../../user-guides/settings/api-tokens.md) com o papel `Deploy` para sua instalação juntamente com a variável `WALLARM_LABELS` e seu rótulo `group`.

Por exemplo:

```bash
docker run -d -e WALLARM_API_TOKEN='<API TOKEN WITH DEPLOY ROLE>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -e WALLARM_LABELS='group=<GROUP>' -p 80:80 wallarm/node:4.8.0-1
```
...colocará a instância do node no grupo de instâncias `<GROUP>` (existente, ou, se não existir, será criado).

## Processo de atualização

1. Revise as [recomendações para atualização de módulos](../general-recommendations.md).
2. Atualize os módulos instalados seguindo as instruções para a opção de instalação do node Wallarm:

      * [Atualizando módulos para NGINX, NGINX Plus](nginx-modules.md)
      * [Atualizando o contêiner Docker com os módulos para NGINX ou Envoy](docker-container.md)
      * [Atualizando o Controlador de Ingresso NGINX com os módulos Wallarm integrados](ingress-controller.md)
      * [Imagem de node na nuvem](cloud-image.md)
      * [Node multi-tenant](multi-tenant.md)
      * [Node CDN](../cdn-node.md)
3. [Migre](../migrate-ip-lists-to-node-3.md) a configuração de lista de permissões e lista de proibição das versões anteriores do Wallarm node para 4.8.

----------

[Outras atualizações nos produtos e componentes Wallarm →](https://changelog.wallarm.com/)