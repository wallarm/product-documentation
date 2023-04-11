[docs-module-update]:   nginx-modules.md
[img-wl-console-users]:             ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png

#   postanalyticsモジュールのアップグレード

これらの指示は、別のサーバーにインストールされたpostanalyticsモジュール4.xをアップグレードする手順を説明しています。Postanalyticsモジュールは、[Wallarm NGINXモジュールのアップグレード][docs-module-update]の前にアップグレードする必要があります。

End-of-lifeモジュール（3.6以下）をアップグレードするには、[別の手順](older-versions/separate-postanalytics.md)を使用してください。

## 要件

--8<-- "../include-ja/waf/installation/requirements-docker-4.0.md"

## ステップ1：新しいWallarmリポジトリの追加

前のWallarmリポジトリアドレスを削除し、新しいWallarmノードバージョンパッケージを含むリポジトリを追加します。適切なプラットフォーム用のコマンドを使用してください。

**CentOSおよびAmazon Linux 2.0.2021x 以下**

=== "CentOS 7およびAmazon Linux 2.0.2021x以下"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
    ```
=== "AlmaLinux、Rocky Linux、Oracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm
    ```

**DebianおよびUbuntu**

1. インストールされたテキストエディタで、Wallarmリポジトリアドレスのファイルを開きます。この手順では、** vim **が使用されています。

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. 以前のリポジトリアドレスをコメントアウトまたは削除します。
3. 新しいリポジトリアドレスを追加します:

    === "Debian 10.x（buster）"
        !!! warning "NGINX安定版およびNGINXプラスではサポートされません"
            公式のNGINXバージョン（安定およびプラス）および、結果として、Wallarmノード4.4およびそれ以降はDebian 10.x（buster）にインストールできません。 [Debian / CentOSリポジトリからNGINXがインストールされている場合は、](../installation/nginx/dynamic-module-from-distr.md)このOSを使用してください。

        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node buster/4.4/
        ```
    === "Debian 11.x（bullseye）"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.4/
        ```
    === "Ubuntu 18.04 LTS（bionic）"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.4/
        ```
    === "Ubuntu 20.04 LTS（focal）"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/
        ```

## ステップ2：Tarantoolパッケージのアップグレード

=== "Debian"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include-ja/waf/upgrade/warning-expired-gpg-keys-4.4.md"

    --8<-- "../include-ja/waf/upgrade/details-about-dist-upgrade.md"
=== "Ubuntu"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include-ja/waf/upgrade/warning-expired-gpg-keys-4.4.md"

    --8<-- "../include-ja/waf/upgrade/details-about-dist-upgrade.md"
=== "CentOSまたはAmazon Linux 2.0.2021x以下"
    ```bash
    sudo yum update
    ```
=== "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
    ```bash
    sudo yum update
    ```

## ステップ3：postanalyticsモジュールの再起動

=== "Debian"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.xおよびAmazon Linux 2.0.2021x以下"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "AlmaLinux、Rocky Linux、Oracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

[Wallarm NGINXモジュールをアップグレードする][docs-module-update]