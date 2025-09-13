#   インストールオプションの概要

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

NGINXまたはNGINX Plusと併用するWallarmフィルタリングノードは、次のモジュールで構成されます。
*   NGINX（NGINX Plus）に接続するモジュール
*   postanalyticsモジュール

モジュールのインストールと設定の順序は、NGINXまたはNGINX Plusのインストール方法に依存します。

本ドキュメントには次のセクションが含まれます。

*   [モジュールの概要][anchor-mod-overview]
*   各モジュールのインストールおよび設定手順への[リンク][anchor-mod-installation]

##  モジュールの概要

フィルタリングノードでリクエストを処理する場合、受信トラフィックは初期処理を経て、順にWallarmモジュールによる処理に進みます。

1.  初期のトラフィック処理は、システムにすでにインストールされている[NGINX][anchor-mod-inst-nginx]または[NGINX Plus][anchor-mod-inst-nginxplus]に接続するモジュールが実行します。
2.  以降のトラフィック処理は[postanalyticsモジュール][anchor-mod-inst-postanalytics]が実行します。このモジュールは適切に動作するために多くのメモリを必要とします。そのため、次のいずれかのインストールオプションを選択できます。
    *   NGINX/NGINX Plusと同じサーバーにインストール（サーバー構成が許す場合）
    *   NGINX/NGINX Plusとは別のサーバー群にインストール

![postanalyticsモジュールのインストールオプション][img-postanalytics-options]

##  モジュールのインストールと設定

### NGINX用モジュール

!!! warning "インストールするモジュールの選択"
    Wallarmモジュールのインストールおよび接続手順は、ご利用のNGINXのインストール方法に依存します。

NGINX用のWallarmモジュールは、次のいずれかの方法で接続できます（各インストールオプションの手順へのリンクは括弧内に記載しています）。

![NGINX用モジュールのインストールオプション][img-nginx-options]

*   ソースファイルからNGINXをビルド（[手順][link-ig-nginx]）
*   NGINXリポジトリからNGINXパッケージをインストール（[手順][link-ig-nginx]）
*   DebianリポジトリからNGINXパッケージをインストール（[手順][link-ig-nginx-distr]）
*   CentOSリポジトリからNGINXパッケージをインストール（[手順][link-ig-nginx-distr]）

### NGINX Plus用モジュール

これらの[手順][link-ig-nginxplus]では、WallarmをNGINX Plusモジュールに接続する方法を説明します。

### postanalyticsモジュール

postanalyticsモジュールのインストールおよび設定（NGINX/NGINX Plusと同一サーバー、または別サーバー）の手順は、[NGINX][anchor-mod-inst-nginx]モジュールのインストールセクションおよび[NGINX Plus][anchor-mod-inst-nginxplus]モジュールのインストールセクションに記載しています。