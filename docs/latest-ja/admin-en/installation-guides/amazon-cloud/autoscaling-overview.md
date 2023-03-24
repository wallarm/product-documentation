[link-doc-aws-as]:          https://docs.aws.amazon.com/autoscaling/plans/userguide/what-is-aws-auto-scaling.html
[link-doc-ec2-as]:          https://docs.aws.amazon.com/autoscaling/ec2/userguide/GettingStartedTutorial.html
[link-doc-as-faq]:          https://aws.amazon.com/autoscaling/faqs/

[link-doc-ami-creation]:    create-image.md
[link-doc-asg-guide]:       autoscaling-group-guide.md
[link-doc-lb-guide]:        load-balancing-guide.md
[link-doc-create-template]: autoscaling-group-guide.md#1-creating-a-launch-template
[link-doc-create-asg]:      autoscaling-group-guide.md#2-creating-an-auto-scaling-group
[link-doc-create-lb]:       load-balancing-guide.md#1-creating-a-load-balancer
[link-doc-set-up-asg]:      load-balancing-guide.md#2-setting-up-an-auto-scaling-group-for-using-the-created-balancer

# AWSでのフィルタリングノード自動スケーリングの概要

Wallarmフィルタリングノードの自動スケーリングを設定することで、フィルタリングノードがトラフィックの変動に対応できるようになります。自動スケーリングを有効にすることで、トラフィックが大幅に増加した場合でも、フィルタリングノードを使用してアプリケーションへの着信リクエストを処理できます。

Amazonクラウドは、以下の自動スケーリング方法をサポートしています：
*   AWSオートスケーリング：
    AWSが収集するメトリックスに基づく新しいオートスケーリング技術。

    AWS Auto Scalingの詳細情報については、この[リンク][link-doc-aws-as]に進んでください。

*   EC2オートスケーリング：
    スケーリングルールを定義するためのカスタム変数を作成できる、従来のオートスケーリング技術。

    EC2 Auto Scalingの詳細情報については、この[リンク][link-doc-ec2-as]に進んでください。

!!! info "自動スケーリング方法に関する情報"
    Amazonが提供する自動スケーリング方法に関するFAQの詳細については、この[リンク][link-doc-as-faq]に進んでください。

このガイドでは、EC2 Auto Scalingを使用したフィルタリングノードの自動スケーリングの設定方法について説明しますが、必要に応じてAWS Auto Scalingを使用することもできます。

!!! warning "前提条件"
    オートスケーリングを設定するには、Wallarmフィルタリングノードが含まれた仮想マシンイメージ（Amazon Machine Image、AMI）が必要です。

    フィルタリングノードが含まれたAMIを作成する方法の詳細については、この[リンク][link-doc-ami-creation]を参照してください。

!!! info "プライベートSSHキー"
    事前に作成したフィルタリングノードに接続するためのプライベートSSHキー（PEM形式で保存）にアクセスできることを確認してください。

Amazonクラウドでフィルタリングノードの自動スケーリングを有効にするには、以下の手順を実行してください：
1.  [フィルタリングノードの自動スケーリングを設定する][link-doc-asg-guide]
    1.  [ランチテンプレートを作成する][link-doc-create-template]
    2.  [オートスケーリンググループを作成する][link-doc-create-asg]
2.  [着信リクエストのバランシングを設定する][link-doc-lb-guide]
    1.  [ロードバランサーを作成する][link-doc-create-lb]
    2.  [作成したバランサーを使用するためのオートスケーリンググループを設定する][link-doc-set-up-asg]