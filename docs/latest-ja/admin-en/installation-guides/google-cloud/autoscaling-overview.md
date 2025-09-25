[link-doc-image-creation]:              create-image.md
[link-doc-template-creation]:           creating-instance-template.md
[link-doc-managed-autoscaling-group]:   creating-autoscaling-group.md
[link-doc-lb-guide]:                    load-balancing-guide.md

#   Google Cloud Platformでのフィルタリングノードのオートスケーリング設定: 概要

Google Cloud Platform(GCP)上でWallarmフィルタリングノードのオートスケーリングを設定すると、トラフィックの変動（ある場合）にフィルタリングノードが対応できるようになります。オートスケーリングを有効にすると、トラフィックが大幅に増加したときでも、フィルタリングノードを使用してアプリケーションへの受信リクエストを処理できます。

!!! warning "前提条件"
    オートスケーリングの設定にはWallarmフィルタリングノードを含む仮想マシンのイメージが必要です。
    
    GCPでWallarmフィルタリングノードを含む仮想マシンのイメージを作成する方法の詳細は、この[リンク][link-doc-image-creation]をご覧ください。

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

Google Cloud Platform上でフィルタリングノードをオートスケールするには、次の手順を実行します:

1.  [Machine Imageを作成します](create-image.md)
1.  フィルタリングノードのオートスケーリングを設定します:
    1.  [フィルタリングノードのインスタンステンプレートを作成します][link-doc-template-creation];
    2.  [オートスケーリングを有効にしたマネージドインスタンスグループを作成します][link-doc-managed-autoscaling-group];
1.  [受信リクエストの負荷分散を設定します][link-doc-lb-guide].

!!! info "必要な権限"
    オートスケーリングを設定する前に、ご使用のGCPアカウントに`Compute Admin`ロールが付与されていることを確認してください。