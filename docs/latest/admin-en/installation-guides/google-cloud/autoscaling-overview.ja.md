[link-doc-image-creation]:               create-image.md
[link-doc-template-creation]:            creating-instance-template.md
[link-doc-managed-autoscaling-group]:    creating-autoscaling-group.md
[link-doc-lb-guide]:                     load-balancing-guide.md

# Google Cloud Platform でのフィルタリングノードのオートスケーリング設定：概要

Google Cloud Platform（GCP）で Wallarm フィルタリングノードのオートスケーリングを設定することで、フィルタリングノードがトラフィックの変動（ある場合）に対処できるようにすることができます。オートスケーリングを有効にすると、フィルタリングノードを使用してアプリケーションへの着信要求を処理できるようになります。

!!! warning "前提条件"
    オートスケーリングを設定するには、Wallarm フィルタリングノードを備えた仮想マシンのイメージが必要です。

    GCP 上で Wallarm フィルタリングノードを備えた仮想マシンのイメージを作成する詳細については、この[リンク][link-doc-image-creation]に進んでください。

--8<-- "../include/gcp-autoscaling-connect-ssh.ja.md"

Google Cloud Platform でフィルタリングノードをオートスケールするには、次の手順を実行します：
1.  フィルタリングノードのオートスケーリングを設定する:
    1.  [フィルタリングノードインスタンステンプレートを作成する][link-doc-template-creation];
    2.  [オートスケーリングが有効になっているマネージドインスタンスグループを作成する][link-doc-managed-autoscaling-group];
2.  [着信要求のバランシングを設定する][link-doc-lb-guide]。

!!! info "必要な権限"
    オートスケーリングを設定する前に、GCP アカウントに `Compute Admin` ロールがあることを確認してください。