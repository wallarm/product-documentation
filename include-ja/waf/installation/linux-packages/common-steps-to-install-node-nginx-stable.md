## 1. NGINX安定版と依存関係のインストール

NGINXリポジトリからNGINX `stable`をインストールする以下のオプションがあります：

* ビルド済みパッケージからのインストール

    === "Debian"
        ```bash
        sudo apt -y install curl gnupg2 ca-certificates lsb-release debian-archive-keyring
        echo "deb http://nginx.org/packages/debian `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
        curl -fSsL https://nginx.org/keys/nginx_signing.key | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/nginx.gpg --import
        sudo chmod 644 /etc/apt/trusted.gpg.d/nginx.gpg
        sudo apt update
        sudo apt -y install nginx
        ```
    === "Ubuntu"
        1. NGINX stableに必要な依存パッケージをインストールします：

            ```bash
            sudo apt -y install curl gnupg2 ca-certificates lsb-release
            ```
        1. NGINX stableをインストールします：

            ```bash
            echo "deb http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
            curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo apt-key add -
            sudo apt update
            sudo apt -y install nginx
            ```
    === "CentOSまたはAmazon Linux 2.0.2021x以下"

        1. CentOS 7.xにEPELリポジトリが追加されている場合、このリポジトリからNGINX stableのインストールを無効にするために、ファイル`/etc/yum.repos.d/epel.repo`に`exclude=nginx*`を追加してください。

            変更後のファイル`/etc/yum.repos.d/epel.repo`の例：

            ```bash
            [epel]
            name=Extra Packages for Enterprise Linux 7 - $basearch
            #baseurl=http://download.fedoraproject.org/pub/epel/7/$basearch
            metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-7&arch=$basearch
            failovermethod=priority
            enabled=1
            gpgcheck=1
            gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
            exclude=nginx*

            [epel-debuginfo]
            name=Extra Packages for Enterprise Linux 7 - $basearch - Debug
            #baseurl=http://download.fedoraproject.org/pub/epel/7/$basearch/debug
            metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-debug-7&arch=$basearch
            failovermethod=priority
            enabled=0
            gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
            gpgcheck=1

            [epel-source]
            name=Extra Packages for Enterprise Linux 7 - $basearch - Source
            #baseurl=http://download.fedoraproject.org/pub/epel/7/SRPMS
            metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-source-7&arch=$basearch
            failovermethod=priority
            enabled=0
            gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
            gpgcheck=1
            ```
        
        2. 公式リポジトリからNGINX stableをインストールします：

            ```bash
            echo -e '\n[nginx-stable] \nname=nginx stable repo \nbaseurl=http://nginx.org/packages/centos/$releasever/$basearch/ \ngpgcheck=1 \nenabled=1 \ngpgkey=https://nginx.org/keys/nginx_signing.key \nmodule_hotfixes=true' | sudo tee /etc/yum.repos.d/nginx.repo
            sudo yum install -y nginx
            ```

* [NGINXリポジトリ](https://hg.nginx.org/pkg-oss/branches)の`stable`ブランチからソースコードをコンパイルし、同じオプションでインストールします。

    !!! info "AlmaLinux、Rocky Linux、Oracle Linux 8.x用のNGINX"
        AlmaLinux、Rocky Linux、Oracle Linux 8.xにNGINXをインストールする唯一のオプションです。

NGINXのインストールに関する詳細な情報は、[公式のNGINXドキュメンテーション](https://nginx.com/resources/admin-guide/installing-nginx-open-source/)で利用可能です。

## 2. Wallarmリポジトリの追加

WallarmノードはWallarmリポジトリからインストールおよび更新されます。リポジトリを追加するためのコマンドはプラットフォームによります：

--8<-- "../include-ja/waf/installation/add-nginx-waf-repos-4.6.md"

## 3. Wallarmパッケージのインストール

次のパッケージが必要です：

* NGINX-Wallarmモジュール用の`nginx-module-wallarm`
* [postanalytics][install-postanalytics-docs]モジュール、Tarantoolデータベース、追加のNGINX-Wallarmパッケージ用の`wallarm-node` 

=== "Debian"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-module-wallarm
    ```
=== "Ubuntu"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-module-wallarm
    ```
=== "CentOSまたはAmazon Linux 2.0.2021x以下"
    ```bash
    sudo yum install -y wallarm-node nginx-module-wallarm
    ```
=== "AlmaLinux、Rocky Linux、Oracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node nginx-module-wallarm
    ```

## 4. Wallarmモジュールの接続

1. ファイル`/etc/nginx/nginx.conf`を開きます：

    ```bash
    sudo vim /etc/nginx/nginx.conf
    ```
2. ファイルに`include /etc/nginx/conf.d/*;`行が追加されていることを確認してください。ない場合は、追加します。
3. `worker_processes`指令の直後に以下の指令を追加します：

    ```bash
    load_module modules/ngx_http_wallarm_module.so;
    ```

    追加した指令の設定例：

    ```
    user  nginx;
    worker_processes  auto;
    load_module modules/ngx_http_wallarm_module.so;

    error_log  /var/log/nginx/error.log notice;
    pid        /var/run/nginx.pid;
    ```

4. システム設定のための設定ファイルをコピーします：

    ``` bash
    sudo cp /usr/share/doc/nginx-module-wallarm/examples/*.conf /etc/nginx/conf.d/
    ```

## 5. フィルタリングノードをWallarm Cloudに接続

--8<-- "../include-ja/waf/installation/connect-waf-and-cloud-4.6.md"
