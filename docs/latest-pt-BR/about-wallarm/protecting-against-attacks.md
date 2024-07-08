# Detectando ataques

A plataforma Wallarm analisa continuamente o tráfego de aplicativos e mitiga solicitações maliciosas em tempo real. Neste artigo, você aprenderá os tipos de recursos que Wallarm protege de ataques, os métodos de detecção de ataques no tráfego e como você pode rastrear e gerenciar ameaças detectadas.

## O que é um ataque e quais são os componentes de um ataque?

<a name="attack"></a>**Ataque** é um único hit ou vários hits agrupados pelas seguintes características:

* O mesmo tipo de ataque, o parâmetro com a carga útil maliciosa e o endereço para onde os hits foram enviados. Os hits podem vir do mesmo ou de diferentes endereços IP e ter diferentes valores das cargas úteis maliciosas dentro de um tipo de ataque.

    Este método de agrupamento de hits é básico e aplicado a todos os hits.
* O mesmo endereço IP de origem se o [trigger](../user-guides/triggers/trigger-examples.md#group-hits-originating-from-the-same-ip-into-one-attack) apropriado está habilitado. Outros valores de parâmetros de hit podem diferir.

    Este método de agrupamento de hits funciona para todos os hits, exceto para os dos tipos de ataque Brute force, Forced browsing, BOLA (IDOR), Resource overlimit, Data bomb e Virtual patch.

    Se os hits são agrupados por este método, o botão [**Marcar como falso positivo**](../user-guides/events/false-attack.md#mark-an-attack-as-a-false-positive) e a opção de [verificação ativa](detecting-vulnerabilities.md#active-threat-verification) estão indisponíveis para o ataque.

Os métodos de agrupamento de hits listados acima não se excluem mutuamente. Se os hits possuírem características de ambos os métodos, eles serão agrupados em um único ataque.

<a name="hit"></a>**Hit** é uma solicitação maliciosa serializada (solicitação maliciosa original e metadados adicionados pelo nó Wallarm). Se a Wallarm detectar várias cargas úteis maliciosas de diferentes tipos em uma solicitação, Wallarm registrará vários hits com cargas úteis de um tipo em cada um.

<a name="malicious-payload"></a>**Carga maliciosa** é uma parte de uma solicitação original contendo os seguintes elementos:

* Sinais de ataque detectados em uma solicitação. Se vários sinais de ataque caracterizando o mesmo tipo de ataque forem detectados em uma solicitação, apenas o primeiro sinal será gravado em uma carga útil.
* Contexto do sinal de ataque. Contexto é um conjunto de símbolos que precedem e fecham sinais de ataque detectados. Como o comprimento de uma carga útil é limitado, o contexto pode ser omitido se um sinal de ataque for de comprimento total de carga útil.

    Como os sinais de ataque não são usados ​​para detectar [ataques comportamentais](#behavioral-attacks), as solicitações enviadas como parte de ataques comportamentais têm cargas úteis vazias.

## Tipos de ataque
A solução Wallarm protege APIs, microsserviços e aplicações web de ameaças OWASP API Top 10, abuso de API e outras ameaças automatizadas.

Tecnicamente, [todos os ataques](../attacks-vulns-list.md) que podem ser detectados pelo Wallarm são divididos em grupos:

* Ataques de validação de entrada
* Ataques comportamentais

O método de detecção de ataques depende do grupo de ataque. Para detectar ataques comportamentais, é necessária uma configuração adicional do nó Wallarm.

### Ataques de validação de entrada

Ataques de validação de entrada incluem injeção SQL, cross‑site scripting, execução remota de código, Path Traversal e outros tipos de ataque. Cada tipo de ataque é caracterizado por combinações específicas de símbolos enviados nas solicitações. Para detectar ataques de validação de entrada, é necessário realizar análise de sintaxe das solicitações - analisá-las para detectar combinações específicas de símbolos.

A Wallarm detecta ataques de validação de entrada em qualquer parte da solicitação, incluindo arquivos binários como SVG, JPEG, PNG, GIF, PDF, etc., usando as [ferramentas](#tools-for-attack-detection) listadas.

A detecção de ataques de validação de entrada está habilitada para todos os clientes por padrão.

### Ataques comportamentais

Ataques comportamentais incluem as seguintes classes de ataque:

* Ataques de força bruta: senhas e identificadores de sessão forçados, arquivos e diretórios de navegação forçada, preenchimento de credenciais. Ataques comportamentais podem ser caracterizados por um grande número de solicitações com diferentes valores de parâmetros forçados enviados para uma URL típica por um período de tempo limitado.

    Por exemplo, se um invasor força a senha, muitas solicitações semelhantes com diferentes valores de `senha` podem ser enviadas para a URL de autenticação do usuário:

    ```bash
    https://example.com/login/?username=admin&password=123456
    ```

* Os ataques BOLA (IDOR) explorando a vulnerabilidade de mesmo nome. Esta vulnerabilidade permite que um invasor acesse um objeto por seu identificador através de uma solicitação de API e obtenha ou modifique seus dados ignorando um mecanismo de autorização.

    Por exemplo, se um invasor força identificadores de loja para encontrar um identificador real e obter os dados financeiros da loja correspondente:

    ```bash
    https://example.com/shops/{shop_id}/financial_info
    ```

    Se a autorização não for necessária para tais solicitações de API, um invasor pode obter os dados financeiros reais e usá-los para seus próprios fins.

#### Detecção de ataque comportamental

Para detectar ataques comportamentais, é necessário conduzir a análise de sintaxe de solicitações e a análise de correlação do número de solicitações e o tempo entre solicitações.

A análise de correlação é conduzida quando o limite do número de solicitações enviadas para autenticação de usuário ou diretório de arquivo de recurso ou uma URL de objeto específica é ultrapassado. O limite do número de solicitações deve ser ajustado para reduzir o risco de bloqueio de solicitações legítimas (por exemplo, quando o usuário insere a senha incorreta em sua conta várias vezes).

* A análise de correlação é conduzida pelo módulo de pós-análise da Wallarm.
* A comparação do número de solicitações recebidas e o limite para o número de solicitações, e o bloqueio das solicitações são realizadas na Nuvem Wallarm.

Quando um ataque comportamental é detectado, as fontes de solicitação são bloqueadas, ou seja, os endereços IP de onde as solicitações foram enviadas são adicionados à lista de bloqueio.

#### Configuração de proteção contra ataques comportamentais

Para proteger o recurso contra ataques comportamentais, é necessário definir o limite para a análise de correlação e URLs que são vulneráveis ​​a ataques comportamentais:

* [Instruções de configuração de proteção contra força bruta](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Instruções de configuração de proteção BOLA (IDOR)](../admin-en/configuration-guides/protecting-against-bola.md)

!!! warning "Restrições de proteção contra ataques comportamentais"
    Ao procurar sinais de ataque comportamental, os nós da Wallarm analisam apenas solicitações HTTP que não contêm sinais de outros tipos de ataque. Por exemplo, as solicitações não são consideradas como parte do ataque comportamental nos seguintes casos:

    * Essas solicitações contêm sinais de [ataques de validação de entrada](#input-validation-attacks).
    * Essas solicitações correspondem à expressão regular especificada na [regra **Criar indicador de ataque com base em expressão regular**](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule).

## Tipos de recursos protegidos

Os nós Wallarm analisam o tráfego HTTP e WebSocket enviado para os recursos protegidos:

* A análise de tráfego HTTP é habilitada por padrão.

    Os nós Wallarm analisam o tráfego HTTP para [ataques de validação de entrada](#input-validation-attacks) e [ataques comportamentais](#behavioral-attacks).
* A análise de tráfego WebSocket deve ser habilitada adicionalmente através da diretiva [`wallarm_parse_websocket`](../admin-en/configure-parameters-en.md#wallarm_parse_websocket).

    Os nós Wallarm analisam o tráfego WebSocket apenas para [ataques de validação de entrada](#input-validation-attacks).

A API de recurso protegido pode ser projetada com base nas seguintes tecnologias (limitado pelo plano de [assinatura](subscription-plans.md#subscription-plans) WAAP):

* GraphQL
* gRPC
* WebSocket
* REST API
* SOAP
* XML-RPC
* WebDAV
* JSON-RPC

## Processo de detecção de ataques

Para detectar ataques, a Wallarm usa o seguinte processo:

1. Determine o formato da solicitação e analise cada parte da solicitação conforme descrito no [documento sobre análise de solicitação](../user-guides/rules/request-processing.md).
2. Determine o ponto de extremidade ao qual a solicitação está endereçada.
3. Aplique [regras personalizadas para análise de solicitação](#custom-rules-for-request-analysis) configuradas no Console Wallarm.
4. Tome uma decisão se a solicitação é maliciosa ou não com base nas [regras de detecção padrão e personalizadas](#tools-for-attack-detection).

## Ferramentas para detecção de ataque

Para detectar solicitações maliciosas, os nós Wallarm analisam todas as solicitações enviadas para o recurso protegido usando as seguintes ferramentas:

* Biblioteca **libproton**
* Biblioteca **libdetection**
* Regras personalizadas para análise de solicitação

### Biblioteca libproton

A biblioteca **libproton** é uma ferramenta principal para a detecção de solicitações maliciosas. A biblioteca usa o componente **proton.db** que determina diferentes sinais de tipo de ataque como sequências de tokens, por exemplo: `union select` para o [tipo de ataque de injeção SQL](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1). Se a solicitação contiver uma sequência de tokens que combine com a sequência de **proton.db**, essa solicitação é considerada um ataque do tipo correspondente.

A Wallarm atualiza regularmente **proton.db** com sequências de tokens para novos tipos de ataque e para tipos de ataque já descritos.

### Biblioteca libdetection

#### Visão geral da libdetection

A biblioteca [**libdetection**](https://github.com/wallarm/libdetection) valida adicionalmente ataques detectados pela biblioteca **libproton** da seguinte forma:

* Se **libdetection** confirmar os sinais de ataque detectados por **libproton**, o ataque é bloqueado (se o nó de filtragem estiver funcionando no modo `block`) e enviado para a Nuvem Wallarm.
* Se **libdetection** não confirmar os sinais de ataque detectados por **libproton**, a solicitação é considerada legítima, o ataque não é enviado para a Nuvem Wallarm e não é bloqueado (se o nó de filtragem estiver funcionando no modo `block`).

Usar **libdetection** garante a dupla detecção de ataques e reduz o número de falsos positivos.

!!! info "Tipos de ataque validados pela biblioteca libdetection"
    Atualmente, a biblioteca **libdetection** valida apenas ataques de Injeção SQL.

#### Como a libdetection funciona

A característica particular de **libdetection** é que ela analisa solicitações não apenas por sequências de tokens específicas para tipos de ataque, mas também pelo contexto em que a sequência de tokens foi enviada. 

A biblioteca contém strings de caracteres de diferentes sintaxes de tipo de ataque (Injeção SQL por enquanto). A string é nomeada como o contexto. Exemplo do contexto para o tipo de ataque de Injeção SQL:

```curl
SELECT example FROM table WHERE id=
```

A biblioteca conduz a análise de sintaxe de ataque para combinar com os contextos. Se o ataque não combinar com os contextos, a solicitação não será definida como maliciosa e não será bloqueada (se o nó de filtragem estiver funcionando no modo `block`).

#### Testando libdetection

Para verificar a operação de **libdetection**, você pode enviar a seguinte solicitação legítima para o recurso protegido:

```bash
curl "http://localhost/?id=1' UNION SELECT"
```

* A biblioteca **libproton** detectará `UNION SELECT` como o sinal de ataque de injeção SQL. Como `UNION SELECT` sem outros comandos não é um sinal do ataque de injeção SQL, **libproton** detecta um falso positivo.
* Se a análise de solicitações com a biblioteca **libdetection** estiver habilitada, o sinal de ataque de injeção SQL não será confirmado na solicitação. A solicitação será considerada legítima, o ataque não será enviado para a Nuvem Wallarm e não será bloqueado (se o nó de filtragem estiver funcionando no modo `block`).

#### Gerenciando o modo libdetection

!!! info "Modo padrão de libdetection"
    O modo padrão da biblioteca **libdetection** é `on/true` (habilitado) para todas as [opções de implantação](../installation/supported-deployment-options.md).

Você pode controlar o modo **libdetection** usando:

* A diretiva [`wallarm_enable_libdetection`](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) para NGINX.
* O parâmetro [`enable_libdetection`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings) para Envoy.
* Uma das [opções](../admin-en/configure-kubernetes-en.md#managing-libdetection-mode) para o controlador de ingressão Wallarm NGINX:

    * A anotação `nginx.ingress.kubernetes.io/server-snippet` para o recurso Ingress.
    * O parâmetro `controller.config.server-snippet` do gráfico Helm.

* A [anotação de pod](../installation/kubernetes/sidecar-proxy/pod-annotations.md#annotation-list)  `wallarm-enable-libdetection` para a solução Wallarm Sidecar.
* A variável `libdetection` para a implantação [AWS Terraform](../installation/cloud-platforms/aws/terraform-module/overview.md#how-to-use-the-wallarm-aws-terraform-module).

### Regras personalizadas para análise de solicitações

Para ajustar a análise de solicitação padrão da Wallarm às especificidades do aplicativo protegido, os clientes Wallarm podem usar regras personalizadas dos seguintes tipos:

* [Criar um patch virtual](../user-guides/rules/vpatch-rule.md)
* [Criar indicador de ataque com base em expressão regular](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule)
* [Desativar detecção de ataque com base em expressão regular](../user-guides/rules/regex-rule.md#partial-disabling-of-a-new-detection-rule)
* [Ignorar certos tipos de ataque](../user-guides/rules/ignore-attack-types.md)
* [Permitir dados binários e tipos de arquivo](../user-guides/rules/ignore-attacks-in-binary-data.md)
* [Desativar / Ativar analisadores](../user-guides/rules/disable-request-parsers.md)
* [Ajuste fino da detecção de ataque overlimit_res](../user-guides/rules/configure-overlimit-res-detection.md)

O conjunto de regras personalizadas [compilada](../user-guides/rules/rules.md) é aplicada junto com as regras padrão de **proton.db** ao analisar as solicitações.

## Monitoramento e bloqueio de ataques

A Wallarm pode processar ataques nos seguintes modos:

* Modo de monitoramento: detecta, mas não bloqueia ataques.
* Modo de bloqueio seguro: detecta ataques, mas bloqueia apenas aqueles originados de IPs [em lista cinza](../user-guides/ip-lists/graylist.md). Solicitações legítimas originadas de IPs em lista cinza não são bloqueadas.
* Modo de bloqueio: detecta e bloqueia ataques.

A Wallarm garante análise de qualidade das solicitações e baixo nível de falsos positivos. No entanto, cada aplicativo protegido tem suas próprias especificidades, por isso recomendamos analisar o trabalho do Wallarm no modo de monitoramento antes de habilitar o modo de bloqueio.

Para controlar o modo de filtragem, a diretiva `wallarm_mode` é usada. Informações mais detalhadas sobre a configuração do modo de filtragem estão disponíveis no [link](../admin-en/configure-wallarm-mode.md).

O modo de filtragem para ataques comportamentais é configurado separadamente por meio do [trigger](../admin-en/configuration-guides/protecting-against-bruteforce.md) específico.

## Falsos positivos

**Falso positivo** ocorre quando sinais de ataque são detectados na solicitação legítima ou quando uma entidade legítima é qualificada como uma vulnerabilidade. [Mais detalhes sobre falsos positivos na verificação de vulnerabilidade →](detecting-vulnerabilities.md#false-positives)

Ao analisar solicitações em busca de ataques, a Wallarm utiliza o conjunto de regras padrão que fornece proteção ideal de aplicação com falsos positivos ultrabaixos. Devido às especificidades do aplicativo protegido, as regras padrão podem erroneamente reconhecer sinais de ataque em solicitações legítimas. Por exemplo: a injeção de SQL pode ser detectada na solicitação de adição de uma postagem com descrição de consulta SQL maliciosa ao Fórum do Administrador de Banco de Dados.

Nesses casos, as regras padrão precisam ser ajustadas para acomodar as especificidades do aplicativo protegido usando os seguintes métodos:

* Analise falsos positivos potenciais (filtrando todos os ataques pela [tag `!known`](../user-guides/search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits)) e se confirmar falsos positivos, [marque](../user-guides/events/false-attack.md) ataques ou hits particulares adequadamente. A Wallarm criará automaticamente as regras desabilitando a análise das mesmas solicitações para os sinais de ataque detectados.
* [Desabilite a detecção de certos tipos de ataque](../user-guides/rules/ignore-attack-types.md) em solicitações específicas.
* [Desabilite a detecção de certos sinais de ataque em dados binários](../user-guides/rules/ignore-attacks-in-binary-data.md).
* [Desabilite analisadores erroneamente aplicados às solicitações](../user-guides/rules/disable-request-parsers.md).

Identificar e lidar com falsos positivos é uma parte do ajuste fino de Wallarm para proteger seus aplicativos. Recomendamos implantar o primeiro nó Wallarm no [modo](#monitoring-and-blocking-attacks) de monitoramento e analisar os ataques detectados. Se alguns ataques forem erroneamente reconhecidos como ataques, marque-os como falsos positivos e mude o nó de filtragem para o modo de bloqueio.

## Gerenciando ataques detectados

Todos os ataques detectados são exibidos na seção Console Wallarm → **Eventos** pelo filtro `attacks`. Você pode gerenciar ataques pela interface da seguinte forma:

* Visualizar e analisar ataques
* Aumentar a prioridade de um ataque na fila de verificação
* Marcar ataques ou hits separados como falsos positivos
* Criar regras para o processamento personalizado de hits separados

Para obter mais informações sobre como gerenciar ataques, consulte as instruções sobre [como trabalhar com ataques](../user-guides/events/analyze-attack.md).

![Visão de Ataques](../images/user-guides/events/check-attack.png)

Além disso, a Wallarm fornece painéis de controle abrangentes para ajudá-lo a manter a postura de segurança do seu sistema. O painel de [prevenção de ameaças](../user-guides/dashboards/threat-prevention.md) da Wallarm fornece métricas gerais sobre a postura de segurança do seu sistema, enquanto o painel [OWASP API Security Top 10](../user-guides/dashboards/owasp-api-top-ten.md) oferece visibilidade detalhada da postura de segurança do seu sistema contra as ameaças OWASP API Top 10.

![OWASP API Top 10](../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## Notificações sobre ataques detectados, hits e cargas úteis maliciosas

Wallarm pode enviar notificações sobre ataques detectados, hits e cargas úteis maliciosas. Isso permite que você esteja ciente das tentativas de ataque ao seu sistema e analise o tráfego malicioso detectado prontamente. Analisar o tráfego malicioso inclui relatar falsos positivos, permitir IPs que originam solicitações legítimas e negar IPs de fontes de ataque.

Para configurar notificações:

1. Configure [integrações internas](../user-guides/settings/integrations/integrations-intro.md) com os sistemas para enviar notificações (por exemplo, PagerDuty, Opsgenie, Splunk, Slack, Telegram).
2. Defina as condições para o envio de notificações:

    * Para receber notificações a cada hit detectado, selecione a opção apropriada nas configurações de integração.

        ??? info "Veja o exemplo da notificação sobre hit detectado no formato JSON"
            ```json
            [
                {
                    "summary": "[Wallarm] New hit detected",
                    "details": {
                    "client_name": "TestCompany",
                    "cloud": "EU",
                    "notification_type": "new_hits",
                    "hit": {
                        "domain": "www.example.com",
                        "heur_distance": 0.01111,
                        "method": "POST",
                        "parameter": "SOME_value",
                        "path": "/news/some_path",
                        "payloads": [
                            "say ni"
                        ],
                        "point": [
                            "post"
                        ],
                        "probability": 0.01,
                        "remote_country": "PL",
                        "remote_port": 0,
                        "remote_addr4": "8.8.8.8",
                        "remote_addr6": "",
                        "tor": "none",
                        "request_time": 1603834606,
                        "create_time": 1603834608,
                        "response_len": 14,
                        "response_status": 200,
                        "response_time": 5,
                        "stamps": [
                            1111
                        ],
                        "regex": [],
                        "stamps_hash": -22222,
                        "regex_hash": -33333,
                        "type": "sqli",
                        "block_status": "monitored",
                        "id": [
                            "hits_production_999_202010_v_1",
                            "c2dd33831a13be0d_AC9"
                        ],
                        "object_type": "hit",
                        "anomaly": 0
                        }
                    }
                }
            ]
            ```
    
    * Para definir o limiar de ataque, hit ou número de carga útil maliciosa e receber notificações quando o limiar for excedido, configure os [triggers](../user-guides/triggers/triggers.md) apropriados.

        [Veja o exemplo do gatilho configurado e notificação →](../user-guides/triggers/trigger-examples.md#slack-notification-if-2-or-more-sqli-hits-are-detected-in-one-minute)

## Vídeos demonstrativos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
