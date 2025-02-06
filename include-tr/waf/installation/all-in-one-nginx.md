Install the latest NGINX version of:

* **NGINX `stable`** - NGINX [belgelendirmesinde](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) nasıl kurulacağını görün.
* **NGINX Mainline** (en son desteklenen sürüm v1.27.3'tür) - NGINX [belgelendirmesinde](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) nasıl kurulacağını görün.
* **NGINX Plus** (en son desteklenen sürüm NGINX Plus R33'dur) - NGINX [belgelendirmesinde](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/) nasıl kurulacağını görün.
* **Distribution-Provided NGINX** - Kurulum yapmak için aşağıdaki komutları kullanın:

    === "Debian"
        ```bash
        sudo apt update 
        sudo apt -y install --no-install-recommends nginx
        ```
    === "Ubuntu"
        ```bash
        sudo apt-get update
        sudo apt-get install nginx
        ```
    === "CentOS"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```