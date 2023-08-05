# AWS上でDEBまたはRPMパッケージからフィルタリングノードをインストールする

このクイックガイドでは、別のAmazon EC2インスタンスにソースパッケージからフィルタリングノードをインストールする手順を提供します。このガイドに従うと、サポートされるオペレーティングシステムのイメージからインスタンスを作成し、そのオペレーティングシステムにWallarmフィルタリングノードをインストールします。

!!! warning "指示の制限"
    これらの指示では、ロードバランシングとノードのオートスケーリングの設定はカバーされていません。これらのコンポーネントを自分で設定する場合は、[AWSのElastic Load Balancingサービスに関する指示](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html)を見直すことをお勧めします。
    
## 要件

* **admin** の権限を持つAWSアカウントとユーザー
* Wallarm Consoleで**Administrator**の役割を持つアカウントへのアクセス ([US Cloud](https://us1.my.wallarm.com/) または [EU Cloud](https://my.wallarm.com/)用)

## フィルタリングノードのインストールオプション

フィルタリングノードはウェブサーバーまたは[APIゲートウェイ](https://www.wallarm.com/what/the-concept-of-an-api-gateway)モジュールとして動作するため、ウェブサーバーまたはAPIゲートウェイのパッケージはフィルタリングノードのパッケージと一緒にオペレーティングシステムにインストールする必要があります。

以下のリストから、アプリケーションアーキテクチャに最も適したウェブサーバーまたはAPIゲートウェイを選択できます：

* [NGINX Stableモジュールとしてフィルタリングノードをインストールする](#nginx-stableモジュールとしてフィルタリングノードをインストールする)
* [NGINX Plusモジュールとしてフィルタリングノードをインストールする](#nginx-plusモジュールとしてフィルタリングノードをインストールする)

## NGINX Stableモジュールとしてフィルタリングノードをインストールする

Amazon EC2インスタンスでNGINX Stableモジュールとしてフィルタリングノードをインストールするには：

1. WallarmがサポートするオペレーティングシステムイメージからAmazon EC2インスタンスを作成します。[AWSの指示](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance)に従ってください。

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
    * Amazon Linux 2.0.2021x 以前
2. [AWSの指示](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)に従って作成したインスタンスに接続します。
3. インスタンスで、[Wallarmの指示](../../../installation/nginx/dynamic-module.md)に従ってNGINX StableとWallarmフィルタリングノードのパッケージをインストールします。

別のインスタンスでpostanalyticsモジュールをインストールするには、手順1-2を繰り返し、[Wallarmの指示](../../../admin-en/installation-postanalytics-en.md)に従ってpostanalyticsモジュールをインストールしてください。

## NGINX Plusモジュールとしてフィルタリングノードをインストールする

Amazon EC2インスタンスでNGINX Plusモジュールとしてフィルタリングノードをインストールするには：

1. WallarmがサポートするオペレーティングシステムイメージからAmazon EC2インスタンスを作成します。[AWSの指示](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance)に従ってください。
    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
    * Amazon Linux 2.0.2021x 以前
2. [AWSの指示](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)に従って作成したインスタンスに接続します。
3. インスタンスで、[Wallarmの指示](../../../installation/nginx/dynamic-module.md)に従ってNGINX PlusとWallarmフィルタリングノードのパッケージをインストールします。

別のインスタンスでpostanalyticsモジュールをインストールするには、手順1-2を繰り返し、[Wallarmの指示](../../../admin-en/installation-postanalytics-en.md)に従ってpostanalyticsモジュールをインストールしてください。