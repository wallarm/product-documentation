[tarantool-status]:           ../images/tarantool-status.png
[configure-selinux-instr]:    configure-selinux.md
[configure-proxy-balancer-instr]:   configuration-guides/access-to-wallarm-api-via-proxy.md
[img-wl-console-users]:             ../images/check-user-no-2fa.png
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# Instalação do Módulo Postanalytics Separado

No processamento de solicitações da Wallarm, são envolvidas duas etapas, incluindo a etapa de pós-análise para análise estatística da solicitação. A pós-análise consome muita memória, o que pode exigir que seja realizada em um servidor dedicado para um desempenho otimizado. Este artigo explica como instalar o módulo de pós-análise em um servidor separado.

A opção de instalar o módulo de pós-análise em um servidor separado está disponível para os seguintes artefatos Wallarm:

* [Pacotes individuais para NGINX estável](../installation/nginx/dynamic-module.md)
* [Pacotes individuais para NGINX Plus](../installation/nginx-plus.md)
* [Pacotes individuais para a distribuição fornecida NGINX](../installation/nginx/dynamic-module-from-distr.md)
* [Instalador all-in-one](../installation/nginx/all-in-one.md)

Por padrão, as instruções de implantação da Wallarm orientam você a instalar ambos os módulos no mesmo servidor.

## Visão geral

O processamento de solicitações no nó Wallarm consiste em duas etapas:

* Processamento primário no módulo NGINX-Wallarm, que não consome muita memória e pode ser executado em servidores de frontend sem alterar os requisitos do servidor.
* Análise estatística das solicitações processadas no módulo de pós-análise que consome muita memória.

Os esquemas abaixo representam a interação do módulo em dois cenários: quando instalado no mesmo servidor e em servidores diferentes.

=== "NGINX-Wallarm e pós-análise em um servidor"
    ![Fluxo de tráfego entre pós-análise e nginx-wallarm](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-the-same-server.png)
=== "NGINX-Wallarm e pós-análise em servidores diferentes"
    ![Fluxo de tráfego entre pós-análise e nginx-wallarm](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-different-servers.png)

## Métodos de instalação

Você pode instalar o módulo de pós-análise em um servidor separado de duas maneiras diferentes:

* [Usando o instalador all-in-one](#instalacao-automatica-all-in-one) (disponível a partir do nó Wallarm 4.6) - automatiza muitas atividades e facilita muito a implantação do módulo de pós-análise. Portanto, este é um método de instalação recomendado.
* [Manualmente](#instalacao-manual) - use para versões de nó mais antigas.

Ao instalar o módulo de filtragem e pós-análise separadamente, você pode combinar as abordagens manual e automática: instale a parte de pós-análise manualmente e depois a parte de filtragem com o instalador all-in-one, e vice-versa: a parte de pós-análise com o instalador all-in-one e então a parte de filtragem manualmente.

## Instalação automática all-in-one

A partir do nó Wallarm 4.6, para instalar a pós-análise separadamente, recomenda-se usar a [instalação all-in-one](../installation/nginx/all-in-one.md#launch-options), que automatiza muitas atividades e facilita muito a implantação do módulo de pós-análise.

### Requisitos

--8<-- "../include-pt-BR/waf/installation/all-in-one/separate-postanalytics-reqs.md"

### Passo 1: Baixe o instalador Wallarm all-in-one

Para baixar o script de instalação all-in-one da Wallarm, execute o comando:

=== "Versão x86_64"
    ```bash
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.0.x86_64-glibc.sh
    ```
=== "Versão ARM64"
    ```bash
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.0.aarch64-glibc.sh
    ```

### Passo 2: Prepare o token Wallarm

Para instalar o nó, você precisará de um token Wallarm do [tipo apropriado][wallarm-token-types]. Para preparar um token:

=== "Token API"

    1. Abra o Console Wallarm → **Configurações** → **Tokens API** em [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) ou [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    2. Encontre ou crie um token API com a função de origem `Deploy`.
    3. Copie este token.

=== "Token de nó"

    1. Abra o Console Wallarm → **Nós** em [US Cloud](https://us1.my.wallarm.com/nodes) ou [EU Cloud](https://my.wallarm.com/nodes).
    2. Faça uma das seguintes ações: 
        * Crie o nó do tipo **Nó Wallarm** e copie o token gerado.
        * Use o grupo de nós existente - copie o token usando o menu do nó → **Copiar token**.

### Passo 3: Execute o instalador Wallarm all-in-one para instalar a pós-análise

Para instalar a pós-análise separadamente com o instalador all-in-one, use:

=== "Token API"
    ```bash
    # Se estiver usando a versão x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.x86_64-glibc.sh postanalytics

    # Se estiver usando a versão ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.aarch64-glibc.sh postanalytics
    ```        

    A variável `WALLARM_LABELS` define o grupo em que o nó será adicionado (usado para agrupamento lógico de nós na UI do Console Wallarm).

=== "Token de nó"
    ```bash
    # Se estiver usando a versão x86_64:
    sudo sh wallarm-4.8.0.x86_64-glibc.sh postanalytics

    # Se estiver usando a versão ARM64:
    sudo sh wallarm-4.8.0.aarch64-glibc.sh postanalytics
    ```

### Passo 4: Instale o módulo NGINX-Wallarm em um servidor separado

Uma vez que o módulo de pós-análise esteja instalado no servidor separado:

1. Instale o módulo NGINX-Wallarm em um servidor diferente:

    === "Token API"
        ```bash
        # Se estiver usando a versão x86_64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.x86_64-glibc.sh filtering

        # Se estiver usando a versão ARM64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.aarch64-glibc.sh filtering
        ```        

        A variável `WALLARM_LABELS` define o grupo em que o nó será adicionado (usado para agrupamento lógico de nós na UI do Console Wallarm).

    === "Token de nó"
        ```bash
        # Se estiver usando a versão x86_64:
        sudo sh wallarm-4.8.0.x86_64-glibc.sh filtering

        # Se estiver usando a versão ARM64:
        sudo sh wallarm-4.8.0.aarch64-glibc.sh filtering
        ```

2. Realize as etapas pós-instalação, como habilitar a análise do tráfego, reiniciar o NGINX, configurar o envio de tráfego para a instância Wallarm, testar e ajustar, conforme descrito [aqui](../installation/nginx/all-in-one.md).

### Passo 5: Conecte o módulo NGINX-Wallarm ao módulo de pós-análise

Na máquina com o módulo NGINX-Wallarm, no arquivo de [configuração](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) do NGINX, especifique o endereço do servidor do módulo de pós-análise:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitido

wallarm_tarantool_upstream wallarm_tarantool;
```

* O valor `max_conns` deve ser especificado para cada um dos servidores upstream Tarantool para impedir a criação de conexões excessivas.
* O valor `keepalive` não deve ser menor do que o número de servidores Tarantool.
* A string `# wallarm_tarantool_upstream wallarm_tarantool;` está comentada por padrão - por favor, exclua `#`.

Após a alteração do arquivo de configuração, reinicie NGINX/NGINX Plus no servidor do módulo NGINX-Wallarm:

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "Ubuntu"
    ```bash
    sudo service nginx restart
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

### Passo 6: Verifique a interação dos módulos NGINX‑Wallarm e pós-análise separados

Para verificar a interação dos módulos NGINX‑Wallarm e pós-análise separados, você pode enviar a solicitação com um ataque de teste para o endereço do aplicativo protegido:

```bash
curl http://localhost/etc/passwd
```

Se os módulos NGINX‑Wallarm e pós-análise separados estiverem configurados corretamente, o ataque será enviado para a nuvem Wallarm e exibido na seção **Eventos** do Console Wallarm:

![Ataques na interface](../images/admin-guides/test-attacks-quickstart.png)

Se o ataque não foi enviado para a Nuvem, por favor, verifique se não há erros na operação dos serviços:

* Certifique-se de que o serviço de pós-análise `wallarm-tarantool` está com status `active`.

    ```bash
    sudo systemctl status wallarm-tarantool
    ```

    ![status wallarm-tarantool][tarantool-status]
* Analise os registros do módulo de pós-análise

    ```bash
    sudo cat /var/log/wallarm/tarantool.log
    ```

    Se houver um registro como `SystemError binary: failed to bind: Cannot assign requested address`, certifique-se de que o servidor aceita a conexão no endereço e porta especificados.
* No servidor com o módulo NGINX‑Wallarm, analise os registros do NGINX:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    Se houver um registro como `[error] wallarm: <address> connect() failed`, certifique-se de que o endereço do módulo de pós-análise separado está especificado corretamente nos arquivos de configuração do módulo NGINX‑Wallarm e de que o servidor de pós-análise separado aceita a conexão no endereço e porta especificados.
* No servidor com o módulo NGINX‑Wallarm, obtenha as estatísticas sobre as solicitações processadas usando o comando abaixo e certifique-se de que o valor de `tnt_errors` é 0.

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [Descrição de todos os parâmetros retornados pelo serviço de estatísticas →](configure-statistics-service.md)

## Instalação manual

### Requisitos

--8<-- "../include-pt-BR/waf/installation/linux-packages/separate-postanalytics-reqs.md"

### Passo 1: Adicione repositórios Wallarm

O módulo de pós-análise, como os outros módulos Wallarm, é instalado e atualizado a partir dos repositórios Wallarm. Para adicionar repositórios, use os comandos para sua plataforma:

=== "Debian 10.x (buster)"
    ```bash
    sudo apt -y install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node buster/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt -y install dirmngr
    curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
    sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node jammy/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "Amazon Linux 2.0.2021x e inferior"
    ```bash
    sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```
=== "RHEL 8.x"
    ```bash
    sudo dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```

### Passo 2: Instale pacotes para o módulo de pós-análise

Instale o pacote `wallarm-node-tarantool` do repositório Wallarm para o módulo de pós-análise e o banco de dados Tarantool:

=== "Debian"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node-tarantool
    ```
=== "CentOS ou Amazon Linux 2.0.2021x e inferior"
    ```bash
    sudo yum install -y wallarm-node-tarantool
    ```
=== "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum install -y wallarm-node-tarantool
    ```

### Passo 3: Conecte o módulo de pós-análise à Cloud Wallarm

O módulo de pós-análise interage com a Cloud Wallarm. É necessário criar o nó Wallarm para o módulo de pós-análise e conectar esse nó à Cloud. Ao conectar, você pode definir o nome do nó de pós-análise, sob o qual ele será exibido na UI do Console Wallarm e colocar o nó no **grupo de nós** apropriado (usado para organizar logicamente os nós na UI). É **recomendado** usar o mesmo grupo de nós para o nó que processa o tráfego inicial e o nó que realiza a pós-análise.

![Nós agrupados](../images/user-guides/nodes/grouped-nodes.png)

Para fornecer acesso ao nó, você precisa gerar um token no lado da Cloud e especificá-lo na máquina com os pacotes do nó.

Para conectar o nó de filtragem de pós-análise à Cloud:

--8<-- "../include-pt-BR/waf/installation/get-api-or-node-token.md"

1. Execute o script `register-node` em uma máquina onde você instala o nó de filtragem:

    === "Token API"

        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com --no-sync --no-sync-acl
        ```
        
        * `<TOKEN>` é o valor copiado do token API com o papel `Deploy`.
        * O parâmetro `--labels 'group=<GROUP>'` coloca seu nó no grupo de nós `<GROUP>` (existente, ou, se não existir, será criado).

    === "Token de nó"

        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --no-sync --no-sync-acl
        ```

        * `<TOKEN>` é o valor copiado do token do nó.

    * Use `-H us1.api.wallarm.com` para instalar na Cloud US, remova esta opção para instalar na Cloud EU.
    * Você pode adicionar o parâmetro `-n <HOST_NAME>` para definir um nome personalizado para sua instância do nó. O nome final da instância será: `HOST_NAME_NodeUUID`.

### Passo 4: Atualize a configuração do módulo de pós-análise

Os arquivos de configuração do módulo de pós-análise estão localizados nos caminhos:

* `/etc/default/wallarm-tarantool` para sistemas operacionais Debian e Ubuntu
* `/etc/sysconfig/wallarm-tarantool` para sistemas operacionais CentOS e Amazon Linux 2.0.2021x e inferiores

Para abrir o arquivo no modo de edição, use o comando:

=== "Debian"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "CentOS ou Amazon Linux 2.0.2021x e inferiores"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "RHEL 8.x"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```

#### Memória

O módulo de pós-análise usa o armazenamento em memória Tarantool. Para ambientes de produção, é recomendável ter uma quantidade maior de memória. Se estiver testando o nó Wallarm ou se tiver um tamanho de servidor pequeno, a quantidade menor pode ser suficiente.

O tamanho da memória alocada é definido em GB pela diretiva `SLAB_ALLOC_ARENA` no arquivo de configuração [`/etc/default/wallarm-tarantool` ou `/etc/sysconfig/wallarm-tarantool`](#4-atualize-a-configuracao-do-modulo-de-pos-analise). O valor pode ser um número inteiro ou um float (um ponto `.` é um separador decimal).

Recomendações detalhadas sobre a alocação de memória para Tarantool são descritas nestas [instruções](configuration-guides/allocate-resources-for-node.md).

#### Endereço do servidor de pós-análise separado

Para definir o endereço do servidor de pós-análise separado:

1. Abra o arquivo Tarantool no modo de edição:

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS ou Amazon Linux 2.0.2021x e inferiores"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "RHEL 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. Descomente as variáveis `HOST` e `PORT` e defina os seguintes valores:

    ```bash
    # endereço e porta para a ligação
    HOST='0.0.0.0'
    PORT=3313
    ```
3. Se o arquivo de configuração do Tarantool estiver configurado para aceitar conexões em endereços IP diferentes de `0.0.0.0` ou `127.0.0.1`, forneça os endereços em `/etc/wallarm/node.yaml`:

    ```bash
    hostname: <nome do nó de pós-análise>
    uuid: <UUID do nó de pós-análise>
    secret: <chave secreta do nó de pós-análise>
    tarantool:
        host: '<Endereço IP do Tarantool>'
        port: 3313
    ```

### Passo 5: Reinicie os serviços Wallarm

Para aplicar as configurações ao módulo de pós-análise:

=== "Debian"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "CentOS ou Amazon Linux 2.0.2021x e inferiores"
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

### Passo 6: Instale o módulo NGINX-Wallarm em um servidor separado

Uma vez que o módulo de pós-análise esteja instalado no servidor separado, instale os outros módulos Wallarm em um servidor diferente. Abaixo estão os links para as instruções correspondentes e os nomes dos pacotes a serem especificados para a instalação do módulo NGINX-Wallarm:

* [NGINX estável](../installation/nginx/dynamic-module.md)

    Na etapa de instalação do pacote, especifique `wallarm-node-nginx` e `nginx-module-wallarm`.
* [NGINX Plus](../installation/nginx-plus.md)

    Na etapa de instalação do pacote, especifique `wallarm-node-nginx` e `nginx-plus-module-wallarm`.
* [NGINX fornecido pela distribuição](../installation/nginx/dynamic-module-from-distr.md)

    Na etapa de instalação do pacote, especifique `wallarm-node-nginx` e `libnginx-mod-http-wallarm/nginx-mod-http-wallarm`.

--8<-- "../include-pt-BR/waf/installation/checking-compatibility-of-separate-postanalytics-and-primary-packages.md"

### Passo 7: Conecte o módulo NGINX-Wallarm ao módulo de pós-análise

Na máquina com o módulo NGINX-Wallarm, no arquivo de [configuração](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) do NGINX, especifique o endereço do servidor do módulo de pós-análise:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitido

wallarm_tarantool_upstream wallarm_tarantool;
```

* O valor `max_conns` deve ser especificado para cada um dos servidores upstream Tarantool para impedir a criação de conexões excessivas.
* O valor `keepalive` não deve ser menor do que o número de servidores Tarantool.
* A string `# wallarm_tarantool_upstream wallarm_tarantool;` está comentada por padrão - por favor, exclua `#`.

Após a alteração do arquivo de configuração, reinicie NGINX/NGINX Plus no servidor do módulo NGINX-Wallarm:

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "Ubuntu"
    ```bash
    sudo service nginx restart
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

### Passo 8: Verifique a interação dos módulos NGINX‑Wallarm e pós-análise separados

Para verificar a interação dos módulos NGINX‑Wallarm e pós-análise separados, você pode enviar a solicitação com um ataque de teste para o endereço do aplicativo protegido:

```bash
curl http://localhost/etc/passwd
```

Se os módulos NGINX‑Wallarm e pós-análise separados estiverem configurados corretamente, o ataque será enviado para a nuvem Wallarm e exibido na seção **Eventos** do Console Wallarm:

![Ataques na interface](../images/admin-guides/test-attacks-quickstart.png)

Se o ataque não foi enviado para a Nuvem, por favor, verifique se não há erros na operação dos serviços:

* Certifique-se de que o serviço de pós-análise `wallarm-tarantool` está com status `active`.

    ```bash
    sudo systemctl status wallarm-tarantool
    ```

    ![status wallarm-tarantool][tarantool-status]
* Analise os registros do módulo de pós-análise

    ```bash
    sudo cat /var/log/wallarm/tarantool.log
    ```

    Se houver um registro como `SystemError binary: failed to bind: Cannot assign requested address`, certifique-se de que o servidor aceita a conexão no endereço e porta especificados.
* No servidor com o módulo NGINX‑Wallarm, analise os registros do NGINX:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    Se houver um registro como `[error] wallarm: <address> connect() failed`, certifique-se de que o endereço do módulo de pós-análise separado está especificado corretamente nos arquivos de configuração do módulo NGINX‑Wallarm e de que o servidor de pós-análise separado aceita a conexão no endereço e porta especificados.
* No servidor com o módulo NGINX‑Wallarm, obtenha as estatísticas sobre as solicitações processadas usando o comando abaixo e certifique-se de que o valor de `tnt_errors` é 0.

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [Descrição de todos os parâmetros retornados pelo serviço de estatísticas →](configure-statistics-service.md)
    
## Proteção do módulo de pós-análise

!!! warning "Proteja o módulo de pós-análise instalado"
    Recomendamos **fortemente** proteger um módulo de pós-análise Wallarm recém-instalado com um firewall. Caso contrário, existe o risco de obter acesso não autorizado ao serviço que pode resultar em:
    
    * Divulgação de informações sobre solicitações processadas
    * Possibilidade de executar código Lua arbitrário e comandos do sistema operacional
   
    Observe que esse risco não existe se você estiver implantando o módulo de pós-análise junto com o módulo NGINX-Wallarm no mesmo servidor. Isso acontece porque o módulo de pós-análise vai escutar a porta `3313`.
    
    **Aqui estão as configurações do firewall que devem ser aplicadas ao módulo de pós-análise instalado separadamente:**
    
    * Permita o tráfego HTTPS de e para os servidores API Wallarm, para que o módulo de pós-análise possa interagir com esses servidores:
        * `us1.api.wallarm.com` é o servidor API na Nuvem Wallarm US
        * `api.wallarm.com` é o servidor API na Nuvem Wallarm EU
    * Restrinja o acesso à porta `3313` Tarantool via protocolos TCP e UDP, permitindo conexões apenas dos endereços IP dos nós de filtragem Wallarm.

## Solução de problemas do Tarantool

[Solução de problemas do Tarantool](../faq/tarantool.md)