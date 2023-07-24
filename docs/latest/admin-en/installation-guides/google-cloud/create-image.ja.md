[link-docs-gcp-autoscaling]: autoscaling-overview.md
[link-docs-gcp-node-setup]: ../../installation-gcp-en.md
[link-cloud-connect-guide]: ../../installation-gcp-en.md#5-connect-the-filtering-node-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]: ../../installation-gcp-en.md#7-set-up-filtering-and-proxying-rules
[link-docs-check-operation]: ../../installation-check-operation-en.md

[img-vm-instance-poweroff]: ../../../images/installation-gcp/auto-scaling/common/create-image/vm-poweroff.png
[img-create-image]: ../../../images/installation-gcp/auto-scaling/common/create-image/create-image.png
[img-check-image]: ../../../images/installation-gcp/auto-scaling/common/create-image/image-list.png

[anchor-node]: #1-creating-and-configuring-the-filtering-node-instance-on-the-google-cloud-platform
[anchor-gcp]: #2-creating-a-virtual-machine-image

#   Google Cloud Platform で Wallarm フィルタリングノードを含むイメージを作成する

Google Cloud Platform（GCP）で展開された Wallarm フィルタリングノードのオートスケーリングを設定するには、まず仮想マシンのイメージが必要です。このドキュメントでは、Wallarm フィルタリングノードがインストールされた仮想マシンのイメージを準備する手順について説明します。オートスケーリングの詳細については、[リンク][link-docs-gcp-autoscaling]ここへ。

GCP で Wallarm フィルタリングノードを含むイメージを作成するには、次の手順を実行します：
1.  [Google Cloud Platform でフィルタリングノードインスタンスの作成と設定][anchor-node]。
2.  [設定したフィルタリングノードインスタンスを基にした仮想マシンイメージの作成][anchor-gcp]。

##  1.  Google Cloud Platform でフィルタリングノードインスタンスの作成と設定

イメージを作成する前に、まず Wallarm フィルタリングノードの初期設定を行う必要があります。フィルタリングノードを設定するには、以下の手順を実行します：
1.  GCP で [フィルタリングノードインスタンスの作成と設定][link-docs-gcp-node-setup]。

    !!! warning "フィルタリングノードにインターネット接続を提供する"
        フィルタリングノードは、適切な動作のために Wallarm API サーバーへのアクセスが必要です。Wallarm API サーバーの選択は、使用している Wallarm クラウドによります：
        
        * US クラウドを使用している場合、ノードは `https://us1.api.wallarm.com` にアクセスできる必要があります。
        * EU クラウドを使用している場合、ノードは `https://api.wallarm.com` にアクセスできる必要があります。

    --8<-- "../include-ja/gcp-autoscaling-connect-ssh.md"

2.  フィルタリングノードを [Wallarm クラウドに接続][link-cloud-connect-guide]。

    !!! warning "トークンを使用して Wallarm クラウドに接続する"
        フィルタリングノードを Wallarm クラウドにトークンを使用して接続する必要があります。同じトークンを使用して複数のフィルタリングノードを Wallarm クラウドに接続することができます。
       
        これにより、オートスケール時に各フィルタリングノードを手動で Wallarm クラウドに接続する必要がありません。 

3.  [フィルタリングノードを Web アプリケーションのリバースプロキシとして設定][link-docs-reverse-proxy-setup]。

4.  [フィルタリングノードが正しく設定され、悪意のあるリクエストから Web アプリケーションが保護されていることを確認][link-docs-check-operation]。

フィルタリングノードの設定が完了したら、以下の手順で仮想マシンをオフにします：
1.  メニューの **Compute Engine** セクションの **VM インスタンス** ページに移動します。
2.  **Connect** 列の右のメニューボタンをクリックして、ドロップダウンメニューを開きます。
3.  ドロップダウンメニューで **Stop** を選択します。

![!仮想マシンをオフにする][img-vm-instance-poweroff]

!!! info "`poweroff` コマンドを使用してオフにする"
    SSH プロトコルを介して仮想マシンに接続し、以下のコマンドを実行することで、仮想マシンをオフにすることもできます：
    
    ``` bash
 	poweroff
 	```

##  2.  仮想マシンイメージの作成

設定済みのフィルタリングノードインスタンスを基にした仮想マシンイメージを作成することができるようになりました。イメージを作成するには、以下の手順を実行します：
1.  メニューの **Compute Engine** セクションの **Images** ページに移動し、**Create image** ボタンをクリックします。
2.  **Name** フィールドにイメージ名を入力します。
3.  **Source** ドロップダウンリストから **Disk** を選択します。
4.  **Source disk** のドロップダウンリストから、[以前に作成された][anchor-node]仮想マシンインスタンスの名前を選択します。

    ![!イメージの作成][img-create-image]

5.  仮想マシンイメージ作成プロセスを開始するために、**Create** ボタンをクリックします。

イメージ作成プロセスが完了すると、利用可能なイメージのリストを含むページに移動されます。イメージが正常に作成され、リストに表示されていることを確認してください。

![!イメージ一覧][img-check-image]

これで、準備されたイメージを使用して、Google Cloud Platform で Wallarm フィルタリングノードの [オートスケーリングをセットアップ][link-docs-gcp-autoscaling]できます。