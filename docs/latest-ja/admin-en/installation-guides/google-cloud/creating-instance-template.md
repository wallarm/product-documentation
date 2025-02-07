# GCPにおけるフィルタリングノードインスタンステンプレートの作成

[img-creating-template]:                ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-template.png
[img-selecting-image]:                  ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/select-image.png

[link-creating-image]:                  create-image.md
[link-creating-instance-group]:         creating-autoscaling-group.md

フィルタリングノードインスタンステンプレートは、後で管理対象インスタンスグループ作成時のベースとして使用します。フィルタリングノードインスタンステンプレートを作成するには、以下の手順に従ってください。

1.  メニューの**Compute Engine**セクションにある**Instance templates**ページに移動し、**Create instance template**ボタンをクリックします。

    ![Creating an instance template][img-creating-template]

2.  **Name**フィールドにテンプレート名を入力します。
3.  フィルタリングノードで仮想マシンを起動するために使用する仮想マシンの種類を、**Machine type**フィールドから選択します。

    !!! warning "Select the proper instance type"
        最初にフィルタリングノードを設定したときに使用したもの（またはそれ以上の性能のもの）と同じインスタンスタイプを選択してください。
        
        性能の低いインスタンスタイプを使用すると、フィルタリングノードの動作に支障が生じる可能性があります。

4.  **Boot disk**設定内の**Change**ボタンをクリックします。表示されるウィンドウで**Custom images**タブに移動し、**Show images from**ドロップダウンリストから仮想マシンイメージを作成したプロジェクト名を選択します。利用可能なイメージの一覧から[以前に作成したイメージ][link-creating-image]を選択し、**Select**ボタンをクリックします。

    ![Selecting an image][img-selecting-image]

5.  テンプレートに基づいたインスタンスがベースインスタンスと同一となるように、残りのすべてのパラメータを[creating your base instance][link-creating-image]作成時と同様に設定してください。

    !!! info "Configuring the firewall"
        ファイアウォールが作成されたテンプレートへのHTTPトラフィックをブロックしないようにしてください。HTTPトラフィックを許可するには、**Allow HTTP traffic**チェックボックスをオンにしてください。
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

6.  **Create**ボタンをクリックし、テンプレート作成プロセスが完了するまでお待ちください。

インスタンステンプレートの作成が完了したら、オートスケーリングが有効な[管理対象インスタンスグループの作成][link-creating-instance-group]を実施できます。