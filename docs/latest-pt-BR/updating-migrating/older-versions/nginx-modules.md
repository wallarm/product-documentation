[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[img-wl-console-users]:             ../../images/check-users.png 
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../installation/custom/custom-nginx-version.md
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:          ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                    ../../user-guides/ip-lists/graylist.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[sqli-attack-docs]:                 ../../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../../attacks-vulns-list.md#crosssite-scripting-xss
[web-server-mirroring-examples]:    ../../installation/oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring

# Atualizando módulos NGINX Wallarm EOL

Estas instruções descrevem as etapas para atualizar os módulos NGINX Wallarm end‑of‑life (versão 3.6 e abaixo) para a versão 4.8. Os módulos NGINX Wallarm são os módulos instalados de acordo com uma das seguintes instruções:

* [Pacotes individuais para NGINX estável](../../installation/nginx/dynamic-module.md)
* [Pacotes individuais para NGINX Plus](../../installation/nginx-plus.md)
* [Pacotes individuais para NGINX fornecido pela distribuição](../../installation/nginx/dynamic-module-from-distr.md)

--8<-- "../include-pt-BR/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Informe ao suporte técnico da Wallarm sobre a atualização do nó EOL

Se estiver atualizando os módulos NGINX Wallarm end‑of‑life (versão 3.6 e abaixo) para a versão 4.8, informe [o suporte técnico da Wallarm](mailto:support@wallarm.com) sobre isso e peça assistência.

Além de qualquer outra ajuda, peça para ativar a nova lógica de listas de IP para sua conta Wallarm. Quando a nova lógica de listas de IP estiver ativada, abra o Console Wallarm e certifique-se de que a seção [**IP lists**](../../user-guides/ip-lists/overview.md) está disponível.

## Métodos de atualização

--8<-- "../include-pt-BR/waf/installation/upgrade-methods.md"

## Atualização com instalador all-in-one

Use o procedimento abaixo para atualizar os módulos NGINX Wallarm end‑of‑life (versão 3.6 e abaixo) para a versão 4.8 usando [o instalador all-in-one](../../installation/nginx/all-in-one.md).

### Requisitos para atualização usando o instalador all-in-one

--8<-- "../include-pt-BR/waf/installation/all-in-one-upgrade-requirements.md"

### Procedimento de atualização

* Se os módulos de nó de filtragem e postanalítica estiverem instalados no mesmo servidor, siga as instruções abaixo para atualizar todos.

    Você precisará executar um nó da versão mais nova usando o instalador all-in-one em uma máquina limpa, testar se ele funciona corretamente e parar o anterior e configurar o tráfego para fluir através da nova máquina em vez da anterior.

* Se os módulos de nó de filtragem e postanalítica estiverem instalados em servidores diferentes, **primeiro** atualize o módulo postanalytics e **depois** o módulo de filtragem seguindo estas [instruções](separate-postanalytics.md).

### Passo 1: Desative o módulo de Verificação de ameaças ativas (se estiver atualizando nó 2.16 ou abaixo)

Se estiver atualizando o nó Wallarm 2.16 ou abaixo, desative o módulo [Verificação de ameaças ativas](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) no Console Wallarm → **Vulnerabilidades** → **Configurar**.

A operação do módulo pode causar [falsos positivos](../../about-wallarm/protecting-against-attacks.md#false-positives) durante o processo de atualização. Desativar o módulo minimiza este risco.

### Passo 2: Prepare a máquina limpa

--8<-- "../include-pt-BR/waf/installation/all-in-one-clean-machine.md"

### Passo 3: Instale o NGINX e as dependências

--8<-- "../include-pt-BR/waf/installation/all-in-one-nginx.md"

### Passo 4: Prepare o token Wallarm

--8<-- "../include-pt-BR/waf/installation/all-in-one-token.md"

### Passo 5: Baixe o instalador all-in-one do Wallarm

--8<-- "../include-pt-BR/waf/installation/all-in-one-installer-download.md"

### Passo 6: Execute o instalador all-in-one do Wallarm

#### Nó de filtragem e postanalytics no mesmo servidor

--8<-- "../include-pt-BR/waf/installation/all-in-one-installer-run.md"

#### Nó de filtragem e postanalytics em servidores diferentes

!!! warning "Sequência de etapas para atualizar os módulos de nó de filtragem e postanalytics"
    Se os módulos de nó de filtragem e postanalítica estiverem instalados em servidores diferentes, será necessário atualizar os pacotes de postanalítica antes de atualizar os pacotes de nó de filtragem.

1. Atualize o módulo postanalytics seguindo estas [instruções](separate-postanalytics.md).
1. Atualize o nó de filtragem:

    === "Token da API"
        ```bash
        # Se estiver usando a versão x86_64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.x86_64-glibc.sh filtering

        # Se estiver usando a versão ARM64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.aarch64-glibc.sh filtering
        ```        

        A variável `WALLARM_LABELS` define o grupo ao qual o nó será adicionado (usado para agrupamento lógico de nós na interface de usuário do Console Wallarm).

    === "Token do nó"
        ```bash
        # Se estiver usando a versão x86_64:
        sudo sh wallarm-4.8.0.x86_64-glibc.sh filtering

        # Se estiver usando a versão ARM64:
        sudo sh wallarm-4.8.0.aarch64-glibc.sh filtering
        ```

### Passo 7: Migrar allowlists e denylists da versão anterior do nó Wallarm para 4.8 (somente se estiver atualizando nó 2.18 ou abaixo)

Se estiver atualizando nó 2.18 ou abaixo, [migre](../migrate-ip-lists-to-node-3.md) a configuração de allowlist e denylist da versão anterior do nó Wallarm para a versão mais recente.

### Passo 8: Transferir a configuração do NGINX e postanalytics do antigo nó para o novo

Transfira a configuração relacionada ao nó do NGINX e a configuração da postanalítica dos arquivos de configuração na máquina antiga para os arquivos na nova máquina. Você pode fazer isso copiando as diretivas necessárias.

**Arquivos de origem**

Em uma máquina antiga, dependendo do SO e da versão do NGINX, os arquivos de configuração do NGINX podem estar localizados em diretórios diferentes e ter nomes diferentes. Os mais comuns são os seguintes:

* `/etc/nginx/conf.d/default.conf` com configurações do NGINX
* `/etc/nginx/conf.d/wallarm.conf` com configurações globais do nó de filtragem

    O arquivo é usado para configurações aplicadas a todos os domínios. Para aplicar configurações diferentes a grupos de domínios diferentes, geralmente é usado o `default.conf` ou é criado um novo arquivo de configuração para cada grupo de domínio (por exemplo, `example.com.conf` e `test.com.conf`). Informações detalhadas sobre os arquivos de configuração do NGINX estão disponíveis na [documentação oficial do NGINX](https://nginx.org/en/docs/beginners_guide.html).

* `/etc/nginx/conf.d/wallarm-status.conf` com configurações de monitoramento do nó Wallarm. Uma descrição detalhada está disponível no [link][wallarm-status-instr]

Além disso, a configuração do módulo de postanalítica (configurações do banco de dados Tarantool) geralmente está localizada aqui:

* `/etc/default/wallarm-tarantool` ou
* `/etc/sysconfig/wallarm-tarantool`

**Arquivos de destino**

Como o instalador all-in-one funciona com diferentes combinações de SO e versões do NGINX, em sua nova máquina, os [arquivos de destino](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) podem ter nomes diferentes e estar localizados em diretórios diferentes.

Ao transferir a configuração, você precisa realizar as etapas listadas abaixo.

#### Renomeie as diretivas NGINX descontinuadas

Renomeie as seguintes diretivas NGINX se elas estiverem explicitamente especificadas nos arquivos de configuração:

* `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
* `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
* `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

Nós só mudamos os nomes das diretivas, sua lógica permanece a mesma. As diretivas com nomes anteriores serão descontinuadas em breve, então recomendamos que você as renomeie antes.
  
#### Atualize as variáveis de log do nó

Na nova versão do nó, as seguintes mudanças nas [variáveis de log do nó](../../admin-en/configure-logging.md#filter-node-variables) foram implementadas:

* A variável `wallarm_request_time` foi renomeada para `wallarm_request_cpu_time`.

   Só mudamos o nome da variável, a lógica dela permanece a mesma. O nome antigo ainda é suportado temporariamente, mas ainda assim é recomendado renomear a variável.
* A variável `wallarm_request_mono_time` foi adicionada - coloque-a na configuração do formato de log se precisar das informações de log sobre o tempo total sendo a soma de:

   * Tempo na fila
   * Tempo em segundos que a CPU gastou processando a solicitação

#### Ajuste as configurações do modo de filtragem do nó Wallarm para mudanças liberadas nas últimas versões

1. Verifique se o comportamento esperado das configurações listadas abaixo corresponde à [lógica modificada dos modos de filtragem `off` e `monitoring`](what-is-new.md#filtration-modes):
      * [Diretiva `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Regra de filtragem geral configurada no Console Wallarm](../../user-guides/settings/general.md)
      * [Regras de filtragem de baixo nível configuradas no Console Wallarm](../../user-guides/rules/wallarm-mode-rule.md)
2. Se o comportamento esperado não corresponder à lógica modificada do modo de filtragem, ajuste as configurações do modo de filtragem para mudanças lançadas usando as [instruções](../../admin-en/configure-wallarm-mode.md).

#### Transfira a configuração de detecção de ataque `overlimit_res` de diretivas para a regra

--8<-- "../include-pt-BR/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

#### Atualize o conteúdo do arquivo `wallarm-status.conf`

Atualize o conteúdo de `/etc/nginx/conf.d/wallarm-status.conf` da seguinte maneira:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # O acesso está disponível apenas para endereços de loopback do servidor de nó de filtragem  
  deny all;

  wallarm_mode off;
  disable_acl "on";   # A verificação das fontes de solicitação está desativada, os IPs da lista negra têm permissão para solicitar o serviço wallarm-status. https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location ~/wallarm-status$ {
    wallarm_status on;
  }
}
```

[Mais detalhes sobre a configuração do serviço de estatísticas](../../admin-en/configure-statistics-service.md)

### Passo 9: Reative o módulo de Verificação de ameaças ativas (somente se estiver atualizando o nó 2.16 ou abaixo)

Aprenda a [recomendação sobre a configuração do módulo Verificação de ameaças ativas](../../vulnerability-detection/threat-replay-testing/setup.md) e reative-o, se necessário.

Depois de um tempo, verifique se a operação do módulo não está causando falsos positivos. Se descobrir falsos positivos, entre em contato com o [suporte técnico da Wallarm](mailto:support@wallarm.com).

### Passo 10: Configure o tráfego para o nó Wallarm

Dependendo da abordagem de implantação em uso, realize as seguintes configurações:

=== "In-line"
    Atualize os destinos de seu balanceador de carga para enviar tráfego para a instância Wallarm. Para obter detalhes, consulte a documentação de seu balanceador de carga.

    Antes de redirecionar completamente o tráfego para o novo nó, é recomendado primeiro redirecioná-lo parcialmente e verificar que o novo nó se comporta conforme o esperado.

=== "Out-of-Band"
    Configure seu servidor web ou proxy (por exemplo, NGINX, Envoy) para espelhar o tráfego de entrada para o nó Wallarm. Para detalhes de configuração, recomendamos referir-se à documentação de seu servidor web ou proxy.

    Dentro do [link][web-server-mirroring-examples], você encontrará a configuração de exemplo para os servidores web e proxy mais populares (NGINX, Traefik, Envoy).

### Passo 11: Remova o nó antigo

1. Delete o nó antigo no Console Wallarm → **Nós** selecionando seu nó e clicando em **Excluir**.
1. Confirme a ação.
    
    Quando o nó é excluído do Cloud, ele para a filtragem de solicitações para suas aplicações. A exclusão do nó de filtragem não pode ser desfeita. O nó será excluído permanentemente da lista de nós.

1. Delete a máquina com o nó antigo ou apenas limpe-a dos componentes do nó Wallarm:

    === "Debian"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```

