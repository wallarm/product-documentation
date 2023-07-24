[docs-module-update]:   nginx-modules.md
[img-wl-console-users]:             ../../images/check-users.png 
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../custom/custom-nginx-version.md

# EOL postanalyticsモジュールのアップグレード

これらの手順は、別のサーバーにインストールされたエンドオブライフのpostanalyticsモジュール（バージョン3.6およびそれ以前）をアップグレードするための手順を説明しています。Postanalyticsモジュールは、[Wallarm NGINXモジュールのアップグレード][docs-module-update]を行う前にアップグレードする必要があります。

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.ja.md"

## 要件

--8<-- "../include/waf/installation/requirements-docker-4.0.ja.md"

## ステップ1：APIポートの更新

--8<-- "../include/waf/upgrade/api-port-443.ja.md"

## ステップ2：新しいWallarmリポジトリの追加

前のWallarmリポジトリのアドレスを削除し、新しいWallarmノードバージョンパッケージのリポジトリを追加してください。適切なプラットフォーム用のコマンドを使用してください。

**CentOSおよびAmazon Linux 2.0.2021xおよびそれ以前**

=== "CentOS 7およびAmazon Linux 2.0.2021xおよびそれ以前"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
    ```
=== "CentOS 8"
    !!! warning "CentOS 8.xの対応が廃止されました"
        CentOS 8.xのサポートは[廃止されました](https://www.centos.org/centos-linux-eol/)。代わりに、AlmaLinux、Rocky Linux、またはOracle Linux 8.xオペレーティング・システムにWallarmノードをインストールできます。

        * [NGINX `stable`用のインストール手順](../../installation/nginx/dynamic-module.md)
        * [CentOS/DebianリポジトリからのNGINXインストール手順](../../installation/nginx/dynamic-module-from-distr.md)
        * [NGINX Plus用のインストール手順](../../installation/nginx-plus.md)
=== "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm
    ```

**DebianおよびUbuntu**

1. インストール済みのテキストエディタでWallarmリポジトリのアドレスが設定されているファイルを開きます。この手順では、**vim**が使用されています。

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. 以前のリポジトリアドレスをコメントアウトまたは削除します。
3. 新しいリポジトリアドレスを追加します：

    === "Debian 10.x (buster)"
        !!! warning "NGINX安定版とNGINX Plusではサポートされていません"
            公式のNGINXバージョン（stableおよびPlus）およびその結果として、Wallarmノード4.4およびそれ以降はDebian 10.x（buster）でインストールできません。[Debian/CentOSリポジトリからインストールされたNGINX](../../installation/nginx/dynamic-module-from-distr.md)のみを使用してください。

        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node buster/4.4/
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.4/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.4/
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/
        ```

## ステップ3：Tarantoolパッケージのアップグレード

=== "Debian"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.4.ja.md"

    --8<-- "../include/waf/upgrade/details-about-dist-upgrade.ja.md"
=== "Ubuntu"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.4.ja.md"

    --8<-- "../include/waf/upgrade/details-about-dist-upgrade.ja.md"
=== "CentOSまたはAmazon Linux 2.0.2021xおよびそれ以前"
    ```bash
    sudo yum update
    ```
=== "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
    ```bash
    sudo yum update
    ```

## ステップ4：ノードタイプの更新

デプロイされているpostanalyticsノード3.6またはそれ以前は、[新しい**Wallarmノード**タイプに置き換えられた](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens)非推奨の**通常**タイプです。

バージョン4.4に移行する際に、非推奨のものの代わりに新しいノードタイプをインストールすることが推奨されています。通常のノードタイプは今後のリリースで削除される予定です。その前に移行してください。

通常のpostanalyticsノードをWallarmノードに置き換えるには：

1. WallarmアカウントでWallarmコンソール内で**管理者**ロールが有効になっていることを確認してください。
     
    [USクラウド](https://us1.my.wallarm.com/settings/users)または[EUクラウド](https://my.wallarm.com/settings/users)のユーザーリストから、指定の設定を確認できます。

    ![!Wallarmコンソールのユーザーリスト][img-wl-console-users]
1. [USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)のWallarmコンソール→ **ノード**を開き、**Wallarmノード**タイプのノードを作成します。

    ![!Wallarmノードの作成][img-create-wallarm-node]
1. 生成されたトークンをコピーします。
1. `register-node`スクリプトを実行して**Wallarmノード**を起動します：

    === "USクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com --force --no-sync --no-sync-acl
        ```
    === "EUクラウド"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> --force --no-sync --no-sync-acl
        ```
    
    * `<NODE_TOKEN>`はWallarmノードトークンです。
    * `--force`オプションは、`/etc/wallarm/node.yaml`ファイルに指定されたWallarm Cloudアクセス認証情報の強制書き換えを行います。

## ステップ5：postanalyticsモジュールの再起動

=== "Debian"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.xまたはAmazon Linux 2.0.2021xおよびそれ以前"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

[Wallarm NGINXモジュールのアップグレード][docs-module-update]