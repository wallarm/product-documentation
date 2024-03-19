[img-wl-console-users]:             ../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../admin-en/installation-postanalytics-en/
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../faq/nginx-compatibility.md#is-wallarm-filtering-node-compatible-with-the-custom-build-of-nginx
[node-token]:                       ../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../user-guides/settings/api-tokens.md
[platform]:                         ../supported-deployment-options.md
[inline-docs]:                      ../inline/overview.md
[oob-docs]:                         ../oob/overview.md
[oob-advantages-limitations]:       ../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md

# 一括インストーラーを使用したデプロイ

**一括インストーラー**は、さまざまな環境でNGINXに対する動的モジュールとしてWallarmノードをインストールするプロセスを簡素化し、標準化するために設計されています。このインストーラは、自動的にオペレーティングシステムとNGINXのバージョンを識別し、必要なすべての依存関係をインストールします。

Wallarmが提供する個々のLinuxパッケージ([NGINX](dynamic-module.md)、[NGINX Plus](../nginx-plus.md)、[配布元提供のNGINX](dynamic-module-from-distr.md))と比較して、**一括インストーラー**は次のアクションを自動的に実行することでプロセスを簡素化します:

1. OSとNGINXのバージョンを確認する
1. 検出されたOSとNGINXバージョンのためのWallarmリポジトリーを追加する
1. これらのリポジトリーからWallarmパッケージをインストールする
1. インストールしたWallarmモジュールをNGINXに接続する
1. 提供されたトークンを使用して、フィルタリングノードをWallarm Cloudに接続する

![All-in-one compared to manual](../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## 要件

--8<-- "../include-ja/waf/installation/all-in-one-requirements.md"

## ステップ1: NGINXと依存関係のインストール

--8<-- "../include-ja/waf/installation/all-in-one-nginx.md"

## ステップ2: Wallarmトークンの準備

--8<-- "../include-ja/waf/installation/all-in-one-token.md"

## ステップ3: 一括Wallarmインストーラーのダウンロード

--8<-- "../include-ja/waf/installation/all-in-one-installer-download.md"

## ステップ4: 一括Wallarmインストーラーの実行

--8<-- "../include-ja/waf/installation/all-in-one-installer-run.md"

これからのステップのコマンドは、x86_64とARM64のインストールに同じです。

## ステップ5: Wallarmノードがトラフィックを分析するように設定する

--8<-- "../include-ja/waf/installation/common-steps-to-enable-traffic-analysis.md"

## ステップ6: NGINXの再起動

--8<-- "../include-ja/waf/installation/restart-nginx-systemctl.md"

## ステップ7: トラフィックの送信をWallarmノードに設定する

--8<-- "../include-ja/waf/installation/sending-traffic-to-node-inline-oob.md"

## ステップ8: Wallarmノードの操作をテストする

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## ステップ9: 展開されたソリューションの調整

デフォルト設定で動的Wallarmモジュールがインストールされています。展開後にフィルタリングノードが追加の設定を必要とする場合があります。

Wallarmの設定は、[NGINXのディレクティブ](../../admin-en/configure-parameters-en.md)またはWallarm Console UIを使用して定義されます。次のファイルにディレクティブを設定する必要があります。

* WallarmノードのマシンにあるNGINX設定の`/etc/nginx/nginx.conf`
* Wallarmノードの監視設定の`/etc/nginx/wallarm-status.conf`。詳細な説明は [リンク][wallarm-status-instr]でご覧いただけます。
* Tarantoolから統計を収集する`collectd`プラグインの設定の`/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf`

以下に、必要に応じて適用できる典型的な設定のいくつかを示します:

* [フィルタリングモードの設定][waf-mode-instr]
* [Wallarmノードのためのリソースの割り当て][memory-instr]
* [Wallarmノード変数のログ記録][logging-instr]
* [フィルタリングノードの後背にプロキシサーバのバランサを使用][proxy-balancer-instr]
* [ディレクティブ`wallarm_process_time_limit`での単一リクエスト処理時間の制限][process-time-limit-instr]
* [NGINXディレクティブ`proxy_read_timeout`でのサーバ応答待ち時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINXディレクティブ`client_max_body_size`での最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINXでの動的DNS解決の設定][dynamic-dns-resolution-nginx]

## 起動オプション

一括スクリプトをダウンロードしたら、次のコマンドでヘルプを表示できます:

```
sudo sh ./wallarm-4.6.12.x86_64-glibc.sh -- -h
```

これにより、以下が返されます:

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

注意点として: 

* `--batch` オプションは **バッチ（対話型でない）モード**を有効にします。 このモードでは、追加のパラメーターを使用しない場合、スクリプトの起動後すぐにノードがインストールされ、ユーザーからの追加の対話やデータ入力を必要としません。 バッチモードでは：
 
    * `--token`が必要
    * デフォルトでEUクラウドにノードがインストールされます
    * 追加のオプションでスクリプトの動作を変更できます

* `filtering/postanalytics` スイッチャーを使用して、postanalyticsモジュールを[別々に](../../admin-en/installation-postanalytics-en.md#postanalytics-module-installation-via-all-in-one-installation-script)インストールできます。 スイッチャーが使用されない場合、フィルタリング部分とpostanalytics部分が一緒にインストールされます。