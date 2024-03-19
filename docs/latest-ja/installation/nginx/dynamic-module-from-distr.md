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
[versioning-policy]:               ../../updating-migrating/versioning-policy.md#version-list
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
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

# ディストリビューション提供のNGINX用のダイナミックなWallarmモジュールのインストール

これらの指示は、Debian/CentOSリポジトリからインストールされたオープンソース版のNGINX用にWallarmフィルタリングノードをダイナミックモジュールとしてインストールする手順を説明しています。

!!! info "一体型インストール"
    Wallarmノード4.6からは、以下の手順のすべての活動を自動化し、ノードの展開を大幅に簡易化する[一体型インストール](all-in-one.md)を使用することを推奨します。

NGINX Open Sourceは、nginx.orgまたはDebian/CentOSのデフォルトリポジトリから取得することができます。これは、要求により、NGINXのバージョンの選好、リポジトリ管理ポリシーによります。Wallarmは、[nginx.org](dynamic-module.md)とディストリビューション提供の両方のバージョンのパッケージを提供しています。このガイドでは、Debian/CentOSリポジトリからのNGINXに焦点を当てています。

## 要件

--8<-- "../include-ja/waf/installation/linux-packages/requirements-nginx-distro.md"

--8<-- "../include-ja/waf/installation/linux-packages/common-steps-to-install-node-nginx-distro.md"

## 5. Wallarmにトラフィックの分析を許可する

--8<-- "../include-ja/waf/installation/common-steps-to-enable-traffic-analysis.md"

## 6. NGINXを再起動する

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

## 7. トラフィックの送信をWallarmインスタンスに設定する

--8<-- "../include-ja/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. Wallarmノードの動作をテストする

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## 9. 展開されたソリューションを微調整する

デフォルト設定の動的WallarmモジュールはNGINX `stable`にインストールされています。展開後、フィルタリングノードは追加の設定が必要な場合があります。

Wallarmの設定は、[NGINXディレクティブ](../../admin-en/configure-parameters-en.md)またはWallarmコンソールUIを使用して定義されます。ディレクティブは、Wallarmノードをもつマシン上の次のファイルに設定する必要があります。

* NGINX設定である `/etc/nginx/conf.d/default.conf`
* グローバルフィルタリングノード設定である `/etc/nginx/conf.d/wallarm.conf`

    このファイルは、すべてのドメインに適用される設定のために使用されます。異なるドメイングループに異なる設定を適用するには、`default.conf`ファイルを使用するか、各ドメイングループ（例えば、`example.com.conf`や `test.com.conf`など）ごとに新しい設定ファイルを作成します。NGINXの設定ファイルについての詳しい情報は[公式NGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)で利用できます。
* Wallarmのノード監視設定をもつ `/etc/nginx/conf.d/wallarm-status.conf`。詳細な説明はリンク内 [link][wallarm-status-instr]で利用できます。
* Tarantoolデータベースの設定を含む `/etc/default/wallarm-tarantool`または `/etc/sysconfig/wallarm-tarantool`

以下に、必要に応じて適用できるいくつかの典型的な設定を示します。

* [フィルタリングモードの設定][waf-mode-instr]

--8<-- "../include-ja/waf/installation/linux-packages/common-customization-options.md"

* [NGINXにおける動的DNS解決の設定][dynamic-dns-resolution-nginx]