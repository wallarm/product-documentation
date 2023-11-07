A implantação agora está completa. O nó de filtragem pode exigir alguma configuração adicional após a implantação.

As configurações do Wallarm são definidas usando as [diretivas NGINX][wallarm-nginx-directives] ou a UI do Console Wallarm. As diretivas devem ser definidas nos seguintes arquivos na instância Wallarm:

* `/etc/nginx/sites-enabled/default` define a configuração do NGINX
* `/etc/nginx/conf.d/wallarm.conf` define a configuração global do nó de filtragem Wallarm
* `/etc/nginx/conf.d/wallarm-status.conf` define a configuração do serviço de monitoramento do nó de filtragem
* `/etc/default/wallarm-tarantool` ou `/etc/sysconfig/wallarm-tarantool` com as configurações do banco de dados Tarantool

Você pode modificar os arquivos listados ou criar seus próprios arquivos de configuração para definir a operação do NGINX e Wallarm. É recomendado criar um arquivo de configuração separado com o bloco `server` para cada grupo de domínios que devem ser processados da mesma maneira (por exemplo, `example.com.conf`). Para ver informações detalhadas sobre o trabalho com arquivos de configuração do NGINX, prossiga para a [documentação oficial do NGINX](https://nginx.org/en/docs/beginners_guide.html).

!!! info "Criando um arquivo de configuração"
    Ao criar um arquivo de configuração personalizado, certifique-se de que o NGINX está ouvindo as conexões de entrada na porta livre.

Abaixo estão algumas das configurações típicas que você pode aplicar, se necessário:

* [Auto-escalabilidade do nó Wallarm][autoscaling-docs]
* [Exibindo o IP real do cliente][real-ip-docs]
* [Alocando recursos para nós Wallarm][allocate-memory-docs]
* [Limitando o tempo de processamento de uma única solicitação][limiting-request-processing]
* [Limitando o tempo de espera da resposta do servidor](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [Limitando o tamanho máximo da solicitação](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Registrando o nó Wallarm][logs-docs]