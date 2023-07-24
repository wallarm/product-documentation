					# Alibaba CloudでのDEBまたはRPMパッケージからのフィルタリングノードのインストール

このクイックガイドでは、別のAlibaba Cloudインスタンス上のソースパッケージからフィルタリングノードをインストールする手順を説明します。このガイドに従って、対応するオペレーティングシステムのイメージからインスタンスを作成し、そのオペレーティングシステムにWallarmフィルタリングノードをインストールします。

!!! warning "指示の制限"
    これらの指示では、ロードバランシングおよびノード自動スケーリングの設定はカバーされていません。これらのコンポーネントを設定する場合は、[Alibaba Cloud Elastic Compute Service（ECS）の指示](https://www.alibabacloud.com/product/ecs)を参照することをお勧めします。

## 要件

* [Alibaba Cloud Console](https://account.alibabacloud.com/login/login.htm)へのアクセス
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**管理者**の役割を持つアカウントへのアクセス

## フィルタリングノードのインストールオプション

フィルタリングノードは、Webサーバーまたは[APIゲートウェイ](https://www.wallarm.com/what/the-concept-of-an-api-gateway)モジュールとして動作するため、WebサーバーやAPIゲートウェイのパッケージをフィルタリングノードパッケージと共にオペレーティングシステムにインストールする必要があります。

以下のリストから、アプリケーションのアーキテクチャに最適なWebサーバーまたはAPIゲートウェイを選択できます。

* [フィルタリングノードをNGINX Stableモジュールとしてインストールする](#installing-the-filtering-node-as-the-nginx-stable-module)
* [フィルタリングノードをNGINX Plusモジュールとしてインストールする](#installing-the-filtering-node-as-the-nginx-plus-module)

## NGINX Stableモジュールとしてのフィルタリングノードのインストール

Alibaba CloudインスタンスにNGINX Stableモジュールとしてフィルタリングノードをインストールするには：

1. [Alibaba Cloudの指示](https://www.alibabacloud.com/help/doc-detail/87190.htm)に従ってWallarmによってサポートされるオペレーティングシステムイメージからAlibaba Cloudインスタンスを作成します。

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. [Alibaba Cloudの指示](https://www.alibabacloud.com/help/doc-detail/71529.htm)に従って作成されたインスタンスに接続します。
3. インスタンス内で、[Wallarmの指示](../../../installation/nginx/dynamic-module.md)に従って、NGINX StableのパッケージとWallarmフィルタリングノードのパッケージをインストールします。

別のインスタンスでpostanalyticsモジュールをインストールするには、手順1-2を繰り返し、[Wallarmの指示](../../../admin-en/installation-postanalytics-en.md)に従ってpostanalyticsモジュールをインストールしてください。

## NGINX Plusモジュールとしてのフィルタリングノードのインストール

Alibaba CloudインスタンスにNGINX Plusモジュールとしてフィルタリングノードをインストールするには：

1. [Alibaba Cloudの指示](https://www.alibabacloud.com/help/doc-detail/87190.htm)に従ってWallarmによってサポートされるオペレーティングシステムイメージからAlibaba Cloudインスタンスを作成します。

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. [Alibaba Cloudの指示](https://www.alibabacloud.com/help/doc-detail/71529.htm)に従って作成されたインスタンスに接続します。
3. インスタンス内で、[Wallarmの指示](../../../installation/nginx/dynamic-module.md)に従って、NGINX PlusのパッケージとWallarmフィルタリングノードのパッケージをインストールします。

別のインスタンスでpostanalyticsモジュールをインストールするには、手順1-2を繰り返し、[Wallarmの指示](../../../admin-en/installation-postanalytics-en.md)に従ってpostanalyticsモジュールをインストールしてください。