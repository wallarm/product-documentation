[link-doc-image-creation]:              create-image.md
[link-doc-template-creation]:           creating-instance-template.md
[link-doc-managed-autoscaling-group]:   creating-autoscaling-group.md
[link-doc-lb-guide]:                    load-balancing-guide.md

#   Google Cloud Platform上でのフィルタリングノードのオートスケーリングの設定：概要

Google Cloud Platform（GCP）上でWallarmのフィルタリングノードのオートスケーリングを設定することで、フィルタリングノードが交通量の変動（もしあれば）に対応できるようにすることができます。オートスケーリングを有効にすると、トラフィックが大幅に増加した場合でも、フィルタリングノードを使用してアプリケーションへの入力リクエストを処理することができます。

!!! warning "前提条件"
    オートスケーリングの設定には、Wallarmのフィルタリングノードを備えた仮想マシンのイメージが必要です。
    
    GCP上でWallarmフィルタリングノード付きの仮想マシンのイメージを作成するための詳細情報については、この[リンク][link-doc-image-creation]に進んでください。

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

Google Cloud Platform上でフィルタリングノードを自動的にスケーリングするために、以下の手順を実行します：

1.  [マシンイメージを作成する](create-image.md)
1.  フィルタリングノードの自動スケーリングを設定する：
    1.  [フィルタリングノードインスタンステンプレートを作成する][link-doc-template-creation];
    2.  [オートスケーリングが有効な管理インスタンスグループを作成する][link-doc-managed-autoscaling-group];
1.  [入力リクエストのバランシングを設定する][link-doc-lb-guide].

!!! info "必要な権限"
    オートスケーリングを設定する前に、GCPアカウントが`Compute Admin`ロールを持っていることを確認してください。