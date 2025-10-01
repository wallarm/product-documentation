次のいずれかのNGINXの最新バージョンをインストールします:

* **NGINX `stable`** - インストール方法はNGINXの[ドキュメント](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)を参照してください。
* **NGINX Mainline**（サポートされている最新バージョンはv1.25.5です）- インストール方法はNGINXの[ドキュメント](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)を参照してください。
* **NGINX Plus**（サポートされている最新バージョンはNGINX Plus R32です）- インストール方法はNGINXの[ドキュメント](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/)を参照してください。
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
    === "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```