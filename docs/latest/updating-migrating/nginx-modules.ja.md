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
[img-create-wallarm-node]:          ../images/user-guides/nodes/create-cloud-node.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md

# Wallarm NGINXモジュールのアップグレード

これらの手順では、Wallarm NGINXモジュール4.xをバージョン4.4にアップグレードする方法を説明しています。Wallarm NGINXモジュールとは、次のいずれかの手順に従ってインストールされたモジュールです。

* [NGINX `stable`モジュール](../installation/nginx/dynamic-module.md)
* [CentOS/DebianリポジトリからのNGINXモジュール](../installation/nginx/dynamic-module-from-distr.md)
* [NGINX Plusモジュール](../installation/nginx-plus.md)

廃止されたノード（3.6以下）をアップグレードする場合は、[別の手順](older-versions/nginx-modules.md)を使用してください。

## 要件

--8<-- "../include/waf/installation/requirements-docker-4.0.ja.md"

## アップグレード手順

* フィルタリングノードとpostanalyticsモジュールが同じサーバーにインストールされている場合は、以下の手順に従ってすべてのパッケージをアップグレードしてください。
* フィルタリングノードとpostanalyticsモジュールが別々のサーバーにインストールされている場合は、**最初に**postanalyticsモジュールを[こちら](separate-postanalytics.md)に従ってアップグレードし、次に下記の手順でフィルタリングノードモジュールを行ってください。

## ステップ1: 最新バージョンのNGINXへのアップグレード

適切な手順を使用して、NGINXを最新バージョンにアップグレードします。

=== "NGINX stable"

    DEBベースのディストリビューション

    ```bash
    sudo apt update
    sudo apt -y install nginx
    ```

    RPM-ベースのディストリビューション

    ```bash
    sudo yum update
    sudo yum install -y nginx
    ```
=== "NGINX Plus"
    NGINX Plusの場合は、[公式アップグレード手順](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/#upgrading-nginx-plus)に従ってください。
=== "Debian/CentOSリポジトリからのNGINX"
    Debian/CentOSリポジトリから[インストールされたNGINXの場合](../installation/nginx/dynamic-module-from-distr.md)は、このステップをスキップしてください。インストールされたNGINXバージョンは、[後で](#step-4-upgrade-wallarm-packages) Wallarmモジュールと一緒にアップグレードされます。

インフラストラクチャに特定のバージョンのNGINXを使用する必要がある場合は、[Wallarm技術サポート](mailto:support@wallarm.com)に連絡して、カスタムバージョンのNGINX用のWallarmモジュールを作成してください。

## ステップ2: 新しいWallarmリポジトリを追加

以前のWallarmリポジトリアドレスを削除し、新しいWallarmノードバージョンパッケージを含むリポジトリを追加します。適切なプラットフォームのコマンドを使用してください。

**CentOSおよびAmazon Linux 2.0.2021x以下**

=== "CentOS 7およびAmazon Linux 2.0.2021x以下"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
    ```

=== "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm
    ```

**DebianおよびUbuntu**

1. インストールされたテキストエディタでWallarmリポジトリアドレスのファイルを開きます。これらの手順では、**vim**が使用されています。

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. 以前のリポジトリアドレスをコメントアウトまたは削除します。
3. 新しいリポジトリアドレスを追加します：

    === "Debian 10.x (buster)"
        !!! warning "NGINX stableおよびNGINX Plusによってサポートされていません"
            公式のNGINXバージョン（stableおよびPlus）およびその結果としてのWallarmノード4.4以上は、Debian 10.x（buster）にインストールできません。[Debian/CentOSリポジトリからNGINXがインストールされている場合](../installation/nginx/dynamic-module-from-distr.md)のみ、このOSを使用してください。

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

## ステップ3: Wallarmパッケージのアップグレード

### 同じサーバー上のフィルタリングノードとpostanalytics

1. 以下のコマンドを実行して、フィルタリングノードとpostanalyticsモジュールをアップグレードします。

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
    === "CentOSまたはAmazon Linux 2.0.2021x以下"
        ```bash
        sudo yum update
        ```
    === "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        sudo yum update
        ```
2. パッケージマネージャが`/etc/cron.d/wallarm-node-nginx`の設定ファイルの内容を書き換えることを確認する必要がある場合は、オプション`Y`を送信します。

    `/etc/cron.d/wallarm-node-nginx`の内容が新しいスクリプトのRPSカウントにダウンロードされるように更新する必要があります。

    パッケージマネージャはデフォルトでオプション`N`を使用しますが、適切なRPSカウントにはオプション`Y`が必要です。フィルタリングノードとpostanalyticsを別々のサーバーで動作させる

!!! warning "フィルタリングノードとpostanalyticsモジュールのアップグレード手順"
    フィルタリングノードとpostanalyticsモジュールが別々のサーバーにインストールされている場合、フィルタリングノードのパッケージを更新する前に、postanalyticsのパッケージを更新する必要があります。

1. これらの[手順](separate-postanalytics.md)に従って、postanalyticsパッケージをアップグレードします。
2. Wallarmノードパッケージをアップグレードします:

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
    === "CentOSまたはAmazon Linux 2.0.2021x以前"
        ```bash
        sudo yum update
        ```
    === "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        sudo yum update
        ```
3. パッケージマネージャーが、設定ファイル `/etc/cron.d/wallarm-node-nginx` の内容を書き換えることを確認してくる場合は、`Y` オプションを送信してください。

    新しいスクリプトでRPSをカウントするために、 `/etc/cron.d/wallarm-node-nginx` の内容を更新する必要があります。

    デフォルトでは、パッケージマネージャーは `N` オプションを使用しますが、正しい RPS カウントには `Y` オプションが必要です。

## ステップ4: NGINXの再起動

--8<-- "../include/waf/restart-nginx-3.6.ja.md"

## ステップ5: Wallarmノードの動作確認

--8<-- "../include/waf/installation/test-waf-operation-no-stats.ja.md"

## 設定のカスタマイズ

Wallarmモジュールがバージョン4.4に更新されます。以前のフィルタリングノードの設定は、新しいバージョンに自動的に適用されます。追加の設定を行うには、[利用可能なディレクティブ](../admin-en/configure-parameters-en.md)を使用してください。

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.ja.md"