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
[install-postanalytics-docs]:       ../../../../../admin-en/installation-postanalytics-en/
[versioning-policy]:                ../../../../updating-migrating/versioning-policy.md#version-list
[dynamic-dns-resolution-nginx]:     ../../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[install-postanalytics-instr]:      ../../../../admin-en/installation-postanalytics-en.md
[img-node-with-several-instances]:  ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:          ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                     ../../../custom/custom-nginx-version.md
[node-token]:                       ../../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../../installation/supported-deployment-options.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png

# ディストリビューション用のNGINXに対するダイナミックWallarmモジュールのインストール

これらの手順では、Debian/CentOS リポジトリからインストールしたオープンソース版の NGINX に対するダイナミックモジュールとして Wallarm フィルタリングノードをインストールする方法について説明しています。ノードはトラフィック分析をインラインで実行します。

!!! info "ワンストップインストール"
    Wallarm ノード 4.6 からは、下記のステップでリストアップされたすべての活動を自動化し、ノードの展開をはるかに容易にする[ワンストップインストール](all-in-one.md)の使用を推奨しています。

NGINX Open Source は、nginx.org もしくはご要望、NGINXバージョンの設定、リポジトリ管理ポリシーに応じて Debian/CentOS のデフォルトリポジトリから入手できます。Wallarmでは、[nginx.org](individual-packages-nginx-stable.md)およびディストリビューション提供バージョンの両方のためのパッケージを提供しています。このガイドでは、Debian/CentOSリポジトリからのNGINXに焦点を当てています。

## 要件

--8<-- "../include-ja/waf/installation/linux-packages/requirements-nginx-distro.md"

--8<-- "../include-ja/waf/installation/linux-packages/common-steps-to-install-node-nginx-distro.md"

## 5. Wallarmによるトラフィック分析の有効化

--8<-- "../include-ja/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

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
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

## 7. Wallarm インスタンスへのトラフィック送信の設定

--8<-- "../include-ja/waf/installation/sending-traffic-to-node-inline.md"

## 8. Wallarm ノードの動作テスト

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## 9. 展開したソリューションの微調整

デフォルト設定での NGINX `stable` に対するダイナミック Wallarm モジュールがインストールされています。フィルタリングノードは展開後に追加設定を必要とする場合があります。

Wallarmの設定は、[NGINX指令](../../../../admin-en/configure-parameters-en.md)またはWallarm Console UIを使用して定義されます。指令はWallarmノードのマシン上の以下のファイルに設定する必要があります：

* NGINXの設定を記載した `/etc/nginx/conf.d/default.conf`
* グローバルなフィルタリングノードの設定を記載した `/etc/nginx/conf.d/wallarm.conf`

    このファイルは、全てのドメインに適用される設定のために使用します。異なる設定を異なるドメイングループに適用するには、`default.conf` ファイルを使用するか、各ドメイングループ用の新しい設定ファイル（例：`example.com.conf`、`test.com.conf`）を作成します。NGINXの設定ファイルに関するより詳しい情報は、[公式NGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)で利用できます。
* Wallarmノードの監視設定を記載した `/etc/nginx/conf.d/wallarm-status.conf`。詳細な説明は[リンク][wallarm-status-instr]内で利用可能です。
* Tarantoolデータベースの設定を記載した `/etc/default/wallarm-tarantool` または `/etc/sysconfig/wallarm-tarantool`

以下は、必要に応じて適用可能な典型的な設定のいくつかです：

* [フィルタリングモードの設定][waf-mode-instr]

--8<-- "../include-ja/waf/installation/linux-packages/common-customization-options.md"

* [NGINXでのダイナミックDNS解決の設定][dynamic-dns-resolution-nginx]