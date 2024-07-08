[link-check-attack]: check-attack.md
[link-false-attack]: false-attack.md

[img-analyze-attack]: ../../images/user-guides/events/analyze-attack.png
[img-analyze-attack-raw]: ../../images/user-guides/events/analyze-attack-raw.png
[img-current-attack]: ../../images/user-guides/events/analyze-current-attack.png

[glossary-attack-vector]: ../../glossary-en.md#malicious-payload

# Analisando Ataques

Você pode verificar ataques na seção **Eventos** do Console Wallarm. A Wallarm agrupa automaticamente solicitações maliciosas associadas em uma entidade - um ataque.

## Analise um Ataque

Você pode obter informações sobre um ataque investigando todas as colunas da tabela descritas em ["Verificando Ataques e Incidentes.][link-check-attack]

## Analisar Solicitações em um Ataque

1. Selecione um ataque.
2. Clique no número na coluna *Solicitações*.

Ao clicar no número, todas as solicitações no ataque selecionado serão exibidas.

![Solicitações no ataque][img-analyze-attack]

Cada solicitação exibe as informações associadas nas seguintes colunas:

* *Data*: Data e hora da solicitação.
* *Payload*: [carga maliciosa][glossary-attack-vector]. Clicar no valor na coluna de carga exibirá informações de referência sobre o tipo de ataque.
* *Fonte*: O endereço IP de onde a solicitação se originou. Clicar no endereço IP adiciona o valor do endereço IP ao campo de pesquisa. As seguintes informações também são exibidas se foram encontradas no banco de dados IP2Location ou similar:
     * O país/ região no qual o endereço IP está registrado.
     * O tipo de fonte, por exemplo **Proxy**, **Tor** ou a plataforma de nuvem no qual o IP está registrado, etc.
     * O rótulo **IPs Maliciosos** aparecerá se o endereço IP for conhecido por atividades maliciosas. Isso é baseado em registros públicos e validações de especialistas.
* *Status*: O status de bloqueio da solicitação (depende do [modo de filtragem de tráfego](../../admin-en/configure-wallarm-mode.md)).
* *Código*: O código de status de resposta do servidor para a solicitação. Se o nó de filtragem bloquear a solicitação, o código será `403` ou outro [valor personalizado](../../admin-en/configuration-guides/configure-block-page-and-code.md).
* *Tamanho*: O tamanho da resposta do servidor.
* *Tempo*: O tempo de resposta do servidor.

Se o ataque estiver acontecendo no momento atual, o rótulo *"agora"* é mostrado no gráfico de solicitação.

![Um ataque acontecendo atualmente][img-current-attack]

A visualização da solicitação oferece as seguintes opções para ajuste fino do comportamento da Wallarm:

* [**Marcar como falso positivo** e **Falso**](false-attack.md) para relatar solicitações legítimas sinalizadas como ataques.
* **Desativar base64** para indicar que o analisador base64 foi aplicado incorretamente ao elemento da solicitação.

    O botão abre um formulário preenchido para configurar a [regra que desativa o analisador](../rules/disable-request-parsers.md).
* **Regra** para criar [qualquer regra individual](../rules/rules.md#rule) para lidar com certas solicitações.

    O botão abre um formulário de configuração de regra preenchido com os dados da solicitação.

* A seção **Detectada por regras personalizadas** é exibida se o ataque foi detectado por uma [regra personalizada baseada em expressão regular](../../user-guides/rules/regex-rule.md). A seção contém o link para a regra correspondente (pode haver mais de uma) - clique no link para acessar os detalhes da regra e editá-los, se necessário.

    ![Ataque detectado por regra personalizada baseada em expressão regular - edição de regra](../../images/user-guides/search-and-filters/detected-by-custom-rule.png)

    [Saiba como pesquisar esses ataques →](../../user-guides/search-and-filters/use-search.md#search-by-regexp-based-customer-rule)

## Analisar uma Solicitação no Formato Bruto

O formato bruto de uma solicitação é o nível máximo possível de detalhes. A visualização no formato bruto no Console Wallarm também permite a cópia de uma solicitação no formato cURL.

Para visualizar uma solicitação em um formato bruto, expanda um ataque necessário e depois a solicitação dentro dele.

![Formato bruto da solicitação][img-analyze-attack-raw]

## Analise solicitações de IPs na lista de negação

[A listagem de negação](../../user-guides/ip-lists/denylist.md) prova ser uma medida defensiva eficaz contra ataques de alto volume de diferentes tipos. Isso é conseguido bloqueando solicitações no estágio inicial de processamento. Ao mesmo tempo, é igualmente importante coletar informações completas sobre todas as solicitações bloqueadas para análises futuras.

A Wallarm oferece a capacidade de coletar e exibir estatísticas sobre solicitações bloqueadas de IPs de origem na lista de negação. Isso permite avaliar a potência dos ataques originários de IPs na lista de negação e realizar uma análise precisa das solicitações desses IPs, explorando vários parâmetros.

!!! info "Disponibilidade do recurso"
    O recurso está disponível a partir da versão 4.8 do nó, para nós baseados em NGINX. Por padrão, ele está [ativado](../../admin-en/configure-parameters-en.md#wallarm_acl_export_enable).
    
Na Wallarm, existem várias maneiras de um IP entrar na lista de negação. Dependendo do caminho utilizado, você precisará [pesquisar](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) os eventos associados usando diferentes tags/filtros:

* Você o adiciona manualmente (na seção **Eventos**, use a pesquisa `blocked_source` ou o filtro `Fonte bloqueada`)
* Ele realiza um ataque comportamental e é automaticamente listado na lista de negação por:
    * Módulo de [Prevenção de Abuso de API](../../user-guides/ip-lists/denylist.md#automatic-bots-ips-denylisting) (pesquisa `api_abuse`, filtro `Abuso de API`)
    * [`Ataque de força bruta`](../../admin-en/configuration-guides/protecting-against-bruteforce.md) (pesquisa `brute`, filtro `Ataque de força bruta`)
    * [`Navegação forçada`](../../admin-en/configuration-guides/protecting-against-bruteforce.md) (pesquisa `dirbust`, filtro `Navegação forçada`)
    * [Gatilho `BOLA`](../../admin-en/configuration-guides/protecting-against-bola.md) (pesquisa `bola`, filtro `BOLA`)
    * Gatilho `Número de cargas maliciosas` (pesquisa `multiple_payloads`, filtro `Cargas múltiplas`)

Os ataques comportamentais listados só podem ser detectados após a acumulação de certas estatísticas cuja quantidade necessária depende dos limiares do gatilho correspondente. Assim, na primeira etapa, antes da listagem de negação, a Wallarm coleta essas informações, mas todas as solicitações são passadas e exibidas dentro dos eventos de `Monitoramento`.

Uma vez que os limiares do gatilho são excedidos, a atividade maliciosa é considerada detectada e a Wallarm coloca o IP na lista de negação, o nó começa a bloquear imediatamente todas as solicitações originadas dele.

Assim que a transmissão de informações sobre solicitações de IPs na lista de negação estiver ativada, você verá as solicitações `Bloqueadas` desses IPs na lista de eventos. Isso se aplica também aos IPs listados manualmente.

![Eventos relacionados a IPs na lista de negação - envio de dados ativado](../../images/user-guides/events/events-denylisted-export-enabled.png)

Note que a pesquisa/filtros exibirá tanto os eventos `Monitoramento` e - se a transmissão de informações estiver habilitada - eventos `Bloqueados` para cada tipo de ataque. Para IPs na lista de negação manualmente, um evento `Monitoramento` nunca existe.

Dentro dos eventos `Bloqueados`, use tags para alternar para o motivo da listagem de negação - configurações BOLA, Prevenção de Abuso de API, gatilho ou registro causador na lista de negação.

## Amostragem de hits

O tráfego malicioso geralmente consiste em hits [comparáveis e idênticos](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components). Armazenar todos os hits resulta em entradas duplicadas na lista de eventos que aumenta tanto o tempo para análise de eventos quanto a carga no Wallarm Cloud.

A amostragem de hits otimiza o armazenamento e a análise dos dados, descartando hits não exclusivos a serem carregados para o Wallarm Cloud.

!!! warning "Hits descartados no número de RPS"
    Como as solicitações descartadas ainda são solicitações processadas pelo nó Wallarm, o valor de RPS nos detalhes do nó aumenta com cada solicitação descartada.

    O número de solicitações e hits no [painel de Prevenção de ameaças](../dashboards/threat-prevention.md) também inclui o número de hits descartados.

A amostragem de hits não afeta a qualidade da detecção de ataques e apenas ajuda a evitar sua desaceleração. O nó Wallarm continua detectando ataques e [bloqueando](../../admin-en/configure-wallarm-mode.md#available-filtration-modes), mesmo com a amostragem de hits ativada.

### Habilitando o algoritmo de amostragem

* Para ataques de [validação de entrada](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), a amostragem de hits está desativada por padrão. Se a porcentagem de ataques em seu tráfego for alta, a amostragem de hits será realizada em duas etapas sequenciais: **extrema** e **regular**.
* Para ataques [comportamentais](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), ataques de [Bomba de dados](../../attacks-vulns-list.md#data-bomb) e [Recursos excedidos](../../attacks-vulns-list.md#overlimiting-of-computational-resources): o algoritmo de amostragem **regular** está ativado por padrão. A amostragem **extrema** começa apenas se a porcentagem de ataques em seu tráfego for alta.
* Para eventos de IPs na lista de negação, a amostragem é configurada no lado do nó. Ele carrega apenas as 10 primeiras solicitações idênticas para a Cloud, enquanto aplica um algoritmo de amostragem ao restante dos hits.

Quando o algoritmo de amostragem está ativado, na seção **Eventos**, a notificação **Amostragem de hits está ativada** é exibida.

A amostragem será automaticamente desativada assim que a porcentagem de ataques no tráfego diminuir.

### Lógica principal da amostragem de hits

A amostragem de hits é realizada em duas etapas sequenciais: **extrema** e **regular**.

O algoritmo regular processa apenas os hits salvos após o estágio extremo, a menos que os hits sejam do tipo [comportamental](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), [Bomba de dados](../../attacks-vulns-list.md#data-bomb) ou [Recursos excedidos](../../attacks-vulns-list.md#overlimiting-of-computational-resources). Se a amostragem extrema for desativada para hits desses tipos, o algoritmo regular processará o conjunto original de hits.

**Amostragem extrema**

O algoritmo de amostragem extrema tem a seguinte lógica principal:

* Se os hits são do tipo [validação de entrada](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), o algoritmo carrega para a Cloud apenas aqueles com cargas [maliciosas únicas](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components). Se vários hits com a mesma carga são detectados em uma hora, apenas o primeiro deles é carregado na Cloud e os outros são descartados.
* Se os hits são do tipo [comportamental](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), [Bomba de dados](../../attacks-vulns-list.md#data-bomb) ou [Recursos excedidos](../../attacks-vulns-list.md#overlimiting-of-computational-resources), o algoritmo carrega para a Cloud apenas os primeiros 10% deles detectados em uma hora.

**Amostragem regular**

O algoritmo de amostragem regular tem a seguinte lógica principal:

1. Os primeiros 5 hits idênticos para cada hora são salvos na amostra na Cloud Wallarm. O restante dos hits não é salvo na amostra, mas seu número é registrado em um parâmetro separado.

    Os hits são idênticos se todos os seguintes parâmetros tiverem os mesmos valores:

    * Tipo de ataque
    * Parâmetro com a carga maliciosa
    * Endereço de destino
    * Método de pedido
    * Código de resposta
    * Endereço IP de origem
2. Amostras de hits são agrupadas em [ataques](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) na lista de eventos.

Os hits agrupados são exibidos na seção **Eventos** do Console Wallarm da seguinte maneira:

![Hits descartados](../../images/user-guides/events/bruteforce-dropped-hits.png)

Para filtrar a lista de eventos de modo que ela exiba apenas os hits amostrados, clique na notificação **Amostragem de hits está ativada**. O atributo `sampled` será [adicionado](../search-and-filters/use-search.md#search-for-sampled-hits) ao campo de pesquisa e a lista de eventos exibirá apenas os hits amostrados.

!!! info "Exibindo hits descartados na lista de eventos"
    Como os hits descartados não são carregados para a nuvem Wallarm, certos hits ou ataques inteiros podem estar ausentes na lista de eventos.

<!-- ## Vídeos de demonstração

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/spD3BnI6fq4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->