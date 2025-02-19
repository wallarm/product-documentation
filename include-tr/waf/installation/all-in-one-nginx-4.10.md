En son NGINX sürümünü yükleyin:

* **NGINX `stable`** - NGINX [dokümantasyonunda](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) nasıl kurulacağını görün.
* **NGINX Mainline** (desteklenen en son sürüm v1.25.5'tir) - NGINX [dokümantasyonunda](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) nasıl kurulacağını görün.
* **NGINX Plus** (desteklenen en son sürüm NGINX Plus R32'dir) - NGINX [dokümantasyonunda](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/) nasıl kurulacağını görün.
* **Distribution-Provided NGINX** - yüklemek için, aşağıdaki komutları kullanın:

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