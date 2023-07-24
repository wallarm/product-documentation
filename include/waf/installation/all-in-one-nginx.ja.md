次の最新版のNGINXをインストールしてください：

* **NGINX `stable`** - インストール方法はNGINXの[ドキュメンテーション](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)をご覧ください。
* **NGINX Plus** - インストール方法はNGINXの[ドキュメンテーション](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/)をご覧ください。
* **Distribution-Provided NGINX** - インストールするには、以下のコマンドを使用してください：

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
  === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
      ```bash
      sudo yum -y update 
      sudo yum install -y nginx
      ```