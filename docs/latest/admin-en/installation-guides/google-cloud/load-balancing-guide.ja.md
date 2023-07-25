Wallarm のドキュメントの次の部分を英語から日本語に翻訳してください：

---
Wallarm は API とアプリケーションのセキュリティと運用上のリスクを自動的に検出、修復し、保護するクラウドネイティブの DevSecOps ソリューションです。モダンなインフラストラクチャ向けに設計された Wallarm は、高度な脅威対策を提供し、リアルタイムでの脆弱性検出とインシデント対応を実現します。

主な機能：
- リアルタイムでの攻撃検出とブロック
- AI による脆弱性検出と修復
- 継続的なセキュリティテスト
- インシデント対応とデータ分析

開発者や運用チームの働き方やワークフローを変更することなく、シームレスに統合され、継続的デリバリータイムライン内で作業を簡単にこなせるように設計されています。今すぐ始めて、Wallarm で包括的なアプリケーションと API セキュリティを実現しましょう。

---[link-doc-asg-guide]: creating-autoscaling-group.ja.md
[link-docs-check-operation]: /admin-en/installation-check-operation-en.ja.md
[link-lb-comparison]: https://cloud.google.com/load-balancing/docs/load-balancing-overview
[link-creating-instance-group]: creating-autoscaling-group.ja.md
[link-backup-resource]: https://cloud.google.com/load-balancing/docs/target-pools#backupPool
[link-health-check]: https://cloud.google.com/load-balancing/docs/health-checks
[link-session-affinity]: https://cloud.google.com/load-balancing/docs/target-pools#sessionaffinity
[link-test-attack]: ../../installation-check-operation-en.ja.md
[link-network-service-tier]: https://cloud.google.com/network-tiers/docs/

[img-backend-configuration]: ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/backend-configuration.png
[img-creating-lb]: ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/creating-load-balancer.png
[img-creating-tcp-lb]: ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/creating-tcp-load-balancer.png
[img-new-frontend-ip-and-port]: ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/frontend-configuration.png
[img-checking-attacks]: ../../../images/admin-guides/test-attacks-quickstart.png

# GCPの受信リクエストバランシングの設定

オートスケーリングが有効になった[設定済み][link-doc-asg-guide]の管理インスタンスグループがあるため、インスタンスグループからの複数のフィルタリングノードに対する受信HTTPおよびHTTPS接続を分配するロードバランサを作成および設定する必要があります。

Google Cloud Platformで以下のタイプのロードバランサを設定できます：
*   HTTP(S)ロードバランサ
*   TCPロードバランサ
*   UDPロードバランサ

!!! info "ロードバランサ間の違い "
    ロードバランサの違いについての詳細情報は、この[リンク][link-lb-comparison]に進んでください。

このドキュメントでは、OSI/ISOネットワークモデルのトランスポートレベルでトラフィックを分散するTCPロードバランサの設定と使用方法を示します。

以下の手順を実行してインスタンスグループ用のTCPロードバランサを作成します:

1.  メニューの**ネットワークサービス**セクションにある**ロードバランシング**ページに移動し、**ロードバランサの作成**ボタンをクリックします。

2.  **TCPロードバランシング**カードの**設定の開始**ボタンをクリックします。

3.  以下の設定で必要なオプションを選択します。

    1.  **インターネット向けか内部専用**の設定で、**インターネットから私のVMへ**オプションを選択して、ロードバランサがクライアントからサーバーへの受信リクエストを制御するようにします。
    
    2.  **複数のリージョンまたは単一のリージョン**の設定で、**単一のリージョンのみ**オプションを選択します。
    
        !!! info "異なるリージョンにあるリソースのトラフィックバランシング"
            このガイドでは、単一のリージョンにあるインスタンスグループ用のロードバランサーの設定が説明されています。
            
            複数のリージョンにある複数のリソース用のトラフィックのバランシングの場合、**複数のリージョン（またはまだわからない）**オプションを選択してください。
    
    ![!Creating a load balancer][img-creating-lb]
    
    **Continue**ボタンをクリックします。

4.  **名前**フィールドにロードバランサ名を入力します。

5.  **バックエンド構成**をクリックして、ロードバランサが入力リクエストをルーティングするバックエンドとして[作成されたインスタンスグループ][link-creating-instance-group]を使用します。

