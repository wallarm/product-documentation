[docs-module-update]:           nginx-modules.md
[img-wl-console-users]:         ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../images/admin-guides/test-attacks-quickstart.png
[wallarm-token-types]:          ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]:             ../images/tarantool-status.png
[statistics-service-all-parameters]: ../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md

# Atualizando o módulo de pós-análise

Estas instruções descrevem os passos para atualizar o módulo de pós-análise 4.x instalado em um servidor separado. O módulo de pós-análise deve ser atualizado antes de [Atualizar Módulos Wallarm NGINX][docs-module-update].

Para atualizar o módulo de fim de vida (3.6 ou inferior), por favor, use as [instruções diferentes](older-versions/separate-postanalytics.md).

## Métodos de atualização

--8<-- "../include-pt-BR/waf/installation/upgrade-methods.md"

## Atualização com instalador tudo em um

Use o procedimento abaixo para atualizar o módulo de pós-análise 4.x instalado em um servidor separado para a versão 4.8 usando [instalador tudo-em-um](../installation/nginx/all-in-one.md).

### Requisitos para atualização usando o instalador tudo em um

--8<-- "../include-pt-BR/waf/installation/all-in-one-upgrade-requirements.md"

### Passo 1: Prepare a máquina limpa

--8<-- "../include-pt-BR/waf/installation/all-in-one-clean-machine.md"

### Passo 2: Prepare o token Wallarm

--8<-- "../include-pt-BR/waf/installation/all-in-one-token.md"

### Passo 3: Baixe o instalador Wallarm tudo em um

--8<-- "../include-pt-BR/waf/installation/all-in-one-installer-download.md"

### Passo 4: Execute o instalador Wallarm tudo em um para instalar a pós-análise

--8<-- "../include-pt-BR/waf/installation/all-in-one-postanalytics.md"

### Passo 5: Atualize o módulo NGINX-Wallarm em um servidor separado

Assim que o módulo de pós-análise estiver instalado em um servidor separado, [atualize o módulo NGINX-Wallarm correspondente](nginx-modules.md) funcionando em um servidor diferente.

!!! info "Combinando métodos de atualização"
    Ambos os métodos, manual e automático, podem ser usados para atualizar o módulo NGINX-Wallarm correspondente.

### Passo 6: Reconecte o módulo NGINX-Wallarm ao módulo pós-análise

--8<-- "../include-pt-BR/waf/installation/all-in-one-postanalytics-reconnect.md"

### Passo 7: Verifique a interação dos módulos NGINX‑Wallarm e pós-análise separados

--8<-- "../include-pt-BR/waf/installation/all-in-one-postanalytics-check.md"

### Passo 8: Remover o antigo módulo de pós-análise

--8<-- "../include-pt-BR/waf/installation/all-in-one-postanalytics-remove-old.md"

## Atualização manual

Use o procedimento abaixo para atualizar manualmente o módulo de pós-análise 4.x instalado em um servidor separado para a versão 4.8.

### Requisitos 

--8<-- "../include-pt-BR/waf/installation/basic-reqs-for-upgrades.md"

### Passo 1: Adicionar novo repositório Wallarm

Delete o endereço do repositório Wallarm anterior e adicione um repositório com os novos pacotes de versão do nó Wallarm. Por favor, use os comandos para a plataforma apropriada.

**CentOS e Amazon Linux 2.0.2021x e inferior**

=== "CentOS 7 e Amazon Linux 2.0.2021x e inferior"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
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
        !!! warning "Não suportado pelo NGINX estável e NGINX Plus"
            As versões oficiais da NGINX (estável e Plus) e, como resultado, o nó Wallarm 4.4 e superior, não podem ser instaladas no Debian 10.x (buster). Por favor, use este sistema operacional apenas se [NGINX estiver instalado a partir dos repositórios Debian/CentOS](../installation/nginx/dynamic-module-from-distr.md).

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

### Passo 2: Atualize os pacotes do Tarantool 

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
=== "CentOS ou Amazon Linux 2.0.2021x e inferior"
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

### Passo 3: Atualize o tipo de nó

!!! info "Apenas para nós instalados usando o script `addnode`"
    Siga este passo apenas se um nó de uma versão anterior estiver conectado ao Wallarm Cloud usando o script `addnode`. Este script foi [removido](what-is-new.md#removal-of-the-email-password-based-node-registration) e substituído pelo `register-node`, que requer um token para registrar o nó na Cloud.

1. Certifique-se de que sua conta Wallarm tem a função **Administrador** navegando até a lista de usuários na [Nuvem US](https://us1.my.wallarm.com/settings/users) ou [Nuvem UE](https://my.wallarm.com/settings/users).

    ![Lista de usuários na console Wallarm][img-wl-console-users]
1. Abra a Console Wallarm → **Nós** na [Nuvem US](https://us1.my.wallarm.com/nodes) ou [Nuvem UE](https://my.wallarm.com/nodes) e crie o nó do tipo **Wallarm node**.

    ![Criação de nó Wallarm][img-create-wallarm-node]
1. Copie o token gerado.
1. Execute o script `register-node` para executar o nó:

    === "Nuvem US"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force --no-sync --no-sync-acl
        ```
    === "Nuvem UE"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force --no-sync --no-sync-acl
        ```
    
    * `<TOKEN>` é o valor copiado do token do nó ou token API com a função `Deploy`.
    * A opção `--force` impõe a substituição das credenciais de acesso à Nuvem Wallarm especificadas no arquivo `/etc/wallarm/node.yaml`.

    <div class="admonition info"> <p class="admonition-title">Usar um token para várias instalações</p> <p>Você tem duas opções para usar um token para várias instalações:</p> <ul><li>**Para todas as versões de nós**, você pode usar um [**token de nó**](../quickstart/getting-started.md#deploy-the-wallarm-filtering-node) em várias instalações, independentemente da [plataforma](../installation/supported-deployment-options.md) selecionada. Ele permite o agrupamento lógico de instâncias de nós na interface da Wallarm Console. Exemplo: você implanta vários nós Wallarm em um ambiente de desenvolvimento, cada nó está em sua própria máquina pertencente a um determinado desenvolvedor.</li><li><p>**A partir de nó 4.6**, para agrupar os nós, você pode usar um [**token API**](../user-guides/settings/api-tokens.md) com a função `Deploy` junto com a bandeira `--labels 'group=<GROUP>'`, por exemplo:</p>
    ```
    sudo /usr/share/wallarm-common/register-node -t <TOKEN API COM FUNÇÃO DEPLOY> --labels 'group=<GROUP>'
    ```
    </p></li></ul></div>

### Passo 4: Reinicie o módulo de pós-análise

=== "Debian"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.x ou Amazon Linux 2.0.2021x e inferior"
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

[Atualize os Módulos Wallarm NGINX][docs-module-update]