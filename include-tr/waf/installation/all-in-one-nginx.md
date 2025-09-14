Aşağıdaki NGINX sürümlerinin en güncelini yükleyin:

* **NGINX `stable`** (en son desteklenen sürüm v1.28.0'dır) - kurulum talimatları için NGINX [belgelerine](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) bakın.
* **NGINX Mainline** (en son desteklenen sürüm v1.27.5'tir) - kurulum talimatları için NGINX [belgelerine](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) bakın.
* **NGINX Plus** (en son desteklenen sürüm NGINX Plus R33'tür) - kurulum talimatları için NGINX [belgelerine](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/) bakın.
* **Dağıtımın sağladığı NGINX** - kurulumu için aşağıdaki komutları kullanın:

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