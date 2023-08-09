[statistics-service-all-parameters]:        ../admin-en/configure-statistics-service.md
[img-attacks-in-interface]:                 ../images/admin-guides/test-attacks-quickstart.png
[tarantool-status]:                         ../images/tarantool-status.png
[configure-proxy-balancer-instr]:           ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[sqli-attack-docs]:                         ../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                          ../attacks-vulns-list.md#crosssite-scripting-xss

# オールインワンインストーラーを使用してWallarmノードをアップグレードする

これらの手順では、[オールインワンインストーラー](../installation/nginx/all-in-one.md)を使用してインストールしたWallarmノード4.6.xをバージョン4.6.x+にアップグレードする手順を説明します。

## 要件

--8<-- "../include-ja/waf/installation/all-in-one-upgrade-requirements.md"

## アップグレード手順

フィルタリングノードとpostanalyticsモジュールがどのようにインストールされているかにより、アップグレード手順が異なります：

* [同じサーバー上](#filtering-node-and-postanalytics-on-the-same-server)：モジュールは一緒にアップグレードされます
* [異なるサーバー上](#filtering-node-and-postanalytics-on-different-servers)：**最初に** postanalyticsモジュールをアップグレードし、**次に** フィルタリングモジュールをアップグレードします

## 同じサーバー上のフィルタリングノードとpostanalytics

以下の手順を使用して、同じサーバー上にオールインワンインストーラーを使用してインストールされたフィルタリングノードとpostanalyticsモジュールを一度にアップグレードします。

### ステップ1：Wallarmトークンを準備する

ノードをアップグレードするには、[タイプの一つ](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation)のWallarmトークンが必要です。トークンを準備するには：

=== "APIトークン"

    1. Wallarm Consoleを開き、**設定** → **APIトークン**をクリックします、[USクラウド](https://us1.my.wallarm.com/settings/api-tokens)または[EUクラウド](https://my.wallarm.com/settings/api-tokens)。
    1. `Deploy`ソースロールを持つAPIトークンを見つけるか作成します。
    1. このトークンをコピーします。

=== "ノードトークン"

    アップグレードのために、インストール時に使用した同じノードトークンを使用します：

    1. Wallarm Consoleを開き、**ノード**を選択します、[USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)。
    1. 既存のノードグループで、ノードのメニュー→ **トークンをコピー**を使用してトークンをコピーします。

### ステップ2：最新版のWallarm一体型インストーラーをダウンロードする

--8<-- "../include-ja/waf/installation/all-in-one-installer-download.md"

### ステップ3：オールインワンWallarmインストーラーを実行する

--8<-- "../include-ja/waf/installation/all-in-one-installer-run.md"

### ステップ4：NGINXを再起動する

--8<-- "../include-ja/waf/installation/restart-nginx-systemctl.md"

### ステップ5：新しいノードの操作をテストする

新しいノードの操作をテストするには：

1. テスト[SQLI][sqli-attack-docs]と[XSS][xss-attack-docs]攻撃を含むリクエストを保護されたリソースアドレスに送信します：

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. Wallarm Consoleを開き、**イベント**セクションを選択します、[USクラウド](https://us1.my.wallarm.com/search)または[EUクラウド](https://my.wallarm.com/search)、攻撃がリストに表示されていることを確認します。
1. クラウドから新しいノードに保存されたデータ（ルール、IPリスト）が同期されると、ルールが期待通りに動作することを確認するためにテスト攻撃を実行します。

## 異なるサーバー上のフィルタリングノードとpostanalytics

!!! warning "フィルタリングノードとpostanalyticsモジュールのアップグレード手順の順序"
    フィルタリングノードとpostanalyticsモジュールが異なるサーバーにインストールされている場合、フィルタリングノードのパッケージを更新する前に、postanalyticsパッケージをアップグレードする必要があります。

### ステップ1：Wallarmトークンを準備する

ノードをアップグレードするには、[タイプの一つ](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation)のWallarmトークンが必要です。トークンを準備するには：

=== "APIトークン"

    1. Wallarm Consoleを開き、**設定** → **APIトークン**をクリックします、[USクラウド](https://us1.my.wallarm.com/settings/api-tokens)または[EUクラウド](https://my.wallarm.com/settings/api-tokens)。
    1. `Deploy`ソースロールを持つAPIトークンを見つけるか作成します。
    1. このトークンをコピーします。

=== "ノードトークン"

    アップグレードのために、インストール時に使用した同じノードトークンを使用します：

    1. Wallarm Consoleを開き、**ノード**を選択します、[USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)。
    1. 既存のノードグループで、ノードのメニュー→ **トークンをコピー**を使用してトークンをコピーします。

### ステップ2：最新版のWallarm一体型インストーラーをpostanalyticsマシンにダウンロードする

このステップは、postanalyticsマシンで実行されます。

--8<-- "../include-ja/waf/installation/all-in-one-installer-download.md"

### ステップ3：オールインワンWallarmインストーラーを実行してpostanalyticsをアップグレードする

このステップは、postanalyticsマシンで実行されます。

--8<-- "../include-ja/waf/installation/all-in-one-postanalytics.md"

### ステップ4：新しいバージョンのオールインワンのWallarmインストーラーをフィルタリングノードマシンにダウンロードする

このステップは、フィルタリングノードマシンで実行されます。

--8<-- "../include-ja/waf/installation/all-in-one-installer-download.md"

### ステップ5：オールインワンWallarmインストーラーを実行してフィルタリングノードをアップグレードする

このステップは、フィルタリングノードマシンで実行されます。

オールインワンインストーラーを使用してフィルタリングノードを別途アップグレードするには、次を使用します：

=== "APIトークン"
    ```bash
    # x86_64バージョンを使用している場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.12.x86_64-glibc.sh filtering

    # ARM64バージョンを使用している場合：
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.12.aarch64-glibc.sh filtering
    ```        

    `WALLARM_LABELS`変数はノードが追加されるグループを設定します（Wallarm Console UIでのノードの論理的なグルーピングに使用されます）。

=== "ノードトークン"
    ```bash
    # x86_64バージョンを使用している場合：
    sudo sh wallarm-4.6.12.x86_64-glibc.sh filtering

    # ARM64バージョンを使用している場合：
    sudo sh wallarm-4.6.12.aarch64-glibc.sh filtering
    ```

### ステップ6：フィルタリングノードと別々のpostanalyticsモジュールの相互作用を確認します

--8<-- "../include-ja/waf/installation/all-in-one-postanalytics-check.md"