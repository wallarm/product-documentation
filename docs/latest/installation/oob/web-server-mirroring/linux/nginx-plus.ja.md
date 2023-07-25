[img-wl-console-users]: ../../../../images/check-user-no-2fa.png
[wallarm-status-instr]: ../../../../admin-en/configure-statistics-service.ja.md
[memory-instr]: ../../../../admin-en/configuration-guides/allocate-resources-for-node.ja.md
[waf-directives-instr]: ../../../../admin-en/configure-parameters-en.ja.md
[ptrav-attack-docs]: ../../../../attacks-vulns-list.ja.md#path-traversal
[attacks-in-ui-image]: ../../../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]: ../../../../admin-en/configure-wallarm-mode.ja.md
[logging-instr]: ../../../../admin-en/configure-logging.ja.md
[proxy-balancer-instr]: ../../../../admin-en/using-proxy-or-balancer-en.ja.md
[process-time-limit-instr]: ../../../../admin-en/configure-parameters-en.ja.md#wallarm_process_time_limit
[configure-selinux-instr]: ../../../../admin-en/configure-selinux.ja.md
[configure-proxy-balancer-instr]: ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.ja.md
[update-instr]: ../../../../updating-migrating/nginx-modules.ja.md
[install-postanalytics-docs]: ../../../../admin-en/installation-postanalytics-en.ja.md
[dynamic-dns-resolution-nginx]: ../../../../admin-en/configure-dynamic-dns-resolution-nginx.ja.md
[waf-mode-recommendations]: ../../../../about-wallarm/deployment-best-practices.ja.md#follow-recommended-onboarding-steps
[ip-lists-docs]: ../../../../user-guides/ip-lists/overview.ja.md
[versioning-policy]: ../../../../updating-migrating/versioning-policy.ja.md#version-list
[install-postanalytics-instr]: ../../../../admin-en/installation-postanalytics-en.ja.md
[img-node-with-several-instances]: ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]: ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]: ../../../custom/custom-nginx-version.ja.md
[node-token]: ../../../../quickstart.ja.md#deploy-the-wallarm-filtering-node
[api-token]: ../../../../user-guides/settings/api-tokens.ja.md
[wallarm-token-types]: ../../../../user-guides/nodes/nodes.ja.md#api-and-node-tokens-for-node-creation
[platform]: ../../../../installation/supported-deployment-options.ja.md
[oob-advantages-limitations]: ../../overview.ja.md#advantages-and-limitations
[web-server-mirroring-examples]: ../overview.ja.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]: ../../../../images/user-guides/nodes/grouped-nodes.png

# Linuxパッケージを使用してNGINX PlusにWallarm OOB Dynamicモジュールをインストールする

これらの指示は、NGINX Plus用の[OOB](../overview.ja.md)動的モジュールとしてWallarmをインストールする手順を説明しています。

Wallarmは以下のオペレーティングシステムをサポートしています：

* Debian 11.x (bullseye)
* Ubuntu 18.04 LTS (bionic)
* Ubuntu 20.04 LTS (focal)
* Ubuntu 22.04 LTS (jammy)
* CentOS 7.x
* Amazon Linux 2.0.2021x以下
* AlmaLinux、Rocky LinuxまたはOracle Linux 8.x

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-plus.ja.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-plus.ja.md"

## 6. Wallarmにトラフィック分析を使わせる

--8<-- "../include/waf/installation/oob/steps-for-mirroring-linux.ja.md"

## 7. NGINX Plusを再起動する

--8<-- "../include/waf/root_perm_info.ja.md"

--8<-- "../include/waf/restart-nginx-3.6.ja.md"

## 8. トラフィックの送信をWallarmインスタンスに設定する

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.ja.md"

## 9. Wallarmノードの動作をテストする

--8<-- "../include/waf/installation/test-waf-operation-no-stats.ja.md"

## 10. 配置した解決策を微調整する

デフォルトの設定でNGINX Plusに動的Wallarmモジュールがインストールされています。フィルタリングノードは配布後に追加の設定が必要な場合があります。

Wallarmの設定は[NGINXのディレクティブ](../../../../admin-en/configure-parameters-en.ja.md)またはWallarm Console UIを使用して定義されます。ディレクティブはWallarmノードのマシン上の以下のファイルに設定する必要があります：

* `default.conf`のNGINX設定とともに`/etc/nginx/conf.d/default.conf`
* グローバルなフィルタリングノードの設定とともに`/etc/nginx/conf.d/wallarm.conf`

    このファイルはすべてのドメインに適用する設定に使用されます。異なるドメイングループに異なる設定を適用するには、`default.conf`のファイルを使用するか、ドメイングループごとに新しい設定ファイル（たとえば、`example.com.conf`と`test.com.conf`）を作成します。NGINXの設定ファイルに関する詳細な情報は、[公式のNGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)で入手できます。
* Wallarmノードの監視設定を持つ`/etc/nginx/conf.d/wallarm-status.conf`。詳しい説明は[リンク][wallarm-status-instr]で利用できます
* Tarantoolデータベースの設定とともに`/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool`

以下に必要に応じて適用できる典型的な設定のいくつかをリストしています：

--8<-- "../include/waf/installation/linux-packages/common-customization-options.ja.md"