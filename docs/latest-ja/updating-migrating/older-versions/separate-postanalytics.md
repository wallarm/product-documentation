[docs-module-update]:   nginx-modules.md
[img-wl-console-users]:             ../../images/check-users.png 
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../../images/admin-guides/test-attacks-quickstart.png
[nginx-custom]:                 ../../custom/custom-nginx-version.md
[wallarm-token-types]:          ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]:             ../../images/tarantool-status.png
[statistics-service-all-parameters]: ../../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:    ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md

# EOL postanalyticsモジュールの更新

これらの指示は、別のサーバーでインストールされたライフエンドのpostanalyticsモジュール（バージョン3.6以前）のアップグレード手順を説明しています。postanalyticsモジュールは[Wallarm NGINXモジュールの更新][docs-module-update]の前にアップグレードする必要があります。

--8<-- "../include-ja/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## アップグレード方法

--8<-- "../include-ja/waf/installation/requirements-docker-nginx-4.0.md"

## オールインワンインストーラを使用したアップグレード

以下の手順を使用して、別のサーバーにインストールされたライフエンド後のpostanalyticsモジュール（バージョン3.6以前）を[オールインワンインストーラ](../../installation/nginx/all-in-one.md)を使用してバージョン4.6にアップグレードしてください。

### オールインワンインストーラを使用したアップグレードの要件

--8<-- "../include-ja/waf/installation/all-in-one-upgrade-requirements.md"

### ステップ1：クリーンマシンの準備

--8<-- "../include-ja/waf/installation/all-in-one-clean-machine.md"

### ステップ2：Wallarmトークンの準備

--8<-- "../include-ja/waf/installation/all-in-one-token.md"

### ステップ3：Wallarmオールインワンインストーラのダウンロード

--8<-- "../include-ja/waf/installation/all-in-one-installer-download.md"

### ステップ4：オールインワンWallarmインストーラを実行して、postanalyticsをインストールする

--8<-- "../include-ja/waf/installation/all-in-one-postanalytics.md"

### ステップ5：APIポートの更新

--8<-- "../include-ja/waf/upgrade/api-port-443.md"

### ステップ6：別のサーバーでNGINX-Wallarmモジュールのアップグレード

postanalyticsモジュールが別のサーバーにインストールされたら、異なるサーバーで実行している関連する[NGINX-Wallarmモジュールをアップグレード](nginx-modules.md)します。

!!! info "アップグレード方法の組み合わせ"
    手動と自動の両方のアプローチが、関連するNGINX-Wallarmモジュールのアップグレードに使用できます。

### ステップ7：NGINX-Wallarmモジュールをpostanalyticsモジュールに再接続する

--8<-- "../include-ja/waf/installation/all-in-one-postanalytics-reconnect.md"

### ステップ8：NGINX-Wallarmと別のpostanalyticsモジュール間のインタラクションを確認する

--8<-- "../include-ja/waf/installation/all-in-one-postanalytics-check.md"

### ステップ9：古いpostanalyticsモジュールを削除する

--8<-- "../include-ja/waf/installation/all-in-one-postanalytics-remove-old.md"

## 手動でのアップグレード

以下の手順を使用して、別のサーバーにインストールされたライフエンドのpostanalyticsモジュール（バージョン3.6以前）を手動でバージョン4.6にアップグレードしてください。

### 要件

--8<-- "../include-ja/waf/installation/requirements-docker-nginx-4.0.md"

### ステップ1：APIポートの更新

--8<-- "../include-ja/waf/upgrade/api-port-443.md"

### ステップ2：新しいWallarmリポジトリの追加

以前のWallarmリポジトリのアドレスを削除し、新しいWallarmノードバージョンパッケージのリポジトリを追加します。適切なプラットフォーム用のコマンドを使用してください。

**CentOSおよびAmazon Linux 2.0.2021x以前**

