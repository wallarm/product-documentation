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
[install-postanalytics-docs]:       ../../../../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:         ../../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../../../admin-en/installation-postanalytics-en.md
[img-node-with-several-instances]:  ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:          ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                     ../../../custom/custom-nginx-version.md
[node-token]:                       ../../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../../installation/supported-deployment-options.md
[oob-advantages-limitations]:       ../../overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png

# ディストリビューション提供の NGINX 用 Wallarm OOB ダイナミックモジュールのインストール

これらの指示は、ディストリビューション提供の NGINX の Linux パッケージを使用して、Wallarm を[OOB](../overview.md) ダイナミックモジュールとしてインストールする手順を説明しています。 

NGINX オープンソースは、nginx.orgまたはDebian/CentOSのデフォルトリポジトリから、要件、NGINX バージョンの選択、リポジトリ管理ポリシーに応じて取得できます。Wallarmは、[nginx.org](nginx-stable.md)とディストリビューション提供のバージョンの両方のパッケージを提供します。このガイドでは、Debian/CentOSリポジトリからのNGINXに焦点を当てています。

Wallarm モジュールは、以下のオペレーティングシステムのディストリビューション提供の NGINX と互換性があります：

* Debian 10.x (buster)
* Debian 11.x (bullseye)
* CentOS 7.x
* AlmaLinux、Rocky Linux、またはOracle Linux 8.x

--8<-- "../include-ja/waf/installation/linux-packages/requirements-nginx-stable.md"

--8<-- "../include-ja/waf/installation/linux-packages/common-steps-to-install-node-nginx-distro.md"

## 5. トラフィックの分析を Wallarm に許可する

--8<-- "../include-ja/waf/installation/oob/steps-for-mirroring-linux.md"

## 6. NGINX を再起動する

--8<-- "../include-ja/waf/root_perm_info.md"

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
	
## 7. Wallarm インスタンスへのトラフィック送信の設定
	
--8<-- "../include-ja/waf/installation/sending-traffic-to-node-oob.md"
	
## 8. Wallarm ノードの動作のテスト

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"	

## 9. 展開されたソリューションの微調整

NGINX `stable`のデフォルト設定のダイナミックWallarmモジュールがインストールされています。展開後にフィルタリングノードに一部の追加設定が必要になることがあります。

Wallarmの設定は、[NGINXのディレクティブ](../../../../admin-en/configure-parameters-en.md)またはWallarm Console UIを使用して定義されます。ディレクティブは、Wallarmノードがあるマシン上の次のファイルに設定する必要があります：

* NGINXの設定を持つ`/etc/nginx/conf.d/default.conf`
* グローバルなフィルタリングノード設定を持つ`/etc/nginx/conf.d/wallarm.conf`

    このファイルは、すべてのドメインに適用される設定に使用されます。異なるドメイングループに異なる設定を適用するには、`default.conf` ファイルを使用するか、各ドメイングループの新しい設定ファイルを作成します（たとえば、`example.com.conf` および `test.com.conf`）。NGINX設定ファイルに関する詳細な情報は、[公式 NGINX ドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)で利用可能です。
* Wallarm ノードの監視設定を持つ`/etc/nginx/conf.d/wallarm-status.conf`。詳細な説明は[リンク][wallarm-status-instr]内にあります
* Tarantoolデータベース設定を持つ`/etc/default/wallarm-tarantool`　または `/etc/sysconfig/wallarm-tarantool`

以下は、必要に応じて適用できる一部の典型的な設定です：

--8<-- "../include-ja/waf/installation/linux-packages/common-customization-options.md"

* [NGINX における動的 DNS 解決の設定][dynamic-dns-resolution-nginx]