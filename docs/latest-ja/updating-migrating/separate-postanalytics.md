[docs-module-update]:           nginx-modules.md
[img-wl-console-users]:         ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../images/admin-guides/test-attacks-quickstart.png
[wallarm-token-types]:          ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]:             ../images/tarantool-status.png
[statistics-service-all-parameters]: ../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ip-lists-docs]:                     ../user-guides/ip-lists/overview.md

# postanalyticsモジュールのアップグレード

これらの手順は、別サーバー上にインストールされているpostanalyticsモジュール4.xをアップグレードする手順について説明しています。postanalyticsモジュールは、[Wallarm NGINXモジュールのアップグレード][docs-module-update]の前にアップグレードする必要があります。

!!! info "all-in-oneインストーラーによるアップグレード"
    バージョン4.10以降、個別のLinuxパッケージが廃止されたため、アップグレードはWallarmの[all-in-oneインストーラー](../installation/nginx/all-in-one.md)を使用して実施されます。この方法は、従来のアプローチと比べてアップグレードプロセスおよび継続的な展開メンテナンスを簡素化します。
    
    インストーラーは自動的に以下の処理を行います：

    1. OSおよびNGINXのバージョンを確認します。
    1. 検出されたOSおよびNGINXのバージョンに応じてWallarmリポジトリを追加します。
    1. これらのリポジトリからWallarmパッケージをインストールします。
    1. インストールされたWallarmモジュールをNGINXに接続します。
    1. 提供されたトークンを使用してフィルタリングノードをWallarm Cloudに接続します。

    ![all-in-oneと手動の比較](../images/installation-nginx-overview/manual-vs-all-in-one.png)

サポート終了モジュール (3.6以下) をアップグレードするには、[こちらの別の手順](older-versions/separate-postanalytics.md)をご使用ください。

## 必要条件

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## ステップ 1: クリーンなマシンを準備します

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## ステップ 2: Wallarmトークンを準備します

--8<-- "../include/waf/installation/all-in-one-token.md"

## ステップ 3: all-in-one Wallarmインストーラーをダウンロードします

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## ステップ 4: all-in-one Wallarmインストーラーを実行してpostanalyticsをインストールします

--8<-- "../include/waf/installation/all-in-one-postanalytics.md"

## ステップ 5: 別サーバー上のNGINX-Wallarmモジュールをアップグレードします

別サーバー上にpostanalyticsモジュールがインストールされたら、異なるサーバーで稼働する[関連するNGINX-Wallarmモジュール](nginx-modules.md)をアップグレードします。

## ステップ 6: NGINX-Wallarmモジュールをpostanalyticsモジュールに再接続します

--8<-- "../include/waf/installation/all-in-one-postanalytics-reconnect-5.0.md"

## ステップ 7: NGINX-Wallarmモジュールと別サーバーのpostanalyticsモジュールの連携を確認します

--8<-- "../include/waf/installation/all-in-one-postanalytics-check.md"

## ステップ 8: 古いpostanalyticsモジュールを削除します

--8<-- "../include/waf/installation/all-in-one-postanalytics-remove-old.md"