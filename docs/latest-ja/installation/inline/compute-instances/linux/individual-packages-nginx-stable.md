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
[configure-selinux-instr]:          ../../../../admin-en/configure-selinux.md
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
[nginx-custom]:                 ../../../custom/custom-nginx-version.md
[node-token]:                       ../../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../../installation/supported-deployment-options.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png

# NGINXリポジトリからNGINX安定版用動的Wallarmモジュールのインストール

この説明では、NGINXリポジトリからインストールされたNGINXのオープンソースバージョンに対して、動的モジュールとしてWallarmフィルタリングノードをインストールする手順を説明しています。ノードは直列にトラフィック解析を実行します。

!!! info "一体型インストール"
    Wallarm node 4.6からは、以下のステップに記述されたすべての活動を自動化し、ノードのデプロイメントを大幅に簡易化する[一体型インストール](all-in-one.md)を使用することが推奨されています。

## 必要条件

--8<-- "../include-ja/waf/installation/linux-packages/requirements-nginx-stable.md"

--8<-- "../include-ja/waf/installation/linux-packages/common-steps-to-install-node-nginx-stable.md"

## 6. Wallarmにトラフィックの分析を許可する

--8<-- "../include-ja/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

## 7. NGINXの再起動

--8<-- "../include-ja/waf/root_perm_info.md"

--8<-- "../include-ja/waf/restart-nginx-3.6.md"

## 8. Wallarmインスタンスへのトラフィックの送信を設定する

--8<-- "../include-ja/waf/installation/sending-traffic-to-node-inline.md"

## 9. Wallarmノードの操作をテストする

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## 10. デプロイされたソリューションを微調整する

デフォルトの設定でNGINX `安定版`用にインストールされた動的Wallarmモジュールです。フィルタリングノードはデプロイメント後に追加の設定が必要な場合があります。

Wallarmの設定は[NGINXディレクティブ](../../../../admin-en/configure-parameters-en.md)またはWallarm Console UIを使用して定義されます。ディレクティブはWallarmノードを持つマシン上の次のファイルで設定する必要があります。

* NGINXの設定がある`/etc/nginx/conf.d/default.conf`
* グローバルなフィルターノードの設定がある`/etc/nginx/conf.d/wallarm.conf`

    このファイルはすべてのドメインに適用する設定に使用されます。異なるドメイングループに異なる設定を適用するには、`default.conf`ファイルを使用するか、各ドメイングループの新しい設定ファイル（例えば、`example.com.conf`および `test.com.conf`など）を作成します。NGINX設定ファイルに関するもっと詳しい情報は[公式のNGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)で入手できます。
* Wallarmノードの監視設定がある`/etc/nginx/conf.d/wallarm-status.conf`の詳細な説明は[リンク][wallarm-status-instr]内にあります。
* Tarantoolデータベースの設定がある`/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool`

以下に、必要に応じて適用できる典型的な設定がいくつか示されています：

* [フィルタリングモードの設定][waf-mode-instr]

--8<-- "../include-ja/waf/installation/linux-packages/common-customization-options.md"

* [NGINXでの動的DNS解決の設定][dynamic-dns-resolution-nginx]