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
[versioning-policy]:               ../../updating-migrating/versioning-policy.md#version-list
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[img-node-with-several-instances]:  ../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../custom/custom-nginx-version.md

# Debian/CentOSリポジトリからのNGINX用ダイナミックWallarmモジュールのインストール

これらの手順は、Debian/CentOSリポジトリからインストールされたオープンソース版のNGINXに対してWallarmフィルタリングノードをダイナミックモジュールとしてインストールする手順を説明しています。

## 要件

--8<-- "../include-ja/waf/installation/nginx-distr-requirements-4.0.md"

## インストールオプション

--8<-- "../include-ja/waf/installation/nginx-installation-options.md"

両方のオプションのインストールコマンドは、さらなる指示に記載されています。

## インストール

### 1. Debian/CentOSリポジトリの追加

=== "Debian 10.x (buster)"
    ```bash
    sudo apt -y install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node buster/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt -y install dirmngr
    curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
    sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm
    ```

### 2. WallarmパッケージとともにNGINXをインストール

#### リクエスト処理とpostanalyticsが同じサーバー上

次のパッケージをインストールするコマンドです。

* NGINX用の`nginx`
* NGINX-Wallarm モジュール用の `libnginx-mod-http-wallarm` または `nginx-mod-http-wallarm`
* postanalyticsモジュール、Tarantoolデータベース、追加のNGINX-Wallarmパッケージ用の `wallarm-node`

=== "Debian 10.x (buster)"
    ```bash
    sudo apt -y install --no-install-recommends nginx wallarm-node libnginx-mod-http-wallarm
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt -y install --no-install-recommends nginx wallarm-node libnginx-mod-http-wallarm
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y nginx wallarm-node nginx-mod-http-wallarm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum install -y nginx wallarm-node nginx-mod-http-wallarm
    ```

#### リクエスト処理とpostanalyticsを別々のサーバーで実行

postanalyticsとリクエスト処理を別々のサーバーで実行するには、次のパッケージが必要です。

* postanalyticsモジュールおよび Tarantool データベース用で別々のサーバーに `wallarm-node-tarantool`（インストール手順は [instructions](../../admin-en/installation-postanalytics-en.md) に記載されています）

* NGINX-Wallarm モジュール用の `wallarm-node-nginx` と `libnginx-mod-http-wallarm`/`nginx-mod-http-wallarm`

これらのコマンドは、NGINXとNGINX-Wallarmモジュール用のパッケージをインストールします。

=== "Debian 10.x (buster)"
    ```bash
    sudo apt -y install --no-install-recommends nginx wallarm-node-nginx libnginx-mod-http-wallarm
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt -y install --no-install-recommends nginx wallarm-node-nginx libnginx-mod-http-wallarm
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y nginx wallarm-node-nginx nginx-mod-http-wallarm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum install -y nginx wallarm-node-nginx nginx-mod-http-wallarm
    ```

### 3. Wallarmモジュールを接続する

システム設定用の設定ファイルをコピーします：

=== "Debian"
    ```bash
    sudo cp /usr/share/doc/libnginx-mod-http-wallarm/examples/*conf /etc/nginx/conf.d/
    ```
=== "CentOS"
    ```bash
    sudo cp /usr/share/doc/nginx-mod-http-wallarm/examples/*conf /etc/nginx/conf.d/
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo cp /usr/share/doc/nginx-mod-http-wallarm/examples/*conf /etc/nginx/conf.d/
    ```

### 4. フィルタリングノードをWallarm Cloudに接続する

--8<-- "../include-ja/waf/installation/connect-waf-and-cloud-4.4.md"

### 5. Wallarmノードの設定を更新する

NGINXとWallarmフィルタリングノードの主要な設定ファイルは、次のディレクトリにあります。

* NGINX設定の`/etc/nginx/conf.d/default.conf`
* グローバルフィルタリングノード設定の`/etc/nginx/conf.d/wallarm.conf`

    このファイルは、すべてのドメインに適用される設定用です。異なるドメイングループに異なる設定を適用するには、`default.conf`ファイルを使用するか、各ドメイングループ用に新しい設定ファイル（`example.com.conf`および`test.com.conf`など）を作成してください。NGINX設定ファイルに関するより詳細な情報は、[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)で入手できます。