## Atualização manual

### Requisitos para atualização manual

--8<-- "../include-pt-BR/waf/installation/basic-reqs-for-upgrades.md"

### Procedimento de atualização

* Se os módulos de nó de filtragem e postanalítica estiverem instalados no mesmo servidor, siga as instruções abaixo para atualizar todos os pacotes.
* Se os módulos de nó de filtragem e postanalítica estiverem instalados em servidores diferentes, **primeiro** atualize o módulo postanalytics seguindo estas [instruções](separate-postanalytics.md) e depois execute as etapas abaixo para os módulos de nó de filtragem.

### Passo 1: Desative o módulo de Verificação de ameaças ativas (se estiver atualizando nó 2.16 ou abaixo)

Se estiver atualizando o nó Wallarm 2.16 ou abaixo, desative o módulo [Verificação de ameaças ativas](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) no Console Wallarm → **Vulnerabilidades** → **Configurar**.

A operação do módulo pode causar [falsos positivos](../../about-wallarm/protecting-against-attacks.md#false-positives) durante o processo de atualização. Desativar o módulo minimiza este risco.

### Passo 2: Atualize a porta da API

--8<-- "../include-pt-BR/waf/upgrade/api-port-443.md"

### Passo 3: Atualize o NGINX para a versão mais recente

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
    Para o NGINX Plus, siga as [instruções de atualização oficiais](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/#upgrading-nginx-plus).
=== "NGINX da repositório Debian/CentOS"
    Para NGINX [instalado do repositório Debian/CentOS](../../installation/nginx/dynamic-module-from-distr.md), pule esta etapa. A versão instalada do NGINX será atualizada [mais tarde](#step-7-upgrade-wallarm-packages) junto com os módulos Wallarm.

Se sua infraestrutura precisa usar uma versão específica do NGINX, entre em contato com o [suporte técnico da Wallarm](mailto:support@wallarm.com) para construir o módulo Wallarm para uma versão personalizada do NGINX.

### Passo 4: Adicione novo repositório Wallarm

Exclua o endereço do repositório Wallarm anterior e adicione um repositório com um novo pacote de versão de nó Wallarm. Por favor, use os comandos para a plataforma apropriada.

**CentOS and Amazon Linux 2.0.2021x and lower**

=== "CentOS 7 and Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "CentOS 8"
    !!! warning "O suporte para CentOS 8.x foi descontinuado"
        O suporte para CentOS 8.x [foi descontinuado](https://www.centos.org/centos-linux-eol/). Você pode instalar o nó Wallarm no sistema operacional AlmaLinux, Rocky Linux, Oracle Linux 8.x ou RHEL 8.x.

        * [Instruções de instalação para NGINX `estável`](../../installation/nginx/dynamic-module.md)
        * [Instruções de instalação para NGINX dos repositórios do CentOS/Debian](../../installation/nginx/dynamic-module-from-distr.md)
        * [Instruções de instalação para NGINX Plus](../../installation/nginx-plus.md)
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
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
            As versões oficiais do NGINX (estável e Plus) e, consequentemente, o nó Wallarm 4.4 e acima não podem ser instalados no Debian 10.x (buster). Use este SO apenas se [o NGINX for instalado dos repositórios Debian/CentOS](../../installation/nginx/dynamic-module-from-distr.md).

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

### Passo 5: Migrar allowlists e denylists da versão anterior do nó Wallarm para 4.8 (somente se estiver atualizando nó 2.18 ou abaixo)

Se estiver atualizando nó 2.18 ou abaixo, [migre](../migrate-ip-lists-to-node-3.md) a configuração de allowlist e denylist da versão anterior do nó Wallarm para a versão mais recente.

### Passo 6: Atualize os pacotes Wallarm

#### Nó de filtragem e postanalytics no mesmo servidor

Execute o comando a seguir para atualizar os módulos de nó de filtragem e postanalítica:

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
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum update
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum update
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum update
    ```

#### Nó de filtragem e postanalytics em servidores diferentes

!!! warning "Sequência de etapas para atualizar os módulos de nó de filtragem e postanalytics"
    Se os módulos de nó de filtragem e postanalítica estiverem instalados em servidores diferentes, será necessário atualizar os pacotes de postanalítica antes de atualizar os pacotes de nó de filtragem.

1. Atualize os pacotes do módulo postanalytics seguindo estas [instruções](separate-postanalytics.md).
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
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum update
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum update
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum update
        ```
3. Se o gerenciador de pacotes pedir confirmação para reescrever o conteúdo do arquivo de configuração `/etc/cron.d/wallarm-node-nginx`:

    1. Certifique-se de que a [migração das listas de IP](#step-6-migrate-allowlists-e-denylists-from-previous-wallarm-node-version-to-42) foi concluída.
    2. Confirme a reescrita do arquivo usando a opção `Y`.

       O gerenciador de pacotes pediria confirmação para reescrever se o arquivo `/etc/cron.d/wallarm-node-nginx` tivesse sido alterado nas versões anteriores do nó Wallarm. Como a lógica da lista de IPs foi alterada no nó Wallarm 3.x, o conteúdo do `/etc/cron.d/wallarm-node-nginx` foi atualizado de acordo. Para que a lista de IPs negados funcione corretamente, o nó Wallarm 3.x deve usar o arquivo de configuração atualizado.

       Por padrão, o gerenciador de pacotes usa a opção `N`, mas a opção `Y` é necessária para a correta operação da lista de IPs negados no nó Wallarm 3.x.

### Passo 7: Atualize o tipo do nó

O nó implantado tem o tipo **regular** descontinuado que é [substituído agora pelo novo tipo **Nó Wallarm**](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens).

É recomendável instalar o novo tipo de nó em vez do descontinuado durante a migração para a versão 4.8. O tipo de nó regular será removido em lançamentos futuros. Por favor, migre antes.

!!! info "Se o módulo pós-analítico está instalado em um servidor separado"
    Se os módulos de processamento de tráfego inicial e pós-analítico estiverem instalados em servidores separados, é recomendado conectar esses módulos ao Wallarm Cloud usando o mesmo token de nó. A interface de usuário do Console Wallarm exibirá cada módulo como uma instância de nó separada, por exemplo:

    ![Nó com várias instâncias](../../images/user-guides/nodes/wallarm-node-with-two-instances.png)

    O nó Wallarm já foi criado durante a [atualização do módulo pós-analítico separado](separate-postanalytics.md). Para conectar o módulo de processamento de tráfego inicial ao Cloud usando as mesmas credenciais do nó:

    1. Copie o token do nó gerado durante a atualização do módulo pós-analítico separado.
    2. Prossiga para o quarto passo na lista abaixo.

Para substituir o nó regular pelo nó Wallarm:

1. Abra o Wallarm Console → **Nós** no [Cloud US](https://us1.my.wallarm.com/nodes) ou [Cloud EU](https://my.wallarm.com/nodes) e crie o nó do tipo **Nó Wallarm**.

    ![Criação do nó Wallarm][img-create-wallarm-node]
1. Copie o token gerado.
1. Pausar o serviço NGINX no servidor com o nó da versão anterior:

    === "Debian"
        ```bash
        sudo systemctl stop nginx
        ```
    === "Ubuntu"
        ```bash
        sudo service nginx stop
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo systemctl stop nginx
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo systemctl stop nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo systemctl stop nginx
        ```

    A pausa do serviço NGINX mitiga o risco de cálculo incorreto do RPS.
1. Execute o script `register-node` para executar o **Nó Wallarm**:

    === "Nuvem EUA"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force
        ```
    === "Nuvem UE"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force
        ```
    
    * `<TOKEN>` é o valor copiado do token do nó ou do token de API com a função `Deploy`.
    * A opção `--force` força a reescrita das credenciais de acesso ao Wallarm Cloud especificadas no arquivo `/etc/wallarm/node.yaml`.

### Passo 8: Atualize a página de bloqueio Wallarm

Na nova versão do nó, a página de amostra de bloqueio da Wallarm foi [modificada](what-is-new.md#new-blocking-page). O logotipo e o e-mail de suporte na página agora estão vazios por padrão.

Se a página `&/usr/share/nginx/html/wallarm_blocked.html` foi configurada para ser retornada em resposta a solicitações bloqueadas, [copie e personalize](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) a nova versão de uma página de amostra.

### Passo 9: Renomeie as diretivas NGINX descontinuadas

Renomeie as seguintes diretivas NGINX se elas estiverem explicitamente especificadas nos arquivos de configuração:

* `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
* `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
* `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

Nós só mudamos os nomes das diretivas, sua lógica permanece a mesma. As diretivas com nomes anteriores serão descontinuadas em breve, então recomendamos que você as renomeie antes.

### Passo 10: Atualize as variáveis de log do nó

Na nova versão do nó, as seguintes mudanças nas [variáveis de log do nó](../../admin-en/configure-logging.md#filter-node-variables) foram implementadas:

* A variável `wallarm_request_time` foi renomeada para `wallarm_request_cpu_time`.

   Só mudamos o nome da variável, a lógica dela permanece a mesma. O nome antigo ainda é suportado temporariamente, mas ainda assim é recomendado renomear a variável.
* A variável `wallarm_request_mono_time` foi adicionada - coloque-a na configuração do formato de log se precisar das informações de log sobre o tempo total sendo a soma de:

   * Tempo na fila
   * Tempo em segundos que a CPU gastou processando a solicitação

### Passo 11: Ajuste as configurações do modo de filtragem do nó Wallarm para mudanças liberadas nas últimas versões

1. Verifique se o comportamento esperado das configurações listadas abaixo corresponde à [lógica modificada dos modos de filtragem `off` e `monitoring`](what-is-new.md#filtration-modes):
      * [Diretiva `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Regra de filtragem geral configurada no Console Wallarm](../../user-guides/settings/general.md)
      * [Regras de filtragem de baixo nível configuradas no Console Wallarm](../../user-guides/rules/wallarm-mode-rule.md)
2. Se o comportamento esperado não corresponder à lógica modificada do modo de filtragem, ajuste as configurações do modo de filtragem para mudanças lançadas usando as [instruções](../../admin-en/configure-wallarm-mode.md).

### Passo 12: Transfira a configuração de detecção de ataque `overlimit_res` de diretivas para a regra

--8<-- "../include-pt-BR/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

### Passo 13: Atualize o conteúdo do arquivo `wallarm-status.conf`

Atualize o conteúdo de `/etc/nginx/conf.d/wallarm-status.conf` da seguinte maneira:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # O acesso está disponível apenas para endereços de loopback do servidor de nó de filtragem  
  deny all;

  wallarm_mode off;
  disable_acl "on";   # A verificação das fontes de solicitação está desativada, os IPs da lista negra têm permissão para solicitar o serviço wallarm-status. https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location ~/wallarm-status$ {
    wallarm_status on;
  }
}
```

[Mais detalhes sobre a configuração do serviço de estatísticas](../../admin-en/configure-statistics-service.md)

### Passo 14: Reinicie o NGINX

--8<-- "../include-pt-BR/waf/installation/restart-nginx-systemctl.md"

### Passo 15: Teste a operação do nó Wallarm

Para testar a operação do novo nó:

1. Envie a solicitação com teste de ataques [SQLI][sqli-attack-docs] e [XSS][xss-attack-docs] para o endereço do recurso protegido:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. Abra a seção Console Wallarm → **Eventos** no [Nuvem US](https://us1.my.wallarm.com/search) ou [Nuvem EU](https://my.wallarm.com/search) e certifique-se de que os ataques estão exibidos na lista.
1. Assim que seus dados armazenados na Cloud (regras, listas de IP) forem sincronizados com o novo nó, realize alguns ataques de teste para se certificar de que suas regras funcionam conforme o esperado.

### Passo 16: Exclua o nó da versão anterior

Uma vez que a operação do novo nó está devidamente testada, abra a seção **Nós** do Console Wallarm e exclua o nó regular da versão anterior da lista.

Se o módulo postanalytics estiver instalado em um servidor separado, exclua também a instância de nó relacionada a este módulo.

## Personalização de configurações

Os módulos Wallarm são atualizados para a versão 4.8. As configurações do nó de filtragem anterior serão aplicadas automaticamente à nova versão. Para fazer configurações adicionais, use as [diretivas disponíveis](../../admin-en/configure-parameters-en.md).

--8<-- "../include-pt-BR/waf/installation/common-customization-options-nginx-4.4.md"