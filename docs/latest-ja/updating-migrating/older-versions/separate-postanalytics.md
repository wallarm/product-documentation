[docs-module-update]:   nginx-modules.md
[img-wl-console-users]:             ../../images/check-users.png 
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../../images/admin-guides/test-attacks-quickstart.png
[nginx-custom]:                 ../../custom/custom-nginx-version.md
[wallarm-token-types]:          ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[statistics-service-all-parameters]: ../../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:    ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ip-lists-docs]:                     ../../user-guides/ip-lists/overview.md

# EOL postanalyticsモジュールのアップグレード

この手順では、別サーバーにインストールされているサポート終了のpostanalyticsモジュール（バージョン3.6以下）をアップグレードする手順を説明します。postanalyticsモジュールは、[Wallarm NGINXモジュールのアップグレード][docs-module-update]の前にアップグレードする必要があります。

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! info "all-in-oneインストーラーでのアップグレード"
    アップグレードは、個別のLinuxパッケージが非推奨になったため、Wallarmの[all-in-oneインストーラー](../../installation/nginx/all-in-one.md)を使用して実行します。この方法は、従来のアプローチと比べて、アップグレード手順と継続的なデプロイの保守を簡素化します。
    
    インストーラーは次の処理を自動で実行します：
    
    1. OSとNGINXのバージョンを確認します。
    1. 検出したOSとNGINXのバージョン用のWallarmリポジトリを追加します。
    1. これらのリポジトリからWallarmパッケージをインストールします。
    1. インストールしたWallarmモジュールをNGINXに接続します。
    1. 提供されたトークンを使用してフィルタリングノードをWallarm Cloudに接続します。
    
        個別のLinuxパッケージによる手動アップグレードはサポートされません。

    ![手動方式との比較](../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## 要件

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## 手順1: クリーンなマシンを準備します

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## 手順2: Wallarmトークンを準備します

--8<-- "../include/waf/installation/all-in-one-token.md"

## 手順3: all-in-oneのWallarmインストーラーをダウンロードします

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## 手順4: all-in-oneのWallarmインストーラーを実行してpostanalyticsをインストールします

--8<-- "../include/waf/installation/all-in-one-postanalytics.md"

## 手順5: APIポートを更新します

--8<-- "../include/waf/upgrade/api-port-443.md"

## 手順6: 別サーバー上のNGINX-Wallarmモジュールをアップグレードします

postanalyticsモジュールを別サーバーにインストールしたら、別のサーバーで稼働している[関連するNGINX-Wallarmモジュール](nginx-modules.md)をアップグレードします。

## 手順7: NGINX-Wallarmモジュールをpostanalyticsモジュールに再接続します

--8<-- "../include/waf/installation/all-in-one-postanalytics-reconnect.md"

## 手順8: NGINX‑Wallarmと別設置のpostanalyticsモジュールの連携を確認します

--8<-- "../include/waf/installation/all-in-one-postanalytics-check-latest.md"

## 手順9: 古いpostanalyticsモジュールを削除します

--8<-- "../include/waf/installation/all-in-one-postanalytics-remove-old.md"