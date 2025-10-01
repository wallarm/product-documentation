[link-doc-ami-creation]:        create-image.md
[link-doc-lb-guide]:            load-balancing-guide.md

[link-ssh-keys-guide]:          ../../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys-in-aws
[link-security-group-guide]:    ../../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group

[link-doc-as-faq]:              https://aws.amazon.com/autoscaling/faqs/

[img-create-lt-wizard]:         ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/create-launch-template.png
[img-create-asg-wizard]:        ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/create-asg-with-template.png
[img-asg-wizard-1]:             ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/asg-wizard-1.png
[img-asg-increase-policy]:      ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/group-size-increase.png
[img-asg-decrease-policy]:      ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/group-size-decrease.png
[img-alarm-example]:            ../../../images/installation-ami/auto-scaling/common/autoscaling-group-guide/alarm-example.png
[img-check-asg-in-cloud]:       ../../../images/cloud-node-status.png

[anchor-lt]:    #1-creating-a-launch-template
[anchor-asg]:   #2-creating-an-auto-scaling-group

#   フィルタリングノードの自動スケーリングの設定

!!! info "必要な権限"
    自動スケーリングを設定する前に、Amazon AWSアカウントに次のいずれかの権限が付与されていることを確認します。
    
    *   `AutoScalingFullAccess`
    *   `AutoScalingConsoleFullAccess`

フィルタリングノードの自動スケーリングを設定するには、以下の手順を実行します。
1.  [Launch Templateの作成][anchor-lt]
2.  [Auto Scaling Groupの作成][anchor-asg]

<a id="1-creating-a-launch-template"></a>
##  1.  Launch Templateの作成

Launch Templateは、Amazon Machine Image（AMI）のデプロイ時に使用するインスタンスタイプを定義し、仮想マシンの一般的なパラメーターをいくつか設定します。

次の手順でLaunch Templateを作成します。

1.  Amazon EC2ダッシュボードの**Launch Templates**タブに移動し、**Create launch template**ボタンをクリックします。

2.  **Launch template name**フィールドにテンプレート名を入力します。

3.  [事前に作成した][link-doc-ami-creation]Amazon Machine Imageを選択します。これを行うには、リンク**Search for AMI**をクリックし、**My AMIs**カタログから必要なイメージを選択します。

4.  **Instance type**リストから、フィルタリングノードの仮想マシンを起動するためのインスタンスタイプを選択します。

    !!! warning "適切なインスタンスタイプを選択してください"
        フィルタリングノードの初期設定時に使用したものと同じ、またはそれより高性能なインスタンスタイプを選択します。
        
        低性能なインスタンスタイプを使用すると、フィルタリングノードの動作に問題が生じる可能性があります。 

5.  フィルタリングノードへアクセスするための[事前に作成した][link-ssh-keys-guide]SSH鍵ペアの名前を**Key pair name**リストから選択します。

6.  [事前に作成した][link-security-group-guide]Security Groupを**Security Groups**リストから選択します。

7.  **Create launch template**ボタンをクリックします。

    ![Launch Templateの作成][img-create-lt-wizard]
    
テンプレートの作成処理が完了するまで待ちます。

Launch Templateの作成後、Auto Scaling Groupの作成に進むことができます。

<a id="2-creating-an-auto-scaling-group"></a>
##  2.  Auto Scaling Groupの作成

!!! info "自動スケーリング方式の選択"
    このセクションでは、EC2 Auto Scaling方式を使用してAuto Scaling Groupを作成する手順を説明します。 

    AWS Auto Scaling方式を使用することもできます。 

    Amazonの自動スケーリング方式に関する詳細なFAQは[こちらのリンク][link-doc-as-faq]をご覧ください。

Auto Scaling Groupを作成するには、次の手順を実行します。

1.  Amazon EC2ダッシュボードの**Auto Scaling Groups**タブに移動し、**Create Auto Scaling Group**ボタンをクリックします。

2.  **Launch Template**オプションを選択し、リストから[事前に作成した][anchor-lt]Launch Templateを選択して、**Next Step**ボタンをクリックします。 

    ![Auto Scaling Groupの作成][img-create-asg-wizard]
    
3.  **Group name**フィールドに目的のAuto Scaling Group名を入力します。

4.  **Launch Template Version**リストでLaunch Templateの**Latest**バージョンを選択します。

5.  **Fleet Composition**のいずれかのオプションを選択して、Auto Scaling Groupに必要なインスタンスタイプを指定します。

    本ガイドに従ってLaunch Templateを作成し、仮想マシンを起動するためのインスタンスタイプを指定している場合は、**Adhere to the launch template**オプションを使用できます。
    
    !!! info "適切なインスタンスタイプを選択してください"
        Launch Templateにインスタンスタイプが指定されていない場合、または自動スケーリングで複数の異なるインスタンスタイプを選択したい場合は、**Combine purchase options and instances**オプションを選択することもできます。
        
        フィルタリングノードの初期設定時に使用したものと同じ、またはそれより高性能なインスタンスタイプを選択します。低性能なインスタンスタイプを使用すると、フィルタリングノードの動作に問題が生じる可能性があります。

