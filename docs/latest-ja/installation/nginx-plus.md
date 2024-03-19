[img-wl-console-users]:             ../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[memory-instr]:                     ../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../admin-en/installation-postanalytics-en/
[waf-mode-recommendations]:          ../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[versioning-policy]:                ../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx-plus/
[img-node-with-several-instances]:  ../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 custom/custom-nginx-version.md
[node-token]:                       ../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../installation/supported-deployment-options.md
[inline-docs]:                      inline/overview.md
[oob-docs]:                         oob/overview.md
[oob-advantages-limitations]:       oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../images/user-guides/nodes/grouped-nodes.png

# NGINX Plus向け動的Wallarmモジュールのインストール

これらの指示は、公式の商用バージョンのNGINX PlusでWallarmフィルタリングノードを動的モジュールとしてインストールするための手順を説明しています。

!!! info "一体型インストール"
    Wallarmノード4.6からは、下記の手順のすべてを自動化し、ノード展開をより簡単にする[一体型インストール](../installation/nginx/all-in-one.md)を使用することを推奨します。

## 要件

--8<-- "../include-ja/waf/installation/linux-packages/requirements-nginx-plus.md"

--8<-- "../include-ja/waf/installation/linux-packages/common-steps-to-install-node-nginx-plus.md"

## 6. Wallarmにトラフィック分析を有効にする

--8<-- "../include-ja/waf/installation/common-steps-to-enable-traffic-analysis.md"

## 7. NGINX Plusを再起動する

--8<-- "../include-ja/waf/root_perm_info.md"

--8<-- "../include-ja/waf/restart-nginx-3.6.md"

## 8. Wallarmインスタンスへのトラフィック送信を設定する

--8<-- "../include-ja/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. Wallarmノードの動作をテストする

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## 10. デプロイしたソリューションの微調整

デフォルト設定でNGINX Plusに動的Wallarmモジュールがインストールされています。フィルタリングノードはデプロイ後に追加設定が必要かもしれません。

Wallarmの設定は[NGINX 設定パラメーター](../admin-en/configure-parameters-en.md)またはWallarm Console UIを使用して定義します。設定パラメータはWallarmノードがあるマシンの以下のファイルに設定する必要があります：

* NGINX設定がある `/etc/nginx/conf.d/default.conf`
* グローバルフィルタリングノード設定がある `/etc/nginx/conf.d/wallarm.conf`

    このファイルは、すべてのドメインに適用される設定に使われます。異なる設定を異なるドメイングループに適用する場合は、`default.conf` ファイルを使用するか、各ドメイングループ（例：`example.com.conf` 及び `test.com.conf`）ごとに新しい設定ファイルを作成します。NGINX設定ファイルについての詳細な情報は [公式NGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)で利用可能です。
* Wallarmノードモニタリング設定がある `/etc/nginx/conf.d/wallarm-status.conf`。詳細な説明は[こちら][wallarm-status-instr]で利用可能です
* Tarantoolデータベース設定がある `/etc/default/wallarm-tarantool` または `/etc/sysconfig/wallarm-tarantool`

以下に必要に応じて適用できる典型的な設定をいくつか示します：

* [フィルタリングモードの設定][waf-mode-instr]

--8<-- "../include-ja/waf/installation/linux-packages/common-customization-options.md"