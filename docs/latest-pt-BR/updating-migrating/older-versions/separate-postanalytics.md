[docs-module-update]:   nginx-modules.md
[img-wl-console-users]:             ../../images/check-users.png
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../../images/admin-guides/test-attacks-quickstart.png
[nginx-custom]:                 ../../custom/custom-nginx-version.md
[wallarm-token-types]:          ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]:             ../../images/tarantool-status.png
[statistics-service-all-parameters]: ../../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:    ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md

# Atualizando o módulo EOL pós-análises

Estas instruções descrevem as etapas para atualizar o módulo pós-análise fim de vida (versão 3.6 e inferior) instalado em um servidor separado. O módulo pós-análise deve ser atualizado antes de [Atualização dos módulos NGINX Wallarm][docs-module-update].

--8<-- "../include-pt-BR/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Métodos de atualização

--8<-- "../include-pt-BR/waf/installation/upgrade-methods.md"

## Atualização com o instalador tudo-em-um

Use o procedimento abaixo para atualizar o módulo pós-análise fim de vida (versão 3.6 e inferior) instalado em um servidor separado para a versão 4.8 usando o [instalador tudo-em-um](../../installation/nginx/all-in-one.md).

### Requisitos para atualização usando o instalador tudo-em-um

--8<-- "../include-pt-BR/waf/installation/all-in-one-upgrade-requirements.md"

### Passo 1: Prepare uma máquina limpa

--8<-- "../include-pt-BR/waf/installation/all-in-one-clean-machine.md"

### Passo 2: Prepare o token Wallarm

--8<-- "../include-pt-BR/waf/installation/all-in-one-token.md"

### Passo 3: Baixe o instalador tudo-em-um Wallarm

--8<-- "../include-pt-BR/waf/installation/all-in-one-installer-download.md"

### Passo 4: Execute o instalador tudo-em-um Wallarm para instalar pós-análises

--8<-- "../include-pt-BR/waf/installation/all-in-one-postanalytics.md"

### Passo 5: Atualize a porta da API

--8<-- "../include-pt-BR/waf/upgrade/api-port-443.md"

### Passo 6: Atualize o módulo NGINX-Wallarm em um servidor separado

Uma vez que o módulo pós-análise foi instalado em um servidor separado, [atualize o NGINX-Wallarm module](nginx-modules.md) relacionado que está em execução em um servidor diferente.

!!! info "Combinando métodos de atualização"
    Ambas as abordagens manual e automática podem ser usadas para atualizar o módulo NGINX-Wallarm relacionado.

### Passo 7: Reconecte o módulo NGINX-Wallarm ao módulo pós-análise

--8<-- "../include-pt-BR/waf/installation/all-in-one-postanalytics-reconnect.md"

### Passo 8: Verifique a interação dos módulos NGINX‑Wallarm e separado de pós-análises

--8<-- "../include-pt-BR/waf/installation/all-in-one-postanalytics-check.md"

### Passo 9: Remova o antigo módulo pós-análise

--8<-- "../include-pt-BR/waf/installation/all-in-one-postanalytics-remove-old.md"

## Atualização manual

Use o procedimento abaixo para atualizar manualmente o módulo pós-análise fim de vida (versão 3.6 e inferior) instalado em um servidor separado para a versão 4.8.

### Requisitos

--8<-- "../include-pt-BR/waf/installation/basic-reqs-for-upgrades.md"

### Passo 1: Atualize a porta da API

--8<-- "../include-pt-BR/waf/upgrade/api-port-443.md"

### Passo 2: Adicione um novo repositório Wallarm

Delete o endereço do repositório Wallarm anterior e adicione um repositório com novos pacotes de versão de nó Wallarm. Por favor, use os comandos para a plataforma apropriada.

**CentOS e Amazon Linux 2.0.2021x e inferiores**

