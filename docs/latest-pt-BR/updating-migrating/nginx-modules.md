[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]:      ../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../admin-en/configure-dynamic-dns-resolution-nginx.md
[img-wl-console-users]:             ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[oob-docs]:                         ../installation//oob/overview.md
[sqli-attack-docs]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[web-server-mirroring-examples]:    ../installation/oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring



# Atualizando módulos NGINX Wallarm

Estas instruções descrevem as etapas para atualizar os módulos NGINX Wallarm 4.x instalados a partir dos pacotes individuais para a versão 4.8. Estes são os módulos instalados de acordo com uma das seguintes instruções:

* [Pacotes individuais para NGINX estável](../installation/nginx/dynamic-module.md)
* [Pacotes individuais para NGINX Plus](../installation/nginx-plus.md)
* [Pacotes individuais para distribuição fornecida NGINX](../installation/nginx/dynamic-module-from-distr.md)

Para atualizar o nó de fim de vida (3.6 ou inferior), utilize as [diferentes instruções](older-versions/nginx-modules.md).

## Métodos de atualização

--8<-- "../include-pt-BR/waf/installation/upgrade-methods.md"

## Atualização com instalador all-in-one

Use o procedimento abaixo para atualizar os módulos NGINX Wallarm 4.x para a versão 4.8 usando [instalador all-in-one](../installation/nginx/all-in-one.md).

### Requisitos para atualização usando o instalador all-in-one

--8<-- "../include-pt-BR/waf/installation/all-in-one-upgrade-requirements.md"

### Procedimento de atualização

* Se os módulos de nó filtragem e postanálise estiverem instalados no mesmo servidor, siga as instruções abaixo para atualizar todos.

    Você precisará executar um nó da versão mais recente usando o instalador all-in-one em uma máquina limpa, testar se funciona corretamente e parar o anterior e configurar o tráfego para fluir através da nova máquina em vez da anterior.

* Se os módulos de nó de filtragem e postanálise estiverem instalados em servidores diferentes, **primeiro** atualize o módulo de postanálise e **depois** o módulo de filtragem seguindo estas [instruções](../updating-migrating/separate-postanalytics.md).

### Etapa 1: Prepara máquina limpa

--8<-- "../include-pt-BR/waf/installation/all-in-one-clean-machine.md"

### Etapa 2: Instale o NGINX e as dependências

--8<-- "../include-pt-BR/waf/installation/all-in-one-nginx.md"

### Etapa 3: Preparar token Wallarm

--8<-- "../include-pt-BR/waf/installation/all-in-one-token.md"

### Etapa 4: Baixar o instalador all-in-one do Wallarm

--8<-- "../include-pt-BR/waf/installation/all-in-one-installer-download.md"

### Etapa 5: Execute o instalador all-in-one do Wallarm

#### Nó de filtragem e postanálise no mesmo servidor

--8<-- "../include-pt-BR/waf/installation/all-in-one-installer-run.md"

#### Nó de filtragem e postanálise em servidores diferentes

!!! warning "Sequência de etapas para atualizar os módulos de nó de filtragem e postanálise"
    Se os módulos de nó de filtragem e postanálise estiverem instalados em servidores diferentes, então é necessário atualizar os pacotes de postanálise antes de atualizar os pacotes do nó de filtragem.

1. Atualize o módulo postanálise seguindo estas [instruções](separate-postanalytics.md).
1. Atualize o nó de filtragem:

    === "API token"
        ```bash
        # Se estiver usando a versão x86_64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.x86_64-glibc.sh filtering

        # Se estiver usando a versão ARM64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.aarch64-glibc.sh filtering
        ```        

        A variável `WALLARM_LABELS` define o grupo em que o nó será adicionado (usado para agrupamento lógico de nós na IU do Console Wallarm).

    === "Nó token"
        ```bash
        # Se estiver usando a versão x86_64:
        sudo sh wallarm-4.8.0.x86_64-glibc.sh filtering

        # Se estiver usando a versão ARM64:
        sudo sh wallarm-4.8.0.aarch64-glibc.sh filtering
        ```

### Etapa 6: Transferir configuração do NGINX e postanálise de máquina antiga para nova