=== "CentOS 7およびAmazon Linux 2.0.2021x以前"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
    ```
=== "CentOS 8"
    !!! warning "CentOS 8.xのサポートは廃止されました"
        CentOS 8.xのサポート[が廃止されました](https://www.centos.org/centos-linux-eol/)。AlmaLinux、Rocky Linux、またはOracle Linux 8.xのオペレーティングシステムにWallarmノードをインストールできます。

        * [NGINX `安定版` のインストール手順](../../installation/nginx/dynamic-module.md)
        * [CentOS/DebianリポジトリからのNGINXのインストール手順](../../installation/nginx/dynamic-module-from-distr.md)
        * [NGINX Plusのインストール手順](../../installation/nginx-plus.md)
=== "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm
    ```

**DebianおよびUbuntu**

1. インストールされたテキストエディタでWallarmリポジトリアドレスのファイルを開きます。この手順では、**vim**を使用しています。 

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. 以前のリポジトリアドレスをコメントアウトまたは削除します。
3. 新しいリポジトリアドレスを追加します：

     === "Debian 10.x (buster)"
        !!! warning "NGINX安定版およびNGINX Plusによりサポートされていません"
            公式のNGINXバージョン（安定版およびPlus）およびそれに伴いWallarmノード4.4およびそれ以降のバージョンはDebian 10.x（buster）ではインストールできません。[NGINXがDebian/CentOSリポジトリからインストールされている場合](../../installation/nginx/dynamic-module-from-distr.md)のみこのOSを使用してください。

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

### ステップ3：Tarantoolパッケージのアップグレード

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
=== "CentOSまたはAmazon Linux 2.0.2021x以前"
    ```bash
    sudo yum update
    ```
=== "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
    ```bash
    sudo yum update
    ```

### ステップ4：ノードタイプの更新

デプロイされたpostanalyticsノード3.6またはそれ以下は、レギュラータイプが[新しい**Wallarmノード**タイプに取って代わられた](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens)レガシータイプです。

バージョン4.6への移行中に非推奨のものの代わりに新しいノードタイプをインストールすることをお勧めします。レギュラーノードタイプは将来のリリースで削除されますので、移行してください。

レギュラーのpostanalyticsノードをWallarmノードに置き換えるには：

1. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)のWallarm Console → **Nodes**を開き、**Wallarmノード**タイプのノードを作成します。

    ![Wallarm node creation][img-create-wallarm-node]
1. 生成されたトークンをコピーします。
1. `register-node`スクリプトを実行して**Wallarmノード**を起動します：

    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force --no-sync --no-sync-acl
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force --no-sync --no-sync-acl
        ```
    
    * `<TOKEN>`は、ノードトークンまたは`Deploy`ロールを持つAPIトークンのコピーした値です。
    * `--force`オプションは、`/etc/wallarm/node.yaml`ファイルに指定されたWallarm Cloudアクセス認証情報を強制的に書き換えます。

    <div class="admonition info"> <p class="admonition-title">複数のインストールで一つのトークンを使用するための2つのオプションがあります：</p> <ul><li>**全てのノードバージョン**で、一つの[**ノードトークン**](../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node)を選択した[プラットフォーム](../../installation/supported-deployment-options.md)に関係なく、複数のインストールで使用できます。これにより、ノードインスタンスをWallarm Console UI内で論理的にグループ化できます。例：開発環境に複数のWallarmノードをデプロイします。各ノードは各開発者が所有する独自のマシン上にあります。</li><li><p>**ノード4.6から**、ノードのグルーピングのために、`Deploy`ロールを持つ一つの[**APIトークン**](../../user-guides/settings/api-tokens.md)を`--labels 'group=<GROUP>'`フラグと一緒に使用できます。例：</p>
    ```
    sudo /usr/share/wallarm-common/register-node -t <APIトークンWITH DEPLOY ROLE> --labels 'group=<GROUP>'
    ```
    </p></li></ul></div>

### ステップ5：postanalyticsモジュールの再起動

=== "Debian"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.xまたはAmazon Linux 2.0.2021x以前"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

[Wallarm NGINXモジュールを更新する][docs-module-update]