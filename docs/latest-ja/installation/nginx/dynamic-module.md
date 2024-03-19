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
[configure-selinux-instr]:          ../../admin-en/configure-selinux.md
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
[nginx-custom]:                 ../custom/custom-nginx-version.md
[node-token]:                       ../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../installation/supported-deployment-options.md
[inline-docs]:                      ../inline/overview.md
[oob-docs]:                         ../oob/overview.md
[oob-advantages-limitations]:       ../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png

# NGINXリポジトリから、NGINX安定版用のダイナミックWallarmモジュールをインストールする

この手順書では、NGINXリポジトリからインストールされたオープンソースバージョンのNGINX `stable` に対して、Wallarmフィルタリングノードをダイナミックモジュールとしてインストールする方法を説明しています。

!!! info "オールインワンのインストール"
    Wallarmノード 4.6から、以下のすべての手順を自動化する[オールインワンのインストール](all-in-one.md)を使用することを推奨しています。これにより、ノードのデプロイがはるかに容易になります。

## 要件

--8<-- "../include-ja/waf/installation/linux-packages/requirements-nginx-stable.md"

--8<-- "../include-ja/waf/installation/linux-packages/common-steps-to-install-node-nginx-stable.md"

## 6. Wallarmによるトラフィックの分析を有効化する

--8<-- "../include-ja/waf/installation/common-steps-to-enable-traffic-analysis.md"

## 7. NGINXを再起動する

--8<-- "../include-ja/waf/root_perm_info.md"

--8<-- "../include-ja/waf/restart-nginx-3.6.md"

## 8. トラフィックの送信をWallarmインスタンスに設定する

--8<-- "../include-ja/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. Wallarmノードの動作をテストする

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## 10. デプロイしたソリューションの微調整

デフォルトの設定でNGINX `stable` にダイナミックWallarmモジュールがインストールされています。フィルタリングノードはデプロイメント後に追加の設定が必要な場合があります。

Wallarmの設定は、[NGINXディレクティブ](../../admin-en/configure-parameters-en.md)またはWallarm Console UIを使用して定義されます。ディレクティブは、Wallarmノードを含むマシン上の以下のファイルに設定する必要があります。

* NGINX設定の `/etc/nginx/conf.d/default.conf`
* グローバルフィルタリングノード設定の `/etc/nginx/conf.d/wallarm.conf`

    このファイルは、すべてのドメインに適用される設定のために使用されます。「default.conf」を使用するか、各ドメイングループ（例： `example.com.conf`、 `test.com.conf`など）の新しい設定ファイルを作成して、異なる設定を異なるドメイングループに適用します。NGINX設定ファイルに関する詳細な情報は、[公式のNGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)にてご覧いただけます。
* Wallarmノードの監視設定の `/etc/nginx/conf.d/wallarm-status.conf`。詳細な説明は、[リンク][wallarm-status-instr]にてご覧いただけます
* Tarantoolデータベースの設定の `/etc/default/wallarm-tarantool`または `/etc/sysconfig/wallarm-tarantool`

以下で必要に応じて適用できる一般的な設定のいくつかを示します。

* [フィルタリングモードの設定][waf-mode-instr]

--8<-- "../include-ja/waf/installation/linux-packages/common-customization-options.md"

* [NGINXでの動的DNS解決の設定][dynamic-dns-resolution-nginx]