# Solução de problemas de alto uso de CPU

O uso recomendado de CPU pela Wallarm é de cerca de 10-15%, o que significa que os nós de filtragem serão capazes de lidar com um pico de tráfego 10 vezes maior. Se um nó Wallarm consome mais CPU do que o esperado e você precisa reduzir o uso da CPU, use este guia.

Para revelar os episódios de processamento de pedidos mais longos e, assim, os principais consumidores de CPU, você pode [ativar o registro estendido](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginx‑based-filter-node) e monitorar o tempo de processamento.

Você pode fazer o seguinte para diminuir a carga de CPU da Wallarm:

* Adicione [`limit_req`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html) à configuração NGINX ou a partir do nó 4.6 use a própria funcionalidade de [limitação de taxa](../user-guides/rules/rate-limiting.md) da Wallarm. Esta pode ser a melhor maneira de reduzir a carga da CPU em caso de ataques de força bruta e outros.

    ??? info "Exemplo de configuração - usando `limit_req`"

        ```bash
        http {
          map $request_uri $binary_remote_addr_map {
            ~^/get $binary_remote_addr;
            ~^/post $binary_remote_addr;
            ~^/wp-login.php $binary_remote_addr;
          }
          limit_req_zone $binary_remote_addr_map zone=urls:10m rate=3r/s;
          limit_req_zone $binary_remote_addr$request_uri zone=allurl:10m rate=5r/s;

          limit_req_status 444;

          server {
            location {
              limit_req zone=urls nodelay;
              limit_req zone=allurl burst=30;
            }
          }
        }        
        ```

* Verifique se a quantidade apropriada de memória [foi alocada](../admin-en/configuration-guides/allocate-resources-for-node.md) para NGINX e Tarantool.
* Certifique-se de que a diretiva [`wallarm_acl_access_phase`](../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) está definida como `on`, o que bloqueia imediatamente quaisquer solicitações de IPs na lista de negação em qualquer modo de filtragem, sem a necessidade de buscar sinais de ataque nessas solicitações. Junto com a ativação da diretiva, verifique as [listas de IP](../user-guides/ip-lists/overview.md) da Wallarm para encontrar os IPs que foram adicionados por engano na **lista de permissões** ou os locais que não foram adicionados por engano à **lista de negação**.

    Note que este método de redução do uso de CPU pode levar a ignorar solicitações de motores de busca. Este problema, no entanto, também pode ser resolvido através do uso do módulo `map` na configuração do NGINX.

    ??? info "Exemplo de configuração - módulo `map` resolvendo o problema dos motores de busca"

        ```bash
        http {
          wallarm_acl_access_phase on;
          map $http_user_agent $wallarm_mode{
        	  default monitoring;
        	  ~*(google|bing|yandex|msnbot) off;
          }
          server {
            server_name mos.ru;
            wallarm_mode $wallarm_mode;
          }
        }
        ```

* Desative o [libdetection](../about-wallarm/protecting-against-attacks.md#libdetection-overview) (ativado por padrão desde a versão do nó 4.4) via `wallarm_enable_libdetection off`. O uso de libdetection aumenta o consumo da CPU em 5-10%. Entretanto, é necessário considerar que a desativação da libdetection pode levar a um aumento no número de falsos positivos para detecção de ataques SQLi.
* Se durante a análise do ataque detectado, você revelar que o Wallarm erroneamente usa alguns analisadores [nas regras](../user-guides/rules/disable-request-parsers.md) ou [via a configuração do NGINX](../admin-en/configure-parameters-en.md#wallarm_parser_disable) para elementos específicos dos pedidos, desabilite esses analisadores para o que eles não se aplicam. Note, no entanto, que a desativação de analisadores em geral nunca é recomendada.
* [Reduza o tempo de processamento de pedidos](../user-guides/rules/configure-overlimit-res-detection.md). Note que ao fazer isso você pode impedir que solicitações legítimas cheguem ao servidor.
* Analise os possíveis alvos para [DDoS](../admin-en/configuration-guides/protecting-against-ddos.md) e aplique uma das [medidas de proteção](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm) disponíveis.