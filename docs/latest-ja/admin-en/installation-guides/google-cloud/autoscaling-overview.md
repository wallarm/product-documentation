[link-doc-image-creation]:              create-image.md
[link-doc-template-creation]:           creating-instance-template.md
[link-doc-managed-autoscaling-group]:   creating-autoscaling-group.md
[link-doc-lb-guide]:                    load-balancing-guide.md

# Google Cloud Platform上でのフィルタリングノード自動スケーリングの設定: 概要

Google Cloud Platform (GCP)上でWallarmフィルタリングノードの自動スケーリングを設定することで、フィルタリングノードがトラフィックの変動に対応できるようにできます。自動スケーリングを有効にすると、トラフィックが大幅に増加してもフィルタリングノードを使用してアプリケーションへの受信リクエストを処理できるようになります。

!!! warning "前提条件"
    自動スケーリングを設定するには、Wallarmフィルタリングノードを搭載した仮想マシンのイメージが必要です。
    
    GCP上でWallarmフィルタリングノードを搭載した仮想マシンのイメージを作成する方法について詳しくは、この[リンク][link-doc-image-creation]を参照してください。

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

Google Cloud Platform上でフィルタリングノードの自動スケーリングを設定するには、以下の手順を実行してください：

1.  [マシンイメージの作成](create-image.md)
1.  フィルタリングノードの自動スケーリングの設定:
    1.  [フィルタリングノードインスタンステンプレートの作成][link-doc-template-creation];
    2.  [自動スケーリングを有効にしたマネージドインスタンスグループの作成][link-doc-managed-autoscaling-group];
1.  [受信リクエストの負荷分散設定][link-doc-lb-guide].

!!! info "必要な権限"
    自動スケーリングを設定する前に、GCPアカウントに`Compute Admin`ロールが付与されていることを確認してください。