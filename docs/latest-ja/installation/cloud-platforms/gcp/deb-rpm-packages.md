# GCP上でDEBまたはRPMパッケージからフィルタリングノードのインストール

このクイックガイドは、別のGoogle Engineインスタンスでソースパッケージからフィルタリングノードをインストールする手順を提供します。このガイドに従うことで、サポートされているオペレーティングシステムのイメージからインスタンスを作成し、そのオペレーティングシステムにWallarmフィルタリングノードをインストールします。

!!! warning "指示の制限"
    これらの指示では、ロードバランシングとノードのオートスケール化の設定はカバーされていません。これらのコンポーネントを自分で設定する場合は、[GCPの指示](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling)を見直すことをおすすめします。

## 要件

* アクティブなGCPアカウント
* [作成済みのGCPプロジェクト](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
* Wallarm Consoleで**管理者**ロールを持つアカウントへのアクセス ([US Cloud](https://us1.my.wallarm.com/) または [EU Cloud](https://my.wallarm.com/))

## フィルタリングノードのインストールオプション

フィルタリングノードは、ウェブサーバーまたは [APIゲートウェイ](https://www.wallarm.com/what/the-concept-of-an-api-gateway) モジュールとして動作するため、フィルタリングノードのパッケージと共に、ウェブサーバーまたはAPIゲートウェイのパッケージをオペレーティングシステムにインストールする必要があります。

以下のリストから、アプリケーションアーキテクチャに最も適しているウェブサーバーまたはAPIゲートウェイを選択できます：

* [NGINX Stableモジュールとしてのフィルタリングノードのインストール](#nginx-stableモジュールとしてのフィルタリングノードのインストール)
* [NGINX Plusモジュールとしてのフィルタリングノードのインストール](#nginx-plusモジュールとしてのフィルタリングノードのインストール)

## NGINX Stableモジュールとしてのフィルタリングノードのインストール

Google EngineインスタンスでNGINX Stableモジュールとしてフィルタリングノードをインストールするには：

1. WallarmがサポートするオペレーティングシステムのイメージからGoogle Engineインスタンスを作成します。以下に従って操作します：[GCPの指示](https://cloud.google.com/compute/docs/instances/create-start-instance#publicimage)：

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. 作成したインスタンスに接続します。以下に従って操作します： [GCPの指示](https://cloud.google.com/compute/docs/instances/connecting-to-instance).
3. インスタンス内で、NGINX StableのパッケージとWallarmフィルタリングノードのパッケージをインストールします。以下に従って操作します： [Wallarmの指示](../../../installation/nginx/dynamic-module.md).

別のインスタンスでpostanalyticsモジュールをインストールするには、ステップ1-2を繰り返し、以下に従ってpostanalyticsモジュールをインストールします： [Wallarmの指示](../../../admin-en/installation-postanalytics-en.md).

## NGINX Plusモジュールとしてのフィルタリングノードのインストール

Google EngineインスタンスでNGINX Plusモジュールとしてフィルタリングノードをインストールするには：

1. WallarmがサポートするオペレーティングシステムのイメージからGoogle Engineインスタンスを作成します。以下に従って操作します：[GCPの指示](https://cloud.google.com/compute/docs/instances/create-start-instance#publicimage)：

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. 作成したインスタンスに接続します。以下に従って操作します： [GCPの指示](https://cloud.google.com/compute/docs/instances/connecting-to-instance).
3. インスタンス内で、NGINX PlusのパッケージとWallarmフィルタリングノードのパッケージをインストールします。以下に従って操作します： [Wallarmの指示](../../../installation/nginx/dynamic-module.md).

別のインスタンスでpostanalyticsモジュールをインストールするには、ステップ1-2を繰り返し、以下に従ってpostanalyticsモジュールをインストールします： [Wallarmの指示](../../../admin-en/installation-postanalytics-en.md).