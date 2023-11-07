## 1. Adicione os repositórios Debian/CentOS

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
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
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

## 2. Instale o NGINX com os pacotes Wallarm

O comando instala os seguintes pacotes:

* `nginx` para o NGINX
* `libnginx-mod-http-wallarm` ou `nginx-mod-http-wallarm` para o módulo NGINX-Wallarm
* `wallarm-node` para o módulo [postanalytics][install-postanalytics-docs], o banco de dados Tarantool e pacotes adicionais do NGINX-Wallarm

=== "Debian 10.x (buster)"
    ```bash
    sudo apt -y install --no-install-recommends nginx wallarm-node libnginx-mod-http-wallarm
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt -y install --no-install-recommends nginx wallarm-node libnginx-mod-http-wallarm
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y nginx wallarm-node nginx-mod-http-wallarm
    ```
=== "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
    ```bash
    sudo yum install -y nginx wallarm-node nginx-mod-http-wallarm
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum install -y nginx wallarm-node nginx-mod-http-wallarm
    ```

## 3. Conecte o módulo Wallarm

Copie os arquivos de configuração para a configuração do sistema:

=== "Debian"
    ```bash
    sudo cp /usr/share/doc/libnginx-mod-http-wallarm/examples/*conf /etc/nginx/conf.d/
    ```
=== "CentOS"
    ```bash
    sudo cp /usr/share/doc/nginx-mod-http-wallarm/examples/*conf /etc/nginx/conf.d/
    ```
=== "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
    ```bash
    sudo cp /usr/share/doc/nginx-mod-http-wallarm/examples/*conf /etc/nginx/conf.d/
    ```
=== "RHEL 8.x"
    ```bash
    sudo cp /usr/share/doc/nginx-mod-http-wallarm/examples/*conf /etc/nginx/conf.d/
    ```

## 4. Conecte o nó de filtragem ao Wallarm Cloud

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6.md"