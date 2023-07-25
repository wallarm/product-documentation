# Azure上でのDEBまたはRPMパッケージからのフィルタリングノードのインストール

このクイックガイドでは、別のAzureインスタンス上のソースパッケージからフィルタリングノードをインストールする手順を提供します。このガイドに従って、サポートされているオペレーティングシステムのイメージからインスタンスを作成し、このオペレーティングシステム上にWallarmフィルタリングノードをインストールします。

!!! warning "手順の制限"
    これらの手順では、ロードバランシングとノードのオートスケーリングの構成はカバーされていません。これらのコンポーネントを自分で設定する場合は、[Azureの手順](https://docs.microsoft.com/ja-jp/azure/virtual-machines/linux/tutorial-load-balancer)を確認することをお勧めします。

## 要件

* アクティブなAzureサブスクリプション
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarmコンソールで**Administrator**ロールを持つアカウントへのアクセス

## フィルタリングノードのインストールオプション

フィルタリングノードはウェブサーバーや[APIゲートウェイ](https://www.wallarm.com/what/the-concept-of-an-api-gateway)のモジュールとして動作するため、フィルタリングノードのパッケージと共に、オペレーティングシステムにウェブサーバーまたはAPIゲートウェイのパッケージをインストールする必要があります。

以下のリストから、アプリケーションのアーキテクチャに最適なウェブサーバーまたはAPIゲートウェイを選択できます:

* [フィルタリングノードをNGINX Stableモジュールとしてインストールする](#NGINX-Stableモジュールとしてフィルタリングノードをインストールする)
* [フィルタリングノードをNGINX Plusモジュールとしてインストールする](#NGINX-Plusモジュールとしてフィルタリングノードをインストールする)

## NGINX Stableモジュールとしてフィルタリングノードをインストールする

AzureインスタンスでNGINX Stableモジュールとしてフィルタリングノードをインストールするには:

1. WallarmがサポートするオペレーティングシステムのイメージからAzureインスタンスを作成します(Azureの手順に従ってください)[https://docs.microsoft.com/ja-jp/azure/virtual-machines/linux/quick-create-portal] :

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. [Azureの手順](https://docs.microsoft.com/ja-jp/azure/bastion/bastion-connect-vm-ssh)に従って作成したインスタンスに接続します。
3. インスタンスで、[Wallarmの手順](../../../installation/nginx/dynamic-module.ja.md)に従って、NGINX StableとWallarmフィルタリングノードのパッケージをインストールします。

別のインスタンスでpostanalyticsモジュールをインストールするには、手順1-2を繰り返し、[Wallarmの手順](../../../admin-en/installation-postanalytics-en.ja.md)に従ってpostanalyticsモジュールをインストールしてください。

## NGINX Plusモジュールとしてフィルタリングノードをインストールする

AzureインスタンスでNGINX Plusモジュールとしてフィルタリングノードをインストールするには:

1. WallarmがサポートするオペレーティングシステムのイメージからAzureインスタンスを作成します(Azureの手順に従ってください)[https://docs.microsoft.com/ja-jp/azure/virtual-machines/linux/quick-create-portal] :

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. [Azureの手順](https://docs.microsoft.com/ja-jp/azure/bastion/bastion-connect-vm-ssh)に従って作成したインスタンスに接続します。
3. インスタンスで、[Wallarmの手順](../../../installation/nginx/dynamic-module.ja.md)に従って、NGINX PlusとWallarmフィルタリングノードのパッケージをインストールします。

別のインスタンスでpostanalyticsモジュールをインストールするには、手順1-2を繰り返し、[Wallarmの手順](../../../admin-en/installation-postanalytics-en.ja.md)に従ってpostanalyticsモジュールをインストールしてください。