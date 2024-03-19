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
[install-postanalytics-docs]:        ../../../../admin-en/installation-postanalytics-en.md-onboarding-steps
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics
[dynamic-dns-resolution-nginx]:     ../../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../../../about-wallarm/deployment-best-practices.md#follow-recommended-instr]:      ../../../../admin-en/installation-postanalytics-en.md
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

# NGINX Plusを使ってLinuxパッケージからWallarm OOBダイナミックモジュールをインストールするための手順

これらの手順は、Wallarmを[OOB](../overview.md)ダイナミックモジュールとしてNGINX Plusにインストールするためのものです。

Wallarmは以下のオペレーティングシステムをサポートしています：

* Debian 11.x (bullseye)
* Ubuntu 18.04 LTS (bionic)
* Ubuntu 20.04 LTS (focal)
* Ubuntu 22.04 LTS (jammy)
* CentOS 7.x
* Amazon Linux 2.0.2021x 以下
* AlmaLinux、Rocky Linux、Oracle Linux 8.x

## 必要条件

--8<-- "../include-ja/waf/installation/linux-packages/requirements-nginx-plus.md"

--8<-- "../include-ja/waf/installation/linux-packages/common-steps-to-install-node-nginx-plus.md"

## 6. Wallarmにトラフィックの解析を許可する

--8<-- "../include-ja/waf/installation/oob/steps-for-mirroring-linux.md"

## 7. NGINX Plusをリスタートする

--8<-- "../include-ja/waf/root_perm_info.md"

--8<-- "../include-ja/waf/restart-nginx-3.6.md"

## 8. トラフィックの送信先をWallarmインスタンスに設定する

--8<-- "../include-ja/waf/installation/sending-traffic-to-node-oob.md"

## 9. Wallarmノードの動作をテストする

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## 10. 展開したソリューションを微調整する

デフォルト設定でのダイナミックWallarmモジュールがNGINX Plusにインストールされています。展開後に、フィルタリングノードにいくつかの追加設定をすることが必要かもしれません。

Wallarmの設定は、[NGINX指令](../../../../admin-en/configure-parameters-en.md) または Wallarm Console UIを用いて定義します。指令は、Wallarmノードがあるマシンの以下のファイルで設定する必要があります：

* NGINX設定としての`/etc/nginx/conf.d/default.conf`
* 全般的なフィルタリングノード設定としての`/etc/nginx/conf.d/wallarm.conf`

    このファイルは全ドメインに適用される設定のために使用されます。異なるドメイングループに異なる設定を適用するには、`default.conf`ファイルを使用するか、各ドメイングループに対して新しい設定ファイル (例：`example.com.conf`, `test.com.conf`) を作成します。[公式NGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)には、NGINX設定ファイルに関するより詳細な情報があります。
* Wallarmノードの監視設定としての`/etc/nginx/conf.d/wallarm-status.conf`。詳しい説明は[リンク][wallarm-status-instr]にあります。
* Tarantoolデータベース設定としての`/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool`

以下に、必要に応じて適用可能ないくつかの典型的な設定を示します：

--8<-- "../include-ja/waf/installation/linux-packages/common-customization-options.md"