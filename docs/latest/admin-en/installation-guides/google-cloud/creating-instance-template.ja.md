# GCPでのフィルタリングノードインスタンステンプレートの作成

[img-creating-template]: ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-template.png
[img-selecting-image]: ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/select-image.png

[link-creating-image]: create-image.ja.md
[link-creating-instance-group]: creating-autoscaling-group.ja.md

フィルタリングノードインスタンステンプレートは、後で管理インスタンスグループを作成する際のベースとして使用されます。フィルタリングノードインスタンステンプレートを作成するには、次の手順を実行します。

1. メニューの **Compute Engine** セクションにある **Instance templates** ページに移動し、**Create instance template** ボタンをクリックします。

    ![!インスタンステンプレートの作成][img-creating-template]

2. **Name** フィールドにテンプレート名を入力します。
3. **Machine type** フィールドから、フィルタリングノードを含む仮想マシンを起動するために使用する仮想マシンタイプを選択します。

    !!! warning "適切なインスタンスタイプを選択してください"
        最初にフィルタリングノードを設定したときに使用したのと同じインスタンスタイプを選択するか、それ以上の性能があるものを選択してください。

        性能が低いインスタンスタイプを使用すると、フィルタリングノードの動作に問題が発生する場合があります。

4. **Boot disk** 設定の **Change** ボタンをクリックします。表示されるウィンドウで **Custom images** タブに移動し、**Show images from** ドロップダウンリストから仮想マシンイメージを作成したプロジェクトの名前を選択します。プロジェクトの利用可能なイメージ一覧から[以前に作成したイメージ][link-creating-image]を選択し、**Select** ボタンをクリックします。

    ![!イメージの選択][img-selecting-image]

5. テンプレートに基づくインスタンスが基本インスタンスと同一であるように、[基本インスタンスを作成するとき][link-creating-image]に設定したパラメータと同じように、残りのすべてのパラメータを設定します。

    !!! info "ファイアウォールの設定"
        ファイアウォールが作成されたテンプレートへのHTTP通信をブロックしないようにしてください。HTTP通信を有効にするには、**Allow HTTP traffic** チェックボックスを選択します。

    --8<-- "../include/gcp-autoscaling-connect-ssh.ja.md"

6. **Create** ボタンをクリックし、テンプレート作成プロセスが完了するのを待ちます。

インスタンステンプレートを作成した後、オートスケーリングが有効な[管理インスタンスグループの作成][link-creating-instance-group]に進むことができます。