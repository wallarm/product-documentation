قم بتثبيت آخر إصدار من NGINX ل:

* **NGINX `المستقر`** - شاهد كيفية التثبيت في [وثائق](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) NGINX.
* **NGINX الرئيسي** - شاهد كيفية التثبيت في [وثائق](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) NGINX.
* **NGINX بلس** - شاهد كيفية التثبيت في [وثائق](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/) NGINX.
* **NGINX المُقدم من توزيعة** - للتثبيت، استخدم الأوامر التالية:

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
    === "AlmaLinux, Rocky Linux أو Oracle Linux 8.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```