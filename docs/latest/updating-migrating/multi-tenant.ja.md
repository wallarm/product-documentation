[ptrav-attack-docs]:                ../attacks-vulns-list.ja.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png

# マルチテナントノードのアップグレード

これらの手順は、マルチテナントノード 4.x を 4.4 にアップグレードするための手順を説明しています。

サポート終了のマルチテナントノード（3.6 以前）をアップグレードする場合は、[別の手順](older-versions/multi-tenant.ja.md)を使用してください。

## 要件

* [技術テナントアカウント](../installation/multi-tenant/configure-accounts.ja.md#tenant-account-structure)の下で追加された **Global administrator** 役割を持つユーザーによるさらなるコマンドの実行
* 米国 Wallarm クラウドを利用している場合は `https://us1.api.wallarm.com` へのアクセス、または欧州 Wallarm クラウドを利用している場合は `https://api.wallarm.com` へのアクセス。ファイアウォールによってアクセスがブロックされないことを確認してください

## 標準アップグレード手順に従う

標準手順とは以下のものです：

* [Wallarm NGINX modules のアップグレード](nginx-modules.ja.md)
* [postanalytics module のアップグレード](separate-postanalytics.ja.md)
* [Wallarm Docker NGINX- または Envoy-based image のアップグレード](docker-container.ja.md)
* [統合された Wallarm modules の NGINX Ingress controller のアップグレード](ingress-controller.ja.md)
* [クラウドノードイメージのアップグレード](cloud-image.ja.md)

!!! warning "マルチテナントノードの作成"
    Wallarm ノードを作成する際は、**Multi-tenant node** オプションを選択してください:

    ![!Multi-tenant node creation](../images/user-guides/nodes/create-multi-tenant-node.png)