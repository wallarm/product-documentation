[img-wl-console-users]:             ../../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../../admin-en/configure-parameters-ja.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../admin-en/using-proxy-or-balancer-ja.md
[process-time-limit-instr]:         ../../../admin-en/configure-parameters-ja.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:       ../../../../admin-en/installation-postanalytics-ja/
[dynamic-dns-resolution-nginx]:     ../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:         ../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../../admin-en/installation-postanalytics-ja.md
[waf-installation-instr-latest]:    /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:          ../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                     ../../custom/custom-nginx-version.md
[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../installation/supported-deployment-options.md
[oob-docs]:                         ../../oob/overview.md
[oob-advantages-limitations]:       ../../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring

# NGINXリポジトリからNGINX stable用の動的Wallarmモジュールをインストールする

この手順書は、NGINXリポジトリからインストールしたオープンソース版のNGINX `stable` 用としてWallarmフィルタリングノードを動的モジュールとしてインストールする手順を説明しています。

## 必要条件

* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarmコンソールで**管理者**ロールを持ったアカウントへのアクセス
* SELinuxが無効化されている、または[手順書][configure-selinux-instr]に従って設定されている
* NGINXバージョン1.24.0

    !!! info "カスタムNGINXバージョンの場合"
        別のバージョンをお持ちの場合は、[NGINXのカスタムビルドにWallarmモジュールを接続する方法][nginx-custom]に記載の手順を参照して下さい
* 全コマンドはスーパーユーザー（例：`root`）として実行します
* パッケージをダウンロードするための、 `https://repo.wallarm.com` へのアクセス。ファイアウォールによるアクセスブロックがないことを確認して下さい
* US Wallarm Cloudで作業する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudで作業する場合は`https://api.wallarm.com`へのアクセス。アクセスがプロキシサーバー経由でのみ設定可能な場合は、[手順書][configure-proxy-balancer-instr]をご利用ください
* [許可リスト、拒否リスト、またはグレーリスト][ip-lists-docs]に登録された国、地域、またはデータセンターで登録されたIPアドレスの実際のリストをダウンロードするために、[GCPストレージアドレス](https://www.gstatic.com/ipranges/goog.json)にアクセス
* **vim**、**nano**、またはその他のテキストエディターがインストールされていること。この手順書では、**vim**が使用されています

## 1. NGINX stableと依存関係のインストール

以下はNGINXリポジトリからNGINX `stable` をインストールするオプションです：

* ビルドパッケージからのインストール

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
        1. NGINX stableのために必要な依存関係をインストールします：

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
    === "CentOSまたはAmazon Linux 2.0.2021xおよび下位"

        1. CentOS 7.xでEPELリポジトリが追加されている場合は、このリポジトリからのNGINX stableのインストールを無効にするために、`exclude=nginx*`をファイル`/etc/yum.repos.d/epel.repo`に追加してください。

            修正後のファイル `/etc/yum.repos.d/epel.repo` の例：

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

* [NGINXレポジトリ](https://hg.nginx.org/pkg-oss/branches)の `stable` ブランチからのソースコードのコンパイルと、同じオプションでのインストール。

    !!! info "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x用のNGINX"
        AlmaLinux、Rocky Linux、またはOracle Linux 8.xにNGINXをインストールする唯一のオプションです。

詳細なインストール情報は[公式のNGINXドキュメンテーション](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/)をご覧ください。

## 2. Wallarmリポジトリの追加

WallarmノードはWallarmリポジトリからインストールおよび更新されます。リポジトリを追加するには、プラットフォームごとに以下のコマンドを使用します：

--8<-- "../include/waf/installation/add-nginx-waf-repos-4.6.md"
## 3. Wallarmパッケージのインストール

必要なパッケージは以下の通りです：

* NGINX-Wallarmモジュールのための`nginx-module-wallarm`
* [投稿解析](../../../admin-en/installation-postanalytics-en.md)モジュール、Tarantoolデータベース、および追加のNGINX-Wallarmパッケージのための`wallarm-node`

=== "Debian"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-module-wallarm
    ```
=== "Ubuntu"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-module-wallarm
    ```
=== "CentOSまたはAmazon Linux 2.0.2021x 以前"
    ```bash
    sudo yum install -y wallarm-node nginx-module-wallarm
    ```
=== "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node nginx-module-wallarm
    ```## 4. Wallarm モジュールの接続

1. ファイル `/etc/nginx/nginx.conf` を開きます：

    ```bash
    sudo vim /etc/nginx/nginx.conf
    ```
2. ファイルに `include /etc/nginx/conf.d/*;` の行が追加されていることを確認します。そのような行がない場合は、追加します。
3. 以下のディレクティブを `worker_processes` ディレクティブの直後に追加します：

    ```bash
    load_module modules/ngx_http_wallarm_module.so;
    ```

    追加したディレクティブを含む設定例：

    ```
    user  nginx;
    worker_processes  auto;
    load_module modules/ngx_http_wallarm_module.so;

    error_log  /var/log/nginx/error.log notice;
    pid        /var/run/nginx.pid;
    ```

4. システム設定のために設定ファイルをコピーします：

    ``` bash
    sudo cp /usr/share/doc/nginx-module-wallarm/examples/*.conf /etc/nginx/conf.d/
    ```## 5. フィルタリングノードをWallarm Cloudに接続する

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6.md"## 6. Wallarmによるトラフィック解析の有効化

デフォルトでは、デプロイされたWallarmノードは受信トラフィックを解析しません。

Wallarmがトラフィックをプロキシするように設定するには、インストール済みのノードがあるマシン上の`/etc/nginx/conf.d/default.conf`ファイルを以下のように変更します：

1. Wallarmが正当なトラフィックをプロキシするIPアドレスを設定します。これはアプリケーションインスタンス、ロードバランサー、DNS名など、あなたのアーキテクチャに依存するものです。

    これを行うには、`proxy_pass`の値を編集します。例えば、Wallarmは正当なリクエストを`http://10.80.0.5`に送信するべきです：

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
2. Wallarmノードが受信トラフィックを解析するために、`wallarm_mode`ディレクティブを`monitoring`に設定します：

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    監視モードは、最初のデプロイメントとソリューションテストに推奨されるモードです。Wallarmは安全なブロッキングとブロッキングモードも提供します、[詳細はこちら][waf-mode-instr]をご覧ください。## 7. NGINXの再開

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-3.6.md"## 8. Wallarmインスタンスへのトラフィック送信の設定

負荷分散装置のターゲットを更新して、Wallarmインスタンスへのトラフィックを送信します。詳細については、ご使用の負荷分散装置のドキュメンテーションを参照してください。## 9. Wallarmノードの動作をテストする

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"## 10. 展開されたソリューションの微調整

デフォルトの設定を持つ動的なWallarmモジュールはNGINX `stable`にインストールされています。フィルタリングノードは、展開後に追加の設定を必要とする場合があります。

Wallarmの設定は、[NGINXディレクティブ](../../../admin-en/configure-parameters-en.md)またはWallarm Console UIを使用して定義されます。ディレクティブは、Wallarmノードがあるマシン上の次のファイルに設定する必要があります：

* `/etc/nginx/conf.d/default.conf` にはNGINXの設定があります
* `/etc/nginx/conf.d/wallarm.conf` には全体のフィルタリングノード設定があります

    このファイルは、すべてのドメインに適用される設定用です。異なる設定を異なるドメイングループに適用するには、ファイル `default.conf` を使用するか、各ドメイングループ用に新しい設定ファイル（例えば `example.com.conf` と `test.com.conf`）を作成します。NGINX設定ファイルについての詳細な情報は[公式NGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)で利用できます。
* `/etc/nginx/conf.d/wallarm-status.conf` にはWallarmノードの監視設定があります。詳細な説明は[リンク][wallarm-status-instr]の中にあります
* `/etc/default/wallarm-tarantool`あるいは`/etc/sysconfig/wallarm-tarantool` にはTarantoolデータベースの設定があります

以下に、必要に応じて適用できる典型的な設定がいくつかあります：

* [フィルタリングモードの設定][waf-mode-instr]

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"

* [NGINXでの動的DNS解決の設定][dynamic-dns-resolution-nginx]