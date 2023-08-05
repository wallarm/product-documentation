[link-docs-gcp-autoscaling]:        autoscaling-overview.md
[link-docs-gcp-node-setup]:         ../../../installation/cloud-platforms/gcp/machine-image.md
[link-cloud-connect-guide]:         ../../../installation/cloud-platforms/gcp/machine-image.md#4-connect-the-filtering-node-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../installation/cloud-platforms/gcp/machine-image.md#5-enable-wallarm-to-analyze-the-traffic
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[img-vm-instance-poweroff]:     ../../../images/installation-gcp/auto-scaling/common/create-image/vm-poweroff.png
[img-create-image]:             ../../../images/installation-gcp/auto-scaling/common/create-image/create-image.png
[img-check-image]:              ../../../images/installation-gcp/auto-scaling/common/create-image/image-list.png

[anchor-node]:  #1-google-cloud-platformでフィルタリングノードインスタンスの作成と設定
[anchor-gcp]:   #2-仮想マシンイメージの作成

#   Google Cloud Platform で Wallarm フィルタリングノードを含むイメージを作成する

Google Cloud Platform (GCP) でデプロイされた Wallarm フィルタリングノードのオートスケーリングを設定するには、まず仮想マシンのイメージが必要です。本ドキュメントでは、Wallarm フィルタリングノードがインストールされている仮想マシンのイメージを準備する手順について説明します。オートスケーリングの設定について詳しく知るには、こちらの[リンク][link-docs-gcp-autoscaling]を参照してください。

GCP で Wallarm フィルタリングノードを含むイメージを作成するには、以下の手順を実行します:
1.  [Google Cloud Platform でフィルタリングノードインスタンスの作成と設定][anchor-node].
2.  [設定済みフィルタリングノードインスタンスを基に仮想マシンイメージを作成][anchor-gcp].

##  1.  Google Cloud Platform でフィルタリングノードインスタンスの作成と設定

イメージを作成する前に、まず Wallarm フィルタリングノードを初期設定する必要があります。フィルタリングノードを設定するためには、以下の手順を行います:
1.  GCP 上に[フィルタリングノードインスタンスを作成して設定][link-docs-gcp-node-setup]します。

    !!! warning "フィルタリングノードにインターネット接続を提供する"
        フィルタリングノードは適切に動作するために Wallarm API サーバーへのアクセスが必要です。Wallarm API サーバーの選択は使用する Wallarm Cloud によります:
        
        * US Cloud を使用している場合、ノードに `https://us1.api.wallarm.com`へのアクセス許可が必要です。
        * EU Cloud を使用している場合、ノードに `https://api.wallarm.com`へのアクセス許可が必要です。
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

2.  フィルタリングノードを[Wallarm Cloud に接続][link-cloud-connect-guide]します。

    !!! warning "トークンを使って Wallarm Cloud に接続する"
        フィルタリングノードはトークンを使って Wallarm Cloud に接続する必要があります。複数のフィルタリングノードが同じトークンを使用して Wallarm Cloud に接続することが許されています。
       
        したがって、オートスケール時に各フィルタリングノードを手動で Wallarm Cloud に接続する必要はありません。

3.  フィルタリングノードを、Webアプリケーションの逆プロキシとして[設定][link-docs-reverse-proxy-setup]します。

4.  フィルタリングノードが正しく設定され、悪意のあるリクエストから Web アプリケーションを保護していることを[確認][link-docs-check-operation]します。

フィルタリングノードの設定が完了したら、以下の操作を完了させることにより、仮想マシンをオフにします:
1.  メニューの **Compute Engine** セクションの **VM インスタンス** ページに移動します。
2.  **接続** 列の右側にあるメニューボタンをクリックしてドロップダウンメニューを開きます。
3.  ドロップダウンメニューで **停止** を選択します。

![!仮想マシンをオフにする][img-vm-instance-poweroff]

!!! info "`poweroff` コマンドを使用しての停止"
    SSH プロトコルを通じて接続し、次のコマンドを実行することにより、仮想マシンをオフにすることもできます:
    
    ``` bash
 	poweroff
 	```

##  2.  仮想マシンイメージの作成

設定済みのフィルタリングノードインスタンスを基に仮想マシンイメージを作成することができます。イメージを作成するには、以下の手順を行います:
1.  メニューの **Compute Engine** セクションの **Images** ページに移動し、**イメージ作成** ボタンをクリックします。
2.  **Name** フィールドにイメージ名を入力します。
3.  **Source** のドロップダウンリストから **Disk** を選択します。
4.  **Source disk** のドロップダウンリストから、[事前に作成した][anchor-node] 仮想マシンインスタンスの名前を選択します。

    ![!イメージの作成][img-create-image]

5.  仮想マシンイメージの作成プロセスを開始するために、**Create** ボタンをクリックします。

イメージ作成プロセスが完了すると、利用可能なイメージのリストが含まれているページに移動します。イメージが正常に作成され、リストに存在することを確認してください。

![!イメージリスト][img-check-image]

これで、準備したイメージを使用して、Google Cloud Platform 上の Wallarm フィルタリングノードの[オートスケーリングを設定][link-docs-gcp-autoscaling]することができます。