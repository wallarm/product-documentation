GCP上でのDEBまたはRPMパッケージからのフィルタリングノードのインストール
# 

このクイックガイドでは、別のGoogle Engineインスタンス上のソースパッケージからフィルタリングノードをインストールする方法を説明します。このガイドに従うことで、サポートされるオペレーティングシステムイメージからインスタンスを作成し、このオペレーティングシステムにWallarmフィルタリングノードをインストールします。

!!! warning "手順の制限事項"
    これらの手順では、ロードバランシングおよびノードのオートスケーリングの設定はカバーされていません。これらのコンポーネントを自分で設定する場合は、[GCPの手順](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling)を参照することをお勧めします。

## 要件

* アクティブなGCPアカウント
* [GCPプロジェクトが作成済み](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
* Wallarm Consoleの**Administrator**ロールを持つアカウントへのアクセス、[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)

## フィルタリングノードのインストールオプション

フィルタリングノードは、Webサーバーまたは[APIゲートウェイ](https://www.wallarm.com/what/the-concept-of-an-api-gateway)モジュールとして動作するため、オペレーティングシステムにフィルタリングノードパッケージと一緒にWebサーバーやAPIゲートウェイパッケージをインストールする必要があります。

以下のリストからアプリケーションアーキテクチャに最適なWebサーバーやAPIゲートウェイを選択できます:

* [フィルタリングノードをNGINX Stableモジュールとしてインストールする](#nginx-stableモジュールとしてフィルタリングノードをインストールする)
* [フィルタリングノードをNGINX Plusモジュールとしてインストールする](#nginx-plusモジュールとしてフィルタリングノードをインストールする)

## NGINX Stableモジュールとしてフィルタリングノードをインストールする

Google EngineインスタンスにNGINX Stableモジュールをフィルタリングノードとしてインストールするには：

1. Wallarmがサポートしているオペレーティングシステムイメージから、[GCPの手順](https://cloud.google.com/compute/docs/instances/create-start-instance#publicimage)に従ってGoogle Engineインスタンスを作成します:

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. [GCPの手順](https://cloud.google.com/compute/docs/instances/connecting-to-instance)に従って作成したインスタンスに接続します。
3. インスタンス内で、NGINX StableパッケージとWallarmフィルタリングノードパッケージを[Wallarmの手順](../../../installation/nginx/dynamic-module.md)に従ってインストールします。

別のインスタンスでpostanalyticsモジュールをインストールするには、手順1-2を繰り返し、[Wallarmの手順](../../../admin-en/installation-postanalytics-en.md)に従ってpostanalyticsモジュールをインストールしてください。

## NGINX Plusモジュールとしてフィルタリングノードをインストールする

Google EngineインスタンスにNGINX Plusモジュールをフィルタリングノードとしてインストールするには：

1. Wallarmがサポートしているオペレーティングシステムイメージから、[GCPの手順](https://cloud.google.com/compute/docs/instances/create-start-instance#publicimage)に従ってGoogle Engineインスタンスを作成します:

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. [GCPの手順](https://cloud.google.com/compute/docs/instances/connecting-to-instance)に従って作成したインスタンスに接続します。
3. インスタンス内で、NGINX PlusパッケージとWallarmフィルタリングノードパッケージを[Wallarmの手順](../../../installation/nginx/dynamic-module.md)に従ってインストールします。

別のインスタンスでpostanalyticsモジュールをインストールするには、手順1-2を繰り返し、[Wallarmの手順](../../../admin-en/installation-postanalytics-en.md)に従ってpostanalyticsモジュールをインストールしてください。