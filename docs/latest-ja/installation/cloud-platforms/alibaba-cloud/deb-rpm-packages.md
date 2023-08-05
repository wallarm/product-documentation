# Alibaba CloudでのDEBまたはRPMパッケージからのフィルタリングノードのインストール

このクイックガイドは、別のAlibaba Cloudインスタンスでソースパッケージからフィルタリングノードをインストールする手順を提供します。このガイドに従うと、対応するオペレーティングシステムイメージからインスタンスを作成し、そのオペレーティングシステムにWallarmフィルタリングノードをインストールします。

!!! warning "指示の制限"
    これらの指示では、ロードバランシングとノードの自動スケーリングの設定はカバーされていません。これらのコンポーネントを自分で設定する場合は、[Alibaba Cloud Elastic Compute Service（ECS）の指示](https://www.alibabacloud.com/product/ecs)を見直すことをお勧めします。

## 必須要件

* [Alibaba Cloud Console](https://account.alibabacloud.com/login/login.htm)へのアクセス
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**管理者**ロールのアカウントへのアクセス

## フィルタリングノードのインストールオプション

フィルタリングノードはWebサーバーまたは[APIゲートウェイ](https://www.wallarm.com/what/the-concept-of-an-api-gateway)モジュールとして動作するため、WebサーバーまたはAPIゲートウェイのパッケージをフィルタリングノードのパッケージとともにオペレーティングシステムにインストールする必要があります。

以下のリストから、アプリケーションアーキテクチャに最も適したWebサーバーまたはAPIゲートウェイを選択できます：

* [フィルタリングノードをNGINX安定モジュールとしてインストールする](#nginx安定モジュールとしてのフィルタリングノードのインストール)
* [フィルタリングノードをNGINX Plusモジュールとしてインストールする](#nginx-plusモジュールとしてのフィルタリングノードのインストール)

## NGINX安定モジュールとしてのフィルタリングノードのインストール

Alibaba CloudインスタンスでフィルタリングノードをNGINX Stableモジュールとしてインストールするには：

1. WallarmがサポートするオペレーティングシステムイメージからAlibaba Cloudインスタンスを作成します。[Alibaba Cloudの命令](https://www.alibabacloud.com/help/doc-detail/87190.htm)に従ってください：

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. [Alibaba Cloudの指示](https://www.alibabacloud.com/help/doc-detail/71529.htm)に従って作成したインスタンスに接続します。
3. インスタンスで、NGINX StableとWallarmフィルタリングノードのパッケージを[Wallarmの指示](../../../installation/nginx/dynamic-module.md)に従ってインストールします。

別のインスタンスでpostanalyticsモジュールをインストールするには、手順1-2を繰り返し、postanalyticsモジュールを[Wallarmの指示](../../../admin-en/installation-postanalytics-en.md)に従ってインストールしてください。

## NGINX Plusモジュールとしてのフィルタリングノードのインストール

Alibaba CloudインスタンスでフィルタリングノードをNGINX Plusモジュールとしてインストールするには：

1. WallarmがサポートするオペレーティングシステムイメージからAlibaba Cloudインスタンスを作成します。[Alibaba Cloudの命令](https://www.alibabacloud.com/help/doc-detail/87190.htm)に従ってください：

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. [Alibaba Cloudの指示](https://www.alibabacloud.com/help/doc-detail/71529.htm)に従って作成したインスタンスに接続します。
3. インスタンスで、NGINX PlusとWallarmフィルタリングノードのパッケージを[Wallarmの指示](../../../installation/nginx/dynamic-module.md)に従ってインストールします。

別のインスタンスでpostanalyticsモジュールをインストールするには、手順1-2を繰り返し、postanalyticsモジュールを[Wallarmの指示](../../../admin-en/installation-postanalytics-en.md)に従ってインストールしてください。