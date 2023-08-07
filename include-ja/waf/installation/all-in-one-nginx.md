以下の最新のNGINXバージョンをインストールします:

* **NGINX `stable`** - そのインストール方法はNGINXの[ドキュメンテーション](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)をご覧ください。
* **NGINX Plus** - そのインストール方法はNGINXの[ドキュメンテーション](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/)をご覧ください。
* **Distribution-Provided NGINX** - インストールするには、次のコマンドを使用します:

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
    === "AlmaLinux、Rocky LinuxもしくはOracle Linux 8.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```