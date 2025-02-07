[docs-module-update]:   nginx-modules.md
[img-wl-console-users]:             ../../images/check-users.png 
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../../images/admin-guides/test-attacks-quickstart.png
[nginx-custom]:                 ../../custom/custom-nginx-version.md
[wallarm-token-types]:          ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]:             ../../images/tarantool-status.png
[statistics-service-all-parameters]: ../../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:    ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ip-lists-docs]:                     ../../user-guides/ip-lists/overview.md

# EOLポストアナリティクスモジュールのアップグレード

これらの手順は、別サーバーにインストールされた廃止予定のポストアナリティクスモジュール（バージョン3.6およびそれ以前）のアップグレード方法について説明します。アップグレードは[Upgrading Wallarm NGINX modules][docs-module-update]の前に、ポストアナリティクスモジュールをアップグレードする必要があります。

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! info "all-in-one installerを使用したアップグレード"
    個別のLinuxパッケージが非推奨となったため、アップグレードはWallarmの[all-in-one installer](../../installation/nginx/all-in-one.md)を使用して実行されます。この方法は従来の方法と比較して、アップグレード手順および継続的な展開メンテナンスを簡素化します。
    
    インストーラーは自動的に以下の処理を実行します：

    1. OSとNGINXのバージョンを確認します。
    1. 検出されたOSとNGINXのバージョンに対応するWallarmリポジトリを追加します。
    1. これらのリポジトリからWallarmパッケージをインストールします。
    1. インストールされたWallarmモジュールをNGINXに接続します。
    1. 提供されたトークンを使用して、フィルタリングノードをWallarm Cloudに接続します。
    
        個別のLinuxパッケージを使用した手動アップグレードはもはやサポートされません。

    ![手動と比較したオールインワン](../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## 要件

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## ステップ1：クリーンマシンの準備

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## ステップ2：Wallarmトークンの準備

--8<-- "../include/waf/installation/all-in-one-token.md"

## ステップ3：all-in-one Wallarmインストーラーのダウンロード

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## ステップ4：all-in-one Wallarmインストーラーを実行してポストアナリティクスをインストール

--8<-- "../include/waf/installation/all-in-one-postanalytics.md"

## ステップ5：APIポートの更新

--8<-- "../include/waf/upgrade/api-port-443.md"

## ステップ6：別サーバー上のNGINX-Wallarmモジュールのアップグレード

別サーバーにポストアナリティクスモジュールがインストールされたら、別のサーバーで稼働している[関連するNGINX-Wallarmモジュール](nginx-modules.md)をアップグレードします。

## ステップ7：NGINX-Wallarmモジュールをポストアナリティクスモジュールに再接続

--8<-- "../include/waf/installation/all-in-one-postanalytics-reconnect.md"

## ステップ8：NGINX-Wallarmモジュールと別サーバーのポストアナリティクスモジュールの連携状況を確認

--8<-- "../include/waf/installation/all-in-one-postanalytics-check.md"

## ステップ9：旧ポストアナリティクスモジュールの削除

--8<-- "../include/waf/installation/all-in-one-postanalytics-remove-old.md"