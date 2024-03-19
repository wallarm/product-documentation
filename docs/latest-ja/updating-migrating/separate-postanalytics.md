[docs-module-update]:           nginx-modules.md
[img-wl-console-users]:         ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../images/admin-guides/test-attacks-quickstart.png
[wallarm-token-types]:          ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]:             ../images/tarantool-status.png
[statistics-service-all-parameters]: ../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md

# postanalyticsモジュールのアップグレード

これらの指示は、別のサーバーにインストールされているpostanalyticsモジュール4.xをアップグレードするための手順を説明しています。 [Wallarm NGINX modules][docs-module-update]をアップグレードする前に、Postanalyticsモジュールをアップグレードする必要があります。

バージョン3.6以下の終了モジュールをアップグレードするには、[異なる指示](older-versions/separate-postanalytics.md)を使用してください。

## アップグレード方法

--8<-- "../include-ja/waf/installation/requirements-docker-nginx-4.0.md"

## 全体一式インストーラーによるアップグレード

以下の手順を使用して、別のサーバーにインストールされているPostanalyticsモジュール4.xを[全体一式インストーラー](../installation/nginx/all-in-one.md)を使用してバージョン4.6にアップグレードします。

### 全体一式インストーラーを使用したアップグレードの要件

--8<-- "../include-ja/waf/installation/all-in-one-upgrade-requirements.md"

### ステップ1：クリーンなマシンを準備する

--8<-- "../include-ja/waf/installation/all-in-one-clean-machine.md"

### ステップ 2: Wallarmトークンを準備する

--8<-- "../include-ja/waf/installation/all-in-one-token.md"

### ステップ 3: 全体一式Wallarmインストーラーをダウンロードする

--8<-- "../include-ja/waf/installation/all-in-one-installer-download.md"

### ステップ 4:全体一式Wallarmインストーラーを実行してpostanalyticsをインストールする

--8<-- "../include-ja/waf/installation/all-in-one-postanalytics.md"

### ステップ 5: 別のサーバー上のNGINX-Wallarmモジュールをアップグレードする

別のサーバーにpostanalyticsモジュールがインストールされたら、別のサーバーで実行されているその関連[NGINX-Wallarmモジュールをアップグレード](nginx-modules.md)します。

!!! info "アップグレード方法の組み合わせ"
    関連するNGINX-Wallarmモジュールをアップグレードするためには手動と自動のどちらのアプローチも使用できます。

### ステップ 6: NGINX-Wallarmモジュールをpostanalyticsモジュールに再接続する

--8<-- "../include-ja/waf/installation/all-in-one-postanalytics-reconnect.md"

### ステップ 7: NGINX‑Wallarmと別のpostanalyticsモジュールとの相互作用を確認する

--8<-- "../include-ja/waf/installation/all-in-one-postanalytics-check.md"

### ステップ 8:旧postanalyticsモジュールを削除する

--8<-- "../include-ja/waf/installation/all-in-one-postanalytics-remove-old.md"

## 手動アップグレード

以下の手順を使用して、別のサーバーにインストールされているpostanalyticsモジュール4.xを手動でバージョン4.6にアップグレードします。

### 要件

--8<-- "../include-ja/waf/installation/requirements-docker-nginx-4.0.md"

### ステップ 1: 新しいWallarmリポジトリを追加する

以前のWallarmリポジトリアドレスを削除し、新しいWallarmノードバージョンパッケージのリポジトリを追加します。適切なプラットフォームのコマンドを使用してください。

**CentOSとAmazon Linux 2.0.2021x以下**

=== "CentOS 7とAmazon Linux 2.0.2021x以下"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
    ```
=== "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm
    ```

**DebianとUbuntu**

1. インストール済みのテキストエディターでWallarmリポジトリアドレスを含むファイルを開きます。この手順では、**vim**を使用します。

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. 以前のリポジトリアドレスをコメントアウトまたは削除します。
3. 新しいリポジトリアドレスを追加します：

    === "Debian 10.x (buster)"
        !!! warning "NGINX安定版とNGINX Plusではサポートされていません"
            公式NGINXバージョン（安定版とPlus）および、その結果としてWallarmノード4.4以降は、Debian 10.x（buster）にインストールできません。 [NGINXがDebian / CentOSリポジトリからインストールされている](../installation/nginx/dynamic-module-from-distr.md)場合にのみ、このOSを使用してください。

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

### ステップ 2: Tarantoolパッケージをアップグレードする

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
=== "CentOSまたはAmazon Linux 2.0.2021x以下"
    ```bash
    sudo yum update
    ```
=== "AlmaLinux, Rocky LinuxまたはOracle Linux 8.x"
    ```bash
    sudo yum update
    ```

### ステップ 3: ノードタイプを更新する

!!! info "`addnode`スクリプトを使用してインストールされたノード専用"
     `addnode`スクリプトを使用してWallarm Cloudに接続されている以前のバージョンのノードの場合のみ、このステップに従ってください。 このスクリプトは[削除](what-is-new.md#removal-of-the-email-password-based-node-registration)され、代わりに`register-node`が使用されます。 これには、Cloudでノードを登録するためのトークンが必要です。

1. Wallarmアカウントが**管理者**ロールを持っていることを確認します。 [US Cloud](https://us1.my.wallarm.com/settings/users)または[EU Cloud](https://my.wallarm.com/settings/users)のユーザーリストに移動して確認します。

    ![Wallarmコンソールのユーザーリスト][img-wl-console-users]
1. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)のWallarmコンソール→ **Nodes**を開き、**Wallarm node**タイプのノードを作成します。

    ![Wallarmノードの作成][img-create-wallarm-node]
1. 生成されたトークンをコピーします。
1. ノードを実行するために`register-node`スクリプトを実行します：

    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force --no-sync --no-sync-acl
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force --no-sync --no-sync-acl
        ```
    
    * `<TOKEN>`は、ノードトークンまたは`Deploy`ロールを持つAPIトークンのコピーされた値です。
    * `--force`オプションは、`/etc/wallarm/node.yaml` ファイルに指定されたWallarm Cloudアクセス認証情報を強制的に書き換えます。

    <div class="admonition info"> <p class="admonition-title">いくつかのインストールに1つのトークンを使用する</p> <p>いくつかのインストールに1つのトークンを使用する2つのオプションがあります：</p> <ul><li>**すべてのノードバージョンについて**、一つの [**ノードトークン**](../quickstart/getting-started.md#deploy-the-wallarm-filtering-node)を選択された[プラットフォーム](../installation/supported-deployment-options.md)に関係なく複数のインストールで使用できます。これにより、Wallarm Console UIでノードインスタンスを論理的にグルーピングできます。例：いくつかのWallarmノードを開発環境にデプロイし、各ノードが特定の開発者が所有する専用のマシン上にあります。</li><li><p>**ノード4.6から始まる** ノードのグルーピングのために、`Deploy`ロールを持つ一つの [**APIトークン**](../user-guides/settings/api-tokens.md) を`--labels 'group=<GROUP>'`フラグと一緒に使用することができます。例えば：</p>
    ```
    sudo /usr/share/wallarm-common/register-node -t <API TOKEN WITH DEPLOY ROLE> --labels 'group=<GROUP>'
    ```
    </p></li></div>

### ステップ 4: postanalyticsモジュールを再起動する

=== "Debian"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.xまたはAmazon Linux 2.0.2021x以下"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

[Wallarm NGINX modulesをアップグレードする][docs-module-update]