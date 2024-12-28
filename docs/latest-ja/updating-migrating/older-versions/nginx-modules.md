[wallarm-status-instr]: ../../admin-en/configure-statistics-service.md
[ptrav-attack-docs]: ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]: ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]: ../../admin-en/configure-wallarm-mode.md
[blocking-page-instr]: ../../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]: ../../admin-en/configure-logging.md
[proxy-balancer-instr]: ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]: ../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]: ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]: ../../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]: ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[img-wl-console-users]: ../../images/check-users.png 
[img-create-wallarm-node]: ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]: ../../installation/custom/custom-nginx-version.md
[nginx-process-time-limit-docs]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]: ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]: ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]: ../../user-guides/ip-lists/graylist.md

# EOL Wallarm NGINXモジュールのアップグレード

これらの手順では、Wallarm NGINXモジュールのエンドオブライフ（バージョン3.6以下）をバージョン4.4にアップグレードする方法について説明しています。 Wallarm NGINXモジュールは、次の手順のいずれかに従ってインストールされたモジュールです。

* [NGINX `stable`モジュール](../../installation/nginx/dynamic-module.md)
* [CentOS/DebianリポジトリからのNGINXモジュール](../../installation/nginx/dynamic-module-from-distr.md)
* [NGINX Plusモジュール](../../installation/nginx-plus.md)

--8<-- "../include-ja/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## 要件

--8<-- "../include-ja/waf/installation/requirements-docker-nginx-4.0.md"

## アップグレード手順

* フィルタリングノードとpostanalyticsモジュールが同じサーバにインストールされている場合、以下の手順に従ってすべてのパッケージをアップグレードしてください。
* フィルタリングノードとpostanalyticsモジュールが異なるサーバにインストールされている場合、まずこれらの[手順](separate-postanalytics.md)に従ってpostanalyticsモジュールをアップグレードし、次に以下の手順をフィルタリングノードモジュールに実行してください。

## ステップ1: フィルタリングノードモジュールをアップグレードしていることをWallarm技術サポートに通知する（ノード2.18以降をアップグレードする場合のみ）

ノード2.18以前をアップグレードする場合は、フィルタリングノードモジュールを最新バージョンに更新していることを[Wallarm技術サポート](mailto:support@wallarm.com)に通知し、Wallarmアカウント用に新しいIPリストロジックを有効にしてもらいます。新しいIPリストロジックが有効になったら、Wallarmコンソールを開き、[**IPリスト**](../../user-guides/ip-lists/overview.md)セクションが利用できることを確認してください。

## ステップ2: アクティブな脅威検証モジュールを無効にする（ノード2.16以前をアップグレードする場合のみ）

Wallarmノード2.16以前をアップグレードする場合は、Wallarmコンソール → **スキャナー** → **設定**で、 [アクティブな脅威検証](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)モジュールを無効にしてください。

