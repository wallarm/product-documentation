[link-docs-aws-autoscaling]: autoscaling-overview.md
[link-docs-aws-node-setup]: ../../installation-ami-en.md
[link-ssh-keys-guide]: ../../installation-ami-en.md#2-create-a-pair-of-ssh-keys
[link-security-group-guide]: ../../installation-ami-en.md#3-create-a-security-group
[link-cloud-connect-guide]: ../../installation-ami-en.md#6-connect-the-filtering-node-to-the-wallarm-cloud
[link-docs-reverse-proxy-setup]: ../../installation-ami-en.md#8-set-up-filtering-and-proxying-rules
[link-docs-check-operation]: ../../installation-check-operation-en.md

[img-launch-ami-wizard]: ../../../images/installation-ami/auto-scaling/common/create-image/launch-ami-wizard.png
[img-config-ami-wizard]: ../../../images/installation-ami/auto-scaling/common/create-image/config-ami-wizard.png
[img-explore-created-ami]: ../../../images/installation-ami/auto-scaling/common/create-image/explore-ami.png

[anchor-node]: #1-creating-and-configuring-the-wallarm-filtering-node-instance-in-the-amazon-cloud
[anchor-ami]: #2-creating-an-amazon-machine-image

#   Wallarmフィルタリングノードを含むAMIの作成

AmazonクラウドでデプロイされたWallarmフィルタリングノードのオートスケーリングを設定できます。この機能は、あらかじめ準備された仮想マシンイメージが必要です。

この文書では、WallarmフィルタリングノードがインストールされたAmazon Machine Image (AMI)を作成する手順について説明します。AMIはフィルタリングノードのオートスケーリング設定に必要です。オートスケーリングの設定に関する詳細情報は、この[リンク][link-docs-aws-autoscaling]に進んでください。

Wallarmフィルタリングノードを含むAMIを作成するには、以下の手順を実行します。

1. [Amazonクラウドでフィルタリングノードインスタンスの作成と構成][anchor-node]
2. [構成済みフィルタリングノードインスタンスを元にAMIの作成][anchor-ami]


##  1.  Amazon CloudでWallarmフィルタリングノードインスタンスの作成と構成

AMIを作成する前に、1つのWallarmフィルタリングノードの初期設定を行う必要があります。フィルタリングノードを設定するには、次の操作を行います。

1.  [Amazonクラウドでフィルタリングノードインスタンスを作成][link-docs-aws-node-setup]します。

    !!! warning "プライベートSSHキー"
        以前にフィルタリングノードに接続するために[作成][link-ssh-keys-guide]したプライベートSSHキー(PEM形式で保存されている)にアクセスできることを確認してください。

    !!! warning "フィルタリングノードにインターネット接続を提供する"
        フィルタリングノードは、正常に動作するためにWallarm APIサーバーへのアクセスが必要です。Wallarm APIサーバーの選択は、使用しているWallarm Cloudによって異なります。
        
        *   US Cloudを使用している場合、`https://us1.api.wallarm.com`へのアクセスが必要です。
        *   EU Cloudを使用している場合、`https://api.wallarm.com`へのアクセスが必要です。
        
    正しいVPCとサブネットを選択し、[セキュリティグループを構成][link-security-group-guide]して、フィルタリングノードがWallarm APIサーバーにアクセスできるようにします。

2.  [フィルタリングノードをWallarm Cloudに接続][link-cloud-connect-guide]します。

    !!! warning "トークンを使用してWallarm Cloudに接続する"
        フィルタリングノードをWallarm Cloudに接続するには、トークンを使用する必要があります。同じトークンを使用して複数のフィルタリングノードをWallarm Cloudに接続することができます。

        したがって、フィルタリングノードのオートスケーリングを行う際に、各フィルタリングノードを手動でWallarm Cloudに接続する必要はありません。

3.  [フィルタリングノードをウェブアプリケーションのリバースプロキシとして機能するように構成][link-docs-reverse-proxy-setup]します。

4.  [フィルタリングノードが正しく設定され、悪意のあるリクエストからウェブアプリケーションを保護していることを確認][link-docs-check-operation]します。

フィルタリングノードの設定が完了したら、以下の操作を行って仮想マシンをオフにします。

1.  Amazon EC2ダッシュボードで**Instances**タブに移動します。
2.  構成済みのフィルタリングノードインスタンスを選択します。
3.  **Actions**のドロップダウンメニューで**Instance State**を選択し、**Stop**をクリックします。

!!! info "`poweroff`コマンドでオフにする"
    また、SSHプロトコルで仮想マシンに接続し、次のコマンドを実行することで仮想マシンをオフにすることもできます。

    ``` bash
    poweroff
    ```

##  2.  Amazon Machine Imageの作成

構成済みのフィルタリングノードインスタンスを元に仮想マシンイメージを作成することができます。イメージを作成するには、以下の手順を実行します。

1.  Amazon EC2ダッシュボードの**Instances**タブに進みます。
2.  構成済みのフィルタリングノードインスタンスを選択します。
3.  **Actions**のドロップダウンメニューで**Image**を選択し、**Create Image**をクリックしてイメージ作成ウィザードを起動します。

    ![!AMI作成ウィザードを起動する][img-launch-ami-wizard]
    
4.  **Create Image**フォームが表示されます。**Image name**フィールドにイメージ名を入力します。他のフィールドはそのままにしておいても構いません。

    ![!AMI作成ウィザードでパラメータを設定する][img-config-ami-wizard]
    
5.  **Create Image**ボタンをクリックして仮想マシンイメージ作成プロセスを開始します。

    イメージ作成プロセスが完了すると、対応するメッセージが表示されます。Amazon EC2ダッシュボードの**AMIs**タブに移動し、イメージが正常に作成され、**Available**ステータスがあることを確認してください。

    ![!作成されたAMIを確認する][img-explore-created-ami]

!!! info "イメージの可視性"
    作成されたイメージには、アプリケーション固有の設定とWallarmトークンが含まれているため、イメージの可視性設定を変更して公開することはお勧めしません(デフォルトでは、AMIは**Private**可視性設定で作成されます)。

これで、準備されたイメージを使用して、AmazonクラウドでWallarmフィルタリングノードのオートスケーリングを[設定][link-docs-aws-autoscaling]することができます。