=== "CentOS 7 e Amazon Linux 2.0.2021x e inferiores"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "CentOS 8"
    !!! warning "O suporte para CentOS 8.x foi descontinuado"
        O suporte para CentOS 8.x [foi descontinuado](https://www.centos.org/centos-linux-eol/). Você pode instalar o nó Wallarm no sistema operacional AlmaLinux, Rocky Linux, Oracle Linux 8.x ou RHEL 8.x em vez disso.

        * [Instruções de instalação para NGINX 'stable'](../../installation/nginx/dynamic-module.md)
        * [Instruções de instalação para NGINX de repositórios CentOS/Debian](../../installation/nginx/dynamic-module-from-distr.md)
        * [Instruções de instalação para NGINX Plus](../../installation/nginx-plus.md)
=== "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```

**Debian e Ubuntu**

1. Abra o arquivo com o endereço do repositório Wallarm no editor de texto instalado. Nesta instrução, **vim** é usado.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. Comente ou delete o endereço do repositório anterior.
3. Adicione um novo endereço de repositório:

    === "Debian 10.x (buster)"
        !!! warning "Não suportado por NGINX estável e NGINX Plus"
            As versões oficiais do NGINX (estável e Plus) e, como resultado, o nó Wallarm 4.4 e acima não podem ser instalados no Debian 10.x (buster). Por favor, use este SO apenas se o [NGINX for instalado a partir dos repositórios Debian/CentOS](../../installation/nginx/dynamic-module-from-distr.md).

        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node buster/4.8/
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.8/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.8/
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/
        ```

### Passo 3: Atualize os pacotes Tarantool

=== "Debian"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include-pt-BR/waf/upgrade/warning-expired-gpg-keys-4.8.md"

    --8<-- "../include-pt-BR/waf/upgrade/details-about-dist-upgrade.md"
=== "Ubuntu"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include-pt-BR/waf/upgrade/warning-expired-gpg-keys-4.8.md"

    --8<-- "../include-pt-BR/waf/upgrade/details-about-dist-upgrade.md"
=== "CentOS ou Amazon Linux 2.0.2021x e inferiores"
    ```bash
    sudo yum update
    ```
=== "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
    ```bash
    sudo yum update
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum update
    ```

### Passo 4: Atualize o tipo de nó

O nó pós-análises implantado 3.6 ou inferior possui o tipo obsoleto **regular** que é [agora substituído pelo novo tipo de nó **Wallarm node**](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens).

É recomendado instalar o novo tipo de nó em vez do obsoleto durante a migração para a versão 4.8. O tipo de nó regular será removido em futuras versões, por favor, migre antes.

Para substituir o nó regular pós-análises pelo Wallarm node:

1. Abra Wallarm Console → **Nodes** [Nuvem US](https://us1.my.wallarm.com/nodes) ou [Nuvem EU](https://my.wallarm.com/nodes) e crie o nó **Wallarm node**.

    ![Criação do nó Wallarm][img-create-wallarm-node]
1. Copie o token gerado.
1. Execute o script `register-node` para executar o **Wallarm node**:

    === "Nuvem US"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force --no-sync --no-sync-acl
        ```
    === "Nuvem EU"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force --no-sync --no-sync-acl
        ```
    
    * `<TOKEN>` é o valor copiado do token de nó ou token de API com a função `Deploy`.
    * A opção `--force` força a reescritura das credenciais de acesso à Wallarm Cloud especificadas no arquivo `/etc/wallarm/node.yaml`.

    <div class="admonition info">
    <p class="admonition-title">Usando um token para várias instalações</p>
    <p>Você tem duas opções para usar um token para várias instalações:</p>
    <ul>
    <li>**Para todas as versões de nó**, você pode usar um [**token de nó**](../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node) em várias instalações, independentemente da [plataforma](../../installation/supported-deployment-options.md) selecionada. Isso permite a agrupação lógica de instâncias de nó na interface do usuário do Console Wallarm. Exemplo: você implanta vários nós Wallarm em um ambiente de desenvolvimento, cada nó está em sua própria máquina de propriedade de um determinado desenvolvedor.</li>
    <li>
    <p>**A partir do nó 4.6**, para agrupamento de nós, você pode usar um [**token API**](../../user-guides/settings/api-tokens.md) com a função `Deploy` junto com a flag `--labels 'group=<GROUP>'`, por exemplo:</p>

    ```
    sudo /usr/share/wallarm-common/register-node -t <TOKEN API COM FUNÇÃO DEPLOY> --labels 'group=<GROUP>'
    ```
    </p>
    </li>
    </ul></div>

### Passo 5: Reinicie o módulo pós-análise

=== "Debian"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.x ou Amazon Linux 2.0.2021x e inferiores"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

[Atualize os módulos NGINX Wallarm][docs-module-update]