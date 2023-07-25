					[link-docs-aws-autoscaling]:        autoscaling-group-guide.md
[link-docs-aws-node-setup]:         ../../../installation/cloud-platforms/aws/ami.md
[link-ssh-keys-guide]:              ../../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys
[link-security-group-guide]:        ../../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group
[link-cloud-connect-guide]:         ../../../installation/cloud-platforms/aws/ami.md#5-connect-the-filtering-node-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../installation/cloud-platforms/aws/ami.md#6-enable-wallarm-to-analyze-the-traffic
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[img-launch-ami-wizard]:        ../../../images/installation-ami/auto-scaling/common/create-image/launch-ami-wizard.png 
[img-config-ami-wizard]:        ../../../images/installation-ami/auto-scaling/common/create-image/config-ami-wizard.png  
[img-explore-created-ami]:      ../../../images/installation-ami/auto-scaling/common/create-image/explore-ami.png

[anchor-node]:  #1-creating-and-configuring-the-wallarm-filtering-node-instance-in-the-amazon-cloud
[anchor-ami]:   #2-creating-an-amazon-machine-image

#   Wallarm フィルタリングノード付き AMI の作成

Amazon クラウドに展開された Wallarm フィルタリングノードのオートスケーリングを設定できます。この機能は、事前に準備された仮想マシンイメージが必要です。

本ドキュメントでは、Wallarm フィルタリングノードがインストールされた Amazon Machine Image（AMI）の準備手順について説明します。フィルタリングノードのオートスケーリング設定には AMI が必要です。オートスケーリングの設定について詳しく知るためには、次の[リンク][link-docs-aws-autoscaling]に進んでください。

Wallarm フィルタリングノード付きの AMI を作成するためには、以下の手順を実行します：

1.  [Amazon クラウドにフィルタリングノードインスタンスの作成と設定を行う][anchor-node]
2.  [設定済みのフィルタリングノードインスタンスに基づいて AMI を作成する][anchor-ami]


##  1.  Amazon クラウド上での Wallarm フィルタリングノードインスタンスの作成と設定

AMI を作成する前に、単一の Wallarm フィルタリングノードの初期設定を行う必要があります。フィルタリングノードを設定するには、以下を行います：

1.  [Amazon クラウドにフィルタリングノードインスタンスを作成します][link-docs-aws-node-setup]。
    
    !!! warning "Private SSH key"
    	フィルタリングノードに接続するために以前に[作成した][link-ssh-keys-guide] PEM 形式で保存されたプライベート SSH キーへのアクセスが確認できることを確認してください。

    !!! warning "フィルタリングノードにインターネット接続を提供する"
        フィルタリングノードは、適切な動作のために Wallarm API サーバーへのアクセスを必要とします。 Wallarm API サーバーの選択は、使用している Wallarm Cloud に依存しています：
        
        *   US Cloud を使用している場合、ノードは `https://us1.api.wallarm.com`へのアクセスを許可する必要があります。
        *   EU Cloud を使用している場合、ノードは `https://api.wallarm.com`へのアクセスを許可する必要があります。

    フィルタリングノードが Wallarm API サーバーにアクセスできないようにする手段で[セキュリティグループを設定][link-security-group-guide]する際には、適切な VPC とサブネットを選択したことを確認してください。

2.  [フィルタリングノードを Wallarm Cloud に接続します][link-cloud-connect-guide]。

    !!! warning "Wallarm Cloud への接続にトークンを使用する"
        フィルタリングノードを Wallarm Cloud に接続するためにはトークンが必要であることに注意してください。複数のフィルタリングノードは、同じトークンを使用して Wallarm Cloud に接続できます。 
        
        したがって、フィルタリングノードのオートスケーリング時に、各フィルタリングノードを手動で Wallarm Cloud に接続する必要はありません。

3.  [フィルタリングノードをウェブアプリケーションのリバースプロキシとして動作するように設定します][link-docs-reverse-proxy-setup]。

4.  [フィルタリングノードが正しく設定され、ウェブアプリケーションを悪意のあるリクエストから保護していることを確認します][link-docs-check-operation]。

フィルタリングノードの設定が完了したら、以下の操作を完了して仮想マシンをオフにします：

1.  Amazon EC2 ダッシュボードの**インスタンス**タブに移動します。
2.  設定したフィルタリングノードインスタンスを選択します。
3.  **アクション** ドロップダウンメニューで **インスタンスステート** を選択し、次に **停止** を選択します。

!!! info "`poweroff` コマンドでオフにする"
    SSH プロトコルを使って仮想マシンに接続し、次のコマンドを実行することでも仮想マシンをオフにすることができます：

    ``` bash
    poweroff
    ```

##  2.  Amazon Machine Image の作成

設定済みのフィルタリングノードインスタンスをベースに仮想マシンイメージを作成できます。イメージを作成するには、以下の手順を実行します：

1.  Amazon EC2 ダッシュボードの**インスタンス**タブに進みます。
2.  設定したフィルタリングノードインスタンスを選択します。
3.  **アクション** ドロップダウンメニューで **イメージ** を選択し、その後 **イメージの作成** を選択することで、イメージ作成ウィザードを起動します。

    ![!AMI作成ウィザードの起動][img-launch-ami-wizard]
    
4.  **イメージの作成**フォームが表示されます。**イメージ名**フィールドにイメージ名を入力します。他のフィールドはそのままにしておいて構いません。

    ![!AMI作成ウィザードでのパラメータ設定][img-config-ami-wizard]
    
5.  **イメージの作成**ボタンをクリックして仮想マシンイメージの作成プロセスを開始します。
   
    イメージ作成プロセスが完了したら、該当のメッセージが表示されます。 Amazon EC2 ダッシュボードの **AMIs** タブに移動して、イメージが正常に作成され、**利用可能** ステータスであることを確認します。

    ![!作成された AMI の探索][img-explore-created-ami]

!!! info "イメージの可視性"
アプリケーションとWallarmトークンに特有の設定を含むため、準備したイメージの可視性設定を変更し、公開することは推奨されません（デフォルトでは、AMIは**プライベート**の可視性設定で作成されます）。

これで、準備したイメージを使用して、AmazonクラウドでのWallarmフィルタリングノードの自動スケーリングを[セットアップ][link-docs-aws-autoscaling]できるようになりました。