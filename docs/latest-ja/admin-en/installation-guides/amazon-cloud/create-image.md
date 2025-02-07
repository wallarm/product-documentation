[link-docs-aws-autoscaling]:        autoscaling-group-guide.md
[link-docs-aws-node-setup]:         ../../../installation/cloud-platforms/aws/ami.md
[link-ssh-keys-guide]:              ../../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys-in-aws
[link-security-group-guide]:        ../../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group
[link-cloud-connect-guide]:         ../../../installation/cloud-platforms/aws/ami.md#6-connect-the-instance-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../installation/cloud-platforms/aws/ami.md#7-configure-sending-traffic-to-the-wallarm-instance
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[img-launch-ami-wizard]:        ../../../images/installation-ami/auto-scaling/common/create-image/launch-ami-wizard.png 
[img-config-ami-wizard]:        ../../../images/installation-ami/auto-scaling/common/create-image/config-ami-wizard.png  
[img-explore-created-ami]:      ../../../images/installation-ami/auto-scaling/common/create-image/explore-ami.png

[anchor-node]:  #1-creating-and-configuring-the-wallarm-filtering-node-instance-in-the-amazon-cloud
[anchor-ami]:   #2-creating-an-amazon-machine-image

# Wallarmフィルタリングノードを搭載したAMIの作成

Amazonクラウド上にデプロイされたWallarmフィルタリングノードの自動スケールを設定できます。この機能を利用するには、事前に準備した仮想マシンイメージが必要です。

本書では、WallarmフィルタリングノードがインストールされたAmazon Machine Image (AMI) を準備する手順を説明します。AMIはフィルタリングノードの自動スケール設定に必要です。自動スケールの詳細な設定方法については、この[リンク][link-docs-aws-autoscaling]に進んでください。

Wallarmフィルタリングノードを搭載したAMIを作成するには、以下の手順を実行します:

1.  [Amazonクラウド上でのフィルタリングノードインスタンスの作成と設定][anchor-node]
2.  [設定済みのフィルタリングノードインスタンスを基にAMIを作成][anchor-ami]

##  1.  Amazonクラウド上でのWallarmフィルタリングノードインスタンスの作成と設定

AMIを作成する前に、単一のWallarmフィルタリングノードの初期設定を行う必要があります。フィルタリングノードの設定手順は次の通りです:

1.  Amazonクラウド上でフィルタリングノードインスタンスを[作成][link-docs-aws-node-setup]してください。
    
    !!! warning "Private SSH key"
        フィルタリングノードに接続するため、以前に[作成した][link-ssh-keys-guide]PEM形式のプライベートSSHキーにアクセスできることを確認してください。

    !!! warning "Provide the filtering node with an internet connection"
        フィルタリングノードが正常に動作するには、Wallarm APIサーバーへのアクセスが必要です。使用するWallarm Cloudに応じて、Wallarm APIサーバーは以下の通りに指定してください:
        
        *   US Cloudをご利用の場合、ノードは`https://us1.api.wallarm.com`にアクセスできる必要があります。
        *   EU Cloudをご利用の場合、ノードは`https://api.wallarm.com`にアクセスできる必要があります。
        
        正しいVPCおよびサブネットを選択し、フィルタリングノードがWallarm APIサーバーにアクセスできるように[セキュリティグループを設定][link-security-group-guide]してください。

2.  フィルタリングノードを[Wallarm Cloudに接続][link-cloud-connect-guide]してください。

    !!! warning "Use a token to connect to the Wallarm Cloud"
        フィルタリングノードをWallarm Cloudに接続する際は、トークンを使用する必要があります。複数のフィルタリングノードが同一のトークンを使用してWallarm Cloudに接続可能です。
        
        そのため、自動スケール時に各フィルタリングノードを手動で接続する必要はありません。

3.  フィルタリングノードがウェブアプリケーションのリバースプロキシとして動作するように、[リバースプロキシの設定][link-docs-reverse-proxy-setup]を行ってください。

4.  フィルタリングノードが正しく設定され、ウェブアプリケーションを悪意のあるリクエストから保護できていることを[確認][link-docs-check-operation]してください。

フィルタリングノードの設定が完了したら、以下の手順で仮想マシンを停止してください:

1.  Amazon EC2ダッシュボードの**Instances**タブに移動します。
2.  設定済みのフィルタリングノードインスタンスを選択します。
3.  **Actions**ドロップダウンメニューから**Instance State**を選択し、さらに**Stop**を選択します。

!!! info "Turning off with the `poweroff` command"
    SSHプロトコルでノードに接続し、以下のコマンドを実行することで仮想マシンを停止することも可能です:
    
    ``` bash
    poweroff
    ```

##  2.  Amazon Machine Imageの作成

設定済みのフィルタリングノードインスタンスを基に仮想マシンイメージを作成できます。イメージを作成するには、以下の手順を実行してください:

1.  Amazon EC2ダッシュボードの**Instances**タブに進みます。
2.  設定済みのフィルタリングノードインスタンスを選択します。
3.  **Actions**ドロップダウンメニューから**Image**を選択し、さらに**Create Image**を選択してイメージ作成ウィザードを起動します.

    ![Launching the AMI creation wizard][img-launch-ami-wizard]
    
4.  「Create Image」フォームが表示されます。**Image name**フィールドにイメージ名を入力します。他のフィールドは変更せずにそのままにしておきます.

    ![Configuring parameters in the AMI creation wizard][img-config-ami-wizard]
    
5.  **Create Image**ボタンをクリックして仮想マシンイメージの作成プロセスを開始してください.
    
    イメージ作成プロセスが完了すると、該当するメッセージが表示されます。Amazon EC2ダッシュボードの**AMIs**タブに移動し、イメージが正常に作成され**Available**状態にあることを確認してください.
    
    ![Exploring the created AMI][img-explore-created-ami]

!!! info "Image visibility"
    準備されたイメージにはご利用中のアプリケーションに特有の設定およびWallarmトークンが含まれているため、イメージの公開状態を変更してパブリックにすることは推奨しません（デフォルトでは、AMIは**Private**状態で作成されます）.

これで、準備したイメージを用いてAmazonクラウド上でWallarmフィルタリングノードの自動スケールを[セットアップ][link-docs-aws-autoscaling]できます.