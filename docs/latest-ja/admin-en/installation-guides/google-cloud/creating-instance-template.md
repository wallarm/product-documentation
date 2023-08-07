# GCPでフィルタリングノードインスタンステンプレートを作成する

[img-creating-template]: ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-template.png
[img-selecting-image]: ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/select-image.png

[link-creating-image]: create-image.md
[link-creating-instance-group]: creating-autoscaling-group.md

後で管理されたインスタンスグループを作成する基礎として使用するために、フィルタリングノードのインスタンステンプレートを作成します。フィルタリングノードインスタンステンプレートを作成するには、以下の手順を実行します：

1. メニューの**Compute Engine**セクションにある**インスタンステンプレート**ページに移動し、**インスタンステンプレートを作成**ボタンをクリックします。
    
    ![インスタンステンプレートを作成][img-creating-template]
    
2. **名前**フィールドにテンプレート名を入力します。
3. **マシンタイプ**フィールドからフィルタリングノードで仮想マシンを起動するために使用する仮想マシンのタイプを選択します。 

    !!! warning "適切なインスタンスタイプを選択してください"
        フィルタリングノードを初期設定したときに使用した同じインスタンスタイプ（またはより強力なもの）を選択します。
        
        力不足なインスタンスタイプを使用すると、フィルタリングノードの操作で問題が発生する可能性があります。

4. **ブートディスク**設定の**変更**ボタンをクリックします。表示されるウィンドウで**カスタムイメージ**タブに移動し、**Show images from**ドロップダウンリストから仮想マシンイメージを作成したプロジェクトの名前を選択します。プロジェクトの利用可能なイメージリストから[以前に作成したイメージ][link-creating-image]を選択し、**選択**ボタンをクリックします。

    ![画像を選択][img-selecting-image]
    
5. テンプレートに基づいて作成されたインスタンスが基本インスタンスと同じになるように、[基本インスタンスを作成したとき][link-creating-image]に設定したパラメータと同じ方法で、残りのすべてのパラメータを設定します。
    
    !!! info "ファイヤウォールの設定"
        作成したテンプレートへのHTTPトラフィックがファイヤウォールによってブロックされないようにします。HTTPトラフィックを有効にするには、**HTTPトラフィックを許可**チェックボックスを選択します。
    
    --8<-- "../include/gcp-autoscaling-connect-ssh.md"

6. **作成**ボタンをクリックし、テンプレートの作成プロセスが完了するのを待ちます。

インスタンステンプレートを作成した後は、オートスケーリングが有効な[管理インスタンスグループの作成][link-creating-instance-group]に進むことができます。