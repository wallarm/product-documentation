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

# EOLのWallarm NGINXモジュールのアップグレード

本手順では、サポート終了のWallarm NGINXモジュール(バージョン3.6以下)を最新のバージョン6.xにアップグレードする手順を説明します。Wallarm NGINXモジュールとは、以下のいずれかの手順に従ってインストールされたモジュールです。

* NGINX stable向け個別パッケージ
* NGINX Plus向け個別パッケージ
* ディストリビューション提供のNGINX向け個別パッケージ

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! info "all-in-oneインストーラーでのアップグレード"
    個別のLinuxパッケージは非推奨となったため、アップグレードはWallarmの[all-in-oneインストーラー](../../installation/nginx/all-in-one.md)で実施します。この方法は、以前の方式に比べてアップグレード作業と継続的なデプロイ保守を簡素化します。
    
    インストーラーは以下を自動で実行します。

    1. OSとNGINXのバージョンを確認します。
    1. 検出したOSとNGINXバージョン向けのWallarmリポジトリを追加します。
    1. これらのリポジトリからWallarmパッケージをインストールします。
    1. インストールしたWallarmモジュールをNGINXに接続します。
    1. 提供されたトークンを使用してフィルタリングノードをWallarm Cloudに接続します。

        個別Linuxパッケージによる手動アップグレードは今後サポートされません。

    ![手動とall-in-oneの比較](../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## EOLノードをアップグレードする旨をWallarmテクニカルサポートに連絡してください

サポート終了のWallarm NGINXモジュール(バージョン3.6以下)をバージョン6.xにアップグレードする場合は、[Wallarmテクニカルサポート](mailto:support@wallarm.com)に連絡し、支援を依頼してください。

その他の支援に加えて、アカウントに新しいIP listsロジックを有効化するよう依頼してください。新しいIP listsロジックが有効化されたら、Wallarm Consoleを開き、セクション[**IP lists**](../../user-guides/ip-lists/overview.md)が利用可能であることを確認してください。

## 要件

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## アップグレード手順

* フィルタリングノードとpostanalyticsモジュールが同一サーバーにインストールされている場合は、以下の手順に従って両方をアップグレードしてください。

    クリーンなマシンでall-in-oneインストーラーを使用して新しいバージョンのノードを起動し、動作をテストし、旧ノードを停止して、トラフィックが旧マシンではなく新マシンを経由するように設定する必要があります。

* フィルタリングノードとpostanalyticsモジュールが別サーバーにインストールされている場合は、**最初に**postanalyticsモジュールを、**次に**フィルタリングモジュールをこれらの[手順](separate-postanalytics.md)に従ってアップグレードしてください。

## ステップ1: Threat Replay Testingモジュールを無効化します(ノード2.16以下をアップグレードする場合)

Wallarmノード2.16以下をアップグレードする場合は、Wallarm Console → **Vulnerabilities** → **Configure**で[Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)モジュールを無効化してください。

アップグレード中にモジュールの動作が[誤検知](../../about-wallarm/protecting-against-attacks.md#false-positives)を引き起こす可能性があります。モジュールを無効化すると、このリスクを最小化できます。

## ステップ2: クリーンなマシンを準備します

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## ステップ3: NGINXと依存関係をインストールします

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## ステップ4: Wallarmトークンを準備します

--8<-- "../include/waf/installation/all-in-one-token.md"

## ステップ5: all-in-oneのWallarmインストーラーをダウンロードします

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## ステップ6: all-in-oneのWallarmインストーラーを実行します

### フィルタリングノードとpostanalyticsが同一サーバー上にある場合

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

### フィルタリングノードとpostanalyticsが別サーバーの場合

!!! warning "フィルタリングノードとpostanalyticsモジュールをアップグレードする手順の順序"
    フィルタリングノードとpostanalyticsモジュールが別サーバーにインストールされている場合は、フィルタリングノードのパッケージを更新する前にpostanalyticsパッケージをアップグレードする必要があります。

1. これらの[手順](separate-postanalytics.md)に従ってpostanalyticsモジュールをアップグレードします。
1. フィルタリングノードをアップグレードします:

    === "APIトークン"
        ```bash
        # x86_64版を使用する場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.4.1.x86_64-glibc.sh filtering

        # ARM64版を使用する場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.4.1.aarch64-glibc.sh filtering
        ```        

        `WALLARM_LABELS`変数は、ノードが追加されるグループを設定します(Wallarm Console UIでノードを論理的にグルーピングするために使用します)。

    === "Nodeトークン"
        ```bash
        # x86_64版を使用する場合:
        sudo sh wallarm-6.4.1.x86_64-glibc.sh filtering

        # ARM64版を使用する場合:
        sudo sh wallarm-6.4.1.aarch64-glibc.sh filtering
        ```

## ステップ7: 以前のWallarmノードのバージョンから6.xへallowlistとdenylistを移行します(ノード2.18以下をアップグレードする場合のみ)

ノード2.18以下をアップグレードする場合は、以前のWallarmノードバージョンから最新バージョンへallowlist/denylist設定を[移行](../migrate-ip-lists-to-node-3.md)してください。

## ステップ8: 旧ノードのマシンから新しいマシンへNGINXおよびpostanalyticsの設定を移行します

必要なディレクティブまたはファイルをコピーして、旧マシンから新マシンへノード関連のNGINXおよびpostanalytics設定を移行します。

* `http`レベルのNGINX設定が記述された`/etc/nginx/conf.d/default.conf`または`/etc/nginx/nginx.conf`

    フィルタリングノードとpostanalyticsノードが別サーバーにある場合は、フィルタリングノードのマシン上の`/etc/nginx/nginx.conf`の`http`ブロックで、`wallarm_tarantool_upstream`を[`wallarm_wstore_upstream`](../../admin-en/configure-parameters-en.md#wallarm_wstore_upstream)にリネームしてください。
* トラフィックルーティングのためのNGINXおよびWallarm設定が記述された`/etc/nginx/sites-available/default`
* `/etc/nginx/conf.d/wallarm-status.conf` → 新しいマシン上の`/etc/nginx/wallarm-status.conf`にコピー

    詳細説明は[リンク][wallarm-status-instr]内にあります。
* `/etc/wallarm/node.yaml` → 新しいマシン上の`/opt/wallarm/etc/wallarm/node.yaml`にコピー

    別のpostanalyticsサーバーでカスタムのホストとポートを使用している場合は、postanalyticsノードのマシン上で、コピーしたファイル内の`tarantool`セクションを`wstore`にリネームしてください。

### 非推奨のNGINXディレクティブをリネームします

設定ファイルで明示的に指定している場合は、以下のNGINXディレクティブをリネームしてください。

* `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
* `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
* `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)
* `wallarm_tarantool_upstream` → [`wallarm_wstore_upstream`](../../admin-en/configure-parameters-en.md#wallarm_wstore_upstream)

ディレクティブ名のみを変更しており、ロジックは変わりません。旧名称のディレクティブはまもなく非推奨になりますので、事前にリネームしておくことをおすすめします。

### ノードのログ変数を更新します

新しいノードバージョンでは、[ノードのログ変数](../../admin-en/configure-logging.md#filter-node-variables)に以下の変更が加えられています。

* 変数`wallarm_request_time`は`wallarm_request_cpu_time`にリネームされました。

    変数名のみを変更しており、ロジックは変わりません。旧名も一時的にサポートされますが、変数のリネームを推奨します。
* 変数`wallarm_request_mono_time`が追加されました。以下の合計である総時間に関するログ情報が必要な場合は、ログフォーマットの設定に含めてください。

    * キュー内の時間
    * CPUがリクエスト処理に費やした秒数

### 最新バージョンで提供された変更に合わせてWallarmノードのフィルタリングモード設定を調整します

1. 以下の設定の期待される動作が、[「off」と「monitoring」フィルタリングモードの変更されたロジック](what-is-new.md#filtration-modes)に合致していることを確認してください。
      * [ディレクティブ`wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Consoleで設定する全体フィルタリングルール](../../admin-en/configure-wallarm-mode.md#general-filtration-mode)
      * [Wallarm Consoleで設定するエンドポイント単位のフィルタリングルール](../../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)
2. 期待される動作が変更後のフィルタリングモードのロジックに一致しない場合は、[手順](../../admin-en/configure-wallarm-mode.md)に従って設定を調整してください。

### `overlimit_res`攻撃検出の設定をディレクティブからルールへ移行します

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

### `wallarm-status.conf`ファイルの内容を更新します

`/etc/nginx/conf.d/wallarm-status.conf`の内容を次のように更新してください。

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.8/8;   # フィルタリングノードサーバーのループバックアドレスからのみアクセス可能
  deny all;

  wallarm_mode off;
  disable_acl "on";   # リクエスト送信元のチェックを無効化します。denylist上のIPでもwallarm-statusサービスへのリクエストが許可されます。 https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  wallarm_enable_apifw off;
  access_log off;

  location ~/wallarm-status$ {
    wallarm_status on;
  }
}
```

[統計サービスの設定の詳細](../../admin-en/configure-statistics-service.md)

### Wallarmのブロッキングページを更新します

新しいノードバージョンでは、Wallarmのサンプルブロッキングページが[変更されました](what-is-new.md#new-blocking-page)。ページ上のロゴとサポートメールはデフォルトで空になりました。

`&/usr/share/nginx/html/wallarm_blocked.html`のページをブロック時のレスポンスとして返すように設定している場合は、新しいサンプルページを[コピーしてカスタマイズ](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)してください。

## ステップ9: APIポートを更新します

--8<-- "../include/waf/upgrade/api-port-443.md"

## ステップ10: Threat Replay Testingモジュールを再有効化します(ノード2.16以下をアップグレードする場合のみ)

[Threat Replay Testingモジュールの設定に関する推奨](../../vulnerability-detection/threat-replay-testing/setup.md)を確認し、必要に応じて再有効化してください。

しばらくしてから、モジュールの動作で誤検知が発生していないことを確認してください。誤検知が発生する場合は、[Wallarmテクニカルサポート](mailto:support@wallarm.com)にご連絡ください。

## ステップ11: NGINXを再起動します

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## ステップ12: Wallarmノードの動作をテストします

新しいノードの動作をテストするには、次を実施します。

1. 保護対象のリソースアドレスにテスト用の[SQLI][sqli-attack-docs]および[XSS][xss-attack-docs]攻撃を含むリクエストを送信します。

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. [US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)のWallarm Console → **Attacks**セクションを開き、攻撃が一覧に表示されていることを確認します。
1. Cloudに保存されているデータ(ルール、IP lists)が新しいノードに同期されたら、いくつかテスト攻撃を行い、ルールが期待どおりに動作することを確認します。

## ステップ13: トラフィックをWallarmノードへ送信するように構成します

ロードバランサーの転送先を更新して、トラフィックをWallarmインスタンスに送信するようにします。詳細はご使用のロードバランサーのドキュメントを参照してください。

トラフィックを新しいノードへ完全に切り替える前に、まずは一部のみを切り替え、新しいノードが期待どおりに動作することを確認することを推奨します。

## ステップ14: 旧ノードを削除します

1. Wallarm Console → **Nodes**で対象のノードを選択し、**Delete**をクリックして旧ノードを削除します。
1. 操作を確認します。
    
    ノードがCloudから削除されると、アプリケーションへのリクエストのフィルタリングは停止します。フィルタリングノードの削除は元に戻せません。ノードはノード一覧から完全に削除されます。

1. 旧ノードのマシンを削除するか、そのマシンからWallarmノードコンポーネントを削除します。

    === "Debian"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```

## 設定のカスタマイズ

Wallarmモジュールはバージョン6.xに更新されます。以前のフィルタリングノードの設定は新しいバージョンに自動的に適用されます。追加の設定が必要な場合は、[利用可能なディレクティブ](../../admin-en/configure-parameters-en.md)を使用してください。

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"