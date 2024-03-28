تثبيت أحدث نسخة من NGINX:

* **NGINX `مستقر`** - راجع كيفية تثبيته في [التوثيق](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) الخاص بـNGINX.
* **الإصدار الرئيسي لـNGINX** - راجع كيفية تثبيته في [التوثيق](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) الخاص بـNGINX.
* **NGINX Plus** - راجع كيفية تثبيته في [التوثيق](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/) الخاص بـNGINX.
* **NGINX المقدم من التوزيعة** - للتثبيت، استخدم الأوامر التالية:

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
    === "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```