6.  以下のデータでフォームを記入してください：

    1.  **リージョン**ドロップダウンリストから、インスタンスグループがあるリージョンを選択します。
    
    2.  **バックエンド**設定の**既存のインスタンスグループを選択**タブに移動し、**インスタンスグループを追加**ドロップダウンリストからインスタンスグループの名前を選択します。
    
    3.  必要に応じて**バックアッププール**ドロップダウンリストから**バックアッププールの作成**オプションを選択してバックアッププールを指定します。 
    
        !!! info "バックアッププールの使用"
            バックアッププールは、前の設定で選択されたインスタンスグループが使用できない場合にリクエストを処理します。バックアッププールの設定についての詳細情報は、この[リンク][link-backup-resource]に進んでください。
            
            このドキュメントでは、バックアッププールの設定は説明されていません。
    
    4.  必要に応じて、**ヘルスチェック**ドロップダウンリストで**ヘルスチェックの作成**オプションを選択して、グループインスタンスの可用性チェックを設定します。機械の可用性チェックについての詳細情報は、この[リンク][link-health-check]に進んでください。
    
        !!! info "可用性チェック"
            このドキュメントの範囲内では可用性チェックは設定されていません。したがって、ここでは**ヘルスチェック**ドロップダウンリストで**ヘルスチェックなし**オプションが選択されています。

    5.  必要に応じて、**セッションアフィニティ**ドロップダウンリストで対応するオプションを選択して、リクエスト処理用のインスタンスの選択方法を設定します。リクエスト処理用のインスタンスの選択に関する詳細情報は、この[リンク][link-session-affinity]で利用できます。
    
        !!! info "インスタンスの選択方法の設定"
            リクエスト処理用のインスタンスの選択方法は、このドキュメントの範囲外です。したがって、ここでは**セッションアフィニティ**ドロップダウンリストで**なし**オプションが選択されています。

        ![!Configuring a backend][img-backend-configuration]
    
7.  **フロントエンド設定**ボタンをクリックして、クライアントがリクエストを送信するIPアドレスとポートを指定します。

8.  新しいIPアドレスとポート作成用のフォームに必要なデータを入力してください。

    1.  必要に応じて、新しいIPアドレスとポートペアの名前を**名前**フィールドに入力します。
    
    2.  **ネットワークサービス層**設定で、必要なネットワークサービス層を選択します。ネットワークサービス層に関する詳細情報は、この[リンク][link-network-service-tier]に進んでください。
    
    3.  **IP**ドロップダウンリストから、ロードバランサがリクエストを受信するIPアドレスを選択します。
    
        1.  仮想マシンの起動ごとにロードバランサが新しいIPアドレスを取得する場合は、**エフェメラル**オプションを選択します。
        
        2.  ロードバランサーに静的IPアドレスを生成する場合は、**IPアドレスの作成**オプションを選択します。

        表示されるフォームで**名前**フィールドに新しいIPアドレスの名前を入力し、**予約**ボタンをクリックします。
    
    4.  **ポート**フィールドに、ロードバランサがリクエストを受信するポートを入力します。

        !!! info "ポートの選択"
            このドキュメントでは、HTTPプロトコルを介してリクエストを受信するためにポート `80` が指定されています。
    
    ![!New frontend IP and port creation form][img-new-frontend-ip-and-port]
    
    設定したIPアドレスとポートペアを作成するには、**完了**ボタンをクリックします。
    
    !!! info "必要なフロントエンドポート"
        このドキュメントでは、バランサはHTTPプロトコルを介してリクエストを受信するように設定されています。インスタンスグループがHTTPSプロトコルを介してリクエストを受信する場合は、ポート `443` を指定した別のIPアドレスとポートペアを作成してください。

9.  設定したロードバランサを作成するには、**作成**ボタンをクリックします。

    ![!Creating a TCP load balancer][img-creating-tcp-lb]
    
ロードバランサーの作成プロセスが完了し、ロードバランサーが以前に作成したインスタンスグループに接続されるまで待ちます。

作成されたTCPバランサは、バックエンドサービスを使用しています（これは、インスタンスグループ用に作成されたバックエンドと連携して動作します）。そのため、インスタンスグループはバランサが接続するために設定変更は不要です。

これで、動的にスケーリングされたWallarmのフィルタリングノードセットが、アプリケーションへの着信トラフィックを処理するようになります。

デプロイされたフィルタリングノードの動作を確認するには、次の手順を実行します：
1.  ブラウザーを使用して、ロードバランサのIPアドレスまたはドメイン名を参照することによって、アプリケーションがロードバランサおよびWallarmフィルタリングノードを通じてアクセス可能であることを確認します。
2.  [テスト攻撃を実行する][link-test-attack]ことによって、Wallarmサービスがアプリケーションを保護していることを確認します。

![!The «Events» tab on the Wallarm web interface][img-checking-attacks]