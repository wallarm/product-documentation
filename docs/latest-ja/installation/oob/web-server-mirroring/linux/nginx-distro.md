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

# 配布用NGINX向けWallarm OOBダイナミックモジュールのインストール

この指示書では、配布用NGINX用のLinuxパッケージを使用したWallarmを[OOB](../overview.md)ダイナミックモジュールとしてインストールする手順を説明します。

NGINX Open Sourceは、nginx.orgから入手するか、あるいはDebian/CentOSのデフォルトのリポジトリから入手することができます。これは、あなたの要件、NGINXのバージョンの好み、リポジトリ管理ポリシーによります。 Wallarmは[nginx.org](nginx-stable.md)対応版と配布用バージョンのパッケージを提供します。 本ガイドでは、Debian/CentOSリポジトリからのNGINXに焦点を当てます。

Wallarmモジュールは、下記のオペレーティングシステム上の配布用NGINXと互換性があります：

* Debian 10.x (buster)
* Debian 11.x (bullseye)
* CentOS 7.x
* AlmaLinux、Rocky Linux、またはOracle Linux 8.x

## 要件

--8<-- "../include-ja/waf/installation/linux-packages/requirements-nginx-stable.md"

--8<-- "../include-ja/waf/installation/linux-packages/common-steps-to-install-node-nginx-distro.md"

## 5. Wallarmでトラフィックの分析を有効にする

--8<-- "../include-ja/waf/installation/oob/steps-for-mirroring-linux.md"

## 6. NGINXの再起動

--8<-- "../include-ja/waf/root_perm_info.md"

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

## 7. Wallarm インスタンスへのトラフィックの送信を設定する

--8<-- "../include-ja/waf/installation/sending-traffic-to-node-oob.md"

## 8. Wallarmノードの動作をテストする

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## 9. 展開したソリューションを微調整する

デフォルト設定でNGINX `stable`用のダイナミックWallarmモジュールがインストールされています。フィルタリングノードは展開後に追加の設定を必要とする場合があります。

Wallarmの設定は、[NGINXのディレクティブ](../../../../admin-en/configure-parameters-en.md)またはWallarm Console UIを使用して定義されます。ディレクティブは、Wallarmノードがあるマシンの次のファイルに設定する必要があります：

* NGINX設定の`/etc/nginx/conf.d/default.conf`
* グローバルフィルタリングノード設定の`/etc/nginx/conf.d/wallarm.conf`

    このファイルはすべてのドメインに適用される設定のために使用されます。異なるドメイングループに異なる設定を適用するには、`default.conf`ファイルを使用するか、各ドメイングループ（例えば、`example.com.conf`や`test.com.conf`）に対して新しい設定ファイルを作成してください。NGINX設定ファイルについての詳細な情報は[公式NGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)で利用できます。
* Wallarmノードの監視設定の`/etc/nginx/conf.d/wallarm-status.conf`。 詳細な説明は[リンク][wallarm-status-instr]で利用可能です。
* Tarantoolデータベース設定の`/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool`

下記に、必要に応じて適用できる典型的な設定をいくつか示します：

--8<-- "../include-ja/waf/installation/linux-packages/common-customization-options.md"

* [NGINXでの動的DNS解決の設定][dynamic-dns-resolution-nginx]
