[docs-module-update]:           nginx-modules.md
[img-wl-console-users]:         ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../images/admin-guides/test-attacks-quickstart.png
[wallarm-token-types]:          ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[statistics-service-all-parameters]: ../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ip-lists-docs]:                     ../user-guides/ip-lists/overview.md

# postanalyticsモジュールのアップグレード

本手順では、別サーバーにインストールされているpostanalyticsモジュールを最新の6.xバージョンへアップグレードする手順を説明します。**postanalyticsモジュールは、[Wallarm NGINXモジュールのアップグレード][docs-module-update]より前にアップグレードする必要があります。**

!!! info "all-in-oneインストーラーでのアップグレード"
    バージョン4.10以降は、個別のLinuxパッケージが非推奨になったため、Wallarmの[all-in-oneインストーラー](../installation/nginx/all-in-one.md)を使用してアップグレードします。この方法は、従来のアプローチと比べて、アップグレード手順と継続的なデプロイの保守を簡素化します。
    
    インストーラーは次の処理を自動で実行します。

    1. OSとNGINXのバージョンを確認します。
    1. 検出したOSとNGINXのバージョンに対応するWallarmリポジトリを追加します。
    1. これらのリポジトリからWallarmパッケージをインストールします。
    1. インストールしたWallarmモジュールをNGINXに接続します。
    1. 提供されたトークンを使用してフィルタリングノードをWallarm Cloudに接続します。

    ![all-in-oneと手動の比較](../images/installation-nginx-overview/manual-vs-all-in-one.png)

サポート終了のモジュール(3.6以下)をアップグレードするには、[別の手順](older-versions/separate-postanalytics.md)を使用してください。

## 要件

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## 手順1: クリーンなマシンを準備します

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## 手順2: Wallarmトークンを準備します

--8<-- "../include/waf/installation/all-in-one-token.md"

## 手順3: Wallarmのall-in-oneインストーラーをダウンロードします

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## 手順4: Wallarmのall-in-oneインストーラーを実行してpostanalyticsをインストールします

--8<-- "../include/waf/installation/all-in-one-postanalytics.md"

## 手順5: 別サーバー上のNGINX‑Wallarmモジュールをアップグレードします

別サーバーにpostanalyticsモジュールをインストールした後は、別のサーバーで動作している[関連するNGINX‑Wallarmモジュール](nginx-modules.md)をアップグレードします。

## 手順6: NGINX‑Wallarmモジュールをpostanalyticsモジュールに再接続します

--8<-- "../include/waf/installation/all-in-one-postanalytics-reconnect.md"

## 手順7: NGINX‑Wallarmと別サーバーのpostanalyticsモジュールの連携を確認します

--8<-- "../include/waf/installation/all-in-one-postanalytics-check-latest.md"

## 手順8: 古いpostanalyticsモジュールを削除します

--8<-- "../include/waf/installation/all-in-one-postanalytics-remove-old.md"