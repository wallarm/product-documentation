[link-docs-gcp-autoscaling]:        autoscaling-overview.md
[link-docs-gcp-node-setup]:         ../../../installation/cloud-platforms/gcp/machine-image.md
[link-cloud-connect-guide]:         ../../../installation/cloud-platforms/gcp/machine-image.md#5-connect-the-instance-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../installation/cloud-platforms/gcp/machine-image.md#6-configure-sending-traffic-to-the-wallarm-instance
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[img-vm-instance-poweroff]:     ../../../images/installation-gcp/auto-scaling/common/create-image/vm-poweroff.png
[img-create-image]:             ../../../images/installation-gcp/auto-scaling/common/create-image/create-image.png
[img-check-image]:              ../../../images/installation-gcp/auto-scaling/common/create-image/image-list.png

[anchor-node]:  #1-creating-and-configuring-the-filtering-node-instance-on-the-google-cloud-platform
[anchor-gcp]:   #2-creating-a-virtual-machine-image

# Google Cloud Platform上でのWallarmフィルタリングノードを搭載したイメージの作成

Google Cloud Platform(GCP)に展開されたWallarmフィルタリングノードの自動スケーリングを設定するには、まず仮想マシンイメージが必要です。本書では、Wallarmフィルタリングノードがインストールされた仮想マシンのイメージを準備する手順について説明します。自動スケーリングの設定の詳細につきましては、この[リンク][link-docs-gcp-autoscaling]をご参照ください。

GCP上でWallarmフィルタリングノードを搭載したイメージを作成するには、以下の手順を実行します：
1. [Google Cloud Platform上でのフィルタリングノードインスタンスの作成と構成][anchor-node]。
2. [構成済みのフィルタリングノードインスタンスを基にした仮想マシンイメージの作成][anchor-gcp]。

##  1.  Google Cloud Platform上でのフィルタリングノードインスタンスの作成と構成

イメージを作成する前に、まず単一のWallarmフィルタリングノードの初期構成が必要です。フィルタリングノードを構成するには、以下の操作を行います：
1. GCP上でフィルタリングノードインスタンスを[作成および構成][link-docs-gcp-node-setup]します。

    !!! warning "フィルタリングノードにインターネット接続を提供してください"
        フィルタリングノードは正しく動作するために、Wallarm APIサーバーへのアクセスが必要です。使用するWallarm Cloudにより、Wallarm APIサーバーの選択が異なります：
        
        * US Cloudを利用している場合は、ノードに`https://us1.api.wallarm.com`へのアクセス権を付与する必要があります。
        * EU Cloudを利用している場合は、ノードに`https://api.wallarm.com`へのアクセス権を付与する必要があります。
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

2. フィルタリングノードをWallarm Cloudに[接続][link-cloud-connect-guide]します。

    !!! warning "Wallarm Cloudに接続する際はトークンを使用してください"
        フィルタリングノードをWallarm Cloudに接続する際は、トークンを使用する必要がありますのでご注意ください。同一のトークンを使用して複数のフィルタリングノードがWallarm Cloudに接続することが可能です。
       
        そのため、自動スケール時に各フィルタリングノードを個別に手動でWallarm Cloudに接続する必要がなくなります。

3. フィルタリングノードを[設定][link-docs-reverse-proxy-setup]して、ウェブアプリケーションのリバースプロキシとして動作させます。

4. フィルタリングノードが正しく構成され、ウェブアプリケーションを悪意のあるリクエストから保護していることを[確認][link-docs-check-operation]します。

フィルタリングノードの構成が完了したら、以下の操作を行い仮想マシンの電源を切ります：
1. メニューの**Compute Engine**セクション内の**VM Instances**ページに移動します。
2. **Connect**列の右側にあるメニューボタンをクリックしてドロップダウンメニューを開きます。
3. ドロップダウンメニューから**Stop**を選択します。

![仮想マシンの電源を切る][img-vm-instance-poweroff]

!!! info "`poweroff`コマンドを使用して電源を切る"
    SSHプロトコルで仮想マシンに接続し、以下のコマンドを実行することでも仮想マシンの電源を切ることができます：
    
    ``` bash
 	poweroff
 	```

##  2.  仮想マシンイメージの作成

これで、構成済みのフィルタリングノードインスタンスを基に仮想マシンイメージを作成できます。イメージを作成するには、以下の手順を実行します：
1. メニューの**Compute Engine**セクション内の**Images**ページに移動し、**Create image**ボタンをクリックします。
2. **Name**フィールドにイメージ名を入力します。
3. **Source**のドロップダウンリストから**Disk**を選択します。
4. **Source disk**のドロップダウンリストから[以前に作成した][anchor-node]仮想マシンインスタンスの名前を選択します。

    ![イメージの作成][img-create-image]

5. 仮想マシンイメージの作成プロセスを開始するために、**Create**ボタンをクリックします。

イメージ作成プロセスが完了すると、利用可能なイメージのリストが表示されるページに移動します。イメージが正しく作成され、リストに存在することをご確認ください。

![イメージのリスト][img-check-image]

これで、用意したイメージを使用してGoogle Cloud Platform上でWallarmフィルタリングノードの[自動スケーリングの設定][link-docs-gcp-autoscaling]が可能になります。