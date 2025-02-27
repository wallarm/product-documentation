# Monitoramento do Controlador Ingress Baseado em NGINX 

--8<-- "../include-pt-BR/ingress-controller-best-practices-intro.md"

Os aspectos gerais do monitoramento do controlador Ingress NGINX já estão bem cobertos na Internet. A Wallarm fornece um conjunto adicional de métricas de monitoramento que devem ser monitoradas em um ambiente de missão crítica. O serviço de métricas `/wallarm-metrics` é desabilitado por padrão.

Para habilitar o serviço, defina `controller.wallarm.metrics.enabled` como `true`:

```
controller:
  wallarm:
    metrics:
      enabled: true
```

A seguir, é apresentada uma lista de métricas específicas da Wallarm no formato Prometheus disponíveis por meio do novo endpoint exposto:

```
# HELP wallarm_requests contagem de requisições
# TYPE wallarm_requests gauge
wallarm_requests 2
# HELP wallarm_attacks contagem de ataques
# TYPE wallarm_attacks gauge
wallarm_attacks 0
# HELP wallarm_blocked contagem de requisições bloqueadas
# TYPE wallarm_blocked gauge
wallarm_blocked 0
# HELP wallarm_blocked_by_acl contagem de requisições bloqueadas por acl
# TYPE wallarm_blocked_by_acl gauge
wallarm_blocked_by_acl 0
# HELP wallarm_acl_allow_list requisições passadas pela lista permitida
# TYPE wallarm_acl_allow_list gauge
wallarm_acl_allow_list 0
# HELP wallarm_abnormal contagem de requisições anormais
# TYPE wallarm_abnormal gauge
wallarm_abnormal 2
# HELP wallarm_tnt_errors contagem erros de escrita tarantool
# TYPE wallarm_tnt_errors gauge
wallarm_tnt_errors 0
# HELP wallarm_api_errors contagem erros escrita API
# TYPE wallarm_api_errors gauge
wallarm_api_errors 0
# HELP wallarm_requests_lost contagem de requisições perdidas
# TYPE wallarm_requests_lost gauge
wallarm_requests_lost 0
# HELP wallarm_overlimits_time contagem do tempo de exceder limites
# TYPE wallarm_overlimits_time gauge
wallarm_overlimits_time 0
# HELP wallarm_segfaults contagem de falhas de segmentação
# TYPE wallarm_segfaults gauge
wallarm_segfaults 0
# HELP wallarm_memfaults contagem de eventos de limite de vmem atingido
# TYPE wallarm_memfaults gauge
wallarm_memfaults 0
# HELP wallarm_softmemfaults contagem de eventos de limite de memória de requisição atingido
# TYPE wallarm_softmemfaults gauge
wallarm_softmemfaults 0
# HELP wallarm_proton_errors contagem de eventos de falhas não relacionadas à memória da libproton
# TYPE wallarm_proton_errors gauge
wallarm_proton_errors 0
# HELP wallarm_time_detect_seconds tempo gasto para detecção
# TYPE wallarm_time_detect_seconds gauge
wallarm_time_detect_seconds 0
# HELP wallarm_db_id id do arquivo proton.db
# TYPE wallarm_db_id gauge
wallarm_db_id 71
# HELP wallarm_lom_id id do arquivo LOM
# TYPE wallarm_lom_id gauge
wallarm_lom_id 386
# HELP wallarm_custom_ruleset_id id do arquivo de conjunto de regras personalizadas
# TYPE wallarm_custom_ruleset_id gauge
wallarm_custom_ruleset_id{format="51"} 386
# HELP wallarm_custom_ruleset_ver versão do formato do arquivo de conjunto de regras personalizado
# TYPE wallarm_custom_ruleset_ver gauge
wallarm_custom_ruleset_ver 51
# HELP wallarm_db_apply_time id do tempo de aplicação do arquivo proton.db
# TYPE wallarm_db_apply_time gauge
wallarm_db_apply_time 1674548649
# HELP wallarm_lom_apply_time tempo de aplicação do arquivo LOM
# TYPE wallarm_lom_apply_time gauge
wallarm_lom_apply_time 1674153198
# HELP wallarm_custom_ruleset_apply_time tempo de aplicação do arquivo de conjunto de regras personalizado
# TYPE wallarm_custom_ruleset_apply_time gauge
wallarm_custom_ruleset_apply_time 1674153198
# HELP wallarm_proton_instances contagem de instâncias proton 
# TYPE wallarm_proton_instances gauge
wallarm_proton_instances{status="success"} 5
wallarm_proton_instances{status="fallback"} 0
wallarm_proton_instances{status="failed"} 0
# HELP wallarm_stalled_worker_time_seconds tempo que um trabalhador ficou parado na libproton
# TYPE wallarm_stalled_worker_time_seconds gauge
wallarm_stalled_worker_time_seconds{pid="3169104"} 25

# HELP wallarm_startid id de início único
# TYPE wallarm_startid gauge
wallarm_startid 3226376659815907920
```

Informações detalhadas sobre a configuração de monitoramento e a lista de métricas disponíveis são fornecidas nesta [documentação](../../../configure-statistics-service.md).
