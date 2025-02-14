[doc-nagios-details]:       fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

[doc-lom]:                  ../../glossary-en.md#custom-ruleset-the-former-term-is-lom

[anchor-tnt]:               #number-of-requests-not-analyzed-by-the-postanalytics-module
[anchor-api]:               #number-of-requests-not-passed-to-the-wallarm-api
[anchor-metric-1]:          #indication-that-the-postanalytics-module-drops-requests

#   Métricas Disponíveis

* [Formato de Métrica](#metric-format)
* [Tipos de Métricas Wallarm](#types-of-wallarm-metrics)
* [Métricas NGINX e Métricas do Módulo NGINX Wallarm](#nginx-metrics-and-nginx-wallarm-module-metrics)
* [Métricas do Módulo Postanalytics](#postanalytics-module-metrics)

!!! warning "Alterações disruptivas devido às métricas excluídas"
    A partir da versão 4.0, o nó Wallarm não coleta as seguintes métricas:
    
    * `wallarm_nginx/gauge-requests` - você pode usar a métrica [`wallarm_nginx/gauge-abnormal`](#number-of-requests) em vez disso
    * `wallarm_nginx/gauge-attacks`
    * `wallarm_nginx/gauge-blocked`
    * `wallarm_nginx/gauge-time_detect`
    * `wallarm_nginx/derive-requests`
    * `wallarm_nginx/derive-attacks`
    * `wallarm_nginx/derive-blocked`
    * `wallarm_nginx/derive-abnormal`
    * `wallarm_nginx/derive-requests_lost`
    * `wallarm_nginx/derive-tnt_errors`
    * `wallarm_nginx/derive-api_errors`
    * `wallarm_nginx/derive-segfaults`
    * `wallarm_nginx/derive-memfaults`
    * `wallarm_nginx/derive-softmemfaults`
    * `wallarm_nginx/derive-time_detect`

## Formato de Métrica

As métricas `collectd` têm a seguinte visualização:

```
host/plugin[-plugin_instance]/type[-type_instance]
```

Uma descrição detalhada do formato da métrica está disponível neste [link](../monitoring/intro.md#how-metrics-look).

!!! note
    * Na lista de métricas disponíveis abaixo, o nome do host (a parte `host/`) é omitido.
    * Ao usar a utilidade `collectd_nagios`, o nome do host deve ser omitido. Ele é configurado separadamente usando o parâmetro `-H` ([mais sobre o uso desta utilidade][doc-nagios-details]).

## Tipos de Métricas Wallarm

Os tipos permitidos de métricas Wallarm são descritos abaixo. O tipo é armazenado no parâmetro `type` da métrica.

* `gauge` é uma representação numérica do valor medido. O valor pode aumentar e diminuir.

* `derive` é a taxa de mudança do valor medido desde a medição anterior (valor derivado). O valor pode aumentar e diminuir.

* `counter` é semelhante à métrica `gauge`. O valor pode apenas aumentar.

##  Métricas NGINX e Métricas do Módulo NGINX Wallarm 

### Número de Solicitações

O número de todas as solicitações processadas pelo nó de filtro desde sua instalação.

* **Métrica:** `wallarm_nginx/gauge-abnormal`
* **Valor da métrica:**
    * `0` para o [modo](../configure-wallarm-mode.md#available-filtration-modes) `off`
    * `>0` para o [modo](../configure-wallarm-mode.md#available-filtration-modes) `monitoring`/`safe_blocking`/`block`
* **Recomendações de solução de problemas:**
    1. Verifique se as configurações do nó de filtro estão corretas.
    2. Verifique a operação do nó de filtro conforme descrito nas [instruções](../installation-check-operation-en.md). O valor deve aumentar `1` depois de enviar um ataque de teste.

### Número de Solicitações Perdidas

O número de solicitações não analisadas pelo módulo postanalytics e não passadas para a API Wallarm. As regras de bloqueio são aplicadas a essas solicitações, mas as solicitações não são visíveis em sua conta Wallarm e não são levadas em conta ao analisar as próximas solicitações. O número é a soma de [`tnt_errors`][anchor-tnt] e [`api_errors`][anchor-api].

* **Métrica:** `wallarm_nginx/gauge-requests_lost`
* **Valor da métrica:** `0`, a soma de [`tnt_errors`][anchor-tnt] e [`api_errors`][anchor-api]
* **Recomendações de solução de problemas:** siga as instruções para [`tnt_errors`][anchor-tnt] e [`api_errors`][anchor-api]

#### Número de Solicitações não Analisadas pelo Módulo Postanalytics

O número de solicitações não analisadas pelo módulo postanalytics. Esta métrica é coletada se o envio de solicitações para o módulo postanalytics estiver configurado ([`wallarm_upstream_backend tarantool`](../configure-parameters-en.md#wallarm_upstream_backend)). As regras de bloqueio são aplicadas a essas solicitações, mas as solicitações não são visíveis em sua conta Wallarm e não são levadas em conta ao analisar as próximas solicitações.

* **Métrica:** `wallarm_nginx/gauge-tnt_errors`
* **Valor da métrica:** `0`
* **Recomendações de solução de problemas:**
    * Obtenha os logs NGINX e Tarantool e analise os erros, se houver.
    * Verifique se o endereço do servidor Tarantool ([`wallarm_tarantool_upstream`](../configure-parameters-en.md#wallarm_tarantool_upstream)) está correto.
    * Verifique se a memória suficiente é [alocada para o Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * Entre em contato com a [equipe de suporte Wallarm](mailto:support@wallarm.com) e forneça os dados acima se o problema não for resolvido.

#### Número de Solicitações não Passadas para o API Wallarm

O número de solicitações não passadas para a API Wallarm. Esta métrica é coletada se a passagem de solicitações para a API Wallarm estiver configurada ([`wallarm_upstream_backend api`](../configure-parameters-en.md#wallarm_upstream_backend)). As regras de bloqueio são aplicadas a essas solicitações, mas as solicitações não são visíveis em sua conta Wallarm e não são levadas em conta ao analisar as próximas solicitações.

* **Métrica:** `wallarm_nginx/gauge-api_errors`
* **Valor da métrica:** `0`
* **Recomendações de solução de problemas:**
    * Obtenha os logs NGINX e Tarantool e analise os erros, se houver.
    * Verifique se as configurações da API Wallarm ([`wallarm_api_conf`](../configure-parameters-en.md#wallarm_api_conf)) estão corretas.
    * Verifique se a memória suficiente é [alocada para o Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * Entre em contato com a [equipe de suporte Wallarm](mailto:support@wallarm.com) e forneça os dados acima se a questão não for resolvida.

### Número de Problemas Que Resultam na Finalização Anormal do Processo Worker NGINX

Um número de problemas levou à finalização anormal do processo worker NGINX. A razão mais comum para a finalização anormal é um erro crítico no NGINX.

* **Métrica:** `wallarm_nginx/gauge-segfaults`
* **Valor da métrica:** `0`
* **Recomendações de solução de problemas:**
    1. Coletar dados sobre o estado atual usando o script `/usr/share/wallarm-common/collect-info.sh`.
    2. Forneça o arquivo gerado para a [equipe de suporte Wallarm](mailto:support@wallarm.com) para investigação.

### Número de Situações que Excedem o Limite de Memória Virtual

O número de situações em que o limite de memória virtual foi excedido.

* **Métrica:**
    * `wallarm_nginx/gauge-memfaults` se o limite em seu sistema foi excedido
    * `wallarm_nginx/gauge-softmemfaults` se o limite para proton.db +lom foi excedido ([`wallarm_general_ruleset_memory_limit`](../configure-parameters-en.md#wallarm_general_ruleset_memory_limit)) 
* **Valor da métrica:** `0`
* **Recomendações de solução de problemas:**
    1. Coletar dados sobre o estado atual usando o script `/usr/share/wallarm-common/collect-info.sh`.
    2. Forneça o arquivo gerado para a [equipe de suporte Wallarm](mailto:support@wallarm.com) para investigação.

### Número de Erros do Proton.db

O número de erros do proton.db, exceto aqueles ocorridos devido a situações em que [o limite de memória virtual foi excedido](#number-of-situations-exceeding-the-virtual-memory-limit).

* **Métrica:** `wallarm_nginx/gauge-proton_errors`
* **Valor da métrica:** `0`
* **Recomendações de solução de problemas:**
    1. Copie o código de erro dos logs NGINX (`wallarm: proton error: <ERROR_NUMBER>`).
    1. Colete dados sobre o estado atual usando o script `/usr/share/wallarm-common/collect-info.sh`.
    1. Forneça os dados coletados para a [equipe de suporte Wallarm](mailto:support@wallarm.com) para investigação.

### Versão do Proton.db

A versão do proton.db em uso.

* **Métrica:** `wallarm_nginx/gauge-db_id`
* **Valor da métrica:** sem limites

### Tempo da Última Atualização do Arquivo Proton.db

O tempo Unix da última atualização do arquivo proton.db.

* **Métrica:** `wallarm_nginx/gauge-db_apply_time`
* **Valor da métrica:** sem limites

### Versão do Conjunto de Regras Personalizado (o termo anterior é LOM)

A versão do [conjunto de regras personalizado][doc-lom] em uso.

* **Métrica:** `wallarm_nginx/gauge-custom_ruleset_id`

    (No nó Wallarm 3.4 e inferior, `wallarm_nginx/gauge-lom_id`. A métrica com o nome antigo ainda é coletada, mas será descontinuada em breve.)
* **Valor da métrica:** sem limites

### Tempo da Última Atualização do Conjunto de Regras Personalizado (o termo anterior é LOM)

O tempo Unix da última atualização do [conjunto de regras personalizado][doc-lom].

* **Métrica:** `wallarm_nginx/gauge-custom_ruleset_apply_time`

    (No nó Wallarm 3.4 e inferior, `wallarm_nginx/gauge-lom_apply_time`. A métrica com o nome antigo ainda é coletada, mas será descontinuada em breve.)
* **Valor da métrica:** sem limites

### Pares Proton.db e LOM

#### Número de Pares Proton.db e LOM

O número de pares proton.db e [LOM][doc-lom] em uso.

* **Métrica:** `wallarm_nginx/gauge-proton_instances-total`
* **Valor da métrica:** `>0`
* **Recomendações de solução de problemas:**
    1. Verifique se as configurações do nó de filtro estão corretas.
    2. Verifique se o caminho para o arquivo proton.db é especificado corretamente ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. Verifique se o caminho para o arquivo LOM é especificado corretamente ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### Número de Pares Proton.db e LOM Baixados com Sucesso

O número de pares proton.db e [LOM][doc-lom] que foram baixados e lidos com sucesso.

* **Métrica:** `wallarm_nginx/gauge-proton_instances-success`
* **Valor da métrica:** é igual ao [`proton_instances-total`](#number-of-protondb-and-lom-pairs)
* **Recomendações de solução de problemas:**
    1. Verifique se as configurações do nó de filtro estão corretas.
    2. Verifique se o caminho para o arquivo proton.db é especificado corretamente ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. Verifique se o caminho para o arquivo LOM é especificado corretamente ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### Número de Pares proton.db e LOM Baixados nos Últimos Arquivos Salvos

O número de pares proton.db e [LOM][doc-lom] baixados dos últimos arquivos salvos. Estes arquivos armazenam os últimos pares baixados com sucesso. Se os pares foram atualizados mas não baixados, os dados dos últimos arquivos salvos são usados.

* **Métrica:** `wallarm_nginx/gauge-proton_instances-fallback`
* **Valor da métrica:** `>0`
* **Recomendações de solução de problemas:**
    1. Verifique se as configurações do nó de filtro estão corretas.
    2. Verifique se o caminho para o arquivo proton.db é especificado corretamente ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. Verifique se o caminho para o arquivo LOM é especificado corretamente ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

#### Número de Pares Proton.db e LOM Inativos

O número de pares proton.db e [LOM][doc-lom] conectados que não puderam ser lidos.

* **Métrica:** `wallarm_nginx/gauge-proton_instances-failed`
* **Valor da métrica:** `0`
* **Recomendações de solução de problemas:**
    1. Verifique se as configurações do nó de filtro estão corretas.
    2. Verifique se o caminho para o arquivo proton.db é especificado corretamente ([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)).
    3. Verifique se o caminho para o arquivo LOM é especificado corretamente ([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)).

##  Métricas do Módulo Postanalytics

### Identificador da Última Solicitação Processada

ID da última solicitação processada. O valor pode aumentar e diminuir.

* **Métrica:**
    * `wallarm-tarantool/counter-last_request_id` se o valor aumentou
    * `wallarm-tarantool/gauge-last_request_id` se o valor aumentou ou diminuiu
* **Valor da métrica:** sem limites
* **Recomendações de solução de problemas:** se houver solicitações de entrada, mas o valor não mudar, verifique se as configurações do nó de filtro estão corretas.

### Solicitações Excluídas

#### Indicação de Solicitações Excluídas

A bandeira sinalizando que as solicitações com ataques foram excluídas do módulo postanalytics, mas não foram enviadas para a [nuvem](../../about-wallarm/overview.md#cloud).

* **Métrica:** `wallarm-tarantool/gauge-export_drops_flag`
* **Valor da métrica:**
    * `0` se as solicitações não são excluídas
    * `1` se as solicitações são excluídas (não há memória suficiente, siga as instruções a seguir)
* **Recomendações de solução de problemas:**
    * [Aloque mais memória para o Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * Instale o módulo postanalytics em uma pool de servidores separada, seguindo estas [instruções](../installation-postanalytics-en.md).

#### Número de Solicitações Excluídas

O número de solicitações com ataques que foram excluídas do módulo postanalytics, mas não foram enviadas para a [nuvem](../../about-wallarm/overview.md#cloud). O número de ataques na solicitação não afeta o valor. A métrica é coletada se [`wallarm-tarantool/gauge-export_drops_flag: 1`](#indication-of-deleted-requests).

É recomendável usar a métrica [`wallarm-tarantool/gauge-export_drops_flag`](#indication-of-deleted-requests) ao configurar notificações de monitoramento.

* **Métrica:** `wallarm-tarantool/gauge-export_drops`
* **Valor da métrica:** `0`
* **Taxa de mudança:** `wallarm-tarantool/derive-export_drops`
* **Recomendações de solução de problemas:**
    * [Aloque mais memória para o Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * Instale o módulo postanalytics em uma pool de servidores separada, seguindo as [instruções](../installation-postanalytics-en.md).

### Atraso na Exportação de Solicitações (em Segundos)

O atraso entre o registro de uma solicitação pelo módulo postanalytics e o download das informações sobre ataques detectados para a nuvem Wallarm.

* **Métrica:** `wallarm-tarantool/gauge-export_delay`
* **Valor da métrica:**
    * ótimo se `<60`
    * aviso se `>60`
    * crítico se `>300`
* **Recomendações de solução de problemas:**
    * Leia os logs do arquivo `/var/log/wallarm/export-attacks.log` e analise os erros. Um valor aumentado pode ser causado por baixa taxa de transferência de rede do nó de filtro para o serviço API Wallarm.
    * Verifique se a memória suficiente está [alocada para o Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool). A métrica [`tnt_errors`][anchor-tnt] também aumenta quando a memória alocada é excedida.

### Tempo de Armazenamento de Solicitações no Módulo Postanalytics (em Segundos)

Tempo que o módulo postanalytics armazena as solicitações. O valor depende da quantidade de memória alocada para o módulo postanalytics e do tamanho e propriedades das solicitações HTTP processadas. Quanto menor o intervalo, pior os algoritmos de detecção funcionam - porque eles se baseiam em dados históricos. Como resultado, se os intervalos forem muito curtos, um invasor pode realizar ataques de força bruta mais rapidamente e sem ser notado. Neste caso, menos dados serão obtidos no histórico do comportamento do invasor.

* **Métrica:** `wallarm-tarantool/gauge-timeframe_size`
* **Valor da métrica:**
    * ótimo se `>900`
    * aviso se `<900`
    * crítico se `<300`
* **Recomendações de solução de problemas:**
    * [Aloque mais memória para o Tarantool](../configuration-guides/allocate-resources-for-node.md#tarantool).
    * Instale o módulo postanalytics em uma pool de servidores separada, seguindo as [instruções](../installation-postanalytics-en.md).
