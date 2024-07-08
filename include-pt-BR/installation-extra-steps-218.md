## Configurações adicionais

O nó de filtragem pode exigir alguma configuração adicional após a instalação.

O documento abaixo lista algumas das configurações típicas que você pode aplicar se necessário.

Para obter mais informações sobre outras configurações disponíveis, prossiga para a seção **Configuração** do [Guia do administrador](admin-intro-en.md).

### Configurando a exibição do IP real do cliente

Se o nó de filtragem for implantado atrás de um servidor proxy ou balanceador de carga sem nenhuma configuração adicional, o endereço de origem da solicitação pode não ser igual ao endereço IP real do cliente. Em vez disso, pode ser igual a um dos endereços IP do servidor proxy ou do balanceador de carga.

Nesse caso, se desejar que o nó de filtragem receba o endereço IP do cliente como um endereço de origem de solicitação, você precisará realizar uma [configuração adicional](using-proxy-or-balancer-en.md) do servidor proxy ou do balanceador de carga.

### Adicionando endereços do Scanner Wallarm à lista de permissões

O Scanner Wallarm verifica os recursos de sua empresa em busca de vulnerabilidades. A varredura é realizada usando endereços IP de uma das seguintes listas (dependendo do tipo de Wallarm Cloud que você está usando):

* [Endereços do Scanner US para usuários do Cloud US](scanner-addresses.md)
* [Endereços do Scanner EU para usuários do Cloud EU](scanner-addresses.md)

Se você está usando o Scanner Wallarm, precisa configurar as listas de permissões em seu software de segurança de escopo de rede (como firewalls, sistemas de detecção de intrusão, etc.) para conter os endereços IP do Scanner Wallarm.

Por exemplo, um nó de filtragem Wallarm com as configurações padrão é colocado no modo de bloqueio, impedindo assim que o Scanner Wallarm verifique os recursos atrás do nó de filtragem.

Para tornar o Scanner operacional novamente, [permitir os endereços IP do Scanner](scanner-ips-allowlisting.md) neste nó de filtragem.

### Limitando o tempo de processamento de uma única solicitação

Use a diretiva Wallarm [`wallarm_process_time_limit`](configure-parameters-en.md#wallarm_process_time_limit) para especificar o limite de duração para o processamento de uma única solicitação pelo nó de filtragem.

Se o processamento da solicitação consumir mais tempo do que o especificado na diretiva, as informações sobre o erro serão inseridas no arquivo de log e a solicitação será marcada como um ataque `overlimit_res`.

### Limitando o tempo de espera da resposta do servidor

Use a diretiva NGINX [`proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) para especificar o tempo limite para ler a resposta do servidor proxy.

Se o servidor não enviar nada durante esse tempo, a conexão será fechada.

### Limitando o tamanho máximo da solicitação

Use a diretiva NGINX [`client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) para especificar o limite para o tamanho máximo do corpo da solicitação do cliente.

Se esse limite for excedido, o NGINX responde ao cliente com o código `413` (`Payload Too Large`), também conhecido como a mensagem `Request Entity Too Large`.