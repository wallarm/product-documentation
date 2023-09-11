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

# Wallarmフィルタリングノード付きのAMIを作成する

AmazonクラウドでデプロイしたWallarmフィルタリングノードのオートスケーリングを設定できます。この機能は、予め準備された仮想マシンのイメージが必要です。

この文書では、WallarmフィルタリングノードがインストールされたAmazonマシンイメージ (AMI) の準備手順を説明します。AMIはフィルタリングノードのオートスケーリング設定に必要です。オートスケーリングの設定について詳しく知るには、この [リンク][link-docs-aws-autoscaling]をご覧ください。

Wallarmフィルタリングノード付きのAMIを作成するには、以下の手順を実行します：

1.  [Amazonクラウドでフィルタリングノードインスタンスを作成し、設定する][anchor-node]
2.  [設定したフィルタリングノードインスタンスを基にAMIを作成する][anchor-ami]


##  1. AmazonクラウドでWallarmフィルタリングノードインスタンスを作成し設定する

AMIを作成する前に、Wallarmフィルタリングノードの初期設定を行う必要があります。フィルタリングノードを設定するには、次の手順を行います：

1.  [Amazonクラウドでフィルタリングノードインスタンスを作成します][link-docs-aws-node-setup]。
    
    !!! warning "プライベートSSHキー"
        フィルタリングノードに接続するために以前に[作成した][link-ssh-keys-guide]プライベートSSHキー（PEM形式で保存）へのアクセスを持っていることを確認してください。

    !!! warning "フィルタリングノードにインターネット接続を提供する"
        フィルタリングノードは、適切な動作のためにWallarm APIサーバーへのアクセスが必要です。Wallarm APIサーバーの選択は、使用しているWallarm Cloudに依存します：
        
        *   US Cloudを使用している場合、ノードは`https://us1.api.wallarm.com`へのアクセスを許可する必要があります。
        *   EU Cloudを使用している場合、ノードは`https://api.wallarm.com`へのアクセスを許可する必要があります。
        
    正しいVPCとサブネットを選択し、フィルタリングノードがWallarm APIサーバーにアクセスできないようにする[セキュリティグループを設定][link-security-group-guide]してください。

2.  フィルタリングノードをWallarmクラウドに[接続します][link-cloud-connect-guide]。

    !!! warning "トークンを使用してWallarmクラウドに接続する"
        フィルタリングノードをトークンを使用してWallarmクラウドに接続する必要があることに注意してください。複数のフィルタリングノードは同じトークンを使用してWallarmクラウドに接続できます。 
        
        したがって、フィルタリングノードのオートスケーリング時に、各フィルタリングノードをWallarmクラウドに手動で接続する必要はありません。

3.  あなたのウェブアプリケーションのリバースプロキシとしてフィルタリングノードを[設定します][link-docs-reverse-proxy-setup]。

4.  フィルタリングノードが正しく設定され、あなたのウェブアプリケーションを悪意のあるリクエストから保護していることを[確認します][link-docs-check-operation]。

フィルタリングノードの設定が完了したら、次の手順を完了して仮想マシンをオフにします：

1.  Amazon EC2ダッシュボードの**Instances**タブに移動します。
2.  設定したフィルタリングノードインスタンスを選択します。
3.  **Actions**ドロップダウンメニューの中から**Instance State**を選択し、次に**Stop**を選択します。

!!! info "`poweroff`コマンドでの電源オフ"
    SSHプロトコルを使用して接続し、次のコマンドを実行することで仮想マシンの電源を切ることも可能です：
    
    ``` bash
    poweroff
    ```

##  2.  Amazonマシンイメージの作成

設定したフィルタリングノードインスタンスを基に仮想マシンイメージを作成することができます。イメージを作成するには、以下の手順を実行します：

1.  Amazon EC2ダッシュボードの**Instances**タブに移動します。
2.  設定したフィルタリングノードインスタンスを選択します。
3.  **Actions**ドロップダウンメニューから**Image**を選択し、次に**Create Image**を選択してイメージ作成ウィザードを起動します。

    ![AMI作成ウィザードの起動][img-launch-ami-wizard]
    
4.  **Create Image**フォームが表示されます。**Image name**フィールドにイメージの名前を入力します。残りのフィールドはそのままにしておいても構いません。

    ![AMI作成ウィザードでのパラメータ設定][img-config-ami-wizard]
    
5.  **Create Image**ボタンをクリックして仮想マシンイメージの作成プロセスを開始します。
    
    イメージ作成プロセスが完了すると、対応するメッセージが表示されます。Amazon EC2ダッシュボードの**AMIs**タブに移動して、イメージが正常に作成され、**Available**ステータスになっていることを確認してください。
    
    ![作成したAMIの表示][img-explore-created-ami]

!!! info "イメージの可視性"
    作成したイメージには、あなたのアプリケーションとWallarmトークンに特有の設定が含まれているため、イメージの可視性設定を変更し公開することは推奨されません（デフォルトでは、AMIは**Private**可視性設定で作成されます）。

現在、準備したイメージを使用して、AmazonクラウドでWallarmフィルタリングノードのオートスケーリングを[設定][link-docs-aws-autoscaling]することができます.