Transfira a configuração do NGINX relacionada ao nó e a configuração de postanálise dos arquivos de configuração na máquina antiga para os arquivos em uma nova máquina. Você pode fazer isso copiando as diretivas necessárias.

**Arquivos de origem**

Na máquina antiga, dependendo do sistema operacional e da versão do NGINX, os arquivos de configuração do NGINX podem estar localizados em diretórios diferentes e ter nomes diferentes. Os mais comuns são os seguintes:

* `/etc/nginx/conf.d/default.conf` com configurações do NGINX
* `/etc/nginx/conf.d/wallarm.conf` com configurações globais do nó de filtragem

    O arquivo é usado para configurações aplicadas a todos os domínios. Para aplicar configurações diferentes a diferentes grupos de domínio, o arquivo `default.conf` geralmente é usado ou um novo arquivo de configuração é criado para cada grupo de domínio (por exemplo, `example.com.conf` e `test.com.conf`). Informações detalhadas sobre os arquivos de configuração do NGINX estão disponíveis na [documentação oficial do NGINX](https://nginx.org/en/docs/beginners_guide.html).
    
* `/etc/nginx/conf.d/wallarm-status.conf` com configurações de monitoramento do nó Wallarm. Descrição detalhada disponível no [link][wallarm-status-instr]

Também, a configuração do módulo postanálise (configurações do banco de dados Tarantool) geralmente está localizada aqui:

* `/etc/default/wallarm-tarantool` ou
* `/etc/sysconfig/wallarm-tarantool`

**Arquivos de destino**

Como o instalador all-in-one funciona com diferentes combinações de sistema operacional e versões do NGINX, na sua nova máquina, os [arquivos de destino](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) podem ter nomes diferentes e estar localizados em diretórios diferentes.

### Etapa 7: Reiniciar NGINX

--8<-- "../include-pt-BR/waf/installation/restart-nginx-systemctl.md"

### Etapa 8: Testar operação do nó Wallarm

Para testar a operação do novo nó:

1. Envie a solicitação com ataques de teste [SQLI][sqli-attack-docs] e [XSS][xss-attack-docs] para o endereço do recurso protegido:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. Abra o console Wallarm → seção **Eventos** no [Cloud dos EUA](https://us1.my.wallarm.com/attacks) ou [Cloud da UE](https://my.wallarm.com/attacks) e certifique-se de que os ataques estão exibidos na lista.
1. Assim que seus dados armazenados em Cloud (regras, listas de IP) estiverem sincronizados para o novo nó, realize alguns ataques de teste para garantir que suas regras funcionem como esperado.

### Etapa 9: Configurar envio de tráfego para o nó Wallarm

Dependendo da abordagem de implantação em uso, realize as seguintes configurações:

=== "In-line"
    Atualize os alvos de seu balanceador de carga para enviar tráfego para a instância Wallarm. Para detalhes, consulte a documentação do seu balanceador de carga.

    Antes de redirecionar completamente o tráfego para o novo nó, é recomendável primeiro redirecioná-lo parcialmente e verificar se o novo nó se comporta conforme o esperado.

=== "Fora de banda"
    Configure seu servidor web ou proxy (por exemplo, NGINX, Envoy) para espelhar o tráfego de entrada para o nó Wallarm. Para detalhes de configuração, recomendamos consultar a documentação do seu servidor web ou proxy.

    Dentro do [link][web-server-mirroring-examples], você encontrará a configuração de exemplo para os servidores web e proxy mais populares (NGINX, Traefik, Envoy).

### Etapa 10: Remover nó antigo

1. Exclua o nó antigo no console Wallarm → **Nós** selecionando seu nó e clicando em **Excluir**.
1. Confirme a ação.
    
    Quando o nó é excluído do Cloud, ele para a filtragem das solicitações para suas aplicações. Excluir o nó de filtragem não pode ser desfeito. O nó será excluído permanentemente da lista de nós.

1. Exclua máquina com o nó antigo ou simplesmente limpe-a dos componentes do nó Wallarm:

    === "Debian"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "CentOS ou Amazon Linux 2.0.2021x e inferior"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```

## Atualização manual

Use o procedimento abaixo para atualizar manualmente os módulos NGINX Wallarm 4.x para a versão 4.8.

### Requisitos para atualização manual

--8<-- "../include-pt-BR/waf/installation/basic-reqs-for-upgrades.md"

### Procedimento de atualização

* Se os módulos de nó de filtragem e postanálise estiverem instalados no mesmo servidor, siga as instruções abaixo para atualizar todos os pacotes.
* Se os módulos de nó de filtragem e postanálise estiverem instalados em servidores diferentes, **primeiro** atualize o módulo de postanálise seguindo estas [instruções](separate-postanalytics.md) e, em seguida, execute as etapas abaixo para os módulos do nó de filtragem.

### Etapa 1: Atualizar NGINX para a versão mais recente

Atualize o NGINX para a versão mais recente usando as instruções relevantes:

=== "NGINX estável"

    Distribuições baseadas em DEB:

    ```bash
    sudo apt update
    sudo apt -y install nginx
    ```

    Distribuições baseadas em RPM:

    ```bash
    sudo yum update
    sudo yum install -y nginx
    ```
=== "NGINX Plus"
    Para NGINX Plus, siga as [instruções oficiais de atualização](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/#upgrading-nginx-plus).
=== "NGINX de repositório Debian/CentOS"
    Para NGINX [instalado de repositório Debian/CentOS](../installation/nginx/dynamic-module-from-distr.md), pule esta etapa. A versão instalada do NGINX será atualizada [mais tarde](#step-4-upgrade-wallarm-packages) junto com os módulos Wallarm.

Se sua infraestrutura precisa usar uma versão específica do NGINX, entre em contato com o [suporte técnico da Wallarm](mailto:support@wallarm.com) para construir o módulo Wallarm para uma versão personalizada do NGINX.

### Etapa 2: Adicionar novo repositório Wallarm

Exclua o endereço do repositório Wallarm anterior e adicione um repositório com um novo pacote de versão do nó Wallarm. Use os comandos para a plataforma apropriada.

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

1. Abra o arquivo com o endereço do repositório Wallarm no editor de texto instalado. Nestas instruções, **vim** é usado.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. Comente ou exclua o endereço do repositório anterior.
3. Adicione um novo endereço de repositório:

    === "Debian 10.x (buster)"
        !!! warning "Não suportado pelo NGINX estável e NGINX Plus"
            As versões oficiais do NGINX (estável e Plus) e, como resultado, o nó Wallarm 4.4 e superior não podem ser instalados no Debian 10.x (buster). Use este sistema operacional apenas se o [NGINX estiver instalado a partir dos repositórios Debian/CentOS](../installation/nginx/dynamic-module-from-distr.md).

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

### Etapa 3: Atualizar pacotes Wallarm

#### Nó de filtragem e postanálise no mesmo servidor

1. Execute o seguinte comando para atualizar os módulos de nó de filtragem e postanálise:

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
2. Se o gerenciador de pacotes perguntar por confirmação para reescrever o conteúdo do arquivo de configuração `/etc/cron.d/wallarm-node-nginx`, envie a opção `Y`.

    O conteúdo do `/etc/cron.d/wallarm-node-nginx` deve ser atualizado para que o novo script de contagem de RPS seja baixado.

    Por padrão, o gerenciador de pacotes usa a opção `N`, mas a opção `Y` é necessária para a contagem correta de RPS.

#### Nó de filtragem e postanálise em servidores diferentes

!!! warning "Sequência de etapas para atualizar os módulos de nó de filtragem e postanálise"
    Se os módulos de nó de filtragem e postanálise estiverem instalados em servidores diferentes, é necessário atualizar os pacotes de postanálise antes de atualizar os pacotes do nó de filtragem.

1. Atualize os pacotes de postanálise seguindo estas [instruções](separate-postanalytics.md).
2. Atualize os pacotes do nó Wallarm:

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
3. Se o gerenciador de pacotes perguntar por confirmação para reescrever o conteúdo do arquivo de configuração `/etc/cron.d/wallarm-node-nginx`, envie a opção `Y`.

    O conteúdo do `/etc/cron.d/wallarm-node-nginx` deve ser atualizado para que o novo script de contagem de RPS seja baixado.

    Por padrão, o gerenciador de pacotes usa a opção `N`, mas a opção `Y` é necessária para a contagem correta de RPS.

### Etapa 4: Atualizar o tipo de nó

!!! info "Apenas para nós instalados usando o script `addnode`"
    Só siga este passo se um nó da versão anterior estiver conectado ao Wallarm Cloud usando o script `addnode`. Este script foi [removido](what-is-new.md#removal-of-the-email-password-based-node-registration) e substituído pelo `register-node`, que requer um token para registrar o nó no Cloud.

1. Certifique-se de que sua conta Wallarm tem a função **Administrador** navegando para a lista de usuários no [Cloud dos EUA](https://us1.my.wallarm.com/settings/users) ou [Cloud da UE](https://my.wallarm.com/settings/users).

    ![Lista de usuários no console Wallarm][img-wl-console-users]
1. Abra o console Wallarm → **Nós** no [Cloud dos EUA](https://us1.my.wallarm.com/nodes) ou [Cloud da UE](https://my.wallarm.com/nodes) e crie um nó do tipo **Nó Wallarm**.

    ![Criação de nó Wallarm][img-create-wallarm-node]

    !!! info "Se o módulo de postanálise estiver instalado em um servidor separado"
        Se os módulos de processamento de tráfego inicial e postanálise estiverem instalados em servidores separados, é recomendado conectar esses módulos ao Wallarm Cloud usando o mesmo token de nó. A IU do Console Wallarm exibirá cada módulo como uma instância de nó separada, por exemplo:

        ![Nó com várias instâncias](../images/user-guides/nodes/wallarm-node-with-two-instances.png)

        O nó Wallarm já foi criado durante a [atualização do módulo postanálise separada](separate-postanalytics.md). Para conectar o módulo de processamento de tráfego inicial ao Cloud usando as mesmas credenciais de nó:

        1. Copie o token de nó gerado durante a atualização do módulo postanálise separada.
        1. Prossiga para a 4ª etapa na lista abaixo.
1. Copie o token gerado.
1. Pausar o serviço NGINX para mitigar o risco de cálculo incorreto de RPS:

    === "Debian"
        ```bash
        sudo systemctl stop nginx
        ```
    === "Ubuntu"
        ```bash
        sudo service nginx stop
        ```
    === "CentOS ou Amazon Linux 2.0.2021x e inferior"
        ```bash
        sudo systemctl stop nginx
        ```
    === "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
        ```bash
        sudo systemctl stop nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo systemctl stop nginx
        ```
1. Execute o script `register-node` para executar o **Nó Wallarm**:

    === "Cloud dos EUA"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force
        ```
    === "Cloud da UE"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force
        ```
    
    * `<TOKEN>` é o valor copiado do token do nó ou do token da API com a função `Deploy`.
    * A opção `--force` força a reescrita das credenciais de acesso ao Wallarm Cloud especificadas no arquivo `/etc/wallarm/node.yaml`.

### Etapa 5: Atualize a página de bloqueio do Wallarm

Na nova versão do nó, a página de bloqueio de amostra do Wallarm foi [alterada](what-is-new.md#new-blocking-page). O logo e o e-mail de suporte na página agora estão vazios por padrão.

Se a página `&/usr/share/nginx/html/wallarm_blocked.html` estava configurada para ser retornada em resposta a solicitações bloqueadas, [copie e personalize](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) a nova versão de uma página de amostra.

### Etapa 6: Reiniciar NGINX

--8<-- "../include-pt-BR/waf/restart-nginx-4.4-and-above.md"

### Etapa 7: Testar a operação do nó Wallarm

--8<-- "../include-pt-BR/waf/installation/test-waf-operation-no-stats.md"

### Personalização de configurações

Os módulos Wallarm estão atualizados para a versão 4.8. As configurações do nó de filtragem anterior serão aplicadas à nova versão automaticamente. Para fazer configurações adicionais, use as [diretivas disponíveis](../admin-en/configure-parameters-en.md).

--8<-- "../include-pt-BR/waf/installation/common-customization-options-nginx-4.4.md"