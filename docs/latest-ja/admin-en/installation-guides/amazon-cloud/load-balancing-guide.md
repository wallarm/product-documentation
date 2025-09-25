[link-doc-asg-guide]:               autoscaling-group-guide.md  
[link-docs-check-operation]:        ../../../admin-en/uat-checklist-en.md#node-registers-attacks

[link-aws-lb-comparison]:           https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html?icmpid=docs_elbv2_console#elb-features   

[img-lb-basics]:                    ../../../images/installation-ami/auto-scaling/common/load-balancing-guide/lb-create-1.png
[img-lb-routing]:                   ../../../images/installation-ami/auto-scaling/common/load-balancing-guide/lb-create-3.png
[img-checking-operation]:           ../../../images/admin-guides/test-attacks-quickstart.png

[anchor-create]:        #1-creating-a-load-balancer
[anchor-configure]:     #2-setting-up-an-auto-scaling-group-for-using-the-created-balancer

#   AWSでLoad Balancerを作成する

[設定済み][link-doc-asg-guide]のフィルタリングノードAuto Scaling Groupが用意できたら、受信するHTTPおよびHTTPS接続をそのAuto Scaling Group内の複数のフィルタリングノードに分散するLoad Balancerを作成・構成する必要があります。

Load Balancerの作成手順は次のとおりです:
1.  [Load Balancerの作成][anchor-create]
2.  [作成したバランサーを使用するためのAuto Scaling Groupの設定][anchor-configure]

##  1.  Load Balancerの作成

Amazonクラウドでは、以下の種類のLoad Balancerを構成できます:
*   Classic Load Balancer
*   Network Load Balancer
*   Application Load Balancer

!!! info "Load Balancerの違い"
    Load Balancer間の違いの詳細は、この[リンク][link-aws-lb-comparison]を参照してください。

本書では、OSI/ISOネットワークモデルのトランスポート層でトラフィックを分散するNetwork Load Balancerの構成と使用方法を示します。

次の操作を実行してLoad Balancerを作成します: 
1.  Amazon EC2ダッシュボードの**Load Balancers**タブに移動し、**Create Load Balancer**ボタンをクリックします。

2.  該当する**Create**ボタンをクリックしてNetwork Load Balancerを作成します。

3.  Load Balancerの基本パラメータを構成します:

    ![Load Balancerの基本パラメータの設定][img-lb-basics]
    
    1.  バランサーの名前（**Name**パラメータ）。
    
    2.  バランサーのタイプ（**Scheme**パラメータ）。バランサーをインターネットで利用可能にするには、タイプに**internet-facing**を選択します。 
    
    3.  **Listeners**パラメータグループを使用して、バランサーが待ち受けるポートを指定します。
    
    4.  バランサーを動作させるVPCとAvailability Zonesを指定します。
        
        !!! info "Auto Scaling Groupの可用性を確認"
            Load Balancerが正しく動作するよう、[以前に作成した][link-doc-asg-guide]Auto Scaling Groupを含むVPCとAvailability Zonesを選択していることを確認してください。
        
4.  **Next: Configure Security Settings**ボタンをクリックして次のステップに進みます。

    必要に応じてセキュリティパラメータを構成します。
    
5.  **Next: Configure Routing**ボタンをクリックして次のステップに進みます。 

    Auto Scaling Group内のフィルタリングノードへの受信リクエストのルーティングを構成します。

    ![受信接続のルーティングの設定][img-lb-routing]
    
    1.  新しいターゲットグループを作成し、その名前を**Name**フィールドに指定します。Load Balancerは、指定したターゲットグループに属するインスタンスに受信リクエストをルーティングします（例：`demo-target`）。
        
    2.  リクエストのルーティングに使用するプロトコルとポートを設定します。 
    
        フィルタリングノード用に、プロトコルはTCP、ポートは80および443（HTTPSトラフィックがある場合）を指定します。
        
    3.  必要に応じて、**Health Checks**パラメータグループを使用して可用性チェックを構成します。
    
6.  **Next: Register Targets**ボタンをクリックして次のステップに進みます。 

    このステップでは操作は不要です。 
    
7.  **Next: Review**ボタンをクリックして次のステップに進みます。
    
    すべてのパラメータが正しく指定されていることを確認し、**Create**ボタンをクリックしてLoad Balancerの作成を開始します。

!!! info "Load Balancerの初期化完了まで待機"
    Load Balancerが作成された後、トラフィックを受け入れられる状態になるまでに一定の時間が必要です。

##  2.  作成したバランサーを使用するためのAuto Scaling Groupの設定

以前に作成したLoad Balancerを使用するようにAuto Scaling Groupを構成します。これにより、グループで起動されたフィルタリングノードインスタンスに対して、バランサーがトラフィックをルーティングできるようになります。

次の操作を実行します:
1.  Amazon EC2ダッシュボードの**Auto Scaling Groups**タブに移動し、[以前に作成した][link-doc-asg-guide]Auto Scaling Groupを選択します。

2.  **Actions**ドロップダウンメニューで*Edit*を選択し、グループ設定の編集ダイアログを開きます。 

3.  Load Balancerの設定時に[作成][anchor-create]したターゲットグループ**demo-target**を、**Target groups**ドロップダウンリストで選択します。

4.  **Save**ボタンをクリックして変更を適用します。

これで、動的にスケールするWallarmフィルタリングノードのセットが、アプリケーションへの受信トラフィックを処理します。

デプロイしたフィルタリングノードの動作を確認するには、次の手順を実行します。

1.  ブラウザでLoad BalancerおよびWallarmフィルタリングノードを介してアプリケーションにアクセスできることを、バランサーのIPアドレスまたはドメイン名にアクセスして確認します。

2.  [テスト攻撃を実行][link-docs-check-operation]して、Wallarmサービスがアプリケーションを保護していることを確認します。

![フィルタリングノードの動作確認][img-checking-operation]