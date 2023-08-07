# Azure上でDEBまたはRPMパッケージからのフィルタリングノードのインストール

このクイックガイドでは、個別のAzureインスタンス上のソースパッケージからフィルタリングノードをインストールする手順を提供します。このガイドに従うことで、サポートされるオペレーティングシステムのイメージからインスタンスを作成し、そのオペレーティングシステムにWallarmフィルタリングノードをインストールします。

!!! warning "指示の制限"
    これらの指示は、ロードバランシングとノードオートスケーリングの設定をカバーしていません。これらのコンポーネントを自分で設定する場合は、[Azureの指示](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/tutorial-load-balancer)を確認することをお勧めします。

## 必須要件

* アクティブなAzureサブスクリプション
* Wallarmコンソールで**管理者**の役割を持つアカウントへのアクセス（[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)用）

## フィルタリングノードのインストールオプション

フィルタリングノードはウェブサーバーまたは[APIゲートウェイ](https://www.wallarm.com/what/the-concept-of-an-api-gateway)モジュールとして動作するため、ウェブサーバーまたはAPIゲートウェイのパッケージはフィルタリングノードのパッケージと共にオペレーティングシステムにインストールする必要があります。

以下のリストから、アプリケーションアーキテクチャに最も適合するウェブサーバーまたはAPIゲートウェイを選択できます。

* [NGINX Stableモジュールとしてフィルタリングノードをインストールする](#nginx-stableモジュールとしてのフィルタリングノードのインストール)
* [NGINX Plusモジュールとしてフィルタリングノードをインストールする](#nginx-plusモジュールとしてのフィルタリングノードのインストール)

## NGINX Stableモジュールとしてのフィルタリングノードのインストール

AzureインスタンスでNGINX Stableモジュールとしてフィルタリングノードをインストールするには：

1. WallarmがサポートするオペレーティングシステムイメージからAzureインスタンスを作成します。詳細は[Azureの指示](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal)に従ってください：

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. 作成したインスタンスに接続します。詳細は[Azureの指示](https://docs.microsoft.com/en-us/azure/bastion/bastion-connect-vm-ssh)に従ってください。
3. インスタンス内で、NGINX StableとWallarmフィルタリングノードのパッケージをインストールします。詳細は[Wallarmの指示](../../../installation/nginx/dynamic-module.md)に従ってください。

別のインスタンスでpostanalyticsモジュールをインストールするには、手順1から2を繰り返し、postanalyticsモジュールを[Wallarmの指示](../../../admin-en/installation-postanalytics-en.md)に従ってインストールしてください。

## NGINX Plusモジュールとしてのフィルタリングノードのインストール

AzureインスタンスでNGINX Plusモジュールとしてフィルタリングノードをインストールするには：

1. WallarmがサポートするオペレーティングシステムイメージからAzureインスタンスを作成します。詳細は[Azureの指示](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal)に従ってください：

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. 作成したインスタンスに接続します。詳細は[Azureの指示](https://docs.microsoft.com/en-us/azure/bastion/bastion-connect-vm-ssh)に従ってください。
3. インスタンス内で、NGINX PlusとWallarmフィルタリングノードのパッケージをインストールします。詳細は[Wallarmの指示](../../../installation/nginx/dynamic-module.md)に従ってください。

別のインスタンスでpostanalyticsモジュールをインストールするには、手順1から2を繰り返し、postanalyticsモジュールを[Wallarmの指示](../../../admin-en/installation-postanalytics-en.md)に従ってインストールしてください。