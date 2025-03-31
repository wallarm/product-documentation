---
search:
  exclude: true
---

[img-wl-console-users]:             ../../../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-proxy-balancer-instr]:   ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../../../admin-en/installation-postanalytics-en/
[dynamic-dns-resolution-nginx]:     ../../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../../../faq/nginx-compatibility.md#is-wallarm-filtering-node-compatible-with-the-custom-build-of-nginx
[node-token]:                       ../../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[platform]:                         ../../../supported-deployment-options.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[oob-advantages-limitations]:       ../../../oob/overview.md#limitations
[web-server-mirroring-examples]:    ../../../oob/web-server-mirroring/overview.md#configuration-examples-for-traffic-mirroring
[download-aio-step]:                #step-3-download-all-in-one-wallarm-installer
[enable-traffic-analysis-step]:     #step-5-enable-wallarm-node-to-analyze-traffic
[restart-nginx-step]:               #step-6-restart-nginx
[separate-postanalytics-installation-aio]:  ../../../../admin-en/installation-postanalytics-en.md
[api-spec-enforcement-docs]:        ../../../../api-specification-enforcement/overview.md
[link-wallarm-health-check]:        ../../../../admin-en/uat-checklist-en.md

# All-in-Oneインストーラーによるデプロイ

これらの手順は、さまざまな環境においてNGINXの動的モジュールとしてWallarmノードをインストールするプロセスの効率化と標準化を目的とした、[OOB](../overview.md)動的モジュールとしてWallarmをインストールするための**all-in-one installer**を使用した手順を説明します。このインストーラーは、使用しているオペレーティングシステムおよびNGINXのバージョンを自動的に識別し、必要な依存関係をすべてインストールします。

**all-in-one installer**は、以下の動作を自動的に実行することにより、シンプルなノードのインストールプロセスを提供します：

1. OSおよびNGINXのバージョンを確認します。
1. 検出されたOSとNGINXのバージョンに対してWallarmリポジトリを追加します。
1. これらのリポジトリからWallarmパッケージをインストールします。
1. インストールされたWallarmモジュールをNGINXに接続します。
1. 提供されたトークンを使用してフィルタリングノードをWallarm Cloudに接続します。

## ユースケース

--8<-- "../include/waf/installation/all-in-one/use-cases.md"

## 要件

--8<-- "../include/waf/installation/all-in-one-requirements-latest.md"

## ステップ1: NGINXと依存関係をインストールします

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## ステップ2: Wallarmトークンの準備

--8<-- "../include/waf/installation/all-in-one-token.md"

## ステップ3: all-in-one Wallarmインストーラーのダウンロード

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## ステップ4: all-in-one Wallarmインストーラーの実行

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

以降の手順のコマンドは、x86_64およびARM64インストールに共通です。

## ステップ5: Wallarmノードによるトラフィック解析を有効化します

--8<-- "../include/waf/installation/oob/steps-for-mirroring-linux-all-in-one.md"

## ステップ6: NGINXの再起動

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## ステップ7: Wallarmノードへのトラフィック送信を設定します

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## ステップ8: Wallarmノードの動作をテストします

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## ステップ9: デプロイ済みソリューションの微調整

既定の設定で動的Wallarmモジュールがインストールされます。デプロイ後、フィルタリングノードには追加の設定が必要になる場合があります。

Wallarmの設定は[NGINXディレクティブ](../../../../admin-en/configure-parameters-en.md)またはWallarm Console UIを使用して定義されます。ディレクティブは、Wallarmノードがインストールされているマシンの以下のファイルに設定します：

* `/etc/nginx/sites-available/default` （サーバーレベルおよびロケーションレベルの設定用）
* `/etc/nginx/nginx.conf` （httpレベルの設定用）
* `/etc/nginx/wallarm-status.conf` はWallarmノードの監視設定用です。詳細な説明は[リンク][wallarm-status-instr]をご参照ください。
* `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` はTarantoolから統計情報を収集する`collectd`プラグインの設定用です。

以下に、必要に応じて適用できる一般的な設定例をいくつか示します：

* [Wallarmノードのリソース割り当て][memory-instr]
* [Wallarmノード変数のログ記録][logging-instr]
* [フィルタリングノードの背後にあるプロキシサーバーのバランサーの使用][proxy-balancer-instr]
* [ディレクティブ`wallarm_process_time_limit`における単一リクエスト処理時間の制限][process-time-limit-instr]
* [NGINXディレクティブ`proxy_read_timeout`におけるサーバー応答待機時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINXディレクティブ`client_max_body_size`における最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINXにおける動的DNS解決の設定][dynamic-dns-resolution-nginx]

## 起動オプション

--8<-- "../include/waf/installation/all-in-one/launch-options.md"

## インストールの再実行

Wallarmノードのインストールを削除し、再度開始する必要がある場合は、以下の手順に従ってください。

!!! warning "インストール再実行の影響"
    インストールを再実行するということは、既に稼働しているWallarmサービスを停止して削除し、再インストールまでトラフィックのフィルタリングが停止することを意味します。プロダクション環境や重要なトラフィックがある環境では、トラフィックがフィルタリングされずリスクにさらされるため、十分ご注意ください。

    既存ノードをアップグレードする場合（例: 4.10から5.0へ）は、[アップグレード手順](../../../../updating-migrating/all-in-one.md)をご参照ください。

1. Wallarmプロセスを終了し、設定ファイルを削除します：

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```
1. [ステップ2](#step-2-prepare-wallarm-token)のセットアップ手順に従い、再インストールプロセスを続行します。