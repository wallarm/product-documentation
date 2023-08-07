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

# AWS上のフィルタリングノードの自動スケーリング設定の概要

Wallarmフィルタリングノードの自動スケーリングを設定することで、フィルタリングノードが、もし必要な場合、トラフィックの変動を処理できるようにします。自動スケーリングを有効にすることで、トラフィックが大幅に増加した場合でも、フィルタリングノードを使用してアプリケーションへの着信リクエストを処理することができます。

Amazonのクラウドでは、以下の自動スケーリング方法が対応しています:
*   AWS Autoscaling:
    AWSによって収集されたメトリクスに基づく新しい自動スケーリング技術。
    
    AWS Auto Scalingに関する詳細な情報を見るには、この[リンク][link-doc-aws-as]へ進んでください。 

*   EC2 Autoscaling:
    スケーリングルールを定義するためのカスタム変数を作成できる伝統的な自動スケーリング技術。
    
    EC2 Auto Scalingに関する詳細な情報を見るには、この[リンク][link-doc-ec2-as]へ進んでください。 
    
!!! info "自動スケーリング方法についての情報"
    Amazonが提供する自動スケーリング方法に関する詳細なFAQを見るには、この[リンク][link-doc-as-faq]へ進んでください。 

このガイドは、EC2 Auto Scalingを使用してフィルタリングノードの自動スケーリングを設定する方法を説明しますが、必要であればAWS Auto Scalingも使用できます。

!!! warning "事前条件"
    自動スケーリングの設定には、Wallarmフィルタリングノード付きの仮想マシンイメージ（Amazon Machine Image、AMI）が必要です。
    
    フィルタリングノード付きのAMIを作成する方法について詳しくは、この[リンク][link-doc-ami-creation]をご覧ください。

!!! info "プライベートSSHキー"
    フィルタリングノードに接続するために以前に作成したプライベートSSHキー（PEM形式で保存）へのアクセスがあることを確認してください。

Amazonのクラウドでフィルタリングノードの自動スケーリングを有効にするには、次の手順を実行してください:

1.  [Amazon Machine Imageを作成する](create-image.md)
1.  [フィルタリングノードの自動スケーリングを設定する][link-doc-asg-guide]
    1.  [Launch Templateを作成する][link-doc-create-template]
    2.  [Auto Scaling Groupを作成する][link-doc-create-asg]
1.  [着信リクエストのバランシングを設定する][link-doc-lb-guide]
    1.  [ロードバランサーを作成する][link-doc-create-lb]
    2.  [作成したバランサーを使用するためのAuto Scaling Groupを設定する][link-doc-set-up-asg]