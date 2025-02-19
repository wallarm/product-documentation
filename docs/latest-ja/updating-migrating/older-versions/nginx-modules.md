```markdown
[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[img-wl-console-users]:             ../../images/check-users.png 
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../installation/custom/custom-nginx-version.md
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:          ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                    ../../user-guides/ip-lists/overview.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[sqli-attack-docs]:                 ../../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../../attacks-vulns-list.md#crosssite-scripting-xss
[web-server-mirroring-examples]:    ../../installation/oob/web-server-mirroring/overview.md#configuration-examples-for-traffic-mirroring
[ip-lists-docs]:                     ../../user-guides/ip-lists/overview.md

# EOL Wallarm NGINXモジュールのアップグレード

本書の手順は、廃止されたWallarm NGINXモジュール（バージョン3.6以下）をバージョン5.0にアップグレードする方法を説明します。Wallarm NGINXモジュールは、以下のいずれかの手順に従ってインストールしたモジュールです：

* NGINX stable向けの個別パッケージ
* NGINX Plus向けの個別パッケージ
* ディストリビューション提供のNGINX向けの個別パッケージ

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! info "all-in-oneインストーラを使用したアップグレード"
    個別のLinuxパッケージは廃止されたため、Wallarmの[all-in-oneインストーラ](../../installation/nginx/all-in-one.md)を使用してアップグレードを実施します。この方法は、以前の方法と比較してアップグレード作業および継続的な展開メンテナンスを簡素化します。
    
    インストーラは自動的に以下の処理を実行します：

    1. OSとNGINXバージョンの確認。
    1. 検出されたOSとNGINXバージョンに対してWallarmリポジトリを追加。
    1. これらのリポジトリからWallarmパッケージのインストール。
    1. インストールされたWallarmモジュールをNGINXに接続。
    1. 提供されたトークンを使用してフィルタリングノードをWallarm Cloudに接続。

        個別のLinuxパッケージによる手動アップグレードはこれ以上サポートされません。

    ![All-in-one compared to manual](../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## EOLノードをアップグレードする旨をWallarmテクニカルサポートへ連絡

もし廃止されたWallarm NGINXモジュール（バージョン3.6以下）をバージョン5.0にアップグレードする場合は、その旨を[Wallarmテクニカルサポート](mailto:support@wallarm.com)に連絡し、支援を依頼してください。

その他の支援と合わせて、Wallarmアカウントに対して新しいIPリストロジックの有効化も依頼してください。新しいIPリストロジックが有効化された場合、Wallarm Consoleを開き、[**IP lists**](../../user-guides/ip-lists/overview.md)セクションが表示されることを確認してください。

## 必要要件

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## アップグレード手順

* フィルタリングノードとpostanalyticsモジュールが同一サーバーにインストールされている場合は、以下の手順に従って全てをアップグレードしてください。

    クリーンなマシンでall-in-oneインストーラを使用して新しいバージョンのノードを実行し、正常に動作することを確認後、以前のノードを停止し、トラフィックを以前のノードの代わりに新しいマシンへ流れるように設定する必要があります。

* フィルタリングノードとpostanalyticsモジュールが別々のサーバーにインストールされている場合は、**最初**にpostanalyticsモジュールをアップグレードし、**次に**これら[手順](separate-postanalytics.md)に従ってフィルタリングモジュールをアップグレードしてください。

## ステップ1：Threat Replay Testingモジュールの無効化（ノード2.16以下のアップグレードの場合）

Wallarmノード2.16以下をアップグレードする場合、Wallarm Consoleの → **Vulnerabilities** → **Configure**で[Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)モジュールを無効化してください。

アップグレードプロセス中にモジュールが動作すると[false positives](../../about-wallarm/protecting-against-attacks.md#false-positives)が発生する可能性があるため、モジュールを無効化することでリスクを最小限に抑えます。

## ステップ2：クリーンなマシンの準備

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## ステップ3：NGINXと依存関係のインストール

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## ステップ4：Wallarmトークンの準備

--8<-- "../include/waf/installation/all-in-one-token.md"

## ステップ5：all-in-one Wallarmインストーラのダウンロード

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## ステップ6：all-in-one Wallarmインストーラの実行

### フィルタリングノードとpostanalyticsが同一サーバーの場合

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

### フィルタリングノードとpostanalyticsが別々のサーバーの場合

!!! warning "フィルタリングノードとpostanalyticsモジュールのアップグレード手順の順序"
    フィルタリングノードとpostanalyticsモジュールが別々のサーバーにインストールされている場合、フィルタリングノードパッケージを更新する前にpostanalyticsパッケージをアップグレードする必要があります。

1. これら[手順](separate-postanalytics.md)に従ってpostanalyticsモジュールをアップグレードしてください。
1. フィルタリングノードをアップグレードしてください：

    === "APIトークン"
        ```bash
        # x86_64版を使用している場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh filtering

        # ARM64版を使用している場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh filtering
        ```        

        `WALLARM_LABELS`変数は、ノードを追加するグループを設定します（Wallarm Console上でのノードの論理グループ化に使用されます）。

    === "ノードトークン"
        ```bash
        # x86_64版を使用している場合:
        sudo sh wallarm-5.3.0.x86_64-glibc.sh filtering

        # ARM64版を使用している場合:
        sudo sh wallarm-5.3.0.aarch64-glibc.sh filtering
        ```

## ステップ7：以前のWallarmノードバージョンから5.0へのallowlistおよびdenylistの移行（ノード2.18以下のアップグレードのみ）

ノード2.18以下をアップグレードする場合、[migrate](../migrate-ip-lists-to-node-3.md)を参照して以前のWallarmノードバージョンから新しいバージョンへのallowlistおよびdenylistの設定を移行してください。

## ステップ8：古いノードマシンから新しいノードマシンへNGINXおよびpostanalyticsの設定を転送

古いマシン上の設定ファイルからノード関連のNGINX設定およびpostanalytics設定を新しいマシンのファイルへ転送してください。必要なディレクティブをコピーすることで実施できます。

**ソースファイル**

古いマシンでは、OSおよびNGINXバージョンに応じてNGINX設定ファイルの配置ディレクトリや名称が異なる場合があります。主に以下のものです：

* `/etc/nginx/conf.d/default.conf`：NGINXの設定
* `/etc/nginx/conf.d/wallarm-status.conf`：Wallarmノードの監視設定。詳細は[こちら][wallarm-status-instr]を参照してください。

また、postanalyticsモジュール（Tarantoolデータベース設定）の設定は通常以下に配置されています：

* `/etc/default/wallarm-tarantool`または
* `/etc/sysconfig/wallarm-tarantool`

**ターゲットファイル**

all-in-oneインストーラはOSとNGINXバージョンの組み合わせにより動作するため、新しいマシンの[ターゲットファイル](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)は名称や配置ディレクトリが異なる場合があります。

設定を転送する際、以下の手順を実施してください。

### 非推奨のNGINXディレクティブの名称変更

設定ファイルに明示的に指定されている場合、以下のNGINXディレクティブの名称を変更してください：

* `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
* `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
* `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

