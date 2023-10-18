[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]:      ../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../admin-en/configure-dynamic-dns-resolution-nginx.md
[img-wl-console-users]:             ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[oob-docs]:                         ../installation//oob/overview.md
[sqli-attack-docs]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[web-server-mirroring-examples]:    ../installation/oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring


# Wallarm NGINX モジュールのアップグレード

丁寧パッケージからインストールされたWallarm NGINXモジュール4.xの4.6へのアップグレード手順を次に述べます。これらは以下の指示に従ってインストールされたモジュールです。

* [個別パッケージ（NGINX安定)](../installation/nginx/dynamic-module.md)
* [個別パッケージ（NGINXプラス)](../installation/nginx-plus.md)
* [個別パッケージ (配布NGINX付属)](../installation/nginx/dynamic-module-from-distr.md)

終了ノード（3.6以下）をアップグレードするには、[異なる手順](older-versions/nginx-modules.md)を使用してください。

## 要件

--8<-- "../include-ja/waf/installation/requirements-docker-nginx-4.0.md"

--8<-- "../include-ja/waf/installation/upgrade-methods.md"

## 一体型インストーラでのアップグレード

以下の手順を使用して、[一体型インストーラ](../installation/nginx/all-in-one.md)を使用してWallarm NGINXモジュール4.xからバージョン4.6にアップグレードします。 

### 一体型インストーラでのアップグレード要件

--8<-- "../include-ja/waf/installation/all-in-one-upgrade-requirements.md"

### アップグレード手順

* フィルタリングノードとPostanalyticsモジュールが同じサーバーにインストールされている場合、以下の指示に従ってすべてをアップグレードします。

    あなたは新しいバージョンのノードを一体型インストーラでクリーンマシン上で実行する必要があります、それがうまく機能していることをテストし、前のものを停止し、前のマシンの代わりに新しいマシンを通じてトラフィックを流すように設定します。

* フィルタリングノードとPostanalyticsモジュールが異なるサーバーにインストールされている場合、**最初に** Postanalytics モジュールをアップグレードし、**次に** これらの[手順](../updating-migrating/separate-postanalytics.md)に従ってフィルタリングモジュールをアップグレードします。

### ステップ1：クリーンマシンの準備

--8<-- "../include-ja/waf/installation/all-in-one-clean-machine.md"

### ステップ2：NGINXと依存関係のインストール

--8<-- "../include-ja/waf/installation/all-in-one-nginx.md"

### ステップ3：Wallarmトークンの準備

--8<-- "../include-ja/waf/installation/all-in-one-token.md"

### ステップ4：一体型Wallarmインストーラのダウンロード

--8<-- "../include-ja/waf/installation/all-in-one-installer-download.md"

### ステップ5：一体型Wallarmインストーラの実行

#### 同じサーバー上のフィルタリングノードとpostanalytics

--8<-- "../include-ja/waf/installation/all-in-one-installer-run.md"

#### 異なるサーバー上のフィルタリングノードとpostanalytics

!!! warning "フィルタリングノードとpostanalyticsモジュールのアップグレードのステップの順序"
    フィルタリングノードとpostanalyticsモジュールが異なるサーバーにインストールされている場合、postanalyticsパッケージをアップグレードする前にフィルタリングノードパッケージを更新する必要があります。

1. これらの[手順](separate-postanalytics.md)に従ってpostanalyticsモジュールをアップグレードします。
1. フィルタリングノードをアップグレードします:

    === "APIトークン"
        ```bash
        # x86_64版の場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.12.x86_64-glibc.sh filtering

        # ARM64版の場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.12.aarch64-glibc.sh filtering
        ```        

        `WALLARM_LABELS`変数は、ノードが追加されるグループを設定します（Wallarm Console UIでのノード論理グループ化に使用されます）。

    === "ノードトークン"
        ```bash
        # x86_64版の場合:
        sudo sh wallarm-4.6.12.x86_64-glibc.sh filtering

        # ARM64版の場合:
        sudo sh wallarm-4.6.12.aarch64-glibc.sh filtering
        ```

### ステップ6：旧ノードマシンから新しいマシンへのNGINXとpostanalyticsの設定の転送

旧マシンの設定ファイルから新マシンのファイルへノード関連のNGINX設定およびpostanalytics設定を転送します。これは、必要なディレクティブをコピーすることにより実行できます。

**ソースファイル**

旧マシンでは、OSとNGINXバージョンに関ディング、NGINX設定ファイルは異なるディレクトリに配置され、異なる名前を持つことがあります。最も一般的なものは次のとおりです。

