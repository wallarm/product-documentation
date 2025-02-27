[doc-configure-kubernetes]:     configure-kubernetes-en.md
[link-prometheus]:              https://prometheus.io/
[gl-lom]:                       ../glossary-en.md#custom-ruleset-the-former-term-is-lom

# Configuração do Serviço de Estatísticas

Para obter estatísticas sobre o nó do filtro, use a diretiva `wallarm_status`, que é escrita no arquivo de configuração NGINX.

## Configurando o Serviço de Estatísticas

!!! warning "Importante"

    É altamente recomendado configurar o serviço de estatísticas no arquivo de configuração separado `/etc/nginx/conf.d/wallarm-status.conf` e não usar a diretiva `wallarm_status` em outros arquivos que você usa ao configurar o NGINX, porque este último pode ser inseguro.
    
    Além disso, é fortemente aconselhado não alterar nenhuma das linhas existentes da configuração padrão `wallarm-status`, pois isso pode corromper o processo de envio de dados métricos para a nuvem Wallarm.

Ao usar a diretiva, as estatísticas podem ser fornecidas no formato JSON ou em um formato compatível com o [Prometheus][link-prometheus]. Uso:

```
wallarm_status [on|off] [format=json|prometheus];
``` 

!!! info
    A diretiva pode ser configurada no contexto de `server` e/ou `location`.

    O parâmetro `format` tem o valor `json` por padrão.

### Configuração padrão

Por padrão, o serviço de estatísticas do nó de filtro tem a configuração mais segura. O arquivo de configuração `/etc/nginx/conf.d/wallarm-status.conf` se parece com o seguinte:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # O acesso está disponível apenas para endereços de retorno do servidor do nó de filtro  
  deny all;

  wallarm_mode off;
  disable_acl "on";   # A verificação de fontes de solicitação está desativada, os IPs da lista de negação têm permissão para solicitar o serviço wallarm-status. https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location /wallarm-status {
    wallarm_status on;
  }
}
```

### Limitando endereços IP permitidos para solicitar estatísticas

Ao configurar a diretiva `wallarm_status`, você pode especificar os endereços IP a partir dos quais pode solicitar estatísticas. Por padrão, o acesso é negado de qualquer lugar, exceto para os endereços IP `127.0.0.1` e `::1`, que permitem executar a solicitação apenas no servidor onde o Wallarm está instalado.

Para permitir solicitações de outro servidor, adicione a instrução `allow` com o endereço IP do servidor desejado na configuração. Por exemplo:

```diff
...
server_name localhost;

allow 127.0.0.0/8;
+ allow 10.41.29.0;
...
```

Depois que as configurações forem alteradas, reinicie o NGINX para aplicar as alterações:

--8<-- "../include-pt-BR/waf/restart-nginx-4.4-and-above.md"

### Alterando um endereço IP do serviço de estatísticas

Para alterar um endereço IP do serviço de estatísticas:

1. Especifique um novo endereço na diretiva `listen` do arquivo `/etc/nginx/conf.d/wallarm-status.conf`.
1. Adicione o parâmetro `status_endpoint` com o novo valor de endereço ao arquivo `/etc/wallarm/node.yaml`, por exemplo:

    ```bash
    hostname: example-node-name
    uuid: ea1xa0xe-xxxx-42a0-xxxx-b1b446xxxxxx
    ...
    status_endpoint: 'http://127.0.0.2:8082/wallarm-status'
    ```
1. Adicione ou altere a diretiva `allow` para permitir o acesso de endereços que não sejam endereços de loopback (o arquivo de configuração padrão permite acesso apenas para endereços de loopback).
1. Reinicie o NGINX para aplicar as alterações:

    --8<-- "../include-pt-BR/waf/restart-nginx-4.4-and-above.md"

### Obtendo estatísticas no formato Prometheus

Por padrão, as estatísticas são retornadas apenas no formato JSON. Para obter as estatísticas no formato Prometheus:

1. Adicione a seguinte configuração ao arquivo `/etc/nginx/conf.d/wallarm-status.conf`:


    ```diff
    ...

    location /wallarm-status {
      wallarm_status on;
    }

    + location /wallarm-status-prometheus {
    +   wallarm_status on format=prometheus;
    + }

    ...
    ```

    !!! warning "Não exclua ou altere a configuração padrão `/wallarm-status`"
        Por favor, não exclua ou altere a configuração padrão do local `/wallarm-status`. A operação padrão deste endpoint é crucial para enviar dados corretos para a Nuvem Wallarm.
1. Reinicie o NGINX para aplicar as alterações:

    --8<-- "../include-pt-BR/waf/restart-nginx-4.4-and-above.md"
1. Chame o novo endpoint para obter as métricas do Prometheus:

    ```bash
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

