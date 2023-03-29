[img-wl-console-users]:             ../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../admin-en/installation-postanalytics-en/
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../faq/nginx-compatibility.md#is-wallarm-filtering-node-compatible-with-the-custom-build-of-nginx

# NGINX リポジトリからの NGINX 安定版に対する動的 Wallarm モジュールのインストール

これらの手順では、NGINX リポジトリからインストールされた NGINX `stable` のオープンソースバージョンに対して、Wallarm のフィルタリングノードを動的モジュールとしてインストールする方法を説明しています。

## 要件

--8<-- "../include-ja/waf/installation/nginx-requirements-4.0.md"

## インストールオプション

--8<-- "../include-ja/waf/installation/nginx-installation-options.md"

両オプションのインストールコマンドは、以下の説明で説明されています。

## インストール

### 1. NGINX 安定版と依存関係のインストール

NGINX リポジトリからの NGINX `stable` のインストールには、以下のオプションがあります。

* ビルトパッケージからのインストール

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
        1. NGINX 安定版に必要な依存関係をインストールします。

            ```bash
            sudo apt -y install curl gnupg2 ca-certificates lsb-release
            ```
        1. NGINX 安定版をインストールします。

            ```bash
            echo "deb http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
            curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo apt-key add -
            sudo apt update
            sudo apt -y install nginx
            ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"

        1. CentOS 7.x に EPEL リポジトリが追加されている場合は、このリポジトリからの NGINX 安定版のインストールを無効にするために、ファイル `/etc/yum.repos.d/epel.repo` に `exclude=nginx*` を追加してください。

            変更されたファイル `/etc/yum.repos.d/epel.repo` の例：

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
        
        2. 公式リポジトリから NGINX 安定版をインストールします。

            ```bash
            echo -e '\n[nginx-stable] \nname=nginx stable repo \nbaseurl=http://nginx.org/packages/centos/$releasever/$basearch/ \ngpgcheck=1 \nenabled=1 \ngpgkey=https://nginx.org/keys/nginx_signing.key \nmodule_hotfixes=true' | sudo tee /etc/yum.repos.d/nginx.repo
            sudo yum install -y nginx
            ```

* ソースコードの `stable` ブランチからの [NGINX リポジトリ](https://hg.nginx.org/pkg-oss/branches) のコンパイルと同じオプションでのインストール。

    !!! info "AlmaLinux、Rocky Linux または Oracle Linux 8.x 用の NGINX"
        これは、AlmaLinux、Rocky Linux、または Oracle Linux 8.x に NGINX をインストールする唯一のオプションです。

インストールに関する詳細情報は、[公式 NGINX ドキュメント](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/)で利用できます。

!!! info "Amazon Linux 2.0.2021x およびそれ以前のバージョンでのインストール"
    Amazon Linux 2.0.2021x およびそれ以前のバージョンに NGINX Plus をインストールするには、CentOS 7 の手順を使用してください。

### 2. Wallarm リポジトリの追加

Wallarm ノードは、Wallarm リポジトリからインストールおよび更新されます。リポジトリを追加するには、プラットフォーム用のコマンドを使用してください。

--8<-- "../include-ja/waf/installation/add-nginx-waf-repos-4.4.md"

### 3. Wallarm パッケージのインストール

#### 同じサーバー上でのリクエスト処理と投稿解析

同じサーバーで投稿解析とリクエスト処理を実行するには、次のパッケージが必要です。

* NGINX-Wallarm モジュールの `nginx-module-wallarm`
* Tarantool データベース、追加の NGINX-Wallarm パッケージ用の投稿解析モジュール、`wallarm-node`

=== "Debian"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-module-wallarm
    ```
=== "Ubuntu"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-module-wallarm
    ```
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum install -y wallarm-node nginx-module-wallarm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node nginx-module-wallarm
    ```
リクエスト処理とポストアナリティクスを異なるサーバーで実行する場合、以下のパッケージが必要です:

* NGINX-Wallarm モジュール用の `wallarm-node-nginx` および `nginx-module-wallarm`

    === "Debian"
        ```bash
        sudo apt -y install --no-install-recommends wallarm-node-nginx nginx-module-wallarm
        ```
    === "Ubuntu"
        ```bash
        sudo apt -y install --no-install-recommends wallarm-node-nginx nginx-module-wallarm
        ```
    === "CentOS または Amazon Linux 2.0.2021x およびそれ以前"
        ```bash
        sudo yum install -y wallarm-node-nginx nginx-module-wallarm
        ```
    === "AlmaLinux, Rocky Linux または Oracle Linux 8.x"
        ```bash
        sudo yum install -y wallarm-node-nginx nginx-module-wallarm
        ```

* ポストアナリティクスモジュールと Tarantool データベース用に別のサーバーに `wallarm-node-tarantool` をインストール（インストール手順は[こちらの説明文書](../../admin-en/installation-postanalytics-en.md)に記載されています）。

### 4. Wallarm モジュールの接続

1. `/etc/nginx/nginx.conf` ファイルを開きます:

    ```bash
    sudo vim /etc/nginx/nginx.conf
    ```
2. `include /etc/nginx/conf.d/*;` 行がファイルに追加されていることを確認します。もし存在しなければ、追加してください。
3. 次のディレクティブを `worker_processes` ディレクティブの直後に追加します。

    ```bash
    load_module modules/ngx_http_wallarm_module.so;
    ```

   追加されたディレクティブを含む設定例:

    ```
    user  nginx;
    worker_processes  auto;
    load_module modules/ngx_http_wallarm_module.so;

    error_log  /var/log/nginx/error.log notice;
    pid        /var/run/nginx.pid;
    ```

4. システム設定用の設定ファイルをコピーします:

    ``` bash
    sudo cp /usr/share/doc/nginx-module-wallarm/examples/*.conf /etc/nginx/conf.d/
    ```

### 5. フィルタリングノードを Wallarm Cloud に接続

--8<-- "../include-ja/waf/installation/connect-waf-and-cloud-4.4.md"

### 6. Wallarm ノード設定を更新

--8<-- "../include-ja/waf/installation/nginx-waf-min-configuration-3.6.md"

### 7. NGINX の再起動

--8<-- "../include-ja/waf/root_perm_info.md"

--8<-- "../include-ja/waf/restart-nginx-3.6.md"

### 8. Wallarm ノード動作のテスト

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## 設定のカスタマイズ

デフォルト設定のダイナミック Wallarm モジュールが NGINX `stable` 用にインストールされています。Wallarm ノード設定のカスタマイズには、[利用可能なディレクティブ](../../admin-en/configure-parameters-en.md)を使用してください。

--8<-- "../include-ja/waf/installation/common-customization-options-nginx-4.4.md"