モジュールの動作は、アップグレードプロセス中に[誤検出](../../about-wallarm/protecting-against-attacks.md#false-positives)を引き起こす可能性があります。モジュールを無効にすることで、このリスクが最小限に抑えられます。

## ステップ3: APIポートを更新する

--8<-- "../include-ja/waf/upgrade/api-port-443.md"

## ステップ4: NGINXを最新バージョンにアップグレードする

適切な手順を使用して、NGINXを最新バージョンにアップグレードします。

=== "NGINX stable"

    DEBベースのディストリビューション:

    ```bash
    sudo apt update
    sudo apt -y install nginx
    ```

    RPMベースのディストリビューション:

    ```bash
    sudo yum update
    sudo yum install -y nginx
    ```
=== "NGINX Plus"
    NGINX Plusの場合は、[公式アップグレード手順](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/#upgrading-nginx-plus)に従ってください。
=== "NGINX from Debian/CentOS repository"
    [CentOS/DebianリポジトリからインストールされたNGINX](../../installation/nginx/dynamic-module-from-distr.md)の場合は、この手順をスキップしてください。インストールされたNGINXのバージョンは、[後で](#step-7-upgrade-wallarm-packages) Wallarmモジュールと共にアップグレードされます。

あなたのインフラがNGINXの特定のバージョンを使用する必要がある場合は、[Wallarm技術サポート](mailto:support@wallarm.com)にNGINXのカスタムバージョン用のWallarmモジュールを作成してもらってください。

## ステップ5: 新しいWallarmリポジトリの追加

以前のWallarmリポジトリアドレスを削除し、新しいWallarmノードバージョンパッケージを含むリポジトリを追加します。適切なプラットフォームのコマンドを使用してください。

**CentOSおよびAmazon Linux 2.0.2021xおよびそれ以前のバージョン**

=== "CentOS 7およびAmazon Linux 2.0.2021xおよびそれ以前のバージョン"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
    ```
=== "CentOS 8"
    !!! warning "CentOS 8.xのサポートは非推奨です"
        CentOS 8.xのサポートは[非推奨](https://www.centos.org/centos-linux-eol/)です。代わりにAlmaLinux、Rocky Linux、またはOracle Linux 8.xオペレーティングシステムにWallarmノードをインストールできます。

        * [NGINX `stable`のインストール手順](../../installation/nginx/dynamic-module.md)
        * [CentOS/DebianリポジトリからのNGINXのインストール手順](../../installation/nginx/dynamic-module-from-distr.md)
        * [NGINX Plusのインストール手順](../../installation/nginx-plus.md)
=== "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm
    ```

**DebianおよびUbuntu**

1. インストールされたテキストエディターでWallarmリポジトリアドレスのファイルを開きます。これらの手順では**vim**が使用されています。

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. 以前のリポジトリアドレスをコメントアウトまたは削除してください。
3. 新しいリポジトリアドレスを追加します。

    === "Debian 10.x (buster)"
        !!! warning "NGINX安定版およびNGINX Plusではサポートされていません。"
            公式のNGINXバージョン（安定版およびPlus）およびその結果としてのWallarmノード4.4以降は、Debian 10.x（buster）にインストールできません。[Debian/CentOSリポジトリからインストールされたNGINX](../../installation/nginx/dynamic-module-from-distr.md)を使用する場合のみ、このOSを使用してください。

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

## ステップ6: 以前のWallarmノードバージョンから4.4への許可リストと拒否リストを移行する（ノード2.18以りにアップグレードする場合のみ）

ノード2.18以前をアップグレードする場合は、以前のWallarmノードバージョンから最新バージョンへの許可リストと拒否リストの設定を[移行](../migrate-ip-lists-to-node-3.md)してください。

## ステップ7: Wallarmパッケージをアップグレードする### 同じサーバー上のフィルタリングノードとpostanalytics

フィルタリングノードとpostanalyticsモジュールをアップグレードするには、次のコマンドを実行してください。

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
=== "CentOS または Amazon Linux 2.0.2021x 以下"
    ```bash
    sudo yum update
    ```
=== "AlmaLinux, Rocky Linux または Oracle Linux 8.x"
    ```bash
    sudo yum update
    ```

### 異なるサーバー上のフィルタリングノードとpostanalytics

!!! warning "フィルタリングノードとpostanalyticsモジュールをアップグレードする手順の順序"
    フィルタリングノードとpostanalyticsモジュールが別々のサーバーにインストールされている場合、フィルタリングノードのパッケージを更新する前にpostanalyticsのパッケージをアップグレードする必要があります。

1. [指示](separate-postanalytics.md)に従ってpostanalyticsパッケージをアップグレードします。
2. Wallarmノードパッケージをアップグレードします：

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
    === "CentOS または Amazon Linux 2.0.2021x 以下"
        ```bash
        sudo yum update
        ```
    === "AlmaLinux, Rocky Linux または Oracle Linux 8.x"
        ```bash
        sudo yum update
        ```
3. パッケージマネージャが設定ファイル `/etc/cron.d/wallarm-node-nginx` の内容を書き換えることについて確認を求める場合：

    1. [IPリストの移行](#step-6-migrate-allowlists-and-denylists-from-previous-wallarm-node-version-to-42)が完了していることを確認します。
    2. オプション `Y` を使用してファイルの書き換えを確認します。

        パッケージマネージャは、ファイル `/etc/cron.d/wallarm-node-nginx` が前のWallarmノードバージョンで[変更されていた場合](/2.18/admin-en/configure-ip-blocking-nginx-en/)、書き換えの確認を求めます。Wallarmノード3.xでIPリストロジックが変更されたため、 `/etc/cron.d/wallarm-node-nginx` の内容もそれに応じて更新されました。IPアドレスのdenylistが正しく動作するためには、Wallarmノード3.xでは更新された設定ファイルを使用する必要があります。

        パッケージマネージャはデフォルトでオプション `N` を使用しますが、Wallarmノード3.xでの正しいIPアドレスdenylistの動作にはオプション `Y` が必要です。

## ステップ8：ノードタイプの更新

デプロイされたノードは、廃止された **regular** タイプで、[新しい**Wallarmノード**タイプに置き換えられました](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens)。

バージョン4.4への移行中に、廃止されたタイプの代わりに新しいノードタイプをインストールすることが推奨されます。通常のノードタイプは将来のリリースで削除されるため、前もって移行してください。

!!! info "postanalyticsモジュールが別のサーバーにインストールされている場合"
    トラフィック処理の初期段階とpostanalyticsモジュールが別のサーバーにインストールされている場合は、これらのモジュールを同じノードトークンを使用してWallarmクラウドに接続することを推奨します。WallarmコンソールUIは、各モジュールを別のノードインスタンスとして表示します。例えば：

    ![ノードにいくつかのインスタンスがある](../../images/user-guides/nodes/wallarm-node-with-two-instances.png)

    Wallarmノードは、[別のpostanalyticsモジュールのアップグレード](separate-postanalytics.md)中にすでに作成されています。初期のトラフィック処理モジュールを同じノード資格情報を使用してクラウドに接続するには：

    1. 別のpostanalyticsモジュールのアップグレード中に生成されたノードトークンをコピーします。
    1. 以下のリストの4番目の手順に進みます。

通常のノードをWallarmノードに置き換えるには：

1. WallarmアカウントにWallarmコンソールで **Administrator** 役割が有効になっていることを確認します。
    
    設定については、[USクラウド](https://us1.my.wallarm.com/settings/users)または[EUクラウド](https://my.wallarm.com/settings/users)でユーザーリストに移動してチェックできます。

    ![Wallarmコンソールのユーザーリスト][img-wl-console-users]
2. [USクラウド](https://us1.my.wallarm.com/nodes)または [EUクラウド](https://my.wallarm.com/nodes) の Wallarmコンソール → **ノード** を開き、**Wallarmノード**タイプのノードを作成します。

    ![Wallarmノードの作成][img-create-wallarm-node]
3. 生成されたトークンをコピーします。
4. 古いバージョンのノードがあるサーバーでNGINXサービスを一時停止します：

    === "Debian"
        ```bash
        sudo systemctl stop nginx
        ```
    === "Ubuntu"
        ```bash
        sudo service nginx stop
        ```
    === "CentOS または Amazon Linux 2.0.2021x 以下"
        ```bash
        sudo systemctl stop nginx
        ```
    === "AlmaLinux, Rocky Linux または Oracle Linux 8.x"
        ```bash
        sudo systemctl stop nginx
        ```

    RPSの計算が不正確になるリスクを軽減するために、NGINXサービスを一時停止しています。
5. **Wallarmノード**を実行するために `register-node` スクリプトを実行します。

    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com --force
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> --force
        ```
    
    * `<NODE_TOKEN>`はWallarmノードのトークンです。
    * `--force`オプションは、`/etc/wallarm/node.yaml`ファイルに指定されたWallarmクラウドアクセス資格情報の書き換えを強制します。

## ステップ9：Wallarmブロッキングページの更新

新しいノードバージョンでは、Wallarmサンプルブロックページが[変更されました](what-is-new.md#new-blocking-page)。ページ上のロゴとサポートメールがデフォルトで空になりました。

ページ `&/usr/share/nginx/html/wallarm_blocked.html` がブロックされたリクエストに対する応答として返されるように設定されていた場合、[新しいサンプルページのコピーとカスタマイズ](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)を行ってください。

## ステップ10：非推奨のNGINXディレクティブの名称変更

設定ファイルで明示的に指定されている場合、以下のNGINXディレクティブの名称を変更します：

* `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
* `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
* `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

ディレクティブの名称だけを変更し、ロジックはそのままです。旧名のディレクティブは間もなく廃止されるため、事前に名称を変更することをお勧めします。

## ステップ11：ノードのログ記録変数の更新

新しいノードバージョンでは、[ノードのログ記録変数](../../admin-en/configure-logging.md#filter-node-variables)について以下の変更が実施されました：

* `wallarm_request_time`変数は `wallarm_request_cpu_time` に名称変更されました。

    変数名だけを変更し、ロジックはそのままです。古い名前も一時的にサポートされていますが、それでも変数の名前を変更することをお勧めします。
* `wallarm_request_mono_time`変数が追加されました。構成のログ形式に配置し、以下の合計についてログ情報が必要な場合：

    * キュー内の時間
    * CPUがリクエストの処理に費やした秒数## ステップ 12: 最新バージョンでリリースされた変更に対応してWallarmノードのフィルタリングモード設定を調整する

1. 以下に記載された設定の予想される動作が、[`off` および `monitoring` フィルタリングモードの変更されたロジック](what-is-new.md#filtration-modes)に対応していることを確認してください:
      * [ディレクティブ `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarmコンソールで構成された一般的なフィルタリングルール](../../admin-en/configure-wallarm-mode.md)
      * [Wallarmコンソールで構成された低レベルのフィルタリングルール](../../admin-en/configure-wallarm-mode.md)
2. 予想される動作が変更されたフィルタリングモードのロジックに対応していない場合は、[手順](../../admin-en/configure-wallarm-mode.md)に従って、リリースされた変更にフィルタリングモード設定を調整してください。

## ステップ 13: `overlimit_res` アタック検出設定をディレクティブからルールに転送する

--8<-- "../include-ja/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

## ステップ 14: `wallarm-status.conf`ファイルの内容を更新する

`/etc/nginx/conf.d/wallarm-status.conf`の内容を以下のように更新します:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # フィルター・ノード・サーバーのループバック・アドレスのみアクセス可能
  deny all;

  wallarm_mode off;
  disable_acl "on";   # リクエストソースのチェックが無効化され、ブラックリストに登録されたIPはwallarm-statusサービスをリクエストできます。https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location ~/wallarm-status$ {
    wallarm_status on;
  }
}
```

[統計サービス構成の詳細](../../admin-en/configure-statistics-service.md)

## ステップ 15: NGINXを再起動する

--8<-- "../include-ja/waf/restart-nginx-3.6.md"

## ステップ 16: Wallarmノード動作をテストする

--8<-- "../include-ja/waf/installation/test-after-node-type-upgrade.md"

## ステップ 17: アクティブな脅威検証モジュールを再度有効化する（ノード 2.16 以下をアップグレードする場合のみ）

[アクティブな脅威検証モジュールのセットアップに関する推奨事項](../../vulnerability-detection/threat-replay-testing/setup.md) を学び、必要に応じて再度有効にしてください。

しばらくして、モジュールの動作が誤検知を引き起こさないことを確認してください。誤検知がある場合は、[Wallarmの技術サポート](mailto:support@wallarm.com)に連絡してください。

## ステップ 18: 前のバージョンのノードを削除する

新しいノードの動作が適切にテストされたら、Wallarmコンソールの **Nodes** セクションを開いて、前のバージョンの通常ノードをリストから削除してください。

postanalyticsモジュールが別のサーバーにインストールされている場合は、このモジュールに関連するノードインスタンスも削除してください。

## 設定のカスタマイズ

Wallarmモジュールはバージョン4.4に更新されます。以前のフィルタリングノード設定は新しいバージョンに自動的に適用されます。追加の設定を行うには、[使用可能なディレクティブ](../../admin-en/configure-parameters-en.md)を使用してください。

--8<-- "../include-ja/waf/installation/common-customization-options-nginx-4.4.md"