##  Trabalhando com o Serviço de Estatísticas

Para obter as estatísticas do nó do filtro, faça uma solicitação a partir de um dos endereços IP permitidos (veja acima):

=== "Estatísticas no formato JSON"
    ```
    curl http://127.0.0.8/wallarm-status
    ```

    Como resultado, você receberá uma resposta do tipo:

    ```
    { "requests":0,"attacks":0,"blocked":0,"blocked_by_acl":0,"acl_allow_list":0,"abnormal":0,
    "tnt_errors":0,"api_errors":0,"requests_lost":0,"overlimits_time":0,"segfaults":0,"memfaults":0,
    "softmemfaults":0,"proton_errors":0,"time_detect":0,"db_id":73,"lom_id":102,"custom_ruleset_id":102,
    "custom_ruleset_ver":51,"db_apply_time":1598525865,"lom_apply_time":1598525870,
    "custom_ruleset_apply_time":1598525870,"proton_instances": { "total":3,"success":3,"fallback":0,
    "failed":0 },"stalled_workers_count":0,"stalled_workers":[],"ts_files":[{"id":102,"size":12624136,
    "mod_time":1598525870,"fname":"\/etc\/wallarm\/custom_ruleset"}],"db_files":[{"id":73,"size":139094,
    "mod_time":1598525865,"fname":"\/etc\/wallarm\/proton.db"}],"startid":1459972331756458216,
    "timestamp":1664530105.868875,"rate_limit":{"shm_zone_size":67108864,"buckets_count":4,"entries":1,
    "delayed":0,"exceeded":1,"expired":0,"removed":0,"no_free_nodes":0},"split":{"clients":[
    {"client_id":null,"requests": 78,"attacks": 0,"blocked": 0,"blocked_by_acl": 0,"overlimits_time": 0,
    "time_detect": 0,"applications":[{"app_id":4,"requests": 78,"attacks": 0,"blocked": 0,
    "blocked_by_acl": 0,"overlimits_time": 0,"time_detect": 0}]}]} }
    ```
