# インストールオプションの概要

[img-postanalytics-options]:    ../images/installation-nginx-overview/postanalytics-options.png
[img-nginx-options]:            ../images/installation-nginx-overview/nginx-options.png

[anchor-mod-overview]:              #modules-overview
[anchor-mod-installation]:          #installing-and-configuring-the-modules
[anchor-mod-inst-nginx]:            #module-for-nginx
[anchor-mod-inst-nginxplus]:        #module-for-nginx-plus
[anchor-mod-inst-postanalytics]:    #postanalytics-module

[link-ig-nginx]:                    ../installation/nginx/dynamic-module.md
[link-ig-nginx-distr]:              ../installation/nginx/dynamic-module-from-distr.md
[link-ig-nginxplus]:                ../installation/nginx-plus.md

<!-- !!!!! TO MOVE -->

Wallarmフィルタリングノード（NGINXまたはNGINX Plusで利用されるもの）は、以下のモジュールで構成されています:
*   NGINX (NGINX Plus)に接続するモジュール
*   postanalyticsモジュール

モジュールのインストールおよび設定順序は、NGINXまたはNGINX Plusのインストール方法によって異なります。

本ドキュメントには以下のセクションが含まれます:

*   [モジュールの概要][anchor-mod-overview]
*   特定のモジュールのインストールおよび設定手順への[リンク][anchor-mod-installation]

## モジュールの概要

フィルタリングノードがリクエストを処理する際、受信トラフィックは初期処理を経た後、Wallarmモジュールによる処理が順次実行されます。

1.  初期トラフィックの処理は、システムに既にインストールされている[NGINX][anchor-mod-inst-nginx]または[NGINX Plus][anchor-mod-inst-nginxplus]に接続するモジュールで実施されます。
2.  その後のトラフィックの処理は、[postanalyticsモジュール][anchor-mod-inst-postanalytics]によって行われます。このモジュールは適切に動作するために大量のメモリを必要とするため、以下のいずれかのインストールオプションを選択できます:
    *   NGINX/NGINX Plusと同じサーバーにインストールする（サーバー構成が許す場合）
    *   NGINX/NGINX Plusとは別のサーバー群にインストールする

![Postanalytics Module Installation Options][img-postanalytics-options]

## モジュールのインストールおよび設定

### NGINX用モジュール

!!! warning "インストールするモジュールの選択について"
    Wallarmモジュールのインストールおよび接続手順は、使用しているNGINXのインストール方法によって異なります。

NGINX用のWallarmモジュールは、以下のいずれかのインストール方法により接続できます（各インストールオプションの手順へのリンクが括弧内に記載されています）:

![Module for NGINX Installation Options][img-nginx-options]

*   ソースファイルからNGINXをビルドする ([手順][link-ig-nginx])
*   NGINXリポジトリからNGINXパッケージをインストールする ([手順][link-ig-nginx])
*   DebianリポジトリからNGINXパッケージをインストールする ([手順][link-ig-nginx-distr])
*   CentOSリポジトリからNGINXパッケージをインストールする ([手順][link-ig-nginx-distr])

### NGINX Plus用モジュール

[これらの][link-ig-nginxplus]手順には、NGINX Plus用モジュールへのWallarm接続方法が記載されています。

### postanalyticsモジュール

同一サーバー上でNGINX/NGINX Plusと共にインストールする場合も、別サーバーにインストールする場合も、postanalyticsモジュールのインストールおよび設定手順は、[NGINX][anchor-mod-inst-nginx]用モジュールのインストールセクションおよび[NGINX Plus][anchor-mod-inst-nginxplus]用モジュールのインストールセクションに記載されています。