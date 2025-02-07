# AWSにおけるフィルタリングノードオートスケーリング設定の概要

Wallarmのフィルタリングノードオートスケーリングを設定することで、フィルタリングノードがトラフィックの変動に対応できるようにできます。オートスケーリングを有効にすると、トラフィックが大幅に増加した場合でも、フィルタリングノードを使用してアプリケーションへの着信リクエストを処理できるようになります。

Amazonクラウドでは、以下のオートスケーリング手法がサポートされています:
*   AWS Auto Scaling:
    AWSで収集されたメトリクスに基づく最新のオートスケーリング技術です。
    
    AWS Auto Scalingの詳細情報については、次の[リンク][link-doc-aws-as]をご覧ください。 

*   EC2 Auto Scaling:
    独自の変数を作成してスケーリングルールを定義できる、従来のオートスケーリング技術です。
    
    EC2 Auto Scalingの詳細情報については、次の[リンク][link-doc-ec2-as]をご覧ください。 
    
!!! info "オートスケーリング手法に関する情報"
    Amazonが提供するオートスケーリング手法に関する詳細なFAQについては、次の[リンク][link-doc-as-faq]をご覧ください。 

本ガイドでは、EC2 Auto Scalingを使用したフィルタリングノードのオートスケーリング設定方法について解説しますが、必要に応じてAWS Auto Scalingも利用できます。

!!! warning "前提条件"
    オートスケーリングを設定するには、Wallarmのフィルタリングノードが搭載された仮想マシンイメージ（Amazon Machine Image、AMI）が必要です。
    
    フィルタリングノードを搭載したAMIの作成に関する詳細情報については、次の[リンク][link-doc-ami-creation]をご覧ください。

!!! info "秘密SSH鍵"
    フィルタリングノードに接続するために以前作成したPEM形式で保存されている秘密SSH鍵にアクセスできることを確認してください。

Amazonクラウドでフィルタリングノードのオートスケーリングを有効にするには、以下の手順を実行してください:

1.  [Amazon Machine Imageの作成](create-image.md)
1.  [フィルタリングノードのオートスケーリング設定][link-doc-asg-guide]
    1.  [Launch Templateの作成][link-doc-create-template]
    2.  [Auto Scaling Groupの作成][link-doc-create-asg]
1.  [着信リクエストの負荷分散設定][link-doc-lb-guide]
    1.  [ロードバランサの作成][link-doc-create-lb]
    2.  [作成したロードバランサを使用するためのAuto Scaling Groupの設定][link-doc-set-up-asg]