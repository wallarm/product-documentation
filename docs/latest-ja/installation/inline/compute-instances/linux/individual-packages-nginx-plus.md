[img-wl-console-users]:             ../../../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../../admin-en/installation-postanalytics-en/
[waf-mode-recommendations]:          ../../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx-plus/
[img-node-with-several-instances]:  ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../../custom/custom-nginx-version.md
[node-token]:                       ../../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../../installation/supported-deployment-options.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png

# NGINX Plusのための動的Wallarmモジュールをインストールする

これらの指示は、公式の商用バージョンのNGINX PlusにWallarmフィルタリングノードを動的モジュールとしてインストールする手順を説明します。ノードはトラフィック解析をインラインで実行します。

!!! info "オールインワンのインストール"
    Wallarmノード 4.6からは、下記の手順でリストされているすべての動作を自動化し、ノードのデプロイを極めて簡単にする[オールインワンのインストール](../../../../installation/nginx/all-in-one.md)を使用することを推奨します。

## 要件

--8<-- "../include-ja/waf/installation/linux-packages/requirements-nginx-plus.md"

--8<-- "../include-ja/waf/installation/linux-packages/common-steps-to-install-node-nginx-plus.md"

## 6. トラフィック解析のためのWallarmの有効化

--8<-- "../include-ja/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

## 7. NGINX Plusの再起動

--8<-- "../include-ja/waf/root_perm_info.md"

--8<-- "../include-ja/waf/restart-nginx-3.6.md"

## 8. Wallarmインスタンスにトラフィック送信の設定

--8<-- "../include-ja/waf/installation/sending-traffic-to-node-inline.md"

## 9. Wallarmノードの動作のテスト

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## 10. デプロイされたソリューションの微調整

デフォルト設定の動的WallarmモジュールがNGINX Plusにインストールされています。フィルタリングノードはデプロイ後に追加の設定を必要とする場合があります。

Wallarmの設定は、[NGINXのディレクティブ](../../../../admin-en/configure-parameters-en.md)またはWallarm Console UIを使用して定義されます。ディレクティブはWallarmノードがあるマシンの次のファイルに設定する必要があります：

* NGINX設定の`/etc/nginx/conf.d/default.conf`
* グローバルフィルタリングノード設定の`/etc/nginx/conf.d/wallarm.conf`

    このファイルはすべてのドメインに適用される設定に使用されます。異なるドメイングループに異なる設定を適用するには、`default.conf`のファイルを使用するか、各ドメイングループに対して新しい設定ファイルを作成します（例：`example.com.conf`と `test.com.conf`）。NGINX設定ファイルに関する詳細な情報は[公式のNGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)で利用できます。
* Wallarmノードモニタリング設定の`/etc/nginx/conf.d/wallarm-status.conf`。詳細な説明は[リンク][wallarm-status-instr]で利用できます。
* Tarantoolデータベース設定の`/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool`

以下に、必要に応じて適用できる典型的な設定のいくつかを示します：

* [フィルタリングモードの設定][waf-mode-instr]

--8<-- "../include-ja/waf/installation/linux-packages/common-customization-options.md"