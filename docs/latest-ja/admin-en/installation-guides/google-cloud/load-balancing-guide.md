[link-doc-asg-guide]:               creating-autoscaling-group.md  
[link-docs-check-operation]:        ../../../admin-en/uat-checklist-en.md
[link-lb-comparison]:               https://cloud.google.com/load-balancing/docs/load-balancing-overview
[link-creating-instance-group]:     creating-autoscaling-group.md
[link-backup-resource]:             https://cloud.google.com/load-balancing/docs/target-pools#backupPool
[link-health-check]:                https://cloud.google.com/load-balancing/docs/health-checks
[link-session-affinity]:            https://cloud.google.com/load-balancing/docs/target-pools#sessionaffinity
[link-test-attack]:                 ../../../admin-en/uat-checklist-en.md#node-registers-attacks
[link-network-service-tier]:        https://cloud.google.com/network-tiers/docs/

[img-backend-configuration]:        ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/backend-configuration.png
[img-creating-lb]:                  ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/creating-load-balancer.png
[img-creating-tcp-lb]:              ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/creating-tcp-load-balancer.png
[img-new-frontend-ip-and-port]:     ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/frontend-configuration.png
[img-checking-attacks]:             ../../../images/admin-guides/test-attacks-quickstart.png


#   GCPでの受信リクエストの負荷分散の設定

オートスケーリングを有効にした[構成済み][link-doc-asg-guide]のManaged instance groupが用意できたので、インスタンスグループ内の複数のフィルタリングノード間で受信HTTPおよびHTTPS接続を分散するLoad Balancerを作成・設定する必要があります。

Google Cloud Platformで設定できるLoad Balancerの種類は次のとおりです:
*   HTTP(S) Load Balancer
*   TCP Load Balancer
*   UDP Load Balancer

!!! info "Load Balancerの違い"
    Load Balancer間の違いの詳細は、この[リンク][link-lb-comparison]をご参照ください。 

本ドキュメントでは、OSI/ISOネットワークモデルのトランスポート層でトラフィックを分散するTCP Load Balancerの設定と使用方法を説明します。

次の手順を実行して、インスタンスグループ用のTCP Load Balancerを作成します: 

1.  メニューの**Network services**セクションにある**Load balancing**ページに移動し、**Create load balancer**ボタンをクリックします。

2.  **TCP load balancing**カードで**Start configuration**ボタンをクリックします。

3.  次の設定で必要なオプションを選択します:

    1.  ロードバランサーがクライアントからサーバーへの受信リクエストを制御できるよう、**Internet facing or internal only**設定で**From Internet to my VMs**オプションを選択します。
    
    2.  **Multiple regions or single region**設定で**Single region only**オプションを選択します。
    
        !!! info "異なるリージョンにあるリソースのトラフィック分散"
            このガイドでは、単一リージョンにある1つのインスタンスグループに対するロードバランサーの設定について説明します。
            
            複数リージョンに配置された複数リソース間でトラフィックを分散する場合は、**Multiple regions (or not sure yet)**オプションを選択します。

    ![Load Balancerの作成][img-creating-lb]

    **Continue**ボタンをクリックします。

4.  **Name**フィールドにロードバランサーの名前を入力します。

5.  ロードバランサーが受信リクエストを転送するバックエンドとして[作成済みのインスタンスグループ][link-creating-instance-group]を使用するため、**Backend configuration**をクリックします。

