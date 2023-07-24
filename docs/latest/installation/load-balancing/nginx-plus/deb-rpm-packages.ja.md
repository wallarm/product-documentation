[img-wl-console-users]: ../../../images/check-user-no-2fa.png
[wallarm-status-instr]: ../../../admin-en/configure-statistics-service.md
[memory-instr]: ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]: ../../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]: ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]: ../../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]: ../../../admin-en/configure-wallarm-mode.md
[logging-instr]: ../../../admin-en/configure-logging.md
[proxy-balancer-instr]: ../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]: ../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]: ../../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]: ../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]: ../../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]: ../../../admin-en/installation-postanalytics-en/
[waf-mode-recommendations]: ../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]: ../../../user-guides/ip-lists/overview.md
[versioning-policy]: ../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]: ../../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]: /installation/nginx-plus/
[img-node-with-several-instances]: ../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]: ../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]: ../../custom/custom-nginx-version.md
[node-token]: ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]: ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]: ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]: ../../../installation/supported-deployment-options.md
[oob-docs]: ../../oob/overview.md
[oob-advantages-limitations]: ../../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]: ../../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring

# NGINX Plus 用 Wallarm 動的モジュールのインストール

この手順は、公式の商用版のNGINX Plusに対してWallarmフィルタリングノードを動的モジュールとしてインストールするための手順です。

## 要件

