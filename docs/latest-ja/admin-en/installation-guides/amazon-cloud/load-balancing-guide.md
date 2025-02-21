[link-doc-asg-guide]:               autoscaling-group-guide.md  
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[link-aws-lb-comparison]:           https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html?icmpid=docs_elbv2_console#elb-features   

[img-lb-basics]:                    ../../../images/installation-ami/auto-scaling/common/load-balancing-guide/lb-create-1.png
[img-lb-routing]:                   ../../../images/installation-ami/auto-scaling/common/load-balancing-guide/lb-create-3.png
[img-checking-operation]:           ../../../images/admin-guides/test-attacks-quickstart.png

[anchor-create]:        #1-creating-a-load-balancer
[anchor-configure]:     #2-setting-up-an-auto-scaling-group-for-using-the-created-balancer

# AWS上のロードバランサ作成

次に、[設定済み][link-doc-asg-guide]のフィルタリングノードAuto Scaling Groupが用意されましたら、複数のフィルタリングノード間で着信HTTPおよびHTTPS接続を分散するロードバランサを作成し、設定する必要があります。

ロードバランサ作成プロセスは、次の手順を含みます:
1.  [ロードバランサの作成][anchor-create]
2.  [作成済みのロードバランサを使用するAuto Scaling Groupの設定][anchor-configure]

## 1. ロードバランサの作成

Amazonクラウドでは、以下のタイプのロードバランサを設定できます:
*   Classic Load Balancer
*   Network Load Balancer
*   Application Load Balancer

!!! info "ロードバランサの違い"
    ロードバランサ間の違いの詳細情報を確認するには、この[リンク][link-aws-lb-comparison]に進んでください.

本書では、OSI/ISOネットワークモデルのトランスポート層でトラフィックを分散するNetwork Load Balancerの設定および使用法について説明します.

以下の操作を完了してロードバランサを作成します: 
1.  Amazon EC2ダッシュボードの**Load Balancers**タブに移動し、**Create Load Balancer**ボタンをクリックします.
2.  対応する**Create**ボタンをクリックして、Network Load Balancerを作成します.
3.  基本的なロードバランサパラメータを設定します:

    ![General Load Balancer parameters configuration][img-lb-basics]
    
    1.  ロードバランサの名前（**Name**パラメータ）.
    2.  ロードバランサのタイプ（**Scheme**パラメータ）. インターネット上でロードバランサを利用可能にするため、**internet-facing**タイプを選択します.
    3.  **Listeners**パラメータ群を使用して、ロードバランサがリッスンするポートを指定します.
    4.  ロードバランサが動作する必要があるVPCおよびAvailability Zonesを指定します.
        
        !!! info "Auto Scaling Groupの可用性を確認します"
            ロードバランサが正しく動作するように、[以前に作成された][link-doc-asg-guide]Auto Scaling Groupを含むVPCおよびAvailability Zonesが選択されていることを確認してください.
        
4.  **Next: Configure Security Settings**ボタンをクリックして、次のステップに進みます.

    必要に応じてセキュリティパラメータを設定します.
    
5.  **Next: Configure Routing**ボタンをクリックして、次のステップに進みます. 

    Auto Scaling Group内のフィルタリングノードへの着信要求のルーティングを設定します.

    ![Configuring the incoming connections routing][img-lb-routing]
    
    1.  新しいターゲットグループを作成し、**Name**フィールドにその名前を指定します. ロードバランサは、指定されたターゲットグループ（例：`demo-target`）に配置されたインスタンスに着信要求をルーティングします.
        
    2.  要求ルーティングに使用されるプロトコルとポートを設定します. 
       
        TCPプロトコルおよびフィルタリングノード用に80と443（HTTPSトラフィックがある場合）のポートを指定します.
        
    3.  必要に応じて、**Health Checks**パラメータ群を使用して可用性チェックを設定します.
    
6.  **Next: Register Targets**ボタンをクリックして、次のステップに進みます. 

    このステップでは操作は不要です. 
    
7.  **Next: Review**ボタンをクリックして、次のステップに切り替えます.
    
    すべてのパラメータが正しく指定されていることを確認し、**Create**ボタンをクリックしてロードバランサ作成プロセスを開始します.

!!! info "ロードバランサの初期化完了を待ちます"
    ロードバランサ作成後、トラフィック受信の準備が整うまで時間がかかります.

## 2. 作成したロードバランサを使用するAuto Scaling Groupの設定

作成したロードバランサを使用するようにAuto Scaling Groupを設定します. これにより、ロードバランサはグループ内で起動されるフィルタリングノードインスタンスにトラフィックをルーティングできるようになります.

これを実現するため、以下の操作を完了します:
1.  Amazon EC2ダッシュボードの**Auto Scaling Groups**タブに移動し、[以前に作成された][link-doc-asg-guide]Auto Scaling Groupを選択します.
2.  **Actions**ドロップダウンメニューで*Edit*を選択して、グループ構成編集ダイアログを開きます.
3.  **Target groups**ドロップダウンリストでロードバランサを設定する際、[作成済み][anchor-create]の**demo-target**ターゲットグループを選択します.
4.  **Save**ボタンをクリックして変更を適用します.

これで、動的にスケールするWallarmフィルタリングノードのセットがアプリケーションへの着信トラフィックを処理します.

配置されたフィルタリングノードの動作を確認するため、以下の手順を実行します:

1.  ブラウザを使用して、ロードバランサのIPアドレスまたはドメイン名を参照し、アプリケーションがロードバランサおよびWallarmフィルタリングノードを通じてアクセス可能であることを確認します.
2.  [テスト攻撃を実行する][link-docs-check-operation]ことで、Wallarmサービスがアプリケーションを保護していることを確認します.

![Checking filtering node operation][img-checking-operation]