* `/etc/nginx/conf.d/default.conf`にはNGINXの設定があります。
* `/etc/nginx/conf.d/wallarm.conf`にはグローバルフィルタリングノードの設定があります。

    このファイルは、すべてのドメインに適用される設定に使用されます。異なるドメイングループに異なる設定を適用するためには、通常は`default.conf`が使用されます、または各ドメイングループ（例えば、`example.com.conf`および`test.com.conf`）に対して新しい設定ファイルが作成されます。NGINX設定ファイルに関する詳細情報は、[公式NGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)で利用可能です。
    
* `/etc/nginx/conf.d/wallarm-status.conf`にはWallarmノード監視設定があります。詳細な説明は[リンク][wallarm-status-instr]にあります。

また、postanalyticsモジュール（Tarantoolデータベース設定）の設定は通常ここに配置されています。

* `/etc/default/wallarm-tarantool`
* `/etc/sysconfig/wallarm-tarantool`

**ターゲットファイル**

一体型インストーラはさまざまなOSとNGINXバージョンの組み合わせで動作するため、新しいマシン上では、ターゲットファイルは異なる名前を持つことがあり、異なるディレクトリに配置される場合があります。

### ステップ7：NGINXを再起動する

--8<-- "../include-ja/waf/installation/restart-nginx-systemctl.md"

### ステップ8：Wallarmノード操作のテスト

新しいノードの操作をテストするには：

