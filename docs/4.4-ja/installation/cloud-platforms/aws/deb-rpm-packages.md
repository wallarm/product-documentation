AWS上のDEBまたはRPMパッケージからのフィルタリングノードのインストール
------

このクイックガイドでは、別のAmazon EC2インスタンス上のソースパッケージからフィルタリングノードをインストールする手順を提供します。このガイドに従って、サポートされているオペレーティングシステムのイメージからインスタンスを作成し、このオペレーティングシステムにWallarmフィルタリングノードをインストールします。

!!! warning "手順の制約"
    これらの指示は、ロードバランシングとノードのオートスケーリングの設定をカバーしていません。これらのコンポーネントを自分で設定する場合は、[AWSのElastic Load Balancingサービスに関する説明書](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html)を確認することをお勧めします。

## 要件

* **管理**権限を持つAWSアカウントとユーザー
* [USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)のWallarmコンソールで**管理者**ロールを持つアカウントへのアクセス

## フィルタリングノードのインストールオプション

フィルタリングノードは、Webサーバーまたは[APIゲートウェイ](https://www.wallarm.com/what/the-concept-of-an-api-gateway)モジュールとして動作するため、WebサーバーまたはAPIゲートウェイのパッケージとフィルタリングノードのパッケージがオペレーティングシステムにインストールされる必要があります。

以下のリストから、アプリケーションアーキテクチャに最も適したWebサーバーまたはAPIゲートウェイを選択できます。

* [NGINX Stableモジュールとしてのフィルタリングノードのインストール](＃installing-the-filtering-node-as-the-nginx-stable-module)
* [NGINX Plusモジュールとしてのフィルタリングノードのインストール](＃installing-the-filtering-node-as-the-nginx-plus-module)

## NGINX Stableモジュールとしてのフィルタリングノードのインストール

Amazon EC2インスタンスにNGINX Stableモジュールとしてフィルタリングノードをインストールするには：

1. WallarmがサポートするオペレーティングシステムイメージからAmazon EC2インスタンスを作成します。[AWSの指示](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance)に従ってください:

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
    * Amazon Linux 2.0.2021x以下
2. [AWSの指示](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)に従って作成したインスタンスに接続する。
3. インスタンスで、NGINX StableとWallarmフィルタリングノードのパッケージを[Wallarmの指示](../../../installation/nginx/dynamic-module.md)に従ってインストールする。

別のインスタンスにpostanalyticsモジュールをインストールするには、手順1-2を繰り返し、[Wallarmの指示](../../../admin-en/installation-postanalytics-en.md)に従ってpostanalyticsモジュールをインストールしてください。

## NGINX Plusモジュールとしてのフィルタリングノードのインストール

Amazon EC2インスタンスにNGINX Plusモジュールとしてフィルタリングノードをインストールするには⠿

1. WallarmがサポートするオペレーティングシステムイメージからAmazon EC2インスタンスを作成します。[AWSの指示](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance)に従ってください:

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
    * Amazon Linux 2.0.2021x以下
2. [AWSの指示](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)に従って作成したインスタンスに接続する。
3. インスタンスで、NGINX PlusとWallarmフィルタリングノードのパッケージを[Wallarmの指示](../../../installation/nginx/dynamic-module.md)に従ってインストールする。

別のインスタンスにpostanalyticsモジュールをインストールするには、手順1-2を繰り返し、[Wallarmの指示](../../../admin-en/installation-postanalytics-en.md)に従ってpostanalyticsモジュールをインストールしてください。