* Wallarmノードの監視設定がある`/etc/nginx/conf.d/wallarm-status.conf`。詳細な説明は [link][wallarm-status-instr] で入手できます
* `/etc/default/wallarm-tarantool` または `/etc/sysconfig/wallarm-tarantool` にあるTarantoolデータベースの設定
#### リクエストフィルタリングモード

デフォルトでは、フィルタリングノードは`off`のステータスにあり、受信リクエストを分析しません。リクエストの分析を有効にするには、以下の手順に従ってください。

1. ファイル `/etc/nginx/conf.d/default.conf` を開きます。

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. `https`、`server`、または `location` ブロックに `wallarm_mode monitoring;` の行を追加します。

??? note "ファイル `/etc/nginx/conf.d/default.conf` の例"

    ```bash
    server {
        # リクエストがフィルタリングされるポート
        listen       80;
        # リクエストがフィルタリングされるドメイン
        server_name  localhost;
        # フィルタリングノードモード
        wallarm_mode monitoring;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
    ```

`monitoring`モードで動作する場合、フィルタリングノードはリクエストの攻撃サインを探しますが、検出された攻撃をブロックしません。フィルタリングノードの展開後、数日間は`monitoring`モードでフィルタリングノードを介したトラフィックを維持し、その後`block`モードを有効にすることをお勧めします。[フィルタリングノード動作モードの設定に関する推奨事項を学ぶ→](../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps)

#### メモリ

!!! info "別のサーバー上のPostanalyticsモジュール"
    もし別のサーバーにpostanalyticsモジュールをインストールした場合は、この手順をスキップして、すでに設定されているモジュールを使用してください。

Wallarmノードは、インメモリストレージであるTarantoolを使用します。Tarantoolの推奨メモリサイズは、サーバーの合計メモリの75%です。Tarantoolのメモリを割り当てるには：

1. 編集モードでTarantool構成ファイルを開きます。

    === "Debian"
        ```bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS"
        ```bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `SLAB_ALLOC_ARENA`ディレクティブにGB単位でメモリサイズを指定します。値は整数または浮動小数点数（小数点は`.`で区切ります）であれば独自の値に変更することができます。

    本番環境では、postanalyticsモジュールに割り当てる推奨のRAM容量は、サーバーの合計メモリの75%です。Wallarmノードをテストするか、インスタンスサイズが小さい場合は、最小限のメモリで十分です（例：合計メモリの25%）。

    例：
    
    === "ノードのテスト時"
        ```bash
        SLAB_ALLOC_ARENA=0.5
        ```
    === "本番環境へのノードのデプロイ時"
        ```bash
        SLAB_ALLOC_ARENA=24
        ```

    Tarantoolのメモリ割り当てに関する詳細な推奨事項は、これらの[指示書][memory-instr]で説明されています。 
3. 変更を適用するには、Tarantool を再起動します。

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### 別のpostanalyticsサーバーのアドレス

!!! info "同じサーバー上のNGINX-Wallarmとpostanalytics"
    NGINX-Wallarmとpostanalyticsモジュールが同じサーバーにインストールされている場合は、この手順をスキップしてください。

--8<-- "../include-ja/waf/configure-separate-postanalytics-address-nginx.md"

#### その他の設定

NGINX と Wallarm ノードの他の設定を更新するには、NGINX のドキュメントと[利用可能な Wallarm ノードディレクティブのリスト][waf-directives-instr]を使用してください。

### 6. NGINX を再起動

--8<-- "../include-ja/waf/root_perm_info.md"

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

### 7. Wallarmノードの動作をテスト

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## 設定のカスタマイズ

Debian/CentOS リポジトリからの NGINX 用のデフォルト設定で動的 Wallarm モジュールがインストールされています。Wallarm ノードの設定をカスタマイズするには、[利用可能なディレクティブ](../../admin-en/configure-parameters-en.md)を使用してください。

--8<-- "../include-ja/waf/installation/common-customization-options-nginx-4.4.md"