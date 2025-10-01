Aşağıdakilerin en son NGINX sürümünü kurun:

* **NGINX `stable`** - kurulum yönergeleri için NGINX [dokümantasyonu](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/).
* **NGINX Mainline** (en son desteklenen sürüm v1.25.5'tir) - kurulum yönergeleri için NGINX [dokümantasyonu](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/).
* **NGINX Plus** (en son desteklenen sürüm NGINX Plus R32'dir) - kurulum yönergeleri için NGINX [dokümantasyonu](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/).
* **Dağıtım tarafından sağlanan NGINX** - kurmak için aşağıdaki komutları kullanın:

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
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```