ディレクティブの名称のみを変更しており、ロジックは同一です。旧名称のディレクティブは近く非推奨となるため、事前に名称変更を推奨します。

### ノードのログ変数の更新

新しいノードバージョンでは、以下の[ノードログ変数](../../admin-en/configure-logging.md#filter-node-variables)の変更が実装されています：

* `wallarm_request_time`変数が`wallarm_request_cpu_time`に名称変更されました。

    変数名のみを変更しており、ロジックは同一です。旧名称も一時的にサポートされていますが、名称変更を推奨します。
* `wallarm_request_mono_time`変数が追加されました – 以下の合計値（
    * キュー内の時間
    * リクエスト処理においてCPUが費やした秒数
  ）のログ情報が必要な場合、ログ形式の設定に追加してください。

### 最新バージョンで変更されたWallarmノードのフィルトレーションモード設定の調整

1. 以下に記載される設定の期待動作が[フィルトレーションモード `off` と `monitoring` の変更されたロジック](what-is-new.md#filtration-modes)に対応していることを確認してください：
      * [ディレクティブ `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Consoleで設定される全般的なフィルトレーションルール](../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console)
      * [Wallarm Consoleで設定されるエンドポイント対象のフィルトレーションルール](../../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)
2. 期待される動作が変更後のフィルトレーションモードのロジックと一致しない場合は、[手順](../../admin-en/configure-wallarm-mode.md)に従ってフィルトレーションモードの設定を調整してください。

### `overlimit_res`攻撃検知設定のディレクティブからルールへの移行

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

### `wallarm-status.conf`ファイルの内容の更新

`/etc/nginx/conf.d/wallarm-status.conf`の内容を以下の通り更新してください：

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # フィルターノードサーバーのループバックアドレスのみアクセス可能  
  deny all;

  wallarm_mode off;
  disable_acl "on";   # リクエスト元のチェックが無効になっており、denylistに登録されたIPもwallarm-statusサービスにアクセス可能です。 https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location ~/wallarm-status$ {
    wallarm_status on;
  }
}
```

[統計サービスの設定の詳細](../../admin-en/configure-statistics-service.md)

### Wallarmブロッキングページの更新

新しいノードバージョンでは、Wallarmのサンプルブロッキングページが[変更されました](what-is-new.md#new-blocking-page)。ページ上のロゴおよびサポート用メールアドレスは、デフォルトでは空になっています。

もしブロックされたリクエストに対して返すために`/usr/share/nginx/html/wallarm_blocked.html`ページが設定されている場合は、[こちら](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)から新しいサンプルページをコピーし、カスタマイズしてください。

## ステップ9：APIポートの更新

--8<-- "../include/waf/upgrade/api-port-443.md"

## ステップ10：Threat Replay Testingモジュールの再有効化（ノード2.16以下のアップグレードの場合）

[Threat Replay Testingモジュール設定に関する推奨事項](../../vulnerability-detection/threat-replay-testing/setup.md)を確認し、必要に応じて再有効化してください。

しばらく経った後、モジュールの動作がfalse positivesを引き起こさないことを確認してください。false positivesが発生した場合は、[Wallarmテクニカルサポート](mailto:support@wallarm.com)に連絡してください。

## ステップ11：NGINXの再起動

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## ステップ12：Wallarmノードの動作テスト

新しいノードの動作をテストするには：

1. 保護対象のリソースアドレスに対して、テスト用の[SQLI][sqli-attack-docs]および[XSS][xss-attack-docs]攻撃リクエストを送信してください：

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. Wallarm Consoleの→**Attacks**セクションを[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)で開き、攻撃がリストに表示されることを確認してください。
1. Cloudに格納されたデータ（ルール、IPリスト）が新しいノードと同期されたら、設定したルールが期待通りに動作するかテスト攻撃を実施してください。

## ステップ13：Wallarmノードへのトラフィック送信の設定

利用しているデプロイメント方式に応じて、以下の設定を実施してください：

=== "インライン"
    ロードバランサーのターゲットを更新して、トラフィックをWallarmインスタンスへ送信するようにしてください。詳細はご利用のロードバランサーのドキュメントを参照してください。

    トラフィックを新しいノードへ完全にリダイレクトする前に、まず部分的にリダイレクトし、新しいノードが期待通りに動作するか確認することを推奨します。

=== "アウトオブバンド"
    Webまたはプロキシサーバー（例：NGINX、Envoy）を設定し、着信トラフィックをWallarmノードにミラーリングするようにしてください。設定詳細については、ご利用のWebまたはプロキシサーバーのドキュメントを参照することを推奨します。

    [こちら][web-server-mirroring-examples]に、最も一般的なWebおよびプロキシサーバー（NGINX、Traefik、Envoy）のサンプル設定例が記載されています。

## ステップ14：古いノードの削除

1. Wallarm Consoleの→**Nodes**で古いノードを選択し、**Delete**をクリックして削除してください。
1. 操作を確認してください。
    
    Cloudからノードが削除されると、アプリケーションへのリクエストのフィルトレーションが停止します。フィルタリングノードの削除は元に戻せません。ノードはノードリストから永久に削除されます。

1. 古いノードが稼働しているマシンを削除するか、もしくはWallarmノードコンポーネントのみを削除してください：

    === "Debian"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x以下"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```

## 設定のカスタマイズ

Wallarmモジュールはバージョン5.0に更新されます。以前のフィルタリングノードの設定は自動的に新しいバージョンに適用されます。追加の設定を行うには、[利用可能なディレクティブ](../../admin-en/configure-parameters-en.md)を使用してください。

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"
```