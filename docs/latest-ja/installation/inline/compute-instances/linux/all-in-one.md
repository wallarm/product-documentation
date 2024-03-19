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
[node-token]:                       ../../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[platform]:                         ../../../supported-deployment-options.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md

# 全てを一つにまとめたインストーラでのデプロイ

**全てを一つにまとめたインストーラ**は、さまざまな環境でNGINXのダイナミックモジュールとしてWallarmノードをインストールする過程を簡略化し、標準化するために設計されています。このインストーラは自動的にお使いのオペレーティングシステムとNGINXのバージョンを認識し、必要な依存関係すべてをインストールします。

Wallarmが[NGINX](individual-packages-nginx-stable.md)、[NGINX Plus](individual-packages-nginx-plus.md)、[distribution-provided NGINX](individual-packages-nginx-distro.md)用に提供する個々のLinuxパッケージと比較して、**全てを一つにまとめたインストーラ**は以下のアクションを自動的に実行することでプロセスを簡略化します：

1. OSとNGINXバージョンのチェック。
1. 検出されたOSとNGINXバージョン用のWallarmリポジトリの追加。
1. これらのリポジトリからのWallarmパッケージのインストール。
1. インストールされたWallarmモジュールをNGINXに接続。
1. 提供されたトークンを使用してフィルタリングノードをWallarm Cloudに接続。

![All-in-one compared to manual](../../../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## 要件

--8<-- "../include-ja/waf/installation/all-in-one-requirements.md"

## ステップ1：NGINXと依存関係のインストール

--8<-- "../include-ja/waf/installation/all-in-one-nginx.md"

## ステップ2：Wallarmトークンの準備

--8<-- "../include-ja/waf/installation/all-in-one-token.md"

## ステップ3：一体型Wallarmインストーラのダウンロード

--8<-- "../include-ja/waf/installation/all-in-one-installer-download.md"

## ステップ4：一体型Wallarmインストーラの実行

--8<-- "../include-ja/waf/installation/all-in-one-installer-run.md"

次のステップのコマンドは、x86_64とARM64のインストールで同じです。

## ステップ5：トラフィックの分析を可能にするためにWallarmノードを有効化

--8<-- "../include-ja/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

## ステップ6：NGINXの再起動

--8<-- "../include-ja/waf/installation/restart-nginx-systemctl.md"

## ステップ7：トラフィックの送信をWallarmノードに設定

--8<-- "../include-ja/waf/installation/sending-traffic-to-node-inline.md"

## ステップ8：Wallarmノード操作のテスト

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## ステップ9：デプロイしたソリューションの微調整

デフォルト設定のダイナミックWallarmモジュールがインストールされています。 フィルタリングノードは、デプロイ後に追加の設定が必要な場合があります。

Wallarmの設定は、[NGINXのディレクティブ](../../../../admin-en/configure-parameters-en.md)またはWallarm Console UIを使用して定義されます。ディレクティブは、Wallarmノードがあるマシンの次のファイルに設定する必要があります：

* NGINXの設定がある `/etc/nginx/nginx.conf` 
* Wallarmノードの監視設定がある `/etc/nginx/wallarm-status.conf`。詳細な説明は[リンク][wallarm-status-instr]で利用可能です。
* Tarantoolからの統計情報を収集する `collectd` プラグインの設定がある `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` 

以下に、必要に応じて適用できる典型的な設定のいくつかを示します：

* [フィルタリングモードの設定][waf-mode-instr]
* [Wallarmノードのリソース割り当て][memory-instr]
* [Wallarmノード変数のログ記録][logging-instr]
* [フィルタリングノードの背後にあるプロキシサーバのバランサの使用][proxy-balancer-instr]
* [ディレクティブ `wallarm_process_time_limit` での単一リクエスト処理時間の制限][process-time-limit-instr]
* [NGINXディレクティブ `proxy_read_timeout` でのサーバ応答待機時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINXディレクティブ `client_max_body_size` での最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINXでの動的DNS解決の設定][dynamic-dns-resolution-nginx]

## ローンチオプション

全てを一つにしたスクリプトがダウンロードされれば、以下のようにしてそのヘルプ情報を取得することができます：

```
sudo sh ./wallarm-4.6.12.x86_64-glibc.sh -- -h
```

これによって以下が返されます：

```
...
Usage: setup.sh [options]... [arguments]... [filtering/postanalytics]

OPTION                      DESCRIPTION
-b, --batch                 Batch mode, non-interactive installation.
-t, --token TOKEN           Node token, only used in a batch mode.
-c, --cloud CLOUD           Wallarm Cloud, one of US/EU, default is EU, only used in a batch mode.
-H, --host HOST             Wallarm API address, for example, api.wallarm.com or us1.api.wallarm.com, only used in a batch mode.
-P, --port PORT             Wallarm API pot, for example, 443.
    --no-ssl                Disable SSL for Wallarm API access.
    --no-verify             Disable SSL certificates verification.
-f, --force                 If there is a node with the same name, create a new instance.
-h, --help
    --version
```

以下の点に注意してください： 

* `--batch` オプションは、**バッチ（非対話型）モード**を有効化します。 このモードでは、追加のパラメータを使用しない場合、ノードはスクリプトの実行直後にすぐにインストールされ、ユーザーからの追加のインタラクションやデータ入力を必要としません。バッチモードは:

    * `--token` が必要です
    * デフォルトでEUクラウドにノードをインストールします
    * 追加のオプションでスクリプトの振る舞いの修正を可能にします

* `filtering/postanalytics` のスイッチャでは、postanalyticsモジュールを[別個に](../../../../admin-en/installation-postanalytics-en.md#postanalytics-module-installation-via-all-in-one-installation-script)インストールします。 スイッチャが使われない場合、フィルタリングとpostanalyticsの部分がまとめてインストールされます。