最新のNGINXバージョンをインストールします:

* **NGINX `stable`** - インストール方法はNGINX [ドキュメント](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)をご参照ください。
* **NGINX Mainline**（最新のサポートバージョンはv1.25.5です） - インストール方法はNGINX [ドキュメント](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)をご参照ください。
* **NGINX Plus**（最新のサポートバージョンはNGINX Plus R32です） - インストール方法はNGINX [ドキュメント](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/)をご参照ください。
* **ディストリビューション提供のNGINX** - インストールするには、次のコマンドを使用します:

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