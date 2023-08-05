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

Wallarmのフィルタリングノードは、NGINXまたはNGINX Plusと一緒に使われ、次のモジュールで構成されます：
*   NGINX（NGINX Plus）に接続するモジュール
*   postanalytics モジュール

モジュールのインストールと設定の順序は、NGINXまたはNGINX Plusのインストール方法に依存します。

このドキュメントには以下のセクションが含まれています：

*   [モジュールの概要][anchor-mod-overview]
*   各モジュールのインストールと設定の手順への[リンク][anchor-mod-installation]

##  モジュールの概要

フィルタリングノードがリクエストの処理に使われるとき、着信トラフィックは初期処理及びWallarmモジュールによる処理を順番に受けます。

1.  初期のトラフィック処理は、すでにシステムにインストールされている[NGINX][anchor-mod-inst-nginx] または [NGINX Plus][anchor-mod-inst-nginxplus]に接続するモジュールによって実行されます。
2.  次のトラフィック処理は、[postanalytics モジュール][anchor-mod-inst-postanalytics]によって行われ、これには大量のメモリが必要です。したがって、以下のインストールオプションから一つを選ぶことができます:
    *   NGINX/NGINX Plusと同じサーバー上でインストール（サーバーの設定がこれを許す場合）
    *   NGINX/NGINX Plusとは別のサーバーグループ上でインストール

![!Postanalytics Module Installation Options][img-postanalytics-options]

##  モジュールのインストールと設定

### NGINXのためのモジュール

!!! warning "インストールするモジュールを選ぶ"
    Wallarmモジュールのインストールと接続手順は、使用しているNGINXのインストール方法に依存します。

WallarmのNGINX用モジュールは、次のインストール方法のいずれかで接続できます（各インストールオプションの手順へのリンクは括弧内に記載されています）：

![!Module for NGINX Installation Options][img-nginx-options]

*   ソースファイルからNGINXをビルドする（[手順][link-ig-nginx]）
*   NGINXのリポジトリからNGINXパッケージをインストールする（[手順][link-ig-nginx]）
*   DebianリポジトリからNGINXパッケージをインストールする（[手順][link-ig-nginx-distr]）
*   CentOSリポジトリからNGINXパッケージをインストールする（[手順][link-ig-nginx-distr]）

### NGINX Plusのためのモジュール

[この][link-ig-nginxplus]手順は、WallarmをNGINX Plusモジュールに接続する方法を説明しています。

### Postanalytics モジュール

Postanalyticsモジュールのインストールと設定の手順（NGINX/NGINX Plusと同じサーバー上、または別のサーバー上）は、[NGINX][anchor-mod-inst-nginx] モジュールのインストールセクションと [NGINX Plus][anchor-mod-inst-nginxplus] モジュールのインストールセクションにあります。