1. テスト[SQLI][sqli-attack-docs]と[XSS][xss-attack-docs]攻撃を含むリクエストを保護されたリソースアドレスに送信します。

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. [米国クラウド](https://us1.my.wallarm.com/search)または[EUクラウド](https://my.wallarm.com/search)のWallarmコンソール→**イベント**セクションを開き、攻撃がリストに表示されていることを確認します。
1. あなたのクラウドに保存されたデータ（ルール、IPリスト）が新しいノードに同期されたら、あなたのルールが期待通りに機能することを確認するためにいくつかのテスト攻撃を実行します。

### ステップ9：Wallarmノードへのトラフィックの送信を設定する

使用しているデプロイメントアプローチに応じて、次の設定を行います：

=== "インライン"
    トラフィックをWallarmインスタンスに送信するように、ロードバランサのターゲットを更新します。詳細については、ロードバランサのドキュメントを参照してください。

    新しいノードへのトラフィックを完全にリダイレクトする前に、まず部分的にリダイレクトして新しいノードが期待どおりの動作をすることを確認することを推奨します。

=== "アウトオブバンド"
    あなたのウェブサーバーまたはプロキシサーバー（例えば、NGINXやEnvoy）を設定して、受信トラフィックをWallarmノードにミラーリングします。設定の詳細については、ウェブサーバーまたはプロキシサーバーのドキュメントを参照することをお勧めします。

    [リンク][web-server-mirroring-examples]の中に、最も人気のあるウェブサーバーとプロキシサーバー（NGINX、Traefik、Envoy）の設定例があります。   

### ステップ10：古いノードの削除

1. Wallarmコンソール→**ノード**から古いノードを削除し、**削除**をクリックしてノードを選択します。
1. アクションを確認します。
    
    ノードがクラウドから削除されると、あなたのアプリケーションへのリクエストのフィルタリングが停止します。フィルタリングノードの削除は元に戻すことができません。ノードはノードリストから永久に削除されます。

1. 古いノードのあるマシンを削除するか、単にWallarmノードコンポーネントからクリーンにします：

    === "デビアン"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "ウブンツ"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "CentOSまたはAmazon Linux 2.0.2021以下"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "AlmaLinux, Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```

## 手動アップグレード

以下の手順を使用して、Wallarm NGINXモジュール4.xをバージョン4.6に手動でアップグレードします。

### 手動アップグレードの要件

--8<-- "../include-ja/waf/installation/requirements-docker-nginx-4.0.md"

### アップグレード手順

* フィルタリングノードとPostanalyticsモジュールが同じサーバーにインストールされている場合、すべてのパッケージをアップグレードするための以下の指示に従います。
* フィルタリングノードとPostanalyticsモジュールが異なるサーバーにインストールされている場合、**最初に** Postanalyticsモジュールをこれらの[手順](separate-postanalytics.md)に従ってアップグレードし、次に以下のステップをフィルタリングノードモジュールに実行します。

### ステップ1：最新バージョンのNGINXにアップグレードする

適当な手順を使用してNGINXを最新バージョンにアップグレードします：

=== "NGINX安定版"

    DEBベースのディストリビューション：

    ```bash
    sudo apt update
    sudo apt -y install nginx
    ```

    RPMベースのディストリビューション：

    ```bash
    sudo yum update
    sudo yum install -y nginx
    ```
=== "NGINXプラス"
    NGINX Plusの場合、[公式アップグレード手順](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/#upgrading-nginx-plus)に従ってください。
=== "Debian/CentOSリポジトリからのNGINX"
    Debian/CentOSリポジトリから[インストールされたNGINX](../installation/nginx/dynamic-module-from-distr.md)の場合、このステップをスキップしてください。インストールされたNGINXバージョンは、Wallarmモジュールとともに[後で](#step-4-upgrade-wallarm-packages)アップグレードされます。

特定バージョンのNGINXをインフラストラクチャで使用する必要がある場合は、カスタム版NGINXのWallarmモジュールをビルドするために[Wallarmテクニカルサポート](mailto:support@wallarm.com)に連絡してください。

### ステップ2：新しいWallarmリポジトリを追加する

以前のWallarmリポジトリアドレスを削除し、新しいWallarmノードバージョンパッケージのリポジトリを追加します。適切なプラットフォームのコマンドを使用してください。

**CentOSおよびAmazon Linux 2.0.2021とそれ以前**

=== "CentOS 7およびAmazon Linux 2.0.2021とそれ以前"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky LinuxまたはOracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm
    ```

**DebianおよびUbuntu**

1. インストールしたテキストエディタでWallarmリポジトリアドレスのファイルを開きます。これらの手順では、**vim**が使用されています。

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. 以前のリポジトリアドレスをコメントアウトまたは削除します。
3. 新しいリポジトリアドレスを追加します：

    === "Debian 10.x (buster)"
        !!! warning "NGINX安定とNGINXプラスではサポートされていません"
            公式のNGINXバージョン（安定版およびプラス）そしてその結果としてWallarmノード4.4以上はDebian 10.x (buster)にインストールできません。このOSは、[NGINXがDebian/CentOSリポジトリからインストールされている場合にのみ使用してください](../installation/nginx/dynamic-module-from-distr.md)。

        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node buster/4.6/
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.6/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.6/
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/
        ```

### ステップ3：Wallarmパッケージをアップグレードする

#### 同じサーバー上のフィルタリングノードとpostanalytics

1. 以下のコマンドを実行して、フィルタリングノードとpostanalyticsモジュールをアップグレードします：

    === "Debian"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include-ja/waf/upgrade/warning-expired-gpg-keys-4.6.md"

        --8<-- "../include-ja/waf/upgrade/details-about-dist-upgrade.md"
    === "Ubuntu"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include-ja/waf/upgrade/warning-expired-gpg-keys-4.6.md"

        --8<-- "../include-ja/waf/upgrade/details-about-dist-upgrade.md"
    === "CentOSまたはAmazon Linux 2.0.2021xとそれ以前"
        ```bash
        sudo yum update
        ```
    === "AlmaLinux, Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        sudo yum update
        ```
2. パッケージマネージャが設定ファイル`/etc/cron.d/wallarm-node-nginx`の内容を上書きするための確認を求めたら、`Y`のオプションを送信します。

    `/etc/cron.d/wallarm-node-nginx`の内容は、新しいスクリプトがRPSをダウンロードするために更新されるべきです。

    パッケージマネージャはデフォルトで`N`オプションを使用しますが、正しいRPS計算のためには`Y`オプションが必要です。

#### 異なるサーバー上のフィルタリングノードとpostanalytics

!!! warning "フィルタリングノードとpostanalyticsモジュールのアップグレードのステップの順序"
    フィルタリングノードとpostanalyticsモジュールが異なるサーバーにインストールされている場合、postanalyticsパッケージをアップグレードする前にフィルタリングノードパッケージを更新する必要があります。

1. これらの[手順](separate-postanalytics.md)に従ってpostanalyticsパッケージをアップグレードします。
2. Wallarmノードパッケージをアップグレードします：

    === "Debian"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include-ja/waf/upgrade/warning-expired-gpg-keys-4.6.md"

        --8<-- "../include-ja/waf/upgrade/details-about-dist-upgrade.md"
    === "Ubuntu"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include-ja/waf/upgrade/warning-expired-gpg-keys-4.6.md"

        --8<-- "../include-ja/waf/upgrade/details-about-dist-upgrade.md"
    === "CentOSまたはAmazon Linux 2.0.2021xとそれ以前"
        ```bash
        sudo yum update
        ```
    === "AlmaLinux, Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        sudo yum update
        ```
3. パッケージマネージャが設定ファイル`/etc/cron.d/wallarm-node-nginx`の内容を上書きするための確認を求めたら、`Y`のオプションを送信します。

    `/etc/cron.d/wallarm-node-nginx`の内容は、新しいスクリプトがRPSをダウンロードするために更新されるべきです。

    パッケージマネージャはデフォルトで`N`オプションを使用しますが、正しいRPS計算のためには`Y`オプションが必要です。

### ステップ4：ノードタイプを更新する

!!! info "「addnode」スクリプトを使用してインストールされたノードのみ"
    前のバージョンのノードが`addnode`スクリプトを使用してWallarmクラウドに接続されている場合にのみ、このステップを実行します。このスクリプトは[削除](what-is-new.md#removal-of-the-email-password-based-node-registration)され、代わりに`register-node`が必要です、これにはクラウド内のノードを登録するためのトークンが必要です。

1. [米国クラウド](https://us1.my.wallarm.com/settings/users)または[EUクラウド](https://my.wallarm.com/settings/users)のユーザーリストを開いて、Wallarmアカウントが**管理者**ロールであることを確認します。

    ![Wallarmコンソール内のユーザーリスト][img-wl-console-users]
1. [米国クラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)のWallarmコンソール→**ノード**を開いて、**Wallarmノード**タイプのノードを作成します。

    ![Wallarmノードの作成][img-create-wallarm-node]

    !!! info "postanalyticsモジュールが別のサーバーにインストールされている場合"
        初期トラフィック処理モジュールとpostanalyticsモジュールが別々のサーバーにインストールされている場合、これらのモジュールを同じノードトークンを使用してWallarmクラウドに接続することをお勧めします。Wallarm Console UIには、各モジュールが別々のノードインスタンスとして表示されます、例えば：

        ![インスタンスが複数あるノード](../images/user-guides/nodes/wallarm-node-with-two-instances.png)

        Wallarmノードはすでに[別々のpostanalyticsモジュールのアップグレード](separate-postanalytics.md)の間に作成されました。初期トラフィック処理モジュールを同じノードの資格情報を使用してクラウドに接続するために：

        1. 別のpostanalyticsモジュールのアップグレード中に生成されたノードトークンをコピーします。
        1. 以下のリストの4つ目のステップに進みます。
1. 生成されたトークンをコピーします。
1. RPS計算のリスクを低減するために、NGINXサービスを一時停止します：

    === "Debian"
        ```bash
        sudo systemctl stop nginx
        ```
    === "Ubuntu"
        ```bash
        sudo service nginx stop
        ```
    === "CentOSまたはAmazon Linux 2.0.2021xとそれ以前"
        ```bash
        sudo systemctl stop nginx
        ```
    === "AlmaLinux, Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        sudo systemctl stop nginx
        ```
1. **Wallarmノード**を実行するために`register-node`スクリプトを実行します：

    === "米国クラウド"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force
        ```
    === "EUクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force
        ```
    
    * `<TOKEN>`はノードトークンまたはAPIトークン（`Deploy`ロール付き）のコピーされた値です。
    * `--force`オプションは、`/etc/wallarm/node.yaml`ファイルに指定されたWallarmクラウドアクセス認証情報を強制的に書き換えるために使用されます。

### ステップ5：Wallarmブロッキングページを更新する

新しいノードバージョンでは、Wallarmのサンプルブロッキングページが[変更](what-is-new.md#new-blocking-page)されました。ページのロゴとサポートメールはデフォルトで空になりました。

ページ`&/usr/share/nginx/html/wallarm_blocked.html`がブロックされたリクエストに対する応答として設定されている場合、新しいサンプルページのバージョンを[コピーしてカスタマイズ](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)します。

### ステップ6：NGINXを再開する

--8<-- "../include-ja/waf/restart-nginx-4.4-and-above.md"

### ステップ7：Wallarmノード操作のテスト

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

### 設定のカスタマイズ

Wallarmモジュールはバージョン4.6に更新されました。以前のフィルタリングノードの設定は新しいバージョンに自動的に適用されます。追加の設定を行うために、[利用可能なディレクティブ](../admin-en/configure-parameters-en.md)を使用してください。

--8<-- "../include-ja/waf/installation/common-customization-options-nginx-4.4.md"
