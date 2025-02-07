[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png

# マルチテナントノードのアップグレード

本手順では、マルチテナントノード4.xから5.0へのアップグレード手順について説明します。

サポートが終了したマルチテナントノード (3.6以下) のアップグレードには、[こちらの別手順](older-versions/multi-tenant.md)をご利用ください。

## 必要条件

* [technical tenant account](../installation/multi-tenant/overview.md#tenant-accounts)に**Global administrator**ロールを追加したユーザーによる追加コマンドの実行
* US Wallarm Cloudで作業する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudで作業する場合は`https://api.wallarm.com`へのアクセス。ファイアウォールでアクセスがブロックされていないことを確認してください
* 攻撃検知ルールやAPI仕様の更新ダウンロード、ならびにホワイトリスト、ブラックリスト、またはグレイリストに登録した国、地域、またはデータセンターの正確なIP取得のため、以下のIPアドレスへのアクセス

    --8<-- "../include/wallarm-cloud-ips.md"

## 標準のアップグレード手順に従う

標準手順は、以下の手順です：

* [WallarmをDEB/RPMパッケージからアップグレード](nginx-modules.md)
* [Wallarmをオールインワンインストーラーでアップグレード](nginx-modules.md)
* [postanalyticsモジュールをアップグレード](separate-postanalytics.md)
* [Wallarm Docker NGINXベースのイメージをアップグレード](docker-container.md)
* [統合WallarmモジュールでNGINX Ingressコントローラーをアップグレード](ingress-controller.md)
* [Sidecarプロキシをアップグレード](sidecar-proxy.md)
* [クラウドノードイメージをアップグレード](cloud-image.md)

!!! warning "マルチテナントノードの作成"
    Wallarmノード作成時に**Multi-tenant node**オプションを選択してください：

    ![マルチテナントノードの作成](../images/user-guides/nodes/create-multi-tenant-node.png)