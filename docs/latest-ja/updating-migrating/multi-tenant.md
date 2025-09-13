[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png

# マルチテナントノードのアップグレード

本ドキュメントでは、マルチテナントノードを最新の6.xにアップグレードする手順を説明します。

サポート終了のマルチテナントノード（3.6以下）をアップグレードする場合は、[別の手順](older-versions/multi-tenant.md)を使用してください。

## 前提条件

* 以降のコマンドを実行するユーザーは、[テクニカルテナントアカウント](../installation/multi-tenant/overview.md#tenant-accounts)配下で**Global administrator**ロールが付与されている必要があります。
* US Wallarm Cloudを使用している場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudを使用している場合は`https://api.wallarm.com`へアクセスできる必要があります。ファイアウォールでアクセスがブロックされていないことを確認してください。
* 攻撃検出ルールおよびAPI仕様の更新をダウンロードし、許可リスト、拒否リスト、またはグレーリストに設定した国、地域、またはデータセンターの正確なIPアドレスを取得するために、以下のIPアドレスへアクセスできる必要があります。

    --8<-- "../include/wallarm-cloud-ips.md"

## 標準アップグレード手順に従う

標準手順は次のとおりです:

* [DEB/RPMパッケージからのWallarmのアップグレード](nginx-modules.md)
* [オールインワンインストーラーでのWallarmのアップグレード](nginx-modules.md)
* [postanalyticsモジュールのアップグレード](separate-postanalytics.md)
* [Wallarm Docker NGINXベースイメージのアップグレード](docker-container.md)
* [Wallarmモジュール統合済みのNGINX Ingress controllerのアップグレード](ingress-controller.md)
* [Sidecar proxyのアップグレード](sidecar-proxy.md)
* [クラウドノードイメージのアップグレード](cloud-image.md)

!!! warning "マルチテナントノードの作成"
    Wallarmノードの作成時は、**Multi-tenant node**オプションを選択してください:

    ![マルチテナントノードの作成](../images/user-guides/nodes/create-multi-tenant-node.png)