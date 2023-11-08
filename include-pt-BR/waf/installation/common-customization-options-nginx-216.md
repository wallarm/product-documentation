Opções comuns de personalização:

* [Configuração do modo de filtragem][waf-mode-instr]
* [Registrando variáveis do nó Wallarm][logging-instr]
* [Usando o balanceador do servidor proxy atrás do nó de filtragem][proxy-balancer-instr]
* [Adicionando endereços do Scanner Wallarm à lista de permissões no modo de filtragem `block`][scanner-allowlisting-instr]
* [Limitando o tempo de processamento de uma única solicitação na diretiva `wallarm_process_time_limit`][process-time-limit-instr]
* [Limitando o tempo de espera da resposta do servidor na diretiva NGINX `proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [Limitando o tamanho máximo da solicitação na diretiva NGINX `client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Configurando a resolução de DNS dinâmico no NGINX][dynamic-dns-resolution-nginx]
* [Dupla detecção de ataques com **libdetection**][enable-libdetection-docs]