6.  **Group size**フィールドに初期のAuto Scaling Groupサイズを入力します（例: 2インスタンス）。

7.  ドロップダウンリスト**Network**から正しいVPCを選択します。

8.  ドロップダウンリスト**Subnets**から正しいサブネットを選択します。

    !!! warning "フィルタリングノードにインターネット接続を提供してください"
        フィルタリングノードが適切に動作するためにはWallarm APIサーバーへのアクセスが必要です。対象のWallarm APIサーバーは、使用しているWallarm Cloudによって異なります。
        
        * US Cloudを使用している場合、ノードには`https://us1.api.wallarm.com`へのアクセスを許可する必要があります。
        * EU Cloudを使用している場合、ノードには`https://api.wallarm.com`へのアクセスを許可する必要があります。

        フィルタリングノードがWallarm APIサーバーにアクセスできなくならないよう、正しいVPCとサブネットを選択し、[Security Groupを構成][link-security-group-guide]してください。

    ![Auto Scaling Groupの一般設定][img-asg-wizard-1]
    
9.  **Next: Configure scaling policies**ボタンをクリックして、**Configure scaling policies**ページに移動します。

10. 自動スケーリングを有効にするため、**Use scaling policies to adjust the capacity of this group**オプションを選択します。

11. Auto Scaling Groupの最小値と最大値を入力します。

    !!! info "Auto Scaling Groupのサイズ"
        6番目の手順で指定した初期グループサイズよりも最小グループサイズを小さく設定することができます。
    
12. **Scale the Auto Scaling group using step or simple scaling policies**オプションを選択して、段階的なポリシー設定モードを有効にします。

13. パラメーターグループ**Increase Group Size**を使用して、グループサイズの拡張ポリシーを構成します。

    ![Auto Scaling Groupの拡張ポリシー][img-asg-increase-policy]
    
    1.  必要に応じて、**Name**パラメーターで拡張ポリシーの名前を指定します。

    2.  **Execute policy when**からイベントを選択して、グループサイズ拡張のトリガーとなるイベントを指定します。イベントをまだ作成していない場合は、**Add Alarm**ボタンをクリックしてイベントを作成します。

    3.  イベント名、監視するメトリクス、イベント発生の通知を設定できます。
    
        !!! info "通知設定に必要なロール"
            通知を設定するには、Amazon AWSアカウントに**AutoScalingNotificationAccessRole**が必要です。
        
        !!! info "例"
            5分間の平均プロセッサ負荷が60%に達したときに、**High CPU utilization**という名前のイベントがトリガーされるように設定できます。
            
            ![アラームの例][img-alarm-example]
        
        
        
        !!! info "Amazonクラウドの標準メトリクス"
            *   CPU Utilization（パーセンテージ）
            *   Disk Reads（バイト）
            *   Disk Writes（バイト）
            *   Disk Read Operations count（回数）
            *   Disk Write Operations count（回数）
            *   Network In（バイト）
            *   Network Out（バイト）

    4.  **Create Alarm**ボタンをクリックしてイベントを作成します。
    
    5.  **High CPU Utilization**イベントがトリガーされた場合に実行するアクションを選択します。例えば、イベント発生時にインスタンスを1台追加するよう、**Add**アクションを用いた自動スケーリングポリシーを構成できます。
    
    6.  新しいインスタンスを追加した直後にリソース消費が急増すると、イベントが早期にトリガーされる場合があります。これを避けるため、**Instances need `X` seconds to warm up**パラメーターでウォームアップ時間（秒）を設定できます。この期間中はイベントはトリガーされません。
    
14. 同様に、パラメーターグループ**Decrease Group Size**を使用して、グループサイズの縮小ポリシーを構成します。

    ![縮小ポリシー][img-asg-decrease-policy]
    
15. 必要に応じて、Auto Scaling Groupの通知とタグを構成するか、**Review**ボタンをクリックして変更内容の確認に進みます。

16. すべてのパラメーターが正しく指定されていることを確認し、**Create Auto Scaling group**ボタンをクリックしてAuto Scaling Groupの作成処理を開始します。

指定した数のインスタンスは、Auto Scaling Groupの作成が成功すると自動的に起動します。

グループ内で起動されたインスタンス数を確認し、この数値をWallarm Cloudに接続されたフィルタリングノードの数と照合することで、Auto Scaling Groupが正しく作成されたことを確認できます。

これはWallarm Consoleを使用して実施できます。例えば、フィルタリングノードを搭載したインスタンスが2台同時に稼働している場合、Wallarm Consoleは対応するWallarmノードの**Nodes**セクションにこの数を表示します。

![Auto Scaling Groupのステータスの確認][img-check-asg-in-cloud]

[ロードバランサーの作成と構成][link-doc-lb-guide]に進むことができます。