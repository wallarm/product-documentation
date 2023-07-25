[img-wl-console-users]:             ../../../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../../../admin-en/configure-statistics-service.ja.md
[memory-instr]:                     ../../../../admin-en/configuration-guides/allocate-resources-for-node.ja.md
[waf-directives-instr]:             ../../../../admin-en/configure-parameters-en.ja.md
[ptrav-attack-docs]:                ../../../../attacks-vulns-list.ja.md#path-traversal
[attacks-in-ui-image]:           ../../../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../../../admin-en/configure-wallarm-mode.ja.md
[logging-instr]:                    ../../../../admin-en/configure-logging.ja.md
[proxy-balancer-instr]:             ../../../../admin-en/using-proxy-or-balancer-en.ja.md
[process-time-limit-instr]:         ../../../../admin-en/configure-parameters-en.ja.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../../../admin-en/configure-selinux.ja.md
[configure-proxy-balancer-instr]:   ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.ja.md
[update-instr]:                     ../../../../updating-migrating/nginx-modules.ja.md
[install-postanalytics-docs]:        ../../../../admin-en/installation-postanalytics-en.ja.md
[dynamic-dns-resolution-nginx]:     ../../../../admin-en/configure-dynamic-dns-resolution-nginx.ja.md
[waf-mode-recommendations]:          ../../../../about-wallarm/deployment-best-practices.ja.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.ja.md
[versioning-policy]:                ../../../../updating-migrating/versioning-policy.ja.md#version-list
[install-postanalytics-instr]:      ../../../../admin-en/installation-postanalytics-en.ja.md
[img-node-with-several-instances]:  ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../../custom/custom-nginx-version.ja.md
[node-token]:                       ../../../../quickstart.ja.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.ja.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.ja.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../../installation/supported-deployment-options.ja.md
[oob-advantages-limitations]:       ../../overview.ja.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../overview.ja.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png

# Wallarm OOB Dynamic ModuleのLinuxパッケージを使用してNGINX Stableにインストールします

これらの指示は、nginx.orgからのNGINX `stable`用のLinuxパッケージを使用してWallarmをOOB（[Out Of Band][../overview.ja.md]）動的モジュールとしてインストールする手順を説明します。

Wallarmは次のオペレーティングシステムをサポートしています：

* Debian 11.x（bullseye）
* Ubuntu 18.04 LTS（bionic）
* Ubuntu 20.04 LTS（focal）
* Ubuntu 22.04 LTS（jammy）
* CentOS 7.x
* Amazon Linux 2.0.2021x以降
* AlmaLinux、Rocky Linux、Oracle Linux 8.x

--8<-- "../include/waf/installation/linux-packages/requirements-nginx-stable.ja.md"

--8<-- "../include/waf/installation/linux-packages/common-steps-to-install-node-nginx-stable.ja.md"

## 6. Wallarmがトラフィックを分析できるように設定します

--8<-- "../include/waf/installation/oob/steps-for-mirroring-linux.ja.md"

## 7. NGINXを再起動します

--8<-- "../include/waf/root_perm_info.ja.md"

--8<-- "../include/waf/restart-nginx-3.6.ja.md"

## 8. Wallarmインスタンスへのトラフィック送信を設定します

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.ja.md"

## 9. Wallarmノードの操作をテストします

--8<-- "../include/waf/installation/test-waf-operation-no-stats.ja.md"

## 10. デプロイ済みのソリューションを微調整します

デフォルト設定でNGINX `stable`用にインストールされた動的Wallarmモジュールです。デプロイメント後にフィルタリングノードに追加の設定が必要な場合があります。

Wallarmの設定は、[NGINXのディレクティブ](../../../../admin-en/configure-parameters-en.ja.md)またはWallarm Console UIを使用して定義されます。ディレクティブは、Wallarmノードのマシン上の次のファイルに設定する必要があります：

* NGINXの設定である`/etc/nginx/conf.d/default.conf`
* グローバルフィルタリングノード設定である`/etc/nginx/conf.d/wallarm.conf`

    このファイルは、すべてのドメインに適用される設定に使用されます。異なるドメイングループに異なる設定を適用するには、`default.conf`ファイルを使用するか、各ドメイングループ用の新しい設定ファイル（例えば、`example.com.conf`と`test.com.conf`）を作成します。NGINXの設定ファイルについての詳しい情報は、[公式NGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)で利用可能です。
* Wallarmノードの監視設定がある`/etc/nginx/conf.d/wallarm-status.conf`。詳しい説明は[リンク][wallarm-status-instr]内にあります
* Tarantoolデータベースの設定がある`/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool`

以下は、必要に応じて適用できる典型的な設定のいくつかです：

--8<-- "../include/waf/installation/linux-packages/common-customization-options.ja.md"

* [NGINXにおける動的DNS解決の設定][dynamic-dns-resolution-nginx]