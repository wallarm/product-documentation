# Opções de configuração para o nó Wallarm baseado no Envoy

[link-lom]:                     ../../../user-guides/rules/rules.md

[anchor-process-time-limit]:    #processtimelimit
[anchor-tsets]:                 #filtering-mode-settings

O Envoy usa filtros pluggable definidos no arquivo de configuração do Envoy para processar as solicitações recebidas. Estes filtros descrevem as ações a serem realizadas na solicitação. Por exemplo, um filtro `envoy.http_connection_manager` é usado para proxy de requisições HTTP. Este filtro possui seu próprio conjunto de filtros HTTP que podem ser aplicados à solicitação.  

O módulo Wallarm é projetado como um filtro HTTP do Envoy. As configurações gerais do módulo são colocadas em uma seção dedicada ao filtro HTTP `wallarm`:

```
listeners:
   - address:
     filter_chains:
     - filters:
       - name: envoy.http_connection_manager
         typed_config:
           http_filters:
           - name: wallarm
             typed_config:
              "@type": type.googleapis.com/wallarm.Wallarm
              <a configuração do módulo Wallarm>
              ...  
```

!!! warning "Ative o processamento do corpo da solicitação"
    Para habilitar o módulo Wallarm a processar um corpo de solicitação HTTP, o filtro buffer deve ser colocado antes do nó de filtragem na cadeia de filtros HTTP do Envoy. Por exemplo:
    
    ```
    http_filters:
    - name: envoy.buffer
      typed_config:
        "@type": type.googleapis.com/envoy.config.filter.http.buffer.v2.Buffer
        max_request_bytes: <tamanho máximo da solicitação (em bytes)>
    - name: wallarm
      typed_config:
        "@type": type.googleapis.com/wallarm.Wallarm
        <a configuração do módulo Wallarm>
        ...
    ```
    
    Se o tamanho da solicitação recebida exceder o valor do parâmetro `max_request_bytes`, então esta solicitação será descartada e o Envoy retornará o código de resposta `413` ("Payload Too Large").

## Configurações de filtragem de solicitações

A seção `rulesets` do arquivo contém os parâmetros relacionados às configurações de filtragem de solicitações:

```
rulesets:
- name: rs0
  pdb: /etc/wallarm/proton.db
  custom_ruleset: /etc/wallarm/custom_ruleset
  key: /etc/wallarm/private.key
  general_ruleset_memory_limit: 0
  enable_libdetection: "on"
  ...
- name: rsN:
  ...
```

