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
[install-postanalytics-docs]:        ../../../../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../../../admin-en/installation-postanalytics-en.md
[img-node-with-several-instances]:  ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../../custom/custom-nginx-version.md
[node-token]:                       ../../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../../installation/supported-deployment-options.md
[oob-advantages-limitations]:       ../../overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png

# NGINX Stable用のWallarm OOB Dynamic ModuleをLinuxパッケージを使用してインストールする

これらの指示は、nginx.orgからのNGINX `stable`のLinuxパッケージを使用して、Wallarmを[OOB](../overview.md) ダイナミックモジュールとしてインストールする手順を説明しています。

Wallarmは次のオペレーティングシステムをサポートしています：

* Debian 11.x (bullseye)
* Ubuntu 18.04 LTS (bionic)
* Ubuntu 20.04 LTS (focal)
* Ubuntu 22.04 LTS (jammy)
* CentOS 7.x
* Amazon Linux 2.0.2021xおよび以下のバージョン
* AlmaLinux、Rocky Linux、Oracle Linux 8.x

## 要件

--8<-- "../include-ja/waf/installation/linux-packages/requirements-nginx-stable.md"

--8<-- "../include-ja/waf/installation/linux-packages/common-steps-to-install-node-nginx-stable.md"

## 6. Wallarmにトラフィック分析を許可する

--8<-- "../include-ja/waf/installation/oob/steps-for-mirroring-linux.md"

## 7. NGINXを再起動する

--8<-- "../include-ja/waf/root_perm_info.md"

--8<-- "../include-ja/waf/restart-nginx-3.6.md"

## 8. トラフィックの送信先をWallarmのインスタンスに設定する

--8<-- "../include-ja/waf/installation/sending-traffic-to-node-oob.md"

## 9. Wallarmノードの動作をテストする

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## 10. 導入したソリューションの詳細設定

デフォルト設定のダイナミックWallarmモジュールはNGINX `stable`にインストールされています。フィルタリングノードは、デプロイした後にいくつかの追加設定が必要な場合があります。

Wallarmの設定は、[NGINXのディレクティブ](../../../../admin-en/configure-parameters-en.md)またはWallarm Console UIを使用して定義されます。ディレクティブは、Wallarmノードがあるマシンの次のファイルに設定するべきです：

* NGINX設定の`/etc/nginx/conf.d/default.conf`
* グローバルなフィルタリングノード設定の`/etc/nginx/conf.d/wallarm.conf`

    このファイルはすべてのドメインに適用される設定に使われます。異なる設定を異なるドメイングループに適用するには、`default.conf`ファイルを使用するか、それぞれのドメイングループ(`例：example.com.conf`と`test.com.conf`)の新しい設定ファイルを作成します。NGINX設定ファイルに関するより詳しい情報は、[公式NGINX文書](https://nginx.org/en/docs/beginners_guide.html)で利用できます。
* Wallarmノード監視設定の`/etc/nginx/conf.d/wallarm-status.conf`。詳細な説明は[リンク][wallarm-status-instr]で利用できます。
* Tarantoolデータベース設定の`/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool`

以下に必要に応じて適用できる典型的な設定がいくつかあります：

--8<-- "../include-ja/waf/installation/linux-packages/common-customization-options.md"

* [NGINXでの動的DNS解決の設定][dynamic-dns-resolution-nginx]