=== "Estatísticas no formato Prometheus"
    ```
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

    O endereço pode ser diferente, consulte o arquivo `/etc/nginx/conf.d/wallarm-status.conf` para o endereço atual.

    Como resultado, você receberá uma resposta do tipo:


    ```
    # HELP wallarm_requests requests count
    # TYPE wallarm_requests gauge
    wallarm_requests 2
    # HELP wallarm_attacks attack requests count
    # TYPE wallarm_attacks gauge
    wallarm_attacks 0
    # HELP wallarm_blocked blocked requests count
    # TYPE wallarm_blocked gauge
    wallarm_blocked 0
    # HELP wallarm_blocked_by_acl blocked by acl requests count
    # TYPE wallarm_blocked_by_acl gauge
    wallarm_blocked_by_acl 0
    # HELP wallarm_acl_allow_list requests passed by allow list
    # TYPE wallarm_acl_allow_list gauge
    wallarm_acl_allow_list 0
    # HELP wallarm_abnormal abnormal requests count
    # TYPE wallarm_abnormal gauge
    wallarm_abnormal 2
    # HELP wallarm_tnt_errors tarantool write errors count
    # TYPE wallarm_tnt_errors gauge
    wallarm_tnt_errors 0
    # HELP wallarm_api_errors API write errors count
    # TYPE wallarm_api_errors gauge
    wallarm_api_errors 0
    # HELP wallarm_requests_lost lost requests count
    # TYPE wallarm_requests_lost gauge
    wallarm_requests_lost 0
    # HELP wallarm_overlimits_time overlimits_time count
    # TYPE wallarm_overlimits_time gauge
    wallarm_overlimits_time 0
    # HELP wallarm_segfaults segmentation faults count
    # TYPE wallarm_segfaults gauge
    wallarm_segfaults 0
    # HELP wallarm_memfaults vmem limit reached events count
    # TYPE wallarm_memfaults gauge
    wallarm_memfaults 0
    # HELP wallarm_softmemfaults request memory limit reached events count
    # TYPE wallarm_softmemfaults gauge
    wallarm_softmemfaults 0
    # HELP wallarm_proton_errors libproton non-memory related libproton faults events count
    # TYPE wallarm_proton_errors gauge
    wallarm_proton_errors 0
    # HELP wallarm_time_detect_seconds time spent for detection
    # TYPE wallarm_time_detect_seconds gauge
    wallarm_time_detect_seconds 0
    # HELP wallarm_db_id proton.db file id
    # TYPE wallarm_db_id gauge
    wallarm_db_id 71
    # HELP wallarm_lom_id LOM file id
    # TYPE wallarm_lom_id gauge
    wallarm_lom_id 386
    # HELP wallarm_custom_ruleset_id Custom Ruleset file id
    # TYPE wallarm_custom_ruleset_id gauge
    wallarm_custom_ruleset_id{format="51"} 386
    # HELP wallarm_custom_ruleset_ver custom ruleset file format version
    # TYPE wallarm_custom_ruleset_ver gauge
    wallarm_custom_ruleset_ver 51
    # HELP wallarm_db_apply_time proton.db file apply time id
    # TYPE wallarm_db_apply_time gauge
    wallarm_db_apply_time 1674548649
    # HELP wallarm_lom_apply_time LOM file apply time
    # TYPE wallarm_lom_apply_time gauge
    wallarm_lom_apply_time 1674153198
    # HELP wallarm_custom_ruleset_apply_time Custom Ruleset file apply time
    # TYPE wallarm_custom_ruleset_apply_time gauge
    wallarm_custom_ruleset_apply_time 1674153198
    # HELP wallarm_proton_instances proton instances count
    # TYPE wallarm_proton_instances gauge
    wallarm_proton_instances{status="success"} 5
    wallarm_proton_instances{status="fallback"} 0
    wallarm_proton_instances{status="failed"} 0
    # HELP wallarm_stalled_worker_time_seconds time a worker stalled in libproton
    # TYPE wallarm_stalled_worker_time_seconds gauge
    wallarm_stalled_worker_time_seconds{pid="3169104"} 25

    # HELP wallarm_startid unique start id
    # TYPE wallarm_startid gauge
    wallarm_startid 3226376659815907920
    ```

Os seguintes parâmetros de resposta estão disponíveis (as métricas do Prometheus têm o prefixo `wallarm_`):

*   `requests`: o número de solicitações que foram processadas pelo nó do filtro.
*   `attacks`: o número de ataques registrados.
*   `blocked`: o número de solicitações bloqueadas, incluindo aquelas originadas de IPs [da lista de negação](../user-guides/ip-lists/denylist.md).
*   `blocked_by_acl`: o número de solicitações bloqueadas devido às fontes de solicitação [da lista de negação](../user-guides/ip-lists/denylist.md).
* `acl_allow_list`: o número de solicitações originadas por fontes de solicitação [da lista de permissões](../user-guides/ip-lists/allowlist.md).
*   `abnormal`: o número de solicitações que o aplicativo considera anormais.
*   `tnt_errors`: o número de solicitações não analisadas por um módulo de pós-análise. Para essas solicitações, os motivos do bloqueio são registrados, mas as próprias solicitações não são contabilizadas nas estatísticas e verificações de comportamento.
*   `api_errors`: o número de solicitações que não foram enviadas para a API para análise posterior. Para essas solicitações foram aplicados parâmetros de bloqueio (ou seja, solicitações maliciosas foram bloqueadas se o sistema estiver operando em modo de bloqueio); no entanto, os dados sobre esses eventos não são visíveis no UI. Este parâmetro é usado apenas quando o Nó Wallarm trabalha com um módulo pós-análise local.
*   `requests_lost`: o número de solicitações que não foram analisadas em um módulo de pós-análise e transferido para a API. Para essas solicitações foram aplicados parâmetros de bloqueio (ou seja, solicitações maliciosas foram bloqueadas se o sistema estiver operando em modo de bloqueio); no entanto, os dados sobre esses eventos não são visíveis no UI. Este parâmetro é usado apenas quando o Nó Wallarm trabalha com um módulo pós-análise local.
*   `overlimits_time`: o número de ataques do tipo [Excesso de limitação de recursos computacionais](../attacks-vulns-list.md#overlimiting-of-computational-resources) detectados pelo nó de filtragem.
*   `segfaults`: o número de problemas que levaram ao término de emergência do processo de trabalho.
*   `memfaults`: o número de problemas em que os limites de memória virtual foram alcançados.
* `softmemfaults`: o número de problemas em que o limite de memória virtual para proton.db +lom foi excedido ([`wallarm_general_ruleset_memory_limit`](configure-parameters-en.md#wallarm_general_ruleset_memory_limit)).
* `proton_errors`: o número de erros de proton.db, exceto aqueles ocorridos devido a situações em que o limite de memória virtual foi excedido.
*   `time_detect`: o tempo total de análise de solicitações.
*   `db_id`: versão proton.db.
*   `lom_id`: será descontinuado em breve, use `custom_ruleset_id`.
*   `custom_ruleset_id`: versão da compilação do [conjunto de regras personalizadas][gl-lom].

    A partir do lançamento 4.8, aparece como `wallarm_custom_ruleset_id{format="51"} 386` no formato Prometheus, com `custom_ruleset_ver` dentro do atributo `format` e o valor principal sendo a versão da compilação do conjunto de regras.
*   `custom_ruleset_ver` (disponível a partir do lançamento Wallarm 4.4.3): o formato do [conjunto de regras personalizadas][gl-lom]:

    * `4x` - para nós Wallarm 2.x que estão [desatualizados](../updating-migrating/versioning-policy.md#version-list).
    * `5x` - para nós Wallarm 4.x e 3.x (o último está [desatualizado](../updating-migrating/versioning-policy.md#version-list)).
*   `db_apply_time`: hora Unix da última atualização do arquivo proton.db.
*   `lom_apply_time`: será descontinuado em breve, use `custom_ruleset_apply_time`.
*   `custom_ruleset_apply_time`: hora Unix da última atualização do arquivo do [conjunto de regras personalizadas](../glossary-en.md#custom-ruleset-the-former-term-is-lom).
*   `proton_instances`: informações sobre pares de proton.db + LOM:
    *   `total`: o número de pares de proton.db + LOM.
    *   `success`: o número de pares de proton.db + LOM carregados com sucesso.
    *   `fallback`: o número de pares de proton.db + LOM carregados a partir dos últimos arquivos salvos.
    *   `failed`: o número de pares de proton.db + LOM que não foram inicializados e executados no modo “não analisar”.
*   `stalled_workers_count`: a quantidade de trabalhadores que excederam o limite de tempo para o processamento de solicitações (o limite é definido na diretiva [`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout)).
*   `stalled_workers`: a lista dos trabalhadores que excederam o limite de tempo para o processamento de solicitações (o limite é definido na diretiva [`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout)) e a quantidade de tempo gasto no processamento de solicitações.
*   `ts_files`: informações sobre o arquivo [LOM](../glossary-en.md#custom-ruleset-the-former-term-is-lom):
    *   `id`: versão do LOM usado.
    *   `size`: tamanho do arquivo LOM em bytes.
    *   `mod_time`: hora Unix da última atualização do arquivo LOM.
    *   `fname`: caminho para o arquivo LOM.
*   `db_files`: informações sobre o arquivo proton.db:
    *   `id`: versão do proton.db usado.
    *   `size`: tamanho do arquivo proton.db em bytes.
    *   `mod_time`: hora Unix da última atualização do arquivo proton.db.
    *   `fname`: caminho para o arquivo proton.db.
* `startid`: ID único do nó de filtragem gerado aleatoriamente.
* `timestamp`: hora em que a última solicitação de entrada foi processada pelo nó (no formato [Unix Timestamp]( https://www.unixtimestamp.com/)).
* `rate_limit`: informações sobre o módulo de [limitação de taxa](../user-guides/rules/rate-limiting.md) Wallarm:
    * `shm_zone_size`: quantidade total de memória compartilhada que o módulo de limitação de taxa Wallarm pode consumir em bytes (o valor é baseado na diretiva [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size), o padrão é `67108864`).
    * `buckets_count`: o número de baldes (geralmente igual à contagem de trabalhadores NGINX, 8 é o máximo).
    * `entries`: o número de valores de pontos de solicitação únicos (também conhecidos como chaves) que você mede os limites.
    * `delayed`: o número de solicitações que foram armazenadas em buffer pelo módulo de limitação de taxa devido à configuração `burst`.
    * `exceeded`: o número de solicitações que foram rejeitadas pelo módulo de limitação de taxa porque excederam o limite.
    * `expired`: o número total de chaves que são removidas do balde em uma base regular de 60 segundos se o limite de taxa para essas chaves não foi excedido.
    * `removed`: o número de chaves removidas abruptamente do emblema. Se o valor for maior que `expired`, aumente o valor de [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size).
    * `no_free_nodes`: o valor diferente de `0` indica que há memória insuficiente alocada para o módulo de limite de taxa, o aumento do valor [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size) é recomendado.
* `split.clients`: principais estatísticas em cada [inquilino](../installation/multi-tenant/overview.md). Se o recurso de multilocação não estiver ativado, a estatística é retornada para o único inquilino (sua conta) com o valor estático `"client_id":null`.
* `split.clients.applications`: principais estatísticas em cada [aplicativo](../user-guides/settings/applications.md). Parâmetros que não estão incluídos nesta seção retornam a estatística em todos os aplicativos.

Os dados de todos os contadores são acumulados a partir do momento em que o NGINX é iniciado. Se o Wallarm foi instalado em uma infraestrutura pronta com o NGINX, o servidor NGINX deve ser reiniciado para iniciar a coleta de estatísticas.