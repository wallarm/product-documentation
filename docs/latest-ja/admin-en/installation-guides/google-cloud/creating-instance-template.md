#  GCPでのフィルタリングノードのインスタンステンプレート作成

[img-creating-template]:                ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-template.png
[img-selecting-image]:                  ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/select-image.png

[link-creating-image]:                  create-image.md
[link-creating-instance-group]:         creating-autoscaling-group.md

フィルタリングノードのインスタンステンプレートは、後でマネージドインスタンスグループを作成する際のベースとして使用します。フィルタリングノードのインスタンステンプレートを作成するには、次の手順を実行します。

1.  メニューの**Compute Engine**セクション内の**Instance templates**ページに移動し、**Create instance template**ボタンをクリックします。
    
    ![インスタンステンプレートの作成][img-creating-template]
    
2.  **Name**フィールドにテンプレート名を入力します。
3.  **Machine type**フィールドから、フィルタリングノードを稼働させる仮想マシンのタイプを選択します。 

    !!! warning "適切なインスタンスタイプの選択"
        初期設定時にフィルタリングノードで使用したものと同じインスタンスタイプ（またはより高性能なもの）を選択します。
        
        より性能の劣るインスタンスタイプを使用すると、フィルタリングノードの動作に問題が発生する可能性があります。

4.  **Boot disk**設定の**Change**ボタンをクリックします。表示されたウィンドウで**Custom images**タブに移動し、**Show images from**ドロップダウンリストからイメージを作成したプロジェクト名を選択します。プロジェクトの利用可能なイメージの一覧から[以前に作成したイメージ][link-creating-image]を選択し、**Select**ボタンをクリックします。

    ![イメージの選択][img-selecting-image]
    
5.  テンプレートに基づいて作成されるインスタンスがベースインスタンスと同一になるよう、[ベースインスタンスを作成した際][link-creating-image]と同じ方法で、残りのパラメータをすべて設定します。
    
    !!! info "ファイアウォールの設定"
        作成したテンプレートへのHTTPトラフィックをファイアウォールがブロックしていないことを確認します。HTTPトラフィックを許可するには、**Allow HTTP traffic**チェックボックスを選択します。
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

6.  **Create**ボタンをクリックし、テンプレートの作成プロセスが完了するまで待ちます。 

インスタンステンプレートの作成後は、自動スケーリングを有効にした[マネージドインスタンスグループの作成][link-creating-instance-group]に進むことができます。