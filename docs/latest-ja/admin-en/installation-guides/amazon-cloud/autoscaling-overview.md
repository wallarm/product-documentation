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


# AWSにおけるフィルタリングノードのオートスケーリング設定の概要

Wallarmフィルタリングノードのオートスケーリングを設定すると、トラフィックの変動がある場合でもフィルタリングノードが対応できるようにできます。オートスケーリングを有効にすると、トラフィックが大幅に急増しても、フィルタリングノードでアプリケーションへの受信リクエストを処理できます。

Amazonクラウドは次のオートスケーリング方式をサポートします:
*   AWS Autoscaling:
    AWSが収集するメトリクスに基づく新しいオートスケーリング技術です。
    
    AWS Auto Scalingの詳細情報はこの[リンク][link-doc-aws-as]をご覧ください。 

*   EC2 Autoscaling:
    スケーリングルールを定義するためのカスタム変数を作成できるレガシーなオートスケーリング技術です。
    
    EC2 Auto Scalingの詳細情報はこの[リンク][link-doc-ec2-as]をご覧ください。 
    
!!! info "オートスケーリング方式に関する情報"
    Amazonが提供するオートスケーリング方式に関する詳細なFAQはこの[リンク][link-doc-as-faq]をご覧ください。 

本ガイドではEC2 Auto Scalingを使用してフィルタリングノードのオートスケーリングを構成する方法を説明しますが、必要に応じてAWS Auto Scalingも使用できます。

!!! warning "前提条件"
    オートスケーリングを設定するには、Wallarmフィルタリングノードを含む仮想マシンイメージ（Amazon Machine Image、AMI）が必要です。
    
    フィルタリングノード入りのAMIの作成方法の詳細はこの[リンク][link-doc-ami-creation]をご覧ください。

!!! info "SSH秘密鍵"
    フィルタリングノードに接続するために以前作成したSSH秘密鍵（PEM形式で保存）にアクセスできることを確認してください。

Amazonクラウドでフィルタリングノードのオートスケーリングを有効にするには、次の手順を実行します:

1.  [Amazon Machine Imageを作成](create-image.md)
1.  [フィルタリングノードのオートスケーリングを設定][link-doc-asg-guide]
    1.  [Launch Templateを作成][link-doc-create-template]
    2.  [Auto Scaling Groupを作成][link-doc-create-asg]
1.  [受信リクエストの負荷分散を設定][link-doc-lb-guide]
    1.  [ロードバランサーを作成][link-doc-create-lb]
    2.  [作成したロードバランサーを使用するようにAuto Scaling Groupを設定][link-doc-set-up-asg]