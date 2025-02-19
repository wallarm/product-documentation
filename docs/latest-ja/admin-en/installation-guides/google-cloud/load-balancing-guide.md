[link-doc-asg-guide]:               creating-autoscaling-group.md  
[link-docs-check-operation]:        /admin-en/installation-check-operation-en.md
[link-lb-comparison]:               https://cloud.google.com/load-balancing/docs/load-balancing-overview
[link-creating-instance-group]:     creating-autoscaling-group.md
[link-backup-resource]:             https://cloud.google.com/load-balancing/docs/target-pools#backupPool
[link-health-check]:                https://cloud.google.com/load-balancing/docs/health-checks
[link-session-affinity]:            https://cloud.google.com/load-balancing/docs/target-pools#sessionaffinity
[link-test-attack]:                 ../../installation-check-operation-en.md
[link-network-service-tier]:        https://cloud.google.com/network-tiers/docs/

[img-backend-configuration]:        ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/backend-configuration.png
[img-creating-lb]:                  ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/creating-load-balancer.png
[img-creating-tcp-lb]:              ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/creating-tcp-load-balancer.png
[img-new-frontend-ip-and-port]:     ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/frontend-configuration.png
[img-checking-attacks]:             ../../../images/admin-guides/test-attacks-quickstart.png

# GCPにおけるインカミングリクエストのロードバランシング設定

[link-doc-asg-guide]に記載された自動スケーリングを有効にした管理対象インスタンスグループが構成済みの場合、インスタンスグループ内の複数のフィルタリングノード間で、着信HTTPおよびHTTPS接続を分散するロードバランサを作成および構成する必要があります。

Google Cloud Platform上で次の種類のロードバランサを構成できます:
*   HTTP(S) Load Balancer
*   TCP Load Balancer
*   UDP Load Balancer

!!! info "ロードバランサの違い"
    ロードバランサの詳細な違いについては、この[リンク][link-lb-comparison]に進んでください。

本ドキュメントでは、OSI/ISOネットワークモデルのトランスポート層でトラフィックを分散するTCP Load Balancerの構成および使用方法を説明します。

以下の操作を完了することで、インスタンスグループ用のTCP Load Balancerを作成します:

1.  メニューの**Network services**セクションにある**Load balancing**ページに移動し、**Create load balancer**ボタンをクリックします。

2.  **TCP load balancing**カード上の**Start configuration**ボタンをクリックします。

3.  次の設定項目で必要なオプションを選択します:

    1.  **Internet facing or internal only**の設定で**From Internet to my VMs**オプションを選択し、ロードバランサがクライアントからサーバへ着信リクエストを制御するようにします。
    
    2.  **Multiple regions or single region**の設定で**Single region only**オプションを選択します。
    
        !!! info "異なるリージョンに配置されたリソース向けのトラフィック分散"
            本ガイドでは、単一リージョンに配置されたインスタンスグループ用のロードバランサ構成について説明します。
            
            複数のリージョンに配置された複数のリソースのトラフィックを分散する場合は、**Multiple regions (or not sure yet)**オプションを選択してください。

    ![Creating a load balancer][img-creating-lb]

    **Continue**ボタンをクリックします。

4.  **Name**フィールドにロードバランサの名前を入力します。

5.  **Backend configuration**をクリックして、ロードバランサが着信リクエストをルーティングするバックエンドとして[作成済みのインスタンスグループ][link-creating-instance-group]を使用します。

