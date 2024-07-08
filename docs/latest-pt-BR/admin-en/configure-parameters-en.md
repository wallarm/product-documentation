[doc-nginx-install]:    ../installation/nginx/dynamic-module-from-distr.md
[doc-eu-scanner-ip-addresses]: scanner-addresses.md
[doc-us-scanner-ip-addresses]: scanner-addresses.md
[acl-access-phase]:            #wallarm_acl_access_phase

# Opções de configuração para o nó Wallarm baseado em NGINX

Saiba mais sobre as opções de ajuste fino disponíveis para os módulos NGINX da Wallarm para obter o máximo da solução Wallarm.

!!! info "Documentação oficial do NGINX"
    A configuração Wallarm é muito semelhante à configuração NGINX. [Veja a documentação oficial do NGINX](https://www.nginx.com/resources/admin-guide/). Junto com as opções de configuração específicas da Wallarm, você tem as capacidades completas da configuração NGINX.

## Diretivas Wallarm

### disable_acl

Permite a desativação da análise de origens de solicitações. Se desativado (`on`), o nó de filtragem não baixa [listas de IP](../user-guides/ip-lists/overview.md) do Wallarm Cloud e pula a análise de IPs de origem de solicitação.

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e location.

    O valor padrão é `off`.

### wallarm_acl_access_phase

A diretiva obriga o nó Wallarm baseado em NGINX a bloquear solicitações originadas de IPs na [lista de negação](../user-guides/ip-lists/denylist.md) na fase de acesso NGINX, o que significa:

* Com `wallarm_acl_access_phase on`, o nó Wallarm bloqueia imediatamente quaisquer solicitações de IPs na lista de negação em qualquer [modo de filtração](configure-wallarm-mode.md) e não procura sinais de ataque em solicitações de IPs na lista de negação.

    Este é o valor **padrão e recomendado** pois faz as listas de negação funcionarem de maneira padrão e reduz significativamente a carga da CPU do nó.

* Com `wallarm_acl_access_phase off`, o nó Wallarm analisa primeiro os sinais de ataque nas solicitações e então, se operando no modo `block` ou `safe_blocking`, bloqueia solicitações originadas de IPs na lista de negação.

    No modo de filtração `off`, o nó não analisa solicitações e não verifica listas de negação.

    No modo de filtração `monitoring`, o nó procura sinais de ataque em todas as solicitações, mas nunca bloqueia, mesmo se o IP de origem estiver na lista de negação.

    O comportamento do nó Wallarm com `wallarm_acl_access_phase off` aumenta significativamente a carga da CPU do nó.

!!! info "Valor padrão e interação com outras diretrizes"
    **Valor padrão**: `on` (a partir do nó Wallarm 4.2)

    A diretiva só pode ser definida dentro do bloco http do arquivo de configuração do NGINX.

    * Com [`disable_acl on`](#disable_acl), as listas de IP não são processadas e a ativação `wallarm_acl_access_phase` não faz sentido.
    * A diretiva `wallarm_acl_access_phase` tem prioridade sobre [`wallarm_mode`](#wallarm_mode) que resulta no bloqueio de solicitações de IPs na lista de negação, mesmo que o modo de filtragem do nó seja `off` ou `monitoring` (com `wallarm_acl_access_phase on`).

### wallarm_acl_export_enable

A diretiva habilita `on`/desabilita `off` o envio de estatísticas sobre as solicitações dos IPs na [lista de negação](../user-guides/ip-lists/denylist.md) do nó para a Nuvem.

* Com `wallarm_acl_export_enable on`, as estatísticas sobre as solicitações dos IPs na lista de negação serão [exibidas](../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) na seção **Eventos**.
* Com `wallarm_acl_export_enable off`, as estatísticas sobre as solicitações dos IPs na lista de negação não serão exibidas.

!!! info
    Este parâmetro é definido dentro do bloco http.
    
    **Valor padrão**: `on`.

### wallarm_api_conf

Um caminho para o arquivo `node.yaml`, que contém requisitos de acesso para a API Wallarm.

**Exemplo**: 
```
wallarm_api_conf /etc/wallarm/node.yaml
```

Usado para enviar solicitações serializadas do nó de filtragem diretamente para a API Wallarm (Cloud) em vez de fazer o upload para o módulo postanalytics (Tarantool).
**Apenas solicitações com ataques são enviadas para a API.** As solicitações sem ataques não são salvas.

**Exemplo do conteúdo do arquivo node.yaml:**
``` bash
# Credenciais de conexão com a API

hostname: <algum nome>
uuid: <algum uuid>
secret: <algum secret>

# Parâmetros de conexão com a API (os parâmetros abaixo são usados por padrão)

api:
  host: api.wallarm.com
  port: 443
  ca_verify: true
```

### wallarm_application

Identificador único da aplicação protegida a ser usado na Wallarm Cloud. O valor pode ser um número inteiro positivo, exceto `0`.

Identificadores únicos podem ser definidos tanto para os domínios da aplicação quanto para os caminhos do domínio, por exemplo:

=== "Identificadores para domínios"
    Arquivo de configuração para o domínio **exemplo.com**:

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        listen 443 ssl;

        ...

        wallarm_mode monitoring;
        wallarm_application 1;
        location / {
                proxy_pass http://exemplo.com;
                include proxy_params;
        }
    }
    ```

    Arquivo de configuração para o domínio **teste.com**:

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        listen 443 ssl;

        ...

        wallarm_mode monitoring;
        wallarm_application 2;
        location / {
                proxy_pass http://teste.com;
                include proxy_params;
        }
    }
    ```
=== "Identificadores para caminhos de domínio"
    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        listen 443 ssl;

        ...
        
        wallarm_mode monitoring;
        location /login {
                proxy_pass http://exemplo.com/login;
                include proxy_params;
                wallarm_application 3;
        }
        
        location /users {
                proxy_pass http://exemplo.com/users;
                include proxy_params;
                wallarm_application 4;
        }
    }
    ```

[Mais detalhes sobre a configuração de aplicações →](../user-guides/settings/applications.md)

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e location.

    **Valor padrão**: `-1`.

### wallarm_block_page

Permite a configuração da resposta à solicitação bloqueada.

[Mais detalhes sobre a configuração de página e código de erro de bloqueio →](configuration-guides/configure-block-page-and-code.md)

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e location.

### wallarm_block_page_add_dynamic_path

Esta diretiva é usada para inicializar a página de bloqueio que possui variáveis NGINX em seu código e o caminho para esta página de bloqueio também é definido usando uma variável. Caso contrário, a diretiva não é usada.

[Mais detalhes sobre a configuração de página e código de erro de bloqueio →](configuration-guides/configure-block-page-and-code.md)

!!! info
    A diretiva pode ser configurada dentro do bloco `http` do arquivo de configuração do NGINX.

### wallarm_cache_path

Um diretório em que o catálogo de backup para o armazenamento de cópia do arquivo proton.db e o arquivo de regras personalizado é criado ao inicializar o servidor. Este diretório deve ser gravável para o cliente que executa o NGINX.

!!! info
    Este parâmetro é configurado  apenas no bloco http.

### wallarm_custom_ruleset_path

Um caminho para o arquivo [conjunto de regras personalizado](../user-guides/rules/rules.md) que contém informações sobre a estrutura da aplicação protegida e as configurações do nó de filtragem.

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e location.
    
    **Valor padrão**: `/etc/wallarm/custom_ruleset`

### wallarm_enable_libdetection

Ativa/desativa a validação adicional dos ataques de injeção de SQL por meio da biblioteca **libdetection**. O uso de **libdetection** garante a detecção dupla de ataques e reduz o número de falsos positivos.

A análise de solicitações com a biblioteca **libdetection** é habilitada por padrão em todas as [opções de implementação](../installation/supported-deployment-options.md). Para reduzir o número de falsos positivos, recomendamos que a análise permaneça habilitada.

[Mais detalhes sobre **libdetection** →](../about-wallarm/protecting-against-attacks.md#library-libdetection)

!!! warning "Aumento do consumo de memória"
    Ao analisar ataques usando a biblioteca libdetection, a quantidade de memória consumida pelos processos NGINX e Wallarm pode aumentar cerca de 10%.

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e location.

    O valor padrão é `on` para todas as [opções de implementação](../installation/supported-deployment-options.md).

### wallarm_fallback

Com o valor definido como `on`, o NGINX tem a habilidade de entrar em um modo de emergência; se o proton.db ou o conjunto de regras personalizado não puderem ser baixados, esta configuração desabilita o módulo Wallarm para os blocos http, server e location, para os quais os dados não conseguem ser baixados. O NGINX continua funcionando.

!!! info
    Valor padrão é `on`.

    Este parâmetro pode ser definido dentro dos blocos http, server e location.

### wallarm_force

Define a análise das solicitações e a geração de regras personalizadas com base no tráfego espelhado do NGINX. Veja [Analisando tráfego espelhado com NGINX](../installation/oob/web-server-mirroring/overview.md).

### wallarm_general_ruleset_memory_limit

Define um limite para a quantidade máxima de memória que pode ser usada por uma instância do proton.db e um arquivo de conjunto de regras personalizadas.

Se o limite de memória for excedido durante o processamento de alguma solicitação, o usuário receberá um erro 500.

Os seguintes sufixos podem ser usados neste parâmetro:
* `k` ou `K` para kilobytes
* `m` ou `M` para megabytes
* `g` ou `G` para gigabytes

Um valor de **0** desativa o limite.

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e/ou location.
    
    **Valor padrão**: `1` GB

### wallarm_global_trainingset_path

!!! warning "A diretiva está obsoleta"
    A partir do nó Wallarm 3.6, por favor use a diretiva [`wallarm_protondb_path`](#wallarm_protondb_path). Basta mudar o nome da diretiva, a lógica não mudou.

### wallarm_file_check_interval

Define um intervalo entre verificar novos dados no proton.db e no arquivo de conjunto de regras personalizadas. A unidade de medida é especificada no sufixo conforme abaixo:
* sem sufixo para minutos
* `s` para segundos
* `ms` para milissegundos

!!! info
    Este parâmetro é configurado apenas dentro do bloco http.
    
    **Valor padrão**: `1` (um minuto)

### wallarm_instance

!!! warning "A diretiva está obsoleta"
    * Se a diretiva era usada para definir o identificador único da aplicação protegida, basta renomeá-la para [`wallarm_application`](#wallarm_application).
    * Para definir o identificador único do inquilino para os nós multi-inquilino, em vez de `wallarm_instance`, use a diretiva [`wallarm_partner_client_uuid`](#wallarm_partner_client_uuid).

    Ao atualizar a configuração que você usava para seu nó de filtragem da versão anterior ao 4.0:

    * Se você atualizar o nó de filtragem sem o recurso de multilocação e tiver alguma `wallarm_instance` usada para definir o identificador único da aplicação protegida, basta renomeá-la para `wallarm_application`.
    * Se você atualizar o nó de filtragem com recurso de multilocação, considere todos `wallarm_instance` como `wallarm_application`, então reescreva a configuração conforme descrito na [instrução de reconfiguração de multilocação](../updating-migrating/older-versions/multi-tenant.md#step-3-reconfigure-multitenancy).

### wallarm_key_path

Um caminho para a chave privada Wallarm usada para encriptação/descriptografia dos arquivos proton.db e conjunto de regras personalizadas.

!!! info
    **Valor padrão**: `/etc/wallarm/private.key` (no nó Wallarm 3.6 e inferiores, `/etc/wallarm/license.key`)

### wallarm_local_trainingset_path

!!! warning "A diretiva está obsoleta"
    A partir do nó Wallarm 3.6, por favor use a diretiva [`wallarm_custom_ruleset_path`](#wallarm_custom_ruleset_path). Basta mudar o nome da diretiva, a lógica não mudou.

### wallarm_mode

Modo de processamento de tráfego:

* `off`
* `monitoring`
* `safe_blocking`
* `block`

--8<-- "../include-pt-BR/wallarm-modes-description-latest.md"

A utilização de `wallarm_mode` pode ser restrita pela diretiva `wallarm_mode_allow_override`.

[Instruções detalhadas sobre a configuração do modo de filtração →](configure-wallarm-mode.md)

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e location.
    
    **Valor padrão** depende do método de implementação do nó de filtragem (pode ser `off` ou `monitoring`)

### wallarm_mode_allow_override

Gerencia a habilidade de substituir os valores de [`wallarm_mode`](#wallarm_mode) via regras de filtragem baixadas da Wallarm Cloud (conjunto de regras personalizadas):

- `off` - as regras personalizadas são ignoradas.
- `strict` - regras personalizadas só podem fortalecer o modo de operação.
- `on` - é possível fortalecer e suavizar o modo de operação.

Por exemplo, com `wallarm_mode monitoring` e `wallarm_mode_allow_override strict` configurados, o Wallarm Console pode ser usado para habilitar o bloqueio de algumas solicitações, mas a análise de ataques não pode ser totalmente desativada.

[Instruções detalhadas sobre a configuração do modo de filtração →](configure-wallarm-mode.md)

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e location.
    
    **Valor padrão**: `on`

### wallarm_parse_response

Se analisar ou não as respostas da aplicação. A análise de resposta é necessária para a detecção de vulnerabilidades durante a [detecção passiva](../about-wallarm/detecting-vulnerabilities.md#passive-detection) e [verificação ativa de ameaças](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification). 

Os possíveis valores são `on` (a análise da resposta está habilitada) e `off` (a análise da resposta está desabilitada).

!!! info
    Este parâmetro pode ser definido nos blocos http, server e location.
    
    **Valor padrão**: `on`

!!! warning "Melhore o desempenho"
    Recomendamos que você desabilite o processamento de arquivos estáticos através do `location` para melhorar o desempenho.

### wallarm_parse_websocket <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

O Wallarm oferece suporte total ao WebSockets sob o plano de assinatura API Security. Por padrão, as mensagens do WebSockets não são analisadas quanto a ataques.

Para forçar o recurso, ative o plano de assinatura API Security e use a diretiva `wallarm_parse_websocket`.

Possíveis valores:

- `on`: a análise de mensagens está habilitada.
- `off`: a análise de mensagens está desabilitada.

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e location.
    
    **Valor padrão**: `off`

### wallarm_parser_disable

Permite a desativação de parsers. Os valores de diretiva correspondem ao nome do parser a ser desativado:

- `cookie`
- `zlib`
- `htmljs`
- `json`
- `multipart`
- `base64`
- `percent`
- `urlenc`
- `xml`
- `jwt`

**Exemplo**

```
wallarm_parser_disable base64;
wallarm_parser_disable xml;
location /ab {
    wallarm_parser_disable json;
    wallarm_parser_disable base64;
    proxy_pass http://exemplo.com;
}
location /zy {
    wallarm_parser_disable json;
    proxy_pass http://exemplo.com;
}
```

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e location.

### wallarm_parse_html_response

Se aplicar ou não os parsers HTML ao código HTML recebido na resposta da aplicação. Os possíveis valores são `on` (o parser HTML é aplicado) e `off` (o parser HTML não é aplicado).

Este parâmetro só é efetivo se `wallarm_parse_response on`.

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e location.
    
    **Valor padrão**: `on`

### wallarm_partner_client_uuid

Identificador único do inquilino para o nó Wallarm [multi-inquilino](../installation/multi-tenant/overview.md). O valor deve ser uma string no formato [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format), por exemplo:

* `11111111-1111-1111-1111-111111111111`
* `123e4567-e89b-12d3-a456-426614174000`

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e location.

    Saiba como:
    
    * [Obter o UUID do inquilino durante a criação do inquilino →](../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)
    * [Obter a lista de UUIDs dos inquilinos existentes →](../updating-migrating/older-versions/multi-tenant.md#get-uuids-of-your-tenants)
    
Exemplo de configuração:

```
server {
  server_name  inquilino1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
  location /login {
     wallarm_application 21;
     ...
  }
  location /users {
     wallarm_application 22;
     ...
  }

server {
  server_name  inquilino1-1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  wallarm_application 23;
  ...
}

server {
  server_name  inquilino2.com;
  wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222;
  ...
}
...
}
```

Na configuração acima:

* O Inquilino é o cliente do parceiro. O parceiro tem 2 clientes.
* O tráfego direcionado para `inquilino1.com` e `inquilino1-1.com` será associado ao cliente `11111111-1111-1111-1111-111111111111`.
* O tráfego direcionado para `inquilino2.com` será associado ao cliente `22222222-2222-2222-2222-222222222222`.
* O primeiro cliente também possui 3 aplicativos, especificados via a diretiva [`wallarm_application`](#wallarm_application):
    * `inquilino1.com/login` - `wallarm_application 21`
    * `inquilino1.com/users` - `wallarm_application 22`
    * `inquilino1-1.com` - `wallarm_application 23`

    O tráfego direcionado a esses 3 caminhos será associado à aplicação correspondente, e o restante será o tráfego genérico do primeiro cliente.

### wallarm_process_time_limit

!!! warning "A diretiva está obsoleta"
    A partir da versão 3.6, é recomendado afinar a detecção de ataque `overlimit_res` usando a [regra **Fine-tune the overlimit_res attack detection**](../user-guides/rules/configure-overlimit-res-detection.md).
    
    A diretiva `wallarm_process_time_limit` está temporariamente suportada, mas será removida em futuras versões.

Configura o limite de tempo para o processamento de uma única solicitação pelo nó Wallarm.

Se o tempo exceder o limite, será registrado um erro no log e o pedido será marcado como o ataque [`overlimit_res`](../attacks-vulns-list.md#overlimiting-of-computational-resources). Dependendo do valor de [`wallarm_process_time_limit_block`](#wallarm_process_time_limit_block), o ataque pode ser bloqueado, monitorado ou ignorado.

O valor é especificado em milissegundos sem unidades, por exemplo:

```bash
wallarm_process_time_limit 1200; # 1200 milissegundos
wallarm_process_time_limit 2000; # 2000 milissegundos
```

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e location.
    
    **Valor padrão**: 1000ms (um segundo).

### wallarm_process_time_limit_block

!!! warning "A diretiva está obsoleta"
    A partir da versão 3.6, é recomendado afinar a detecção de ataque `overlimit_res` usando a [regra **Fine-tune the overlimit_res attack detection**](../user-guides/rules/configure-overlimit-res-detection.md).
    
    A diretiva `wallarm_process_time_limit_block` está temporariamente suportada, mas será removida em futuras versões.

A capacidade de gerenciar o bloqueio de solicitações, que excedem o limite de tempo definido na diretiva [`wallarm_process_time_limit`](#wallarm_process_time_limit):

- `on`: as solicitações são sempre bloqueadas a menos que `wallarm_mode off`
- `off`: as solicitações são sempre ignoradas

    !!! warning "Risco de contornar a proteção"
        O valor `off` deve ser usado com cuidado, pois este valor desabilita a proteção contra ataques `overlimit_res`.
        
        É recomendado usar o valor `off` apenas nas localizações estritamente específicas onde é realmente necessário, por exemplo, onde o upload de arquivos grandes é realizado e onde não há risco de contornar a proteção e explorar a vulnerabilidade.
        
        **É fortemente recomendado** não definir `wallarm_process_time_limit_block` para `off` globalmente para blocos http ou server.
    
- `attack`: depende do modo de bloqueio de ataque definido na diretiva `wallarm_mode`:
    - `off`: as solicitações não são processadas.
    - `monitoring`: as solicitações são ignoradas, mas os detalhes sobre os ataques `overlimit_res` são enviados para a Wallarm Cloud e exibidos no Wallarm Console.
    - `safe_blocking`: apenas solicitações originárias de endereços IP na [lista cinza](../user-guides/ip-lists/graylist.md) são bloqueadas e os detalhes sobre todos os ataques `overlimit_res` são enviados para a Wallarm Cloud e exibidos no Wallarm Console.
    - `block`: as solicitações são bloqueadas.

Independentemente do valor da diretiva, solicitações do tipo de ataque `overlimit_res` são enviadas para a Wallarm Cloud, exceto quando [`wallarm_mode off;`](#wallarm_mode).

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e location.
    
    **Valor padrão**: `wallarm_process_time_limit_block attack`

### wallarm_protondb_path

Um caminho para o arquivo [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton) que possui as configurações globais para a filtragem de solicitações, que não dependem da estrutura da aplicação.

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e location.
    
    **Valor padrão**: `/etc/wallarm/proton.db`

### wallarm_rate_limit

Configura a limitação de taxa no seguinte formato:

```
wallarm_rate_limit <KEY_TO_MEASURE_LIMITS_FOR> rate=<RATE> burst=<BURST> delay=<DELAY>;
```

* `KEY_TO_MEASURE_LIMITS_FOR` - uma chave que deseja medir os limites. Pode conter texto, [variáveis NGINX](http://nginx.org/en/docs/varindex.html) e sua combinação.

    Por exemplo: `"$remote_addr +location_name"` para limitar solicitações originadas do mesmo IP e direcionadas ao endpoint `/login`.
* `rate=<RATE>` (obrigatório) - limite de taxa, pode ser `rate=<número>r/s` ou `rate=<número>r/m`.
* `burst=<BURST>` (opcional) - número máximo de solicitações excessivas a serem armazenadas em buffer assim que o RPS/RPM especificado for excedido e a serem processadas assim que a taxa voltar ao normal. `0` por padrão.
* `delay=<DELAY>` - se o valor `<BURST>` for diferente de `0`, você pode controlar se manterá o RPS/RPM definido entre a execução das solicitações excessivas em buffer. `nodelay` aponta para o processamento simultâneo de todas as solicitações excessivas em buffer, sem o atraso do limite de taxa. Valor numérico implica o processamento simultâneo do número especificado de solicitações excessivas, outras são processadas com atraso definido em RPS/RPM.

Exemplo:

```
wallarm_rate_limit "$remote_addr +location_name" rate=10r/s burst=9 delay=5;
```

!!! info
    **Valor padrão:** none.

    Este parâmetro pode ser definido dentro dos contextos http, server e location.

    Se você definir a regra de [limitação de taxa](../user-guides/rules/rate-limiting.md), a diretiva `wallarm_rate_limit` terá uma prioridade inferior.

### wallarm_rate_limit_enabled

Habilita/desabilita a limitação de taxa Wallarm.

Se `off`, a [regra de limitação de taxa](../user-guides/rules/rate-limiting.md) (recomendada) e a diretiva `wallarm_rate_limit` não funcionam.

!!! info
    **Valor padrão:** `on` mas a limitação de taxa Wallarm não funciona sem a [regra de limitação de taxa](../user-guides/rules/rate-limiting.md) (recomendada) ou a diretiva `wallarm_rate_limit` configurada.

### wallarm_rate_limit_log_level

O nível para o registro das solicitações rejeitadas pelo controle de limitação de taxa. Pode ser: `info`, `notice`, `warn`, `error`.

!!! info
    **Valor padrão:** `error`.
    
    Este parâmetro pode ser definido dentro dos contextos http, server e location.

### wallarm_rate_limit_status_code

Código para retornar em resposta às solicitações rejeitadas pelo módulo de limitação de taxa da Wallarm.

!!! info
    **Valor padrão:** `503`.
    
    Este parâmetro pode ser definido dentro dos contextos http, server e location.

### wallarm_rate_limit_shm_size

Define a quantidade máxima de memória compartilhada que o módulo de limitação de taxa da Wallarm pode consumir.

Com um comprimento médio de chave de 64 bytes (caracteres), e `wallarm_rate_limit_shm_size` de 64MB, o módulo pode lidar com cerca de 130.000 chaves únicas simultaneamente. Aumentando a memória por dois, dobra a capacidade do módulo de maneira linear.

Uma chave é um valor único de um ponto de solicitação que o módulo usa para medir limites. Por exemplo, se o módulo está limitando conexões com base em endereços IP, cada endereço IP único é considerado uma única chave. Com o valor de diretiva padrão, o módulo pode processar solicitações originadas de ~130.000 IPs diferentes simultaneamente.

!!! info
    **Valor padrão:** `64m` (64 MB).
    
    Este parâmetro pode ser definido apenas no contexto http.

### wallarm_request_chunk_size

Limita o tamanho da parte da solicitação que é processada durante uma iteração. Você pode configurar um valor personalizado para a diretiva `wallarm_request_chunk_size` em bytes, atribuindo um número inteiro a ela. A diretiva também aceita os seguintes sufixos:
* `k` ou `K` para kilobytes
* `m` ou `M` para megabytes
* `g` ou `G` para gigabytes

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e location.
    **Valor padrão**: `8k` (8 kilobytes).

### wallarm_request_memory_limit

Define um limite para a quantidade máxima de memória que pode ser usada para o processamento de uma única solicitação.

Se o limiar for ultrapassado, o processamento da solicitação será interrompido e o usuário receberá um erro 500.

Os seguintes sufixos podem ser usados neste parâmetro:
* `k` ou `K` para kilobytes
* `m` ou `M` para megabytes
* `g` ou `G` para gigabytes

Um valor de `0` desativa o limite.

Por padrão, os limites estão desativados. 

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e/ou location.

### wallarm_stalled_worker_timeout

Define um limite de tempo para um único processamento de solicitação para um worker NGINX em segundos.

Se o tempo ultrapassar o limite, os dados sobre os trabalhadores NGINX serão gravados nos parâmetros de [estatística](configure-statistics-service.md##working-with-the-statistics-service) `stalled_workers_count` e `stalled_workers`.

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server e location.
    
    **Valor padrão**: `5` (cinco segundos)

### wallarm_status

Controla a operação do [serviço de estatísticas Wallarm](configure-statistics-service.md).

O valor da diretiva tem o seguinte formato:

```
wallarm_status [on|off] [format=json|prometheus];
```

É altamente recomendado configurar o serviço de estatísticas em um arquivo de configuração separado `/etc/nginx/conf.d/wallarm-status.conf` e não usar a diretiva `wallarm_status` em outros arquivos que você usa ao configurar o NGINX, porque este último pode ser inseguro.

Além disso, é fortemente recomendado não alterar nenhuma das linhas existentes da configuração `wallarm-status` padrão, pois isso pode corromper o processo de envio de dados de métrica para a nuvem Wallarm.

!!! info
    A diretiva pode ser configurada no contexto NGINX de `server` e/ou `location`.

    O parâmetro `format` tem o valor `json` por padrão.

### wallarm_tarantool_upstream

Com o `wallarm_tarantool_upstream`, você pode equilibrar as solicitações entre vários servidores postanalytics.

**Exemplo:**

```bash
upstream wallarm_tarantool {
    server 127.0.0.1:3313 max_fails=0 fail_timeout=0 max_conns=1;
    keepalive 1;
}

# omitido

wallarm_tarantool_upstream wallarm_tarantool;
```

Confira também [Module ngx_http_upstream_module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html).

!!! warning "Condições necessárias"
    É necessário que as seguintes condições sejam satisfeitas para os parâmetros `max_conns` e `keepalive`:

    * O valor do parâmetro `keepalive` não deve ser menor que o número de servidores Tarantool.
    * O valor do parâmetro `max_conns` deve ser especificado para cada um dos servidores upstream do Tarantool para evitar a criação de conexões excessivas.

!!! info
    O parâmetro é configurado apenas dentro do bloco http.

### wallarm_timeslice

Um limite no tempo que um nó de filtragem gasta em uma iteração de processamento de uma solicitação antes de mudar para a próxima solicitação. Ao atingir o limite de tempo, o nó de filtragem procede ao processamento da próxima solicitação na fila. Após realizar uma iteração em cada uma das solicitações na fila, o nó realiza a segunda iteração de processamento na primeira solicitação da fila.

Você pode usar sufixos de intervalos de tempo que estão descritos na [documentação NGINX](https://nginx.org/en/docs/syntax.html) para atribuir diferentes valores de unidade de tempo à diretiva.

!!! info
    Este parâmetro pode ser definido dentro dos blocos http, server, e location.
    **Valor padrão**: `0` (limite de tempo para uma única iteração está desativado).

-----

!!! warning
    Devido às limitações do servidor NGINX, é necessário desativar a solicitação de buffering, atribuindo o valor `off` para a diretiva NGINX `proxy_request_buffering` para que a diretiva `wallarm_timeslice` funcione.

### wallarm_ts_request_memory_limit

!!! warning "A diretiva está obsoleta"
    A partir do nó Wallarm 4.0, por favor use a diretiva [`wallarm_general_ruleset_memory_limit`](#wallarm_general_ruleset_memory_limit). Basta mudar o nome da diretiva, a lógica não mudou.

### wallarm_unpack_response

Se descompactar ou não os dados compactados retornados na resposta da aplicação. Os possíveis valores são `on` (a descompactação está habilitada) e `off` (a descompactação está desativada).

Este parâmetro só é efetivo se `wallarm_parse_response on`.

!!! info
    **Valor padrão**: `on`.

### wallarm_upstream_backend

Um método para envio de solicitações serializadas. As solicitações podem ser enviadas para Tarantool ou para a API.

Possíveis valores de diretiva:
*   `tarantool`
*   `api`

Dependendo das outras diretivas, o valor padrão será atribuído da seguinte forma:
*   `tarantool` - se não houver diretiva `wallarm_api_conf` na configuração.
*   `api` - se houver uma diretiva `wallarm_api_conf`, mas não houver diretiva `wallarm_tarantool_upstream` na configuração.

    !!! note
        Se as diretivas `wallarm_api_conf` e `wallarm_tarantool_upstream` estiverem presentes simultaneamente na configuração, ocorrerá um erro de configuração do formulário **diretiva ambígua do backend upstream wallarm**.

!!! info
    Este parâmetro só pode ser definido dentro do bloco http.

### wallarm_upstream_connect_attempts

Define o número de reconexões imediatas para o Tarantool ou Wallarm API.
Se uma conexão com o Tarantool ou API for encerrada, a tentativa de reconexão não ocorrerá. No entanto, isso não ocorre quando não há mais conexões e a fila de solicitações serializadas não está vazia.

!!! note
    A reconexão pode ocorrer por meio de outro servidor, porque o subsistema "upstream" é responsável pela escolha do servidor.
    
    Este parâmetro pode ser definido dentro do bloco http.

### wallarm_upstream_reconnect_interval

Define o intervalo entre tentativas de reconexão para o Tarantool ou Wallarm API após o número de tentativas malsucedidas exceder o limite `wallarm_upstream_connect_attempts`.

!!! info
    Este parâmetro pode ser definido dentro do bloco http.

### wallarm_upstream_connect_timeout

Define um tempo limite para a conexão com o Tarantool ou Wallarm API.

!!! info
    Este parâmetro pode ser definido dentro do bloco http.

### wallarm_upstream_queue_limit

Define um limite para o número de solicitações serializadas.
Definir simultaneamente o parâmetro `wallarm_upstream_queue_limit` e não definir o parâmetro `wallarm_upstream_queue_memory_limit` significa que não haverá limite para este último.

!!! info
    Este parâmetro pode ser definido dentro do bloco http.

### wallarm_upstream_queue_memory_limit

Define um limite para o volume total de solicitações serializadas.
Definir simultaneamente o parâmetro `wallarm_upstream_queue_memory_limit` e não definir o parâmetro `wallarm_upstream_queue_limit` significa que não haverá limite para este último.

!!! info
    **Valor padrão:** `100m`.
    
    Este parâmetro pode ser definido dentro do bloco http.