# Executando a Imagem Docker Baseada em Envoy

Essas instruções descrevem as etapas para executar a imagem Docker Wallarm baseada em [Envoy 1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4). A imagem contém todos os sistemas necessários para a operação correta do nó Wallarm:

* Serviços de proxy Envoy com o módulo Wallarm embutido
* Módulos do Tarantool para pós-análise
* Outros serviços e scripts

O módulo Wallarm é projetado como um filtro HTTP Envoy para proxying de solicitações.

!!! aviso "Parâmetros de configuração suportados"
    Observe que a maioria das [diretivas][nginx-directives-docs] para a configuração do nó de filtragem baseado em NGINX não são suportadas para a configuração do nó de filtragem baseado em Envoy. Consequentemente, a configuração de [limite de taxa][rate-limit-docs] não está disponível neste método de implantação.
    
    Veja a lista de parâmetros disponíveis para a [configuração do nó de filtragem baseada em Envoy →][docker-envoy-configuration-docs]

## Casos de uso

--8<-- "../include/waf/installation/docker-images/envoy-based-use-cases.md"

## Requisitos

--8<-- "../include/waf/installation/docker-images/envoy-requirements.md"

## Opções para executar o contêiner

Os parâmetros de configuração do nó de filtragem podem ser passados ​​para o comando `docker run` das seguintes maneiras:

* **Nas variáveis ​​de ambiente**. Esta opção permite a configuração de apenas os parâmetros básicos do nó de filtragem, a maioria dos [parâmetros][docker-envoy-configuration-docs] não pode ser alterada através de variáveis ​​de ambiente.
* **No arquivo de configuração montado**. Esta opção permite a configuração de todos os [parâmetros][docker-envoy-configuration-docs] do nó de filtragem.

## execute o contêiner passando as variáveis ​​de ambiente

Para executar o contêiner:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Execute o contêiner com o nó:

    === "Nuvem dos EUA"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e ENVOY_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/envoy:4.8.0-1
        ```
    === "Nuvem da UE"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e ENVOY_BACKEND='example.com' -p 80:80 wallarm/envoy:4.8.0-1
        ```

Você pode passar as seguintes configurações básicas do nó de filtragem para o contêiner por meio da opção `-e`:

Variável de ambiente | Descrição | Necessário
--- | ---- | ----
`WALLARM_API_TOKEN` | Token de nó ou API do Wallarm. | Sim
`ENVOY_BACKEND` | Domínio ou endereço IP do recurso a ser protegido com a solução Wallarm. | Sim
`WALLARM_API_HOST` | Servidor API Wallarm:<ul><li>`us1.api.wallarm.com` para a Nuvem dos EUA</li><li>`api.wallarm.com` para a Nuvem da UE</li></ul>Por padrão: `api.wallarm.com`. | Não
`WALLARM_MODE` | Modo de nó:<ul><li>`block` para bloquear solicitações maliciosas</li><li>`safe_blocking` para bloquear apenas aquelas solicitações maliciosas originadas de [endereços IP cinza listados][graylist-docs]</li><li>`monitoring` para analisar, mas não bloquear solicitações</li><li>`off` para desativar a análise e o processamento de tráfego</li></ul>Por padrão: `monitoring`.<br>[Descrição detalhada dos modos de filtragem →][wallarm-mode-docs] | Não
`WALLARM_LABELS` | <p>Disponível a partir do nó 4.6. Funciona apenas se `WALLARM_API_TOKEN` for definido como [token de API][api-tokens-docs] com a função `Deploy`. Define o rótulo `group` para agrupamento de instâncias de nó, por exemplo:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>... colocará a instância de nó no grupo de instâncias` <GROUP> ` (existente ou, se não existir, será criado).</p> | Sim (para tokens de API)
`TARANTOOL_MEMORY_GB` | [Quantidade de memória][allocate-resources-for-wallarm-docs] alocada ao Tarantool. O valor pode ser um número inteiro ou um número decimal (um ponto <code>.</code> é um separador decimal). Por padrão: 0.2 gigabytes. | Não

O comando faz o seguinte:

* Cria o arquivo `envoy.yaml` com configuração mínima de Envoy no diretório do contêiner `/etc/envoy`.
* Cria arquivos com credenciais do nó de filtragem para acessar a Wallarm Cloud no diretório do contêiner `/etc/wallarm`:
    * `node.yaml` com UUID do nó de filtragem e chave secreta
    * `private.key` com chave privada Wallarm
* Protege o recurso `http://ENVOY_BACKEND:80`.

## Execute o contêiner montando o envoy.yaml

Você pode montar o arquivo preparado `envoy.yaml` no contêiner Docker por meio da opção `-v`. O arquivo deve conter as seguintes configurações:

* Configurações do nó de filtragem, conforme descrito nas [instruções][docker-envoy-configuration-docs]
* Configurações Envoy conforme descrito nas [instruções Envoy](https://www.envoyproxy.io/docs/envoy/v1.15.0/configuration/overview/overview)

Para executar o contêiner:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Execute o contêiner com o nó:

    === "Nuvem dos EUA"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.8.0-1
        ```
    === "Nuvem da UE"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.8.0-1
        ```

    * A opção `-e` passa as seguintes variáveis ​​de ambiente obrigatórias para o contêiner:

    Variável de ambiente | Descrição | Necessário
    --- | ---- | ----
    `WALLARM_API_TOKEN` | Token de nó do Wallarm.<br><div class="admonition info"> <p class="admonition-title">Usando um token para várias instalações</p> <p>Você pode usar um token em várias instalações, independentemente do [plataforma][supported-deployments] selecionada. Ele permite o agrupamento lógico de instâncias de nós na interface de usuário do Console Wallarm. Exemplo: você implanta vários nós Wallarm em um ambiente de desenvolvimento, cada nó está em sua própria máquina de propriedad de um certo desenvolvedor.</p></div> | Sim
    `WALLARM_API_HOST` | Servidor API Wallarm:<ul><li>`us1.api.wallarm.com` para a Nuvem dos EUA</li><li>`api.wallarm.com` para a Nuvem da UE</li></ul>Por padrão: `api.wallarm.com`. | Não

    * A opção `-v` monta o diretório com o arquivo de configuração `envoy.yaml` no diretório do contêiner `/etc/envoy`.

O comando faz o seguinte:

* Monta o arquivo `envoy.yaml` no diretório do contêiner `/etc/envoy`.
* Cria arquivos com credenciais do nó de filtragem para acessar a Wallarm Cloud no diretório do contêiner `/etc/wallarm`:
    * `node.yaml` com UUID do nó de filtragem e chave secreta
    * `private.key` com chave privada Wallarm
* Protege o recurso especificado no arquivo de configuração montado.

## Configuração da rotação de logs (opcional)

A rotação do arquivo de log está pré-configurada e ativada por padrão. Você pode ajustar as configurações de rotação, se necessário. Essas configurações estão localizadas no diretório `/etc/logrotate.d` do contêiner.

## Testando a operação do nó Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"