6.  次の内容でフォームに入力します:

    1.  **Region**ドロップダウンリストからインスタンスグループが存在するリージョンを選択します。
    
    2.  **Backends**設定の**Select existing instance groups**タブに移動し、**Add an instance group**ドロップダウンリストからインスタンスグループ名を選択します。
    
    3.  必要に応じて、**Backup Pool**ドロップダウンリストから**Create a backup pool**オプションを選択してバックアッププールを指定します。 
    
        !!! info "バックアッププールの使用"
            バックアッププールは、前の設定で選択したインスタンスグループが利用できない場合にリクエストを処理します。バックアッププールの設定の詳細は、この[リンク][link-backup-resource]をご参照ください。
            
            本ドキュメントではバックアッププールの設定は取り扱いません。
    
    4.  必要に応じて、**Health check**ドロップダウンリストで**Create a health check**オプションを選択し、グループインスタンスの可用性チェックを構成します。マシンの可用性チェックの詳細は、この[リンク][link-health-check]をご参照ください。
    
        !!! info "可用性チェック"
            本ドキュメントの範囲では可用性チェックは構成しません。そのため、ここでは**Health check**ドロップダウンリストで**No health check**オプションを選択します。
    
    5.  必要に応じて、**Session affinity**ドロップダウンリストで該当するオプションを選択し、リクエスト処理に使用するインスタンスの選択方法を構成します。リクエスト処理用インスタンスの選択に関する詳細は、この[リンク][link-session-affinity]をご参照ください。
    
        !!! info "インスタンス選択方法の構成"
            リクエスト処理に使用するインスタンスの選択方法は本ドキュメントの範囲外です。そのため、ここでは**Session affinity**ドロップダウンリストで**None**オプションを選択します。
    
        ![バックエンドの構成][img-backend-configuration]

7.  **Frontend configuration**ボタンをクリックし、クライアントがリクエストを送信するIPアドレスとポートを指定します。

8.  新しいIPアドレスとポートの作成用フォームに必要事項を入力します:

    1.  必要に応じて、**Name**フィールドに新しいIPアドレスとポートのペアの名前を入力します。
    
    2.  **Network Service Tier**設定で必要なネットワークサービス階層を選択します。ネットワークサービス階層の詳細は、この[リンク][link-network-service-tier]をご参照ください。
    
    3.  **IP**ドロップダウンリストから、ロードバランサーがリクエストを受信するIPアドレスを選択します。
    
        1.  各仮想マシンの起動時にロードバランサーへ新しいIPアドレスを割り当てたい場合は、**Ephemeral**オプションを選択します。
        
        2.  ロードバランサー用に静的IPアドレスを割り当てるには、**Create IP address**オプションを選択します。 
        
        表示されるフォームの**Name**フィールドに新しいIPアドレスの名前を入力し、**Reserve**ボタンをクリックします。
            
    4.  **Port**フィールドに、ロードバランサーがリクエストを受信するポートを入力します。 
    
        !!! info "ポートの選択"
            本ドキュメントでは、HTTPプロトコル経由のリクエスト受信にポート`80`を指定します。
    
    ![新しいフロントエンドIPとポートの作成フォーム][img-new-frontend-ip-and-port]
    
    設定したIPアドレスとポートのペアを作成するために**Done**ボタンをクリックします。
    
    !!! info "必要なフロントエンドポート"
        本ドキュメントでは、HTTPプロトコル経由のリクエストを受信するようにバランサーを構成しています。インスタンスグループがHTTPSプロトコル経由でリクエストを受信する場合は、ポート`443`を指定した別のIPアドレスとポートのペアを作成します。

9.  **Create**ボタンをクリックして、構成済みのロードバランサーを作成します。

    ![TCP Load Balancerの作成][img-creating-tcp-lb]
    
ロードバランサーの作成処理が完了し、先ほど作成したインスタンスグループにロードバランサーが接続されるまで待機します。

作成したTCPバランサーはBackend service（インスタンスグループ用に作成したバックエンドと連携します）を使用するため、バランサーが接続するためにインスタンスグループ側の設定を変更する必要はありません。

これで、動的にスケールするWallarmフィルタリングノード群が、アプリケーションへの受信トラフィックを処理します。

デプロイしたフィルタリングノードの動作を確認するには、次の手順を実行します:
1.  ブラウザでバランサーのIPアドレスまたはドメイン名にアクセスし、ロードバランサーおよびWallarmフィルタリングノード経由でアプリケーションに到達できることを確認します。
2.  [テスト攻撃を実行][link-test-attack]して、Wallarmサービスがアプリケーションを保護していることを確認します。

![WallarmのWebインターフェイスの「Events」タブ][img-checking-attacks]