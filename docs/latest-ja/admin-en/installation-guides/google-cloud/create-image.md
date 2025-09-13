[link-docs-gcp-autoscaling]:        autoscaling-overview.md
[link-docs-gcp-node-setup]:         ../../../installation/cloud-platforms/gcp/machine-image.md
[link-cloud-connect-guide]:         ../../../installation/cloud-platforms/gcp/machine-image.md#5-connect-the-filtering-node-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../installation/cloud-platforms/gcp/machine-image.md#6-configure-sending-traffic-to-the-wallarm-instance
[link-docs-check-operation]:        ../../../admin-en/uat-checklist-en.md#node-registers-attacks

[img-vm-instance-poweroff]:     ../../../images/installation-gcp/auto-scaling/common/create-image/vm-poweroff.png
[img-create-image]:             ../../../images/installation-gcp/auto-scaling/common/create-image/create-image.png
[img-check-image]:              ../../../images/installation-gcp/auto-scaling/common/create-image/image-list.png

[anchor-node]:  #1-creating-and-configuring-the-filtering-node-instance-on-the-google-cloud-platform
[anchor-gcp]:   #2-creating-a-virtual-machine-image

#   Google Cloud Platform上でのWallarmフィルタリングノードを含むイメージの作成

Google Cloud Platform(GCP)にデプロイされたWallarmフィルタリングノードのオートスケーリングを設定するには、まず仮想マシンイメージが必要です。このドキュメントでは、Wallarmフィルタリングノードをインストールした仮想マシンのイメージを準備する手順について説明します。オートスケーリングの設定に関する詳細は、この[リンク][link-docs-gcp-autoscaling]をご覧ください。

GCP上でWallarmフィルタリングノードを含むイメージを作成するには、次の手順を実行します。
1.  [Google Cloud Platform上でのフィルタリングノードインスタンスの作成と設定][anchor-node]。
2.  [構成済みフィルタリングノードインスタンスに基づく仮想マシンイメージの作成][anchor-gcp]。

##  1.  Google Cloud Platform上でのフィルタリングノードインスタンスの作成と設定 {#1-creating-and-configuring-the-filtering-node-instance-on-the-google-cloud-platform}

イメージを作成する前に、単一のWallarmフィルタリングノードの初期設定を行う必要があります。フィルタリングノードを設定するには、次の操作を実行します。
1.  GCP上にフィルタリングノードインスタンスを[作成して設定][link-docs-gcp-node-setup]します。

    !!! warning "フィルタリングノードにインターネット接続を確保してください"
        フィルタリングノードの適切な動作にはWallarm API serverへのアクセスが必要です。使用しているWallarm Cloudに応じて、接続先のWallarm API serverが異なります。
        
        * US Cloudを使用している場合は、ノードに`https://us1.api.wallarm.com`へのアクセスを許可する必要があります。
        * EU Cloudを使用している場合は、ノードに`https://api.wallarm.com`へのアクセスを許可する必要があります。
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

2.  フィルタリングノードをWallarm Cloudに[接続][link-cloud-connect-guide]します。

    !!! warning "Wallarm Cloudへの接続にはトークンを使用してください"
        フィルタリングノードはトークンを使用してWallarm Cloudに接続する必要があります。同じトークンを使用して複数のフィルタリングノードをWallarm Cloudに接続することができます。
       
        したがって、オートスケーリング時に各フィルタリングノードを手動でWallarm Cloudに接続する必要はありません。

3.  フィルタリングノードを、アプリケーションとAPIのリバースプロキシとして動作するように[構成][link-docs-reverse-proxy-setup]します。

4.  フィルタリングノードが正しく構成され、アプリケーションとAPIを悪意のあるリクエストから保護していることを[確認][link-docs-check-operation]します。

フィルタリングノードの設定が完了したら、次の操作を実行して仮想マシンの電源をオフにします。
1.  メニューの**Compute Engine**セクションにある**VM Instances**ページに移動します。
2.  **Connect**列の右側にあるメニューボタンをクリックしてドロップダウンメニューを開きます。
3.  ドロップダウンメニューで**Stop**を選択します。

![仮想マシンの電源をオフにする][img-vm-instance-poweroff]

!!! info "`poweroff`コマンドを使用したシャットダウン"
    SSHプロトコルで接続し、次のコマンドを実行して仮想マシンの電源をオフにすることもできます。
    
    ``` bash
 	poweroff
 	```

##  2.  仮想マシンイメージの作成 {#2-creating-a-virtual-machine-image}

構成済みのフィルタリングノードインスタンスに基づいて、仮想マシンイメージを作成できます。イメージを作成するには、次の手順を実行します。
1.  メニューの**Compute Engine**セクションにある**Images**ページに移動し、**Create image**ボタンをクリックします。
2.  イメージ名を**Name**フィールドに入力します。
3.  **Source**ドロップダウンリストから**Disk**を選択します。
4.  **Source disk**ドロップダウンリストから、[以前に作成した][anchor-node]仮想マシンインスタンスの名前を選択します。

    ![イメージの作成][img-create-image]

5.  **Create**ボタンをクリックして、仮想マシンイメージの作成プロセスを開始します。

イメージの作成プロセスが完了すると、使用可能なイメージの一覧を含むページに移動します。イメージが正常に作成され、一覧に表示されていることを確認します。

![イメージの一覧][img-check-image]

これで、準備したイメージを使用して、Google Cloud Platform上のWallarmフィルタリングノードの[オートスケーリングを設定][link-docs-gcp-autoscaling]できます。