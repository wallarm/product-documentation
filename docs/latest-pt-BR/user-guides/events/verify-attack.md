[img-verification-statuses]:    ../../images/user-guides/events/attack-verification-statuses.png
[img-verify-attack]:            ../../images/user-guides/events/verify-attack.png
[img-verified-icon]:            ../../images/user-guides/events/verified.png#mini
[img-error-icon]:               ../../images/user-guides/events/error.png#mini
[img-forced-icon]:              ../../images/user-guides/events/forced.png#mini
[img-sheduled-icon]:            ../../images/user-guides/events/sheduled.png#mini
[img-cloud-icon]:           ../../images/user-guides/events/cloud.png#mini

[al-brute-force-attack]:      ../../attacks-vulns-list.md#brute-force-attack
[al-forced-browsing]:         ../../attacks-vulns-list.md#forced-browsing

# Verificando Ataques

A Wallarm verifica automaticamente os [rechecks](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) ataques para a detecção ativa de vulnerabilidades.

Você pode verificar o status de verificação do ataque e forçar uma nova verificação no separador *Eventos*. O ataque selecionado será a base para a geração do conjunto de testes de ataque.

![Ataques com vários status de verificação][img-verification-statuses]

## Verifique o Status da Verificação do Ataque

1. Clique na guia *Eventos*.
2. Verifique o status na coluna "Verificação".

## Legenda de Status de Verificação de Ataque

* ![Verificado][img-verified-icon] *Verificado*: O ataque foi verificado.
* ![Erro][img-error-icon] *Erro*: Uma tentativa de verificar um tipo de ataque que não suporta verificação.
* ![Forçado][img-forced-icon] *Forçado*: O ataque tem uma prioridade elevada na fila de verificação.
* ![Agendado][img-sheduled-icon] *Agendado*: O ataque está na fila para verificação.
* ![Não foi possível conectar][img-cloud-icon] *Não foi possível conectar ao servidor*: Não é possível acessar o servidor neste momento.

## Forçando uma Verificação de Ataque

1. Selecione um ataque.
2. Clique no sinal de status na coluna "Verificação".
3. Clique em *Forçar verificação*.

A Wallarm aumentará a prioridade da verificação do ataque na fila.

![Verificação de ataques][img-verify-attack]

## Tipos de Ataque que Não Suportam Verificação

Ataques dos seguintes tipos não suportam verificação:

* [Ataque de força bruta][al-brute-force-attack]
* [Navegação forçada][al-forced-browsing]
* Ataques com um limite de processamento de solicitações
* Ataques para os quais as vulnerabilidades já foram fechadas
* Ataques que não contêm dados suficientes para verificação
* [Ataques que consistem em hits agrupados por IPs de origem](../triggers/trigger-examples.md#group-hits-originating-from-the-same-ip-into-one-attack)

A repetição da verificação do ataque falhará nos seguintes casos:

* Ataques enviados através do protocolo gRPC ou Protobuff
* Ataques enviados via protocolo HTTP de versão diferente de 1.x
* Ataques enviados por um método diferente dos seguintes: GET, POST, PUT, HEAD, PATCH, OPTIONS, DELETE, LOCK, UNLOCK, MOVE, TRACE
* Falha ao alcançar um endereço de uma solicitação original
* Sinais de ataque estão no cabeçalho `HOST`
* [Elemento de solicitação](../rules/request-processing.md) contendo sinais de ataque é diferente de um dos seguintes: `uri`, `header`, `query`, `post`, `path`, `action_name`, `action_ext`