* [US Cloud](https://us1.my.wallarm.com/) または [EU Cloud](https://my.wallarm.com/) の Wallarmコンソールで **管理者** ロールを持つアカウントへのアクセス
* SELinux が無効化されているか、または[指示][configure-selinux-instr]に基づいて設定されている
* NGINX Plus リリース 28 (R28)

    !!! info "カスタムNGINX Plusバージョン"
        異なるバージョンをお持ちの場合は、[NGINXのカスタムビルドにWallarmモジュールを接続する方法][nginx-custom]に関する手順を参照してください
* スーパーユーザ（例: `root`）として全てのコマンドを実行すること
* パッケージをダウンロードするための`https://repo.wallarm.com`へのアクセス。ファイアウォールによってアクセスが遮断されていないことを確認してください
* US Wallarm Cloudと連携するための`https://us1.api.wallarm.com`へのアクセス、またはEU Wallarm Cloudと連携するための`https://api.wallarm.com`へのアクセス。アクセスがプロキシサーバー経由でのみ設定できる場合は、[指示][configure-proxy-balancer-instr] を使用してください
* [許可リスト、拒否リスト、またはグレーリスト][ip-lists-docs]に登録された国、地域、またはデータセンターで登録されているIPアドレスの最新リストをダウンロードするための [GCPストレージアドレス](https://www.gstatic.com/ipranges/goog.json)へのアクセス
* テキストエディター **vim**、**nano**、またはその他のエディターがインストールされています。この手順では、**vim**が使用されています

## 1. NGINX Plusおよび依存パッケージのインストール

[公式のNGINXの手順](https://www.nginx.com/resources/admin-guide/installing-nginx-plus/)を使用して、NGINX Plusとその依存パッケージをインストールします。

## 2. Wallarmリポジトリの追加

WallarmノードはWallarmのリポジトリからインストールおよび更新します。リポジトリを追加するには、プラットフォームに対応するコマンドを使用してください：

=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt -y install dirmngr
    curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
    sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 20.04 LTS (focal)"
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
=== "Amazon Linux 2.0.2021x 以下"
    ```bash
    sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
    ```
=== "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm
    ```

## 3. Wallarmパッケージのインストール

以下のパッケージが必要です：

* NGINX Plus-Wallarmモジュールのための`nginx-plus-module-wallarm`
* [postanalytics][install-postanalytics-instr] モジュール、 Tarantoolデータベース、および追加のNGINX Plus-Wallarmパッケージのための`wallarm-node`

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
=== "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node nginx-plus-module-wallarm
    ```## 4. Wallarm モジュールを接続する

1. ファイル`/etc/nginx/nginx.conf`を開きます：

    ```bash
    sudo vim /etc/nginx/nginx.conf
    ```
2. `worker_processes`ディレクティブの直後に次のディレクティブを追加します：

    ```bash
    load_module modules/ngx_http_wallarm_module.so;
    ```

    追加ディレクティブが含まれた設定例：

    ```
    user  nginx;
    worker_processes  auto;
    load_module modules/ngx_http_wallarm_module.so;

    error_log  /var/log/nginx/error.log notice;
    pid        /var/run/nginx.pid;
    ```

3. システムセットアップのための設定ファイルをコピーします：

    ```bash
    sudo cp /usr/share/doc/nginx-plus-module-wallarm/examples/*.conf /etc/nginx/conf.d/
    ```

## 5. フィルタリングノードを Wallarm Cloud に接続する

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6.md"
## 6. Wallarmによるトラフィックの分析を有効にする

デフォルトでは、デプロイされたWallarmノードは受信トラフィックを分析しません。

インストールされたノードを持つマシンの`/etc/nginx/conf.d/default.conf`ファイルを変更して、Wallarmがトラフィックをプロキシするように設定します：

1. Wallarmが正当なトラフィックをプロキシするためのIPアドレスを設定します。これは、アプリケーションインスタンス、ロードバランサー、またはDNS名など、アーキテクチャに応じたIPです。

    次のように`proxy_pass`の値を編集し、Wallarmが正当なリクエストを`http://10.80.0.5`に送信するようにします：

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;

        ...

        location / {
            proxy_pass http://10.80.0.5; 
            ...
        }
    }
    ```
1. Wallarmノードが受信トラフィックを分析するためには、`wallarm_mode`ディレクティブを`monitoring`に設定します:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    モニタリングモードは、初回のデプロイメントとソリューションテストに推奨されるモードです。Wallarmは、安全なブロッキングモードとブロッキングモードも提供しています。詳細については、[こちらを読む][waf-mode-instr]。

## 7. NGINX Plusを再起動する

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-3.6.md"

## 8. Wallarmインスタンスへのトラフィック送信を設定する

ロードバランサーのターゲットを更新して、トラフィックをWallarmインスタンスに送信します。詳細については、ロードバランサーのドキュメンテーションを参照してください。

## 9. Wallarmノードの動作をテストする

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"
## 10. デプロイされたソリューションの微調整

デフォルトの設定により、動的なWallarmモジュールがNGINX Plusにインストールされています。フィルタリングノードは、デプロイ後に追加の設定が必要な場合があります。

Wallarmの設定は、[NGINXディレクティブ](../../../admin-en/configure-parameters-ja.md)またはWallarm Console UIを使用して定義されます。ディレクティブは、Wallarmノードが存在するマシンの以下のファイルに設定すべきです：

* NGINXの設定がある `/etc/nginx/conf.d/default.conf` 
* グローバルなフィルタリングノードの設定がある `/etc/nginx/conf.d/wallarm.conf` 

    このファイルは、すべてのドメインに適用する設定に使用されます。異なる設定を異なるドメイングループに適用するには、`default.conf` ファイルを使用するか、各ドメイングループ（例: `example.com.conf` 、`test.com.conf` など）の新しい設定ファイルを作成します。NGINX設定ファイルの詳細情報は、[公式NGINXドキュメンテーション](https://nginx.org/ja/docs/beginners_guide.html)で利用可能です。
* Wallarmノードの監視設定がある `/etc/nginx/conf.d/wallarm-status.conf` 。詳細な説明は[リンク][wallarm-status-instr]内にあります。
* Tarantoolデータベースの設定がある `/etc/default/wallarm-tarantool` または `/etc/sysconfig/wallarm-tarantool` 

以下に、必要に応じて適用できる典型的な設定をいくつか示します：

* [フィルタリングモードの設定][waf-mode-instr]

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"