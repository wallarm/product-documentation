Opções comuns de personalização:

* [Configuração do modo de filtragem][waf-mode-instr]
* [Registrar variáveis do nó Wallarm][logging-instr]
* [Uso do balanceador do servidor proxy atrás do nó de filtragem][proxy-balancer-instr]
* [Adicionando endereços do Scanner Wallarm à lista de permissões no modo de filtragem `block`][scanner-allowlisting-instr]
* [Limitação do tempo de processamento de uma única solicitação na diretiva `wallarm_process_time_limit`][process-time-limit-instr]
* [Limitação do tempo de espera da resposta do servidor na diretiva NGINX `proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [Limitação do tamanho máximo da solicitação na diretiva NGINX `client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Detecção dupla de ataques com **libdetection**][enable-libdetection-docs]