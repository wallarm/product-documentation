[link-docs-gcp-autoscaling]:        autoscaling-overview.md
[link-docs-gcp-node-setup]:         ../../../installation/cloud-platforms/gcp/machine-image.md
[link-cloud-connect-guide]:         ../../../installation/cloud-platforms/gcp/machine-image.md#4-connect-the-filtering-node-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../installation/cloud-platforms/gcp/machine-image.md#5-enable-wallarm-to-analyze-the-traffic
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[img-vm-instance-poweroff]:     ../../../images/installation-gcp/auto-scaling/common/create-image/vm-poweroff.png
[img-create-image]:             ../../../images/installation-gcp/auto-scaling/common/create-image/create-image.png
[img-check-image]:              ../../../images/installation-gcp/auto-scaling/common/create-image/image-list.png

[anchor-node]:  #1-creating-and-configuring-the-filtering-node-instance-on-the-google-cloud-platform
[anchor-gcp]:   #2-creating-a-virtual-machine-image

#   Google Cloud Platform上でWallarmフィルタリングノードを有する画像を作成する

Google Cloud Platform(GCP)に展開されているWallarmフィルタリングノードの自動スケーリングを設定するには、最初に仮想マシンイメージが必要です。このドキュメントでは、Wallarmフィルタリングノードがインストールされた仮想マシンの画像の準備方法を説明します。自動スケーリングの詳細な設定については、この[リンク][link-docs-gcp-autoscaling]に進んでください。

GCPでWallarmフィルタリングノード付きの画像を作成するためには、以下の手順を実行します：
1.  [Google Cloud Platformでのフィルタリングノードインスタンスの作成と設定][anchor-node]。
2.  [設定済みのフィルタリングノードインスタンスを基にした仮想マシンイメージの作成][anchor-gcp]。

##  1.  Google Cloud Platformでのフィルタリングノードインスタンスの作成と設定

画像を作成する前に、単一のWallarmフィルタリングノードの初期設定を行う必要があります。フィルタリングノードを設定するには、以下の手順を実行します：
1.  [GCP上でフィルタリングノードインスタンスを作成および設定します][link-docs-gcp-node-setup]。

    !!! warning "フィルタリングノードにインターネット接続を提供する"
        フィルタリングノードは適切な操作のためにWallarm APIサーバーへのアクセスが必要です。Wallarm APIサーバの選択は使用するWallarm Cloudによります：

        * US Cloudを使用している場合、ノードには`https://us1.api.wallarm.com`へのアクセスが必要です。
        * EU Cloudを使用している場合、ノードには`https://api.wallarm.com`へのアクセスが許可されている必要があります。
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

2.  [フィルタリングノードをWallarm Cloudに接続します][link-cloud-connect-guide]。

    !!! warning "トークンを使用してWallarm Cloudに接続する"
        フィルタリングノードをトークンを使用してWallarm cloudに接続する必要があることに注意してください。同じトークンを使用して、複数のフィルタリングノードがWallarm cloudに接続することができます。

        従って、自動スケールしたときにフィルタリングノードを手動でWallarm Cloudに接続する必要はありません。

3.  [フィルタリングノードをWebアプリケーションのリバースプロキシとして動作するように設定します][link-docs-reverse-proxy-setup]。

4.  [フィルタリングノードが正しく設定され、Webアプリケーションを悪意のあるリクエストから保護していることを確認します][link-docs-check-operation]。

フィルタリングノードの設定が完了したら、以下の手順を完了して仮想マシンをオフにします：
1.  メニューの**Compute Engine**セクションにある**VM Instances**ページに移動します。
2.  **Connect**列の右側にあるメニューボタンをクリックしてドロップダウンメニューを開きます。
3.  ドロップダウンメニューで**Stop**を選択します。

![!仮想マシンをオフにする][img-vm-instance-poweroff]

!!! info "`poweroff`コマンドを使用してオフにする"
    SSHプロトコルを経由して仮想マシンに接続し、次のコマンドを実行して仮想マシンをオフにすることもできます：

    ``` bash
 	poweroff
 	```

##  2.  仮想マシンイメージの作成

設定済みのフィルタリングノードインスタンスを基にした仮想マシンイメージを作成することができます。画像を作成するには、以下の手順を実行します：
1.  メニューの**Compute Engine**セクションにある**Images**ページに移動し、**Create image**ボタンをクリックします。
2.  **Name**フィールドにイメージ名を入力します。
3.  **Source**ドロップダウンリストから**Disk**を選択します。
4.  **Source disk**ドロップダウンリストから[以前に作成された][anchor-node]仮想マシンインスタンスの名前を選択します。

    ![!画像を作成する][img-create-image]

5.  **Create**ボタンをクリックして、仮想マシン画像の作成プロセスを開始します。

画像の作成プロセスが終了すると、利用可能な画像のリストが含まれるページにリダイレクトされます。画像が正常に作成され、リストに表示されていることを確認します。

![!画像リスト][img-check-image]

これで、準備したイメージを使用して、Google Cloud Platform上のWallarmフィルタリングノードの自動スケーリングを[設定する][link-docs-gcp-autoscaling]ことができます。