# インストールオプションの概要

[img-postanalytics-options]: ../images/installation-nginx-overview/postanalytics-options.png
[img-nginx-options]: ../images/installation-nginx-overview/nginx-options.png

[anchor-mod-overview]: #modules-overview
[anchor-mod-installation]: #installing-and-configuring-the-modules
[anchor-mod-inst-nginx]: #module-for-nginx
[anchor-mod-inst-nginxplus]: #module-for-nginx-plus
[anchor-mod-inst-postanalytics]: #postanalytics-module

[link-ig-nginx]: ../installation/nginx/dynamic-module.ja.md
[link-ig-nginx-distr]: ../installation/nginx/dynamic-module-from-distr.ja.md
[link-ig-nginxplus]: ../installation/nginx-plus.ja.md

Wallarmフィルタリングノードは、NGINXまたはNGINX Plusで使用するために以下のモジュールで構成されています：
*   NGINX (NGINX Plus) に接続するモジュール
*   postanalyticsモジュール

モジュールのインストールと設定の手順は、NGINXまたはNGINX Plusのインストール方法によって異なります。

このドキュメントには、以下のセクションが含まれています：

*   [モジュールの概要][anchor-mod-overview]
*   [リンク][anchor-mod-installation] 各モジュールのインストールと設定手順へ

##  モジュールの概要

フィルタリングノードがリクエストの処理に使用される場合、着信トラフィックは最初の処理から順にWallarmモジュールによる処理へ進みます。

1.  初期トラフィック処理は、システムにすでにインストールされている [NGINX][anchor-mod-inst-nginx] または [NGINX Plus][anchor-mod-inst-nginxplus] に接続するモジュールによって実行されます。
2.  後続のトラフィック処理は [postanalyticsモジュール][anchor-mod-inst-postanalytics] によって実施され、適切に機能するために大量のメモリが必要となります。したがって、次のインストールオプションから選択できます：
    *   NGINX/NGINX Plusと同じサーバーにインストールされる（サーバー構成がこれを許可する場合）
    *   NGINX/NGINX Plusとは別のサーバー群にインストールされる

![!Postanalyticsモジュールのインストールオプション][img-postanalytics-options]

##  モジュールのインストールと設定

### NGINX用モジュール

!!! warning "インストールするモジュールを選択"
    Wallarmモジュールのインストールと接続手順は、使用しているNGINXインストール方法に依存します。

Wallarmモジュール for NGINXは、以下のインストール方法のいずれかで接続できます（各インストールオプションのインストラクションへのリンクは、括弧内にリストされています）：

![!NGINX用モジュールのインストールオプション][img-nginx-options]

*   ソースファイルからNGINXをビルドする ([手順][link-ig-nginx])
*   NGINXリポジトリからNGINXパッケージをインストールする ([手順][link-ig-nginx])
*   DebianリポジトリからNGINXパッケージをインストールする ([手順][link-ig-nginx-distr])
*   CentOSリポジトリからNGINXパッケージをインストールする ([手順][link-ig-nginx-distr])

### NGINX Plus用モジュール

[ここ][link-ig-nginxplus] の指示に従って、NGINX PlusモジュールにWallarmを接続します。

### Postanalyticsモジュール

postanalyticsモジュールのインストールと設定の手順（NGINX/NGINX Plusと同じサーバーまたは別のサーバーに）は、[NGINX][anchor-mod-inst-nginx]モジュールのインストールセクションと[NGINX Plus][anchor-mod-inst-nginxplus]モジュールのインストールセクションにあります。