As entradas `rs0` ... `rsN` são um ou mais grupos de parâmetros. Os grupos podem ter qualquer nome (para que possam ser referenciados posteriormente através do parâmetro [`ruleset`](#ruleset_param) na seção `conf`). Pelo menos um grupo deve estar presente na configuração do nó de filtragem (por exemplo, com o nome `rs0`).

Esta seção não tem valores padrão. Você precisa especificar explicitamente os valores no arquivo de configuração.

!!! info "Nível de definição"
    Esta seção pode ser definida apenas no nível do nó de filtragem.

Parâmetro | Descrição | Valor padrão
--- | ---- | -----
`pdb` | Caminho para o arquivo `proton.db`. Este arquivo contém as configurações globais para a filtragem de solicitações, que não dependem da estrutura do aplicativo. | `/etc/wallarm/proton.db`
`custom_ruleset` | Caminho para o arquivo [custom ruleset][link-lom] que contém informações sobre o aplicativo protegido e as configurações do nó de filtragem. | `/etc/wallarm/custom_ruleset`
`key` | Caminho para o arquivo com a chave privada Wallarm usada para criptografia/descriptografia dos arquivos proton.db e custom ruleset. | `/etc/wallarm/private.key`
`general_ruleset_memory_limit` | Limite para a quantidade máxima de memória que pode ser usada por uma instância de proton.db e custom ruleset. Se o limite de memória for excedido ao processar alguma solicitação, o usuário receberá o erro 500. Os seguintes sufixos podem ser usados neste parâmetro:<ul><li>`k` ou `K` para kilobytes</li><li>`m` ou `M` para megabytes</li><li>`g` ou `G` para gigabytes</li></ul>O valor `0` desativa o limite. | `0`
`enable_libdetection` | Ativa/desativa validação adicional dos ataques de SQL Injection com a [**libdetection** library](../../../about-wallarm/protecting-against-attacks.md#library-libdetection). Se a biblioteca não confirmar a carga maliciosa, a solicitação é considerada legítima. Utilizar a biblioteca **libdetection** permite reduzir o número de falsos positivos entre os ataques de SQL Injection.<br><br>Por padrão, a biblioteca **libdetection** está habilitada. Para a melhor detecção de ataques, recomendamos que a biblioteca permaneça habilitada.<br><br>Ao analisar ataques utilizando a biblioteca **libdetection**, a quantidade de memória consumida pelos processos NGINX e Wallarm pode aumentar em cerca de 10%. | `on`

##  Configurações do módulo de pós-análise

A seção `tarantool` do nó de filtragem contém os parâmetros relacionados ao módulo de pós-análise:

```
tarantool:
  server:
  - uri: localhost:3313
    max_packets: 512
    max_packets_mem: 0
    reconnect_interval: 1
```

A entrada `server` é um grupo de parâmetros que descreve as configurações para o servidor Tarantool.

!!! info "Nível de definição"
    Esta seção pode ser definida apenas no nível do nó de filtragem.

Parâmetro | Descrição | Valor padrão
--- | ---- | -----
`uri` | String com as credenciais utilizadas para se conectar ao servidor Tarantool. O formato da string é `endereço IP` ou `nome do domínio:porta`. | `localhost:3313`
`max_packets` | Limite do número de solicitações serializadas a serem enviadas para o Tarantool. Para remover o limite, defina `0` como o valor do parâmetro. | `512`
`max_packets_mem` | Limite do volume total (em bytes) de solicitações serializadas a serem enviadas para o Tarantool. | `0` (o volume não é limitado)
`reconnect_interval` | Intervalo (em segundos) entre tentativas de reconexão ao Tarantool. Um valor de `0` significa que o nó de filtragem tentará se reconectar ao servidor o mais rápido possível se o servidor render indisponível (não recomendado). | `1`

##  Configurações básicas

A seção `conf` da configuração do Wallarm contém os parâmetros que influenciam as operações básicas do nó de filtragem:

```
conf:
  ruleset: rs0
  mode: "monitoring"
  mode_allow_override: "off"
  application: 42
  process_time_limit: 1000
  process_time_limit_block: "attack"
  request_memory_limit: 104857600
  wallarm_status: "off"
  wallarm_status_format: "json"
  parse_response: true
  unpack_response: true
  parse_html_response: true
```

!!! info "Nível de definição"
    Para um nível de proteção mais flexível, esta seção pode ser sobrescrita no nível da rota ou do host virtual:

    * No nível da rota:

        ```
        routes:
        - match:
          typed_per_filter_config:
            wallarm:
              "@type": type.googleapis.com/wallarm.WallarmConf
              <os parâmetros da seção>
        ```
        
    * No nível do host virtual:
        ```
        virtual_hosts:
        - name: <o nome do host virtual>
          typed_per_filter_config:
            wallarm:
              "@type": type.googleapis.com/wallarm.WallarmConf
              <os parâmetros da seção>
        ```
    Os parâmetros na seção `conf` sobrescrita no nível da rota têm prioridade sobre os parâmetros na seção definida no nível do host virtual, que por sua vez têm prioridade mais alta que os parâmetros listados na seção no nível do nó de filtragem.

Parâmetro | Descrição | Valor padrão
--- | ---- | -----
<a name="ruleset_param"></a>`ruleset` | Um dos grupos de parâmetros que é definido na seção `rulesets`. Este grupo de parâmetros define as regras de filtragem de solicitações a serem usadas.<br>Se este parâmetro for omitido da seção `conf` do nó de filtragem, então ele deve estar presente na seção `conf` sobrescrita no nível da rota ou host virtual. | -
`mode` | Modo do nó:<ul><li>`block` - para bloquear solicitações maliciosas.</li><li>`monitoring` - para analisar, mas não bloquear solicitações.</li><li>`safe_blocking` - para bloquear apenas aquelas solicitações maliciosas originadas de [endereços IP na lista cinza](../../../user-guides/ip-lists/graylist.md).</li><li>`monitoring` - para analisar, mas não bloquear solicitações.</li><li>`off` - para desativar a análise e processamento do tráfego.</li></ul><br>[Descrição detalhada dos modos de filtragem →](../../configure-wallarm-mode.md) | `block`
`mode_allow_override` | Permite a substituição do modo do nó de filtragem que é definido através do parâmetro `mode` com o [custom ruleset][link-lom]:<ul><li>`off` - custom ruleset é ignorado.</li><li>`strict` - custom ruleset pode apenas fortalecer o modo de operação.</li><li>`on` - é possível tanto fortalecer quanto suavizar o modo de operação.</li></ul>Por exemplo, se o parâmetro `mode` for definido com o valor `monitoring` e o parâmetro `mode_allow_override` for definido com o valor `strict`, então será possível bloquear algumas solicitações (`block`), mas não desativar completamente o nó de filtragem (`off`). | `off`
<a name="application_param"></a>`application` | Identificador único da aplicação protegida a ser usado na nuvem Wallarm. O valor pode ser um inteiro positivo exceto `0`.<br><br>[Mais detalhes sobre a configuração de aplicações →](../../../user-guides/settings/applications.md) | `-1`
<a name="partner_client_id_param"></a>`partner_client_uuid` | Identificador único do [inquilino](../../../installation/multi-tenant/overview.md) para o nó [multi-inquilino](../../../installation/multi-tenant/deploy-multi-tenant-node.md) do Wallarm. O valor deve ser uma string no formato [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format), por exemplo: <ul><li> `11111111-1111-1111-1111-111111111111`</li><li>`123e4567-e89b-12d3-a456-426614174000`</li></ul><p>Saiba como:</p><ul><li>[Obter o UUID do inquilino durante a criação do inquilino →](../../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)</li><li>[Obter a lista de UUIDs dos inquilinos existentes →](../../../updating-migrating/older-versions/multi-tenant.md#get-uuids-of-your-tenants)</li><ul>| -
<a name="process_time_limit"></a>`process_time_limit` | <div class="admonition warning"> <p class="admonition-title">O parâmetro foi depreciado</p> <p>A partir da versão 3.6, é recomendado fazer ajustes finos na detecção do ataque `overlimit_res` usando a <a href="../../../../user-guides/rules/configure-overlimit-res-detection/">regra **Ajuste fino da detecção de ataque overlimit_res**</a>.<br>O parâmetro `process_time_limit` é temporariamente suportado, mas será removido em futuras versões.</p></div>Limite no tempo de processamento de uma única solicitação (em milissegundos). Se a solicitação não puder ser processada no tempo definido, então uma mensagem de erro será registrada no arquivo de log e a solicitação será marcada como um ataque `overlimit_res`. | `1000`
<a name="process_time_limit_block"></a>`process_time_limit_block` | <div class="admonition warning"> <p class="admonition-title">O parâmetro foi depreciado</p> <p>A partir da versão 3.6, é recomendado fazer ajustes finos na detecção do ataque `overlimit_res` usando a <a href="../../../../user-guides/rules/configure-overlimit-res-detection/">regra **Ajuste fino da detecção de ataque overlimit_res**</a>.<br>O parâmetro `process_time_limit_block` é temporariamente suportado, mas será removido em futuras versões.</p></div>Ação a ser tomada quando o tempo de processamento da solicitação exceder o limite definido pelo parâmetro `process_time_limit`:<ul><li>`off` - as solicitações são sempre ignoradas.</li><li>`on` - as solicitações são sempre bloqueadas, a menos que `mode: "off"`.</li><li>`attack` - depende do modo de bloqueio de ataque definido pelo parâmetro `mode`:<ul><li>`off` - as solicitações não são processadas.</li><li>`monitoring` - as solicitações são ignoradas.</li><li>`block` - as solicitações são bloqueadas.</li></ul></li></ul> | `attack`
`wallarm_status` | Se habilita o [serviço de estatísticas do nó de filtragem](../../configure-statistics-service.md). | `false`
`wallarm_status_format` | Formato das [estatísticas do nó de filtragem](../../configure-statistics-service.md): `json` ou `prometheus`. | `json`
`disable_acl` | Permite desativar a análise das origens das solicitações. Se desativado (`on`), o nó de filtragem não baixa [listas IP](../../../user-guides/ip-lists/overview.md) da nuvem Wallarm e ignora a análise dos IPs de origem das solicitações. | `off`
`parse_response` | Se analisa as respostas do aplicativo. A análise da resposta é necessária para a detecção de vulnerabilidades durante a [detecção passiva](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection) e a [verificação ativa de ameaças](../../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification).<br><br>Os valores possíveis são `true` (análise da resposta está habilitada) e `false` (análise da resposta está desabilitada). | `true`
`unpack_response` | Se descomprime dados comprimidos retornados na resposta do aplicativo. Os valores possíveis são `true` (a descompressão está habilitada) e `false` (a descompressão está desabilitada).<br><br>Este parâmetro é efetivo apenas se `parse_response true`. | `true`
`parse_html_response` | Se aplica os parsers HTML ao código HTML recebido na resposta do aplicativo. Os valores possíveis são `true` (o parser HTML é aplicado) e `false` (o parser HTML não é aplicado).<br><br>Este parâmetro é efetivo apenas se `parse_response true`. | `true`
