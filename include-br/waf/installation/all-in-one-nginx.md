Instale a última versão do NGINX de:

* **NGINX `estável`** - veja como instalá-lo na [documentação](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) do NGINX.
* **NGINX Plus** - veja como instalá-lo na [documentação](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/) do NGINX.
* **NGINX fornecido pela distribuição** - para instalar, use os seguintes comandos:

    === "Debian 10.x (buster)"
        ```bash
        sudo apt-get update 
        sudo apt -y install --no-install-recommends nginx
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        sudo apt update 
        sudo apt -y install --no-install-recommends nginx
        ```
    === "CentOS 7.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```
    === "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```