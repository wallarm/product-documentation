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
[node-token]:                       ../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../user-guides/settings/api-tokens.md
[platform]:                         ../../admin-en/supported-platforms.md
[oob-docs]:                         ../oob/overview.md
[oob-advantages-limitations]:       ../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation


# オールインワンインストーラーでのデプロイ 

**オールインワンインストーラー**は、さまざまな環境のNGINXにWallarmノードを動的モジュールとしてインストールするプロセスを簡潔化し、標準化するために設計されています。このインストーラーは自動的にお使いのオペレーティングシステムとNGINXのバージョンを識別し、必要な依存関係すべてをインストールします。 

Wallarmが提供する個々のLinuxパッケージ[NGINX](dynamic-module.md)、[NGINX Plus](../nginx-plus.md)、[お使いのディストリビューションが提供するNGINX](dynamic-module-from-distr.md)と比較して、**オールインワンインストーラー**は次のアクションを自動的に実行することにより、プロセスを簡素化します：

1. お使いのOSとNGINXのバージョンを確認します。
1. 検出されたOSとNGINXのバージョンのためのWallarmリポジトリを追加します。 
1. これらのリポジトリからWallarmパッケージをインストールします。
1. インストールしたWallarmモジュールをお使いのNGINXに接続します。
1. 提供されたトークンを使用して、フィルタリングノードをWallarm Cloudに接続します。

![!オールインワンインストーラーと手動インストールの比較](../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## 要件

--8<-- "../include/waf/installation/all-in-one-requirements.md"

## ステップ1：NGINXと依存関係をインストールする

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## ステップ2：Wallarmトークンの準備

--8<-- "../include/waf/installation/all-in-one-token.md"

## ステップ3：オールインワンのWallarmインストーラーをダウンロードする

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## ステップ4：オールインワンのWallarmインストーラーを実行する

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

今後の手順でのコマンドはx86_64とARM64のインストールの両方で同じです。

## ステップ5：Wallarmノードでのトラフィック分析を有効にする

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis.md"

## ステップ6：NGINXを再起動する

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## ステップ7：トラフィックのWallarmノードへの送信を設定する

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## ステップ8：Wallarmノードの動作をテストする

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## ステップ9：デプロイされたソリューションを微調整する

デフォルト設定の動的Wallarmモジュールがインストールされます。フィルタリングノードはデプロイ後に追加の設定が必要な場合があります。

Wallarmの設定は、[NGINXのディレクティブ](../../admin-en/configure-parameters-en.md)またはWallarm Console UIを使用して定義されます。ディレクティブは、Wallarmノードがあるマシンの以下のファイルで設定する必要があります。

* NGINX設定の`/etc/nginx/nginx.conf`
* Wallarmノードの監視設定の`/etc/nginx/wallarm-status.conf`。詳細な説明は[リンク][wallarm-status-instr]内で利用可能です。
* Tarantoolから統計を収集する `collectd` プラグインの設定 `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` 

以下に、必要に応じて適用できる典型的な設定のいくつかを示します。

* [フィルタリングモードの設定][waf-mode-instr]
* [Wallarmノードのためのリソースの割り当て][memory-instr]
* [Wallarmノード変数のロギング][logging-instr]
* [フィルタリングノードの背後のプロキシサーバーのバランサーの使用][proxy-balancer-instr]
* [ディレクティブ `wallarm_process_time_limit` における単一のリクエスト処理時間の制限][process-time-limit-instr]
* [NGINXディレクティブ `proxy_read_timeout` によるサーバー応答待機時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINXディレクティブ `client_max_body_size` による最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINXでの動的DNS解決の設定][dynamic-dns-resolution-nginx]

## 起動オプション

オールインワンのスクリプトをダウンロードしたら、次のコマンドでヘルプを参照できます：

```
sudo sh ./wallarm-4.6.12.x86_64-glibc.sh -- -h
```

返される結果：

```
...
使用法： setup.sh [options]... [arguments]... [filtering/postanalytics]

オプション                      説明
-b, --batch                 バッチモード、対話式のインストールではありません。
-t, --token TOKEN           ノードトークン、バッチモードでのみ使用されます。
-c, --cloud CLOUD           Wallarm Cloud、US/EUのいずれか、デフォルトはEU、バッチモードでのみ使用されます。
-H, --host HOST             Wallarm APIアドレス、例えば、api.wallarm.com または us1.api.wallarm.com、バッチモードでのみ使用されます。
-P, --port PORT             Wallarm APIのポート、例えば、443。
    --no-ssl                Wallarm APIへのアクセスでSSLを無効にする。
    --no-verify             SSL証明書の確認を無効にする。
-f, --force                 同名のノードが存在する場合、新しいインスタンスを作成する。
-h, --help
    --version
```

注意点：

* `--batch`オプションは**バッチ(非対話型)モード**を有効にします。このモードでは、追加パラメータを使用しない場合、スクリプトの起動後すぐにノードがインストールされ、ユーザーからの追加の相互作用やデータ入力が必要ありません。バッチモードは：

   * `--token`が必要です
   * デフォルトでノードをEUクラウドにインストールします
   * 追加オプションでスクリプトの動作を変更できます

* `filtering/postanalytics`スイッチャーはpostanalyticsモジュールを[別々に](../../admin-en/installation-postanalytics-en.md#postanalytics-module-installation-via-all-in-one-installation-script)インストールすることができます。スイッチャーが使用されていない場合、フィルタリング部とpostanalytics部は一緒にインストールされます。