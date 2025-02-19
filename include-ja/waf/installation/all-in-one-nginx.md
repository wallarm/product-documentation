最新のNGINXバージョンをインストールしてください:

* **NGINX `stable`** - インストール方法についてはNGINX[ドキュメント](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)を参照してください。
* **NGINX Mainline** (最新のサポートバージョンはv1.27.3です) - インストール方法についてはNGINX[ドキュメント](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)を参照してください。
* **NGINX Plus** (最新のサポートバージョンはNGINX Plus R33です) - インストール方法についてはNGINX[ドキュメント](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/)を参照してください。
* **Distribution-Provided NGINX** - インストールする場合は、次のコマンドを使用してください:

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