6.  次のデータでフォームを入力します:

    1.  **Region**のドロップダウンリストからインスタンスグループが配置されているリージョンを選択します。
    
    2.  **Backends**設定内の**Select existing instance groups**タブに移動し、**Add an instance group**のドロップダウンリストからインスタンスグループの名前を選択します。
    
    3.  必要に応じて、**Backup Pool**ドロップダウンリストから**Create a backup pool**オプションを選択し、バックアッププールを指定します。 
    
        !!! info "バックアッププールの使用"
            バックアッププールは、前の設定で選択されたインスタンスグループが利用できない場合にリクエストを処理します。バックアッププールの構成の詳細については、この[リンク][link-backup-resource]に進んでください。
            
            本ドキュメントではバックアッププールの構成については説明しません。
    
    4.  必要に応じて、**Health check**ドロップダウンリストで**Create a health check**オプションを選択し、グループインスタンスの可用性チェックを構成します。マシンの可用性チェックの詳細については、この[リンク][link-health-check]に進んでください。
    
        !!! info "可用性チェック"
            本ドキュメントでは可用性チェックは構成されません。そのため、**Health check**ドロップダウンリストで**No health check**オプションが選択されます。
    
    5.  必要に応じて、**Session affinity**ドロップダウンリストで対応するオプションを選択し、リクエスト処理のためのインスタンス選択方法を構成します。リクエスト処理のためのインスタンス選択の詳細については、この[リンク][link-session-affinity]にてご確認ください。
    
        !!! info "インスタンス選択方法の構成"
            リクエスト処理のためのインスタンス選択方法は本ドキュメントの範囲外です。そのため、**Session affinity**ドロップダウンリストでは**None**オプションが選択されます。
    
        ![Configuring a backend][img-backend-configuration]

7.  **Frontend configuration**ボタンをクリックして、クライアントがリクエストを送信するIPアドレスとポートを指定します。

8.  新しいIPアドレスとポートの作成用フォームに必要なデータを入力します:

    1.  必要に応じて、**Name**フィールドに新しいIPアドレスとポートペアの名前を入力します。
    
    2.  **Network Service Tier**の設定で必要なネットワークサービスティアを選択します。ネットワークサービスティアの詳細については、この[リンク][link-network-service-tier]に進んでください。
    
    3.  **IP**のドロップダウンリストから、ロードバランサがリクエストを受信するIPアドレスを選択します。
    
        1.  仮想マシン起動時にロードバランサが新しいIPアドレスを取得する場合は、**Ephemeral**オプションを選択します。
        
        2.  ロードバランサ用の静的IPアドレスを生成するには、**Create IP address**オプションを選択します。 
        
        表示されたフォームで、**Name**フィールドに新しいIPアドレスの名前を入力し、**Reserve**ボタンをクリックします。
            
    4.  **Port**フィールドに、ロードバランサがリクエストを受信するポート番号を入力します。 
    
        !!! info "ポートの選択"
            本ドキュメントでは、HTTPプロトコルを介してリクエストを受信するためにポート`80`が指定されています。
    
    ![New frontend IP and port creation form][img-new-frontend-ip-and-port]
    
    **Done**ボタンをクリックして、構成されたIPアドレスとポートペアを作成します。
    
    !!! info "必要なフロントエンドポート"
        本ドキュメントでは、HTTPプロトコルを介してリクエストを受信するようにロードバランサが構成されています。インスタンスグループがHTTPSプロトコルでリクエストを受信する場合は、ポート`443`を指定した別のIPアドレスとポートペアを作成してください。

9.  **Create**ボタンをクリックして、構成済みのロードバランサを作成します。

    ![Creating a TCP load balancer][img-creating-tcp-lb]
    
ロードバランサ作成プロセスが完了し、以前に作成したインスタンスグループにロードバランサが接続されるまでお待ちください。

作成されたTCPロードバランサは、インスタンスグループのために作成されたバックエンドと連携するBackend serviceを使用するため、インスタンスグループの構成を変更する必要はありません。

これで、Wallarmフィルタリングノードの動的にスケーリングするセットが、アプリケーションへの着信トラフィックを処理します。

デプロイされたフィルタリングノードの動作を確認するには、次の手順を実行してください:
1.  ブラウザを使用して、ロードバランサのIPアドレスまたはドメイン名にアクセスし、アプリケーションがロードバランサおよびWallarmフィルタリングノードを通じてアクセス可能であることを確認します。
2.  [テスト攻撃を実行する][link-test-attack]ことで、Wallarmサービスがアプリケーションを保護していることを確認します。

![The «Events» tab on the Wallarm web interface][img-checking-attacks]