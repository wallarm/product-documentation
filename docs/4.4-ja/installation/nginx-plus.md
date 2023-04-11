[img-wl-console-users]: ../images/check-user-no-2fa.png
[wallarm-status-instr]: ../admin-en/configure-statistics-service.md
[memory-instr]: ../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]: ../admin-en/configure-parameters-en.md
[ptrav-attack-docs]: ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]: ../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]: ../admin-en/configure-wallarm-mode.md
[logging-instr]: ../admin-en/configure-logging.md
[proxy-balancer-instr]: ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]: ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]: ../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]: ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]: ../updating-migrating/nginx-modules.md
[install-postanalytics-docs]: ../../admin-en/installation-postanalytics-en/
[waf-mode-recommendations]: ../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]: ../user-guides/ip-lists/overview.md
[versioning-policy]: ../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]: ../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]: /installation/nginx-plus/
[img-node-with-several-instances]: ../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]: ../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]: ../faq/nginx-compatibility.md#is-wallarm-filtering-node-compatible-with-the-custom-build-of-nginx

# NGINX Plus用のダイナミックWallarmモジュールのインストール

これらの手順は、公式の商用バージョンのNGINX PlusのダイナミックモジュールとしてWallarmフィルタリングノードをインストールする手順を説明しています。

## 要件

--8<-- "../include-ja/waf/installation/nginx-plus-requirements-4.0.md"

## インストールオプション

--8<-- "../include-ja/waf/installation/nginx-installation-options.md"

両方のオプションのインストールコマンドは、以降の手順で説明されています。

## インストール

### 1. NGINX Plusと依存関係のインストール

[公式のNGINX手順](https://www.nginx.com/resources/admin-guide/installing-nginx-plus/)を使用して、NGINX Plusとその依存関係をインストールします。

!!! info "Amazon Linux 2.0.2021x以前のバージョンでのインストール"
    Amazon Linux 2.0.2021x以前のバージョンでNGINX Plusをインストールする場合は、CentOS 7の手順を使用してください。

### 2. Wallarmリポジトリの追加

Wallarmノードは、Wallarmリポジトリからインストールおよび更新されます。リポジトリを追加するには、プラットフォームごとのコマンドを使用してください。

=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt -y install dirmngr
    curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
    sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node jammy/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
    ```
=== "Amazon Linux 2.0.2021x以前"
    ```bash
    sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
    ```
=== "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm
    ```

### 3. Wallarmパッケージのインストール

#### リクエスト処理とpostanalyticsを同じサーバーで実行

リクエスト処理とpostanalyticsを同じサーバーで実行するには、次のパッケージが必要です。

* NGINX Plus-Wallarmモジュール用の `nginx-plus-module-wallarm`
* ポストアナリティクスモジュール、Tarantoolデータベース、および追加のNGINX Plus-Wallarmパッケージ用の `wallarm-node`

=== "Debian"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-plus-module-wallarm
    ```
=== "Ubuntu"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-plus-module-wallarm
    ```
=== "CentOSまたはAmazon Linux 2.0.2021x以前"
    ```bash
    sudo yum install -y wallarm-node nginx-plus-module-wallarm
    ```
=== "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node nginx-plus-module-wallarm
    ```

#### リクエスト処理とpostanalyticsを異なるサーバーで実行

リクエスト処理とpostanalyticsを異なるサーバーで実行するには、次のパッケージが必要です。

* NGINX Plus-Wallarmモジュール用の `wallarm-node-nginx` と `nginx-plus-module-wallarm`

    === "Debian"
        ```bash
        sudo apt -y install --no-install-recommends wallarm-node-nginx nginx-plus-module-wallarm
        ```
    === "Ubuntu"
        ```bash
        sudo apt -y install --no-install-recommends wallarm-node-nginx nginx-plus-module-wallarm
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x以前"
        ```bash
        sudo yum install -y wallarm-node-nginx nginx-plus-module-wallarm
        ```
    === "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
        ```bash
        sudo yum install -y wallarm-node-nginx nginx-plus-module-wallarm
        ```

* postanalyticsモジュールとTarantoolデータベース用の別のサーバー上での `wallarm-node-tarantool`（インストール手順は[指示書](../admin-en/installation-postanalytics-en.md)に記載されています）

### 4. Wallarmモジュールの接続

1. ファイル `/etc/nginx/nginx.conf` を開きます。

    ```bash
    sudo vim /etc/nginx/nginx.conf
    ```
2. `worker_processes` ディレクティブの直後に以下のディレクティブを追加します。

    ```bash
    load_module modules/ngx_http_wallarm_module.so;
    ```

    追加されたディレクティブを含む構成の例：

    ```
    user  nginx;
    worker_processes  auto;
    load_module modules/ngx_http_wallarm_module.so;

    error_log  /var/log/nginx/error.log notice;
    pid        /var/run/nginx.pid;
    ```

3. システム設定用の構成ファイルをコピーします：

    ``` bash
    sudo cp /usr/share/doc/nginx-plus-module-wallarm/examples/*.conf /etc/nginx/conf.d/
    ```

### 5. フィルタリングノードをWallarm Cloudに接続

--8<-- "../include-ja/waf/installation/connect-waf-and-cloud-4.4.md"

### 6. Wallarmノード構成の更新

--8<-- "../include-ja/waf/installation/nginx-waf-min-configuration-3.6.md"

### 7. NGINX Plusを再起動

--8<-- "../include-ja/waf/root_perm_info.md"

--8<-- "../include-ja/waf/restart-nginx-3.6.md"

### 8. Wallarmノードの動作をテスト

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"
## 設定のカスタマイズ

デフォルト設定の動的なWallarmモジュールがNGINX Plusにインストールされています。Wallarmノードの設定をカスタマイズするには、[利用可能なディレクティブ](../admin-en/configure-parameters-en.md)を使用してください。

--8<-- "../include-ja/waf/installation/common-customization-options-4.4.md"