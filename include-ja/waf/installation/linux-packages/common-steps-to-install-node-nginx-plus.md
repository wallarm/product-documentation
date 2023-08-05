## 1. NGINX Plusと依存関係のインストール

これらの[公式NGINXの指示](https://www.nginx.com/resources/admin-guide/installing-nginx-plus/)を使用して、NGINX Plusとその依存関係をインストールしてください。

!!! info "Amazon Linux 2.0.2021x以下でのインストール"
    Amazon Linux 2.0.2021x以下でNGINX Plusをインストールするには、CentOS 7の指示に従ってください。

## 2. Wallarmリポジトリを追加

WallarmノードはWallarmリポジトリからインストールおよびアップデートされます。リポジトリを追加するには、プラットフォームのコマンドを使用します：

=== "Debian 11.x（bullseye）"
    ```bash
    sudo apt -y install dirmngr
    curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
    sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 18.04 LTS（bionic）"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 20.04 LTS（focal）"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node jammy/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
    ```
=== "Amazon Linux 2.0.2021x以下"
    ```bash
    sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
    ```
=== "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm
    ```

## 3. Wallarmパッケージのインストール

以下のパッケージが必要です：

* NGINX Plus-Wallarmモジュール用の`nginx-plus-module-wallarm`
* [postanalytics][install-postanalytics-instr]モジュール、Tarantoolデータベース、追加的なNGINX Plus-Wallarmパッケージ用の`wallarm-node`

=== "Debian"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-plus-module-wallarm
    ```
=== "Ubuntu"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-plus-module-wallarm
    ```
=== "CentOSまたはAmazon Linux 2.0.2021x以下"
    ```bash
    sudo yum install -y wallarm-node nginx-plus-module-wallarm
    ```
=== "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node nginx-plus-module-wallarm
    ```

## 4. Wallarmモジュールの接続

1. ファイル`/etc/nginx/nginx.conf`を開きます：

    ```bash
    sudo vim /etc/nginx/nginx.conf
    ```
2. 下記のディレクティブを`worker_processes`ディレクティブの直後に追加します:

    ```bash
    load_module modules/ngx_http_wallarm_module.so;
    ```

    追加ディレクティブを含む設定例：

    ```
    user  nginx;
    worker_processes  auto;
    load_module modules/ngx_http_wallarm_module.so;

    error_log  /var/log/nginx/error.log notice;
    pid        /var/run/nginx.pid;
    ```

3. システムのセットアップのための設定ファイルをコピーします：

    ``` bash
    sudo cp /usr/share/doc/nginx-plus-module-wallarm/examples/*.conf /etc/nginx/conf.d/
    ```

## 5. フィルタリングノードをWallarm Cloudに接続

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6.md"
