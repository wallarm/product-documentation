[link-doc-asg-guide]:               autoscaling-group-guide.md  
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[link-aws-lb-comparison]:           https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html?icmpid=docs_elbv2_console#elb-features   

[img-lb-basics]:                    ../../../images/installation-ami/auto-scaling/common/load-balancing-guide/lb-create-1.png
[img-lb-routing]:                   ../../../images/installation-ami/auto-scaling/common/load-balancing-guide/lb-create-3.png
[img-checking-operation]:           ../../../images/admin-guides/test-attacks-quickstart.png

[anchor-create]:        #1-creating-a-load-balancer
[anchor-configure]:     #2-setting-up-an-auto-scaling-group-for-using-the-created-balancer

#   AWS上でのロードバランサーの作成

今、フィルタリングノードのオートスケーリンググループが[設定][link-doc-asg-guide]されている状態になりましたので、オートスケーリンググループからの複数のフィルタリングノード間で、HTTPとHTTPSの接続を分散するロードバランサーを作成し設定する必要があります。

ロードバランサーの作成過程は以下のステップで進めます：
1.  [ロードバランサーの作成][anchor-create]
2.  [作成したバランサーのためのオートスケーリンググループの設定][anchor-configure]

##  1.  ロードバランサーの作成

Amazonのクラウドでは以下のタイプのロードバランサーを設定できます：
*   Classic Load Balancer
*   Network Load Balancer
*   Application Load Balancer

!!! info "ロードバランサーの違い"
    ロードバランサー間の違いについて詳しく理解するために、こちらの[リンク][link-aws-lb-comparison]をご覧ください。

このドキュメントでは、OSI/ISOネットワークモデルのトランスポート層でトラフィックを分散するNetwork Load Balancerの設定と利用を示します。

以下の操作を行ってロードバランサーを作成します： 
1.  Amazon EC2ダッシュボードの**Load Balancers**タブに移動し、**Create Load Balancer**ボタンをクリックします。

2.  対応する**Create**ボタンをクリックしてNetwork Load Balancerを作成します。

3.  基本的なロードバランサーのパラメータを設定します：

    ![汎用ロードバランサーのパラメータ設定][img-lb-basics]
    
    1.  バランサーの名前（**Name**パラメータ）。
    
    2.  バランサーのタイプ（**Scheme**パラメータ）。バランサーがインターネット上で利用可能にするには、**internet-facing**タイプを選択します。
    
    3.  バランサーが監視するポートを**Listeners**パラメータグループを使用して指定します。
    
    4.  バランサーが作業を行うVPCと使用可能領域を指定します。
        
        !!! info "オートスケーリンググループの使用可能性を確認"
            ロードバランサーが正常に動作するために、必ず[以前に作成した][link-doc-asg-guide]オートスケーリンググループが含まれるVPCと使用可能領域を選択してください。
        
4.  **Next: Configure Security Settings**ボタンをクリックして次のステップに進みます。

    必要に応じてセキュリティーパラメータを設定します。
    
5.  **Next: Configure Routing**ボタンをクリックして次のステップに進みます。

    オートスケーリンググループ内のフィルタリングノードへの要求のルーティングを設定します。

    ![配置された接続のルーティング設定][img-lb-routing]
    
    1.  新しいターゲットグループを作成し、**Name**フィールドでその名前を指定します。ロードバランサーは、着信要求を指定したターゲットグループ内のインスタンスにルーティングします（例：`demo-target`）。
        
    2.  リクエストルーティングに使用するプロトコルとポートを設定します。
    
        フィルタリングノードのTCPプロトコルと80および443（HTTPSトラフィックがある場合）ポートを指定します。
        
    3.  必要に応じて、**Health Checks**パラメータグループを使用して使用可能性チェックを設定します。
    
6.  **Next: Register Targets**ボタンをクリックして次のステップに進みます。

    このステップでは何も操作は不要です。 
    
7.  **Next: Review**ボタンをクリックして次のステップに切り替えます。
    
    すべてのパラメータが正確に指定されていることを確認し、**Create**ボタンをクリックしてロードバランサー作成プロセスを開始します。

!!! info "ロードバランサーが初期化されるまで待つ"
    ロードバランサーが作成された後、トラフィックを受け取る準備が整うまでには少し時間がかかります。

##  2.  作成したバランサーの使用のためのオートスケーリンググループ設定

以前に作成したロードバランサーを使用するために、オートスケーリンググループを設定します。これにより、バランサーはグループ内で起動したフィルタリングノードインスタンスに対してトラフィックをルーティングできます。

これを行うために以下の操作を実行します：
1.  Amazon EC2ダッシュボードの**Auto Scaling Groups**タブに移動し、[以前に作成した][link-doc-asg-guide]オートスケーリンググループを選択します。

2.  **Actions**ドロップダウンメニューで*Edit*を選択し、グループ設定編集ダイアログを開きます。 

3.  **Target groups**ドロップダウンメニューで、ロードバランサー設定時に[作成した][anchor-create]**demo-target**ターゲットグループを選択します。

4.  **Save**ボタンをクリックして変更を適用します。

今、動的にスケーリングされるWallarmフィルタリングノードのセットがアプリケーションへの着信トラフィックを処理します。

デプロイされたフィルタリングノードの動作を確認するためには、以下のステップを行います：

1.  ブラウザを使用してバランサーのIPアドレスまたはドメイン名を参照し、アプリケーションがロードバランサーとWallarmフィルタリングノードを通じてアクセス可能であることを確認します。

2.  [テスト攻撃を行う][link-docs-check-operation]ことにより、Wallarmのサービスがアプリケーションを保護していることを確認します。

![フィルタリングノードの操作チェック][img-checking-operation]