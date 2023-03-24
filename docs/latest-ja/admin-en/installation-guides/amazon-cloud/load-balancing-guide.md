[link-doc-asg-guide]:               autoscaling-group-guide.md  
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[link-aws-lb-comparison]:           https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html?icmpid=docs_elbv2_console#elb-features   

[img-lb-basics]:                    ../../../images/installation-ami/auto-scaling/common/load-balancing-guide/lb-create-1.png
[img-lb-routing]:                   ../../../images/installation-ami/auto-scaling/common/load-balancing-guide/lb-create-3.png
[img-checking-operation]:           ../../../images/admin-guides/test-attacks-quickstart.png

[anchor-create]:        #1-creating-a-load-balancer
[anchor-configure]:     #2-setting-up-an-auto-scaling-group-for-using-the-created-balancer

#   AWSでロードバランサーを作成する

これで、[設定済み][link-doc-asg-guide]フィルタリングノードのAuto Scaling Groupができたので、Auto Scaling GroupからいくつかのフィルタリングノードにHTTPおよびHTTPS接続を分散させるロードバランサーを作成および設定する必要があります。

ロードバランサーの作成プロセスには、次の手順が含まれます。
1. [ロードバランサーの作成][anchor-create]
2. [作成されたバランサーの使用を設定するAutoScalingグループ][anchor-configure]

##  1.  ロードバランサーの作成

次のタイプのロードバランサーをAmazonクラウドで設定できます。
*   Classic Load Balancer
*   Network Load Balancer
*   Application Load Balancer

!!! info "ロードバランサーの違い"
    ロードバランサー間の違いに関する詳しい情報は、この[リンク][link-aws-lb-comparison]に進んでください。

このドキュメントでは、OSI/ISOネットワークモデルのトランスポートレベルでトラフィックを分散させるネットワークロードバランサーの設定と使用方法について説明します。

次のアクションを完了してロードバランサーを作成します。
1. Amazon EC2ダッシュボードの**Load Balancers**タブに移動し、**Create Load Balancer**ボタンをクリックします。

2. 対応する**Create**ボタンをクリックして、Network Load Balancerを作成します。

3. 基本的なロードバランサーのパラメーターを設定します:

    ![!General Load Balancer parameters configuration][img-lb-basics]
    
    1. バランサーの名前（**Name**パラメータ）。
    
    2. バランサーのタイプ（**Scheme**パラメータ）。バランサーがインターネットで利用可能にするには、**internet-facing**タイプを選択します。
    
    3. **Listeners**パラメータグループを使用して、バランサーがリッスンするポートを指定します。
    
    4. バランサーが動作する必要があるVPCおよび利用可能なゾーンを指定します。
        
        !!! info "Auto Scaling Groupの使用可能性を確認する"
            ロードバランサーが正しく動作するために、[以前に作成された][link-doc-asg-guide] Auto Scaling Groupを含むVPCおよびAvailability Zonesを選択したことを確認してください。
        
4. **Next: Configure Security Settings**ボタンをクリックして次のステップに進みます。

    必要に応じてセキュリティパラメータを設定します。
    
5. **Next: Configure Routing**ボタンをクリックして次のステップに進みます。

    Auto Scaling Groupのフィルタリングノードに入ってくるリクエストのルーティングを設定します。

    ![!Configuring the incoming connections routing][img-lb-routing]
    
    1. 新しいターゲットグループを作成し、**Name**フィールドにその名前を指定します。 ロードバランサーは、指定されたターゲットグループ（例：`demo-target`）にあるインスタンスに入ってくるリクエストをルーティングします。
        
    2. リクエストルーティングに使用されるプロトコルとポートを設定します。
    
        フィルタリングノード用にTCPプロトコルと80および443（HTTPSトラフィックがある場合）ポートを指定します。
        
    3. 必要に応じて、**Health Checks**パラメータグループを使用して使用可能性チェックを設定します。
    
6. **Next: Register Targets**ボタンをクリックして次のステップに進みます。

    このステップではアクションは必要ありません。
    
7. **Next: Review**ボタンをクリックして次のステップに切り替えます。

    すべてのパラメータが正しく指定されていることを確認し、**Create**ボタンをクリックしてロードバランサーの作成プロセスを開始します。

!!! info "Load Balancerが初期化されるまで待つ"
    ロードバランサーが作成された後、トラフィックを受け取る準備ができるまでに時間がかかります。

##  2.  作成されたバランサーを使用するAuto Scaling Groupの設定

以前に作成したロードバランサーを使用するようにAuto Scaling Groupを設定します。これにより、バランサーはグループ内で起動されたフィルタリングノードインスタンスにトラフィックをルーティングできます。

これを行うには、次のアクションを完了します。
1. Amazon EC2ダッシュボードの**Auto Scaling Groups**タブに移動し、[以前に作成された][link-doc-asg-guide] Auto Scaling Groupを選択します。

2. **アクション**ドロップダウンメニューで*Edit*を選択して、グループ設定の編集ダイアログを開きます。

3. ドロップダウンリストで**Target groups**ドロップダウンリストにロードバランサー設定[作成][anchor-create]時に作成された**demo-target**ターゲットグループを選択します。

4. **Save**ボタンをクリックして変更を適用します。

これで、動的にスケーリングされるWallarmフィルタリングノードのセットがアプリケーションに届くトラフィックを処理します。

展開されたフィルタリングノードの動作を確認するには、次の手順を実行します。

1. ブラウザーを使用してバランサーのIPアドレスまたはドメイン名を参照して、アプリケーションがロードバランサーおよびWallarmフィルタリングノードを経由してアクセス可能であることを確認します。

2. [テスト攻撃を実行する][link-docs-check-operation]ことで、Wallarmサービスがアプリケーションを保護していることを確認します。

![!Checking filtering node operation][img-checking-operation]