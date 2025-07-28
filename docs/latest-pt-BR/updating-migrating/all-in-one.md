[statistics-service-all-parameters]:        ../admin-en/configure-statistics-service.md
[img-attacks-in-interface]:                 ../images/admin-guides/test-attacks-quickstart.png
[tarantool-status]:                         ../images/tarantool-status.png
[configure-proxy-balancer-instr]:           ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[sqli-attack-docs]:                         ../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                          ../attacks-vulns-list.md#crosssite-scripting-xss

# Atualizando o nó Wallarm com o instalador All-in-One

Estas instruções descrevem os passos para atualizar o nó Wallarm 4.x instalado usando o [instalador all-in-one](../installation/nginx/all-in-one.md) para a versão 4.8.

## Requerimentos

--8<-- "../include-pt-BR/waf/installation/all-in-one-upgrade-requirements.md"

## Procedimento de atualização

O procedimento de atualização difere dependendo de como os módulos do nó de filtragem e pós-análise estão instalados:

* [No mesmo servidor](#filtering-node-and-postanalytics-on-the-same-server): os módulos são atualizados juntos
* [Em servidores diferentes](#filtering-node-and-postanalytics-on-different-servers): **primeiro** atualize o módulo de pós-análise e **depois** o módulo de filtragem

## Nó de filtragem e pós-análise no mesmo servidor

Use o procedimento abaixo para atualizar juntos os módulos do nó de filtragem e pós-análise instalados usando o instalador all-in-one no mesmo servidor.

### Passo 1: Prepare o token Wallarm

Para atualizar o nó, você precisará de um token Wallarm de [um dos tipos](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation). Para preparar um token:

=== "Token de API"

    1. Abra o Wallarm Console → **Configurações** → **Tokens de API** no [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) ou [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Encontre ou crie um token de API com o papel de fonte `Deploy`.
    1. Copie este token.

=== "Token do nó"

    Para atualizar, use o mesmo token do nó que foi utilizado para a instalação:

    1. Abra o Wallarm Console → **Nós** no [US Cloud](https://us1.my.wallarm.com/nodes) ou [EU Cloud](https://my.wallarm.com/nodes).
    1. No grupo de nós existente, copie o token usando o menu do nó → **Copiar token**.

### Passo 2: Baixe a versão mais recente do instalador Wallarm all-in-one

--8<-- "../include-pt-BR/waf/installation/all-in-one-installer-download.md"

### Passo 3: Execute o instalador Wallarm all-in-one

--8<-- "../include-pt-BR/waf/installation/all-in-one-installer-run.md"

### Passo 4: Reinicie o NGINX

--8<-- "../include-pt-BR/waf/installation/restart-nginx-systemctl.md"

### Passo 5: Teste a operação do nó Wallarm

Para testar a nova operação do nó:

1. Envie a requisição com testes de [SQLI][sqli-attack-docs] e [XSS][xss-attack-docs] ataques ao endereço do recurso protegido:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. Abra a seção Wallarm Console → **Eventos** no [US Cloud](https://us1.my.wallarm.com/attacks) ou [EU Cloud](https://my.wallarm.com/attacks) e certifique-se de que os ataques são exibidos na lista.
1. Assim que os dados armazenados em seu Cloud (regras, listas de IP) forem sincronizados com o novo nó, realize alguns ataques de teste para ter certeza de que suas regras funcionam conforme o esperado.

## Nó de filtragem e pós-análise em servidores diferentes

!!! warning "Sequência de passos para atualizar os módulos de nó de filtragem e pós-análise"
    Se o nó de filtragem e os módulos de pós-análise estiverem instalados em servidores diferentes, será necessário atualizar os pacotes de pós-análise antes de atualizar os pacotes de nó de filtragem.

### Passo 1: Prepare o token Wallarm

Para atualizar o nó, você precisará de um token Wallarm de [um dos tipos](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation). Para preparar um token:

=== "Token de API"

    1. Abra o Wallarm Console → **Configurações** → **Tokens de API** no [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) ou [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Encontre ou crie um token de API com o papel de fonte `Deploy`.
    1. Copie este token.

=== "Token do nó"

    Para atualizar, use o mesmo token do nó que foi utilizado para a instalação:

    1. Abra o Wallarm Console → **Nós** no [US Cloud](https://us1.my.wallarm.com/nodes) ou [EU Cloud](https://my.wallarm.com/nodes).
    1. No grupo de nós existente, copie o token usando o menu do nó → **Copiar token**.

### Passo 2: Baixe a versão mais recente do instalador Wallarm all-in-one para a máquina de pós-análise

Este passo é realizado na máquina de pós-análise.

--8<-- "../include-pt-BR/waf/installation/all-in-one-installer-download.md"

### Passo 3: Execute o instalador Wallarm all-in-one para atualizar o pós-analítico

Este passo é realizado na máquina de pós-análise.

--8<-- "../include-pt-BR/waf/installation/all-in-one-postanalytics.md"

### Passo 4: Baixe a versão mais recente do instalador Wallarm all-in-one para a máquina do nó de filtragem

Este passo é realizado na máquina do nó de filtragem.

--8<-- "../include-pt-BR/waf/installation/all-in-one-installer-download.md"

### Passo 5: Execute o instalador Wallarm all-in-one para atualizar o nó de filtragem

Este passo é realizado na máquina do nó de filtragem.

Para atualizar o nó de filtragem separadamente com o instalador all-in-one, use:

=== "Token de API"
    ```bash
    # Se usando a versão x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.x86_64-glibc.sh filtering

    # Se usando a versão ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.aarch64-glibc.sh filtering
    ```        

    A variável `WALLARM_LABELS` define o grupo ao qual o nó será adicionado (usado para agrupamento lógico de nós na interface do usuário do Wallarm Console).

=== "Token do nó"
    ```bash
    # Se usando a versão x86_64:
    sudo sh wallarm-4.8.0.x86_64-glibc.sh filtering

    # Se usando a versão ARM64:
    sudo sh wallarm-4.8.0.aarch64-glibc.sh filtering
    ```

### Passo 6: Verifique a interação dos módulos do nó de filtragem e pós-análise separados

--8<-- "../include-pt-BR/waf/installation/all-in-one-postanalytics-check.md"
