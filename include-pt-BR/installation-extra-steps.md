## Configurações adicionais

O nó de filtragem pode exigir alguma configuração adicional após a instalação.

O documento abaixo lista algumas das configurações típicas que você pode aplicar, se necessário.

Para obter mais informações sobre outras configurações disponíveis, prossiga para a seção **Configuração** do guia do administrador.

### Configurando a exibição do IP real do cliente

Se o nó de filtragem for implantado atrás de um servidor proxy ou balanceador de carga sem nenhuma configuração adicional, o endereço de origem do pedido pode não ser igual ao IP real do cliente. Em vez disso, pode ser igual a um dos endereços IP do servidor proxy ou do balanceador de carga.

Nesse caso, se você deseja que o nó de filtragem receba o endereço IP do cliente como um endereço de origem de solicitação, você precisa realizar uma [configuração adicional](using-proxy-or-balancer-en.md) do servidor proxy ou do balanceador de carga.

### Limitando o tempo de processamento de uma única solicitação

Use a diretiva Wallarm [`wallarm_process_time_limit`](configure-parameters-en.md#wallarm_process_time_limit) para especificar o limite da duração do processamento de uma única solicitação pelo nó de filtragem.

Se o processamento da solicitação consumir mais tempo do que o especificado na diretiva, então as informações sobre o erro são inseridas no arquivo de log e a solicitação é marcada como um ataque `overlimit_res`.

### Limitando o tempo de espera da resposta do servidor

Use a diretiva NGINX [`proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) para especificar o tempo limite para ler a resposta do servidor proxy.

Se o servidor não enviar nada durante esse tempo, a conexão é fechada.

### Limitando o tamanho máximo da solicitação

Use a diretiva NGINX [`client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) para especificar o limite para o tamanho máximo do corpo da solicitação do cliente.

Se este limite for excedido, o NGINX responde ao cliente com o código `413` (`Payload Too Large`), também conhecido como a mensagem `Request Entity Too Large`.