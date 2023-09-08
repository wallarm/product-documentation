[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png

# マルチテナントノードのアップグレード

これらの指示は、マルチテナントノード 4.x を 4.6 までアップグレードするための手順を説明しています。

エンド・オブ・ライフのマルチテナントノード（3.6 またはそれ以下）のアップグレードには、[別の指示](older-versions/multi-tenant.md)をご利用ください。

## 必要条件

* [技術的テナントアカウント](../installation/multi-tenant/configure-accounts.md#tenant-account-structure)で付与された**グローバル管理者**ロールを持つユーザーによるさらなるコマンドの実行
* US Wallarm Cloudで作業している場合は `https://us1.api.wallarm.com`、EU Wallarm Cloudで作業している場合は `https://api.wallarm.com`へのアクセス。ファイヤーウォールによってアクセスがブロックされていないことを確認してください

## 標準のアップグレード手順に従う

標準手順は次の通りです：

* [ Wallarm NGINXモジュールのアップグレード](nginx-modules.md)
* [postanalyticsモジュールのアップグレード](separate-postanalytics.md)
* [ Wallarm Docker NGINX-またはEnvoyベースのイメージのアップグレード](docker-container.md)
* [ Wallarmモジュール統合付きNGINX Ingressコントローラのアップグレード](ingress-controller.md)
* [ クラウドノードイメージのアップグレード](cloud-image.md)

!!! warning "マルチテナントノードの作成"
    Wallarmノード作成中に、**マルチテナントノード**オプションを選択してください：

    ![マルチテナントノードの作成](../images/user-guides/nodes/create-multi-tenant-node.png)