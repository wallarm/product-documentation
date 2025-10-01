[link-docs-aws-autoscaling]:        autoscaling-group-guide.md
[link-docs-aws-node-setup]:         ../../../installation/cloud-platforms/aws/ami.md
[link-ssh-keys-guide]:              ../../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys-in-aws
[link-security-group-guide]:        ../../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group
[link-cloud-connect-guide]:         ../../../installation/cloud-platforms/aws/ami.md#6-connect-the-instance-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]:    ../../../installation/cloud-platforms/aws/ami.md#7-configure-sending-traffic-to-the-wallarm-instance
[link-docs-check-operation]:        ../../../admin-en/uat-checklist-en.md#node-registers-attacks

[img-launch-ami-wizard]:        ../../../images/installation-ami/auto-scaling/common/create-image/launch-ami-wizard.png 
[img-config-ami-wizard]:        ../../../images/installation-ami/auto-scaling/common/create-image/config-ami-wizard.png  
[img-explore-created-ami]:      ../../../images/installation-ami/auto-scaling/common/create-image/explore-ami.png

[anchor-node]:  #1-creating-and-configuring-the-wallarm-filtering-node-instance-in-the-amazon-cloud
[anchor-ami]:   #2-creating-an-amazon-machine-image

#   Wallarmフィルタリングノードを含むAMIの作成

AmazonクラウドにデプロイされたWallarmフィルタリングノードに対してオートスケーリングを設定できます。この機能を使用するには、事前に仮想マシンイメージを準備しておく必要があります。

本書では、WallarmフィルタリングノードをインストールしたAmazon Machine Image (AMI) の準備手順を説明します。AMIはフィルタリングノードのオートスケーリング設定に必要です。オートスケーリングの詳細については、この[リンク][link-docs-aws-autoscaling]をご覧ください。

Wallarmフィルタリングノードを含むAMIを作成するには、次の手順を実行します:

1.  [AmazonクラウドでWallarmフィルタリングノードインスタンスを作成して設定する][anchor-node]
2.  [設定済みフィルタリングノードインスタンスを基にAMIを作成する][anchor-ami]


##  1.  AmazonクラウドでWallarmフィルタリングノードインスタンスを作成して設定する

AMIを作成する前に、まず1台のWallarmフィルタリングノードの初期設定を行う必要があります。フィルタリングノードを設定するには、次の手順を実行します。

1.  Amazonクラウドでフィルタリングノードインスタンスを[作成][link-docs-aws-node-setup]します。
    
    !!! warning "SSH秘密鍵"
        フィルタリングノードへの接続用に以前[作成][link-ssh-keys-guide]したPEM形式で保管されているSSH秘密鍵にアクセスできることを確認してください。

    !!! warning "フィルタリングノードにインターネット接続を提供する"
        フィルタリングノードの正常な動作にはWallarm APIサーバーへのアクセスが必要です。使用中のWallarm Cloudによって接続先のWallarm APIサーバーが異なります：
        
        *   US Cloudを使用している場合、ノードには`https://us1.api.wallarm.com`へのアクセス権限を付与する必要があります。
        *   EU Cloudを使用している場合、ノードには`https://api.wallarm.com`へのアクセス権限を付与する必要があります。
        
    正しいVPCおよびサブネットを選択し、フィルタリングノードがWallarm APIサーバーへアクセスするのを妨げないように[セキュリティグループを構成][link-security-group-guide]してください。

2.  フィルタリングノードをWallarm Cloudに[接続][link-cloud-connect-guide]します。

    !!! warning "Wallarm Cloudへの接続にはトークンを使用してください"
        フィルタリングノードはトークンを使用してWallarm Cloudに接続する必要がある点にご注意ください。同一のトークンを使用して複数のフィルタリングノードをWallarm Cloudに接続できます。 
        
        そのため、フィルタリングノードのオートスケーリング時に、各フィルタリングノードを手動でWallarm Cloudに接続する必要はありません。

3.  アプリケーションとAPIのリバースプロキシとして機能するようにフィルタリングノードを[構成][link-docs-reverse-proxy-setup]します。

4.  フィルタリングノードが正しく構成され、アプリケーションとAPIを悪意のあるリクエストから保護していることを[確認][link-docs-check-operation]します。

フィルタリングノードの構成が完了したら、次の操作で仮想マシンの電源をオフにします。

1.  Amazon EC2ダッシュボードの**Instances**タブに移動します。
2.  構成済みのフィルタリングノードインスタンスを選択します。
3.  ドロップダウンメニュー**Actions**で**Instance State**を選択し、続けて**Stop**を選択します。

!!! info "`poweroff`コマンドで電源をオフにする"
    SSHプロトコルで接続し、次のコマンドを実行して仮想マシンの電源をオフにすることもできます。
    
    ``` bash
    poweroff
    ```

##  2.  Amazon Machine Imageの作成

設定済みフィルタリングノードインスタンスを基に仮想マシンイメージを作成できます。イメージを作成するには、次の手順を実行します。

1.  Amazon EC2ダッシュボードの**Instances**タブに移動します。
2.  構成済みのフィルタリングノードインスタンスを選択します。
3.  ドロップダウンメニュー**Actions**で**Image**を選択し、続けて**Create Image**を選択してイメージ作成ウィザードを起動します。

    ![AMI作成ウィザードの起動][img-launch-ami-wizard]
    
4.  **Create Image**フォームが表示されます。**Image name**フィールドにイメージ名を入力します。残りのフィールドは変更しなくても問題ありません。

    ![AMI作成ウィザードでのパラメータの設定][img-config-ami-wizard]
    
5.  **Create Image**ボタンをクリックして仮想マシンイメージの作成を開始します。
    
    イメージ作成プロセスが完了すると、完了メッセージが表示されます。Amazon EC2ダッシュボードの**AMIs**タブに移動し、イメージが正常に作成され、ステータスが**Available**になっていることを確認します。
    
    ![作成されたAMIの確認][img-explore-created-ami]

!!! info "イメージの可視性"
    準備したイメージにはお使いのアプリケーション固有の設定とWallarmトークンが含まれるため、イメージの可視性設定を変更して公開することは推奨しません（既定ではAMIsは**Private**の可視性で作成されます）。

これで、準備したイメージを使用してAmazonクラウドでWallarmフィルタリングノードのオートスケーリングを[設定][link-docs-aws-autoscaling]できます。