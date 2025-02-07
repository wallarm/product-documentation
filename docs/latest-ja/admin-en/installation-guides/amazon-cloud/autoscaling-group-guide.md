```markdown
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

# フィルタリングノードのオートスケーリング設定

!!! info "必要な権限"
    オートスケーリングの設定を行う前に、Amazon AWSアカウントに以下のいずれかの権限が付与されていることを確認してください:
    
    *   `AutoScalingFullAccess`
    *   `AutoScalingConsoleFullAccess`

フィルタリングノードのオートスケーリングを設定するには、次の手順に従ってください:
1.  [Launch Templateの作成][anchor-lt]
2.  [Auto Scaling Groupの作成][anchor-asg]

## 1. Launch Templateの作成

Launch Templateは、Amazon Machine Image (AMI)の展開時に使用するインスタンスタイプを定義し、一般的な仮想マシンのパラメータを設定します。

以下の手順に従ってLaunch Templateを作成してください:

1.  Amazon EC2ダッシュボードの**Launch Templates**タブに移動し、**Create launch template**ボタンをクリックします。

2.  **Launch template name**フィールドにテンプレート名を入力します。

3.  [以前に作成した][link-doc-ami-creation]Amazon Machine Imageを選択します。これには、**Search for AMI**リンクをクリックし、**My AMIs**カタログから必要なイメージを選択します。

4.  **Instance type**リストから、フィルタリングノード仮想マシンを起動するためのインスタンスタイプを選択します。

    !!! warning "適切なインスタンスタイプを選択してください"
        フィルタリングノードの初期設定時に使用したもの、またはそれ以上の性能を持つ同じインスタンスタイプを選択してください。
        
        より低性能なインスタンスタイプを使用すると、フィルタリングノードの動作に問題が生じる可能性があります。 

5.  **Key pair name**リストから、フィルタリングノードにアクセスするために[以前に作成した][link-ssh-keys-guide]SSHキーのペアの名前を選択します。

6.  **Security Groups**リストから、[以前に作成した][link-security-group-guide]Security Groupを選択します。

7.  **Create launch template**ボタンをクリックします。

    ![Launch Templateの作成][img-create-lt-wizard]
    
テンプレート作成プロセスが完了するまでお待ちください。

Launch Templateの作成後、Auto Scaling Groupの作成を進めることができます。

## 2. Auto Scaling Groupの作成

!!! info "オートスケーリング方式の選択"
    このセクションでは、EC2 Auto Scaling方式を使用してAuto Scaling Groupを作成する手順について説明します。 

    AWS Auto Scaling方式を使用することも可能です。 

    Amazonのオートスケーリング方式に関する詳細なFAQを参照するには、この[リンク][link-doc-as-faq]に進んでください。

Auto Scaling Groupを作成するには、以下の手順に従ってください:

1.  Amazon EC2ダッシュボードの**Auto Scaling Groups**タブに移動し、**Create Auto Scaling Group**ボタンをクリックします。

2.  **Launch Template**オプションを選択し、リストから[以前に作成した][anchor-lt]Launch Templateを選択して、**Next Step**ボタンをクリックします。 

    ![Auto Scaling Groupの作成][img-create-asg-wizard]
    
3.  **Group name**フィールドに希望のAuto Scaling Group名を入力します。

4.  **Launch Template Version**リストから、**Latest**バージョンのLaunch Templateを選択します。

5.  **Fleet Composition**オプションのいずれかを選択して、Auto Scaling Groupに必要なインスタンスタイプを選択します。

    このガイドに従ってLaunch Templateを作成し、仮想マシンを起動するためのインスタンスタイプが指定されている場合は、**Adhere to the launch template**オプションを使用できます。
    
    !!! info "適切なインスタンスタイプを選択してください"
        Launch Templateにインスタンスタイプが指定されていない場合や、オートスケーリング用に複数の異なるインスタンスタイプを選択したい場合は、**Combine purchase options and instances**オプションを選択することも可能です。
        
        フィルタリングノードの初期設定時に使用したもの、またはそれ以上の性能を持つ同じインスタンスタイプを選択してください。低性能なインスタンスタイプを使用すると、フィルタリングノードの動作に問題が生じる可能性があります。

6.  **Group size**フィールドに初期のAuto Scaling Groupサイズを入力します（例：2インスタンス）。

7.  **Network**ドロップダウンリストから正しいVPCを選択します。

8.  **Subnets**ドロップダウンリストから正しいサブネットを選択します。

    !!! warning "フィルタリングノードにインターネット接続を提供してください"
        フィルタリングノードは、適切な動作のためにWallarm APIサーバへのアクセスが必要です。Wallarm APIサーバの選択は、利用しているWallarm Cloudによって異なります:
        
        * US Cloudを使用している場合、ノードは`https://us1.api.wallarm.com`へのアクセス権が付与されている必要があります。
        * EU Cloudを使用している場合、ノードは`https://api.wallarm.com`へのアクセス権が付与されている必要があります。

        正しいVPCおよびサブネットを選択し、フィルタリングノードがWallarm APIサーバへアクセスできるように[Security Groupを設定][link-security-group-guide]するようにしてください。

    ![Auto Scaling Groupの一般設定][img-asg-wizard-1]
    
9.  **Next: Configure scaling policies**ボタンをクリックして、**Configure scaling policies**ページに移動します。

10. **Use scaling policies to adjust the capacity of this group**オプションを選択して、オートスケーリングを有効にします。

11. 最小および最大のAuto Scaling Groupサイズを入力します。

    !!! info "Auto Scaling Groupサイズについて"
        最小のAuto Scaling Groupサイズは、6番目のステップで指定した初期グループサイズより小さくても構いません。
    
12. **Scale the Auto Scaling group using step or simple scaling policies**オプションを選択して、段階的ポリシー構成モードを有効にします。

13. **Increase Group Size**パラメーターグループを使用して、グループサイズの増加ポリシーを構成します。

    ![グループサイズ増加ポリシー][img-asg-increase-policy]
    
    1.  必要に応じて、**Name**パラメーターを使用してグループサイズ増加ポリシーの名前を指定します。

    2.  **Execute policy when**から、グループサイズの増加をトリガーするイベントを選択します。以前にイベントを作成していない場合は、**Add Alarm**ボタンをクリックしてイベントを作成してください。

    3.  イベント名、監視するメトリック、およびイベント発生に関する通知を設定できます。
    
        !!! info "通知設定に必要なロール"
            通知設定には、Amazon AWSアカウントに**AutoScalingNotificationAccessRole**が必要です。
        
        !!! info "例"
            5分以内に平均CPU使用率が60%に達すると、**High CPU utilization**という名前のイベントがトリガーされるように設定できます:
            
            ![アラームの例][img-alarm-example]
        
        !!! info "Amazonクラウドの標準メトリック"
            *   CPU Utilization（パーセンテージ）
            *   Disk Reads（バイト単位）
            *   Disk Writes（バイト単位）
            *   ディスク読み取り操作数
            *   ディスク書き込み操作数
            *   Network In（バイト単位）
            *   Network Out（バイト単位）

    4.  **Create Alarm**ボタンをクリックしてイベントを作成します。
    
    5.  **High CPU Utilization**イベントがトリガーされた場合に実行するアクションを選択します。例えば、イベントがトリガーされた際に1インスタンスを追加する（**Add**アクションを使用する）オートスケーリングポリシーを構成できます。
    
    6.  新しいインスタンスの追加後にリソース消費の急増が発生すると、イベントが早期にトリガーされる可能性があります。これを避けるため、**Instances need `X` seconds to warm up**パラメーターを使用して、ウォームアップ期間（秒単位）を設定できます。この期間中は、イベントはトリガーされません。
    
14. 同様に、**Decrease Group Size**パラメーターグループを使用して、グループサイズ減少ポリシーを構成します。

    ![グループサイズ減少ポリシー][img-asg-decrease-policy]
    
15. 必要に応じて、Auto Scaling Groupの通知およびタグを構成するか、**Review**ボタンをクリックして変更内容の確認に進みます。

16. 全てのパラメーターが正しく指定されていることを確認し、**Create Auto Scaling group**ボタンをクリックしてAuto Scaling Group作成プロセスを開始します。

Auto Scaling Groupの作成が成功すると、指定された数のインスタンスが自動的に起動されます。

グループ内で起動されたインスタンス数を確認し、その数をWallarm Cloudに接続されているフィルタリングノードの数と比較することで、Auto Scaling Groupが正しく作成されたかどうかを確認できます。

この確認は、Wallarm Consoleを使用して行えます。例えば、フィルタリングノードを持つ2インスタンスが同時に稼働している場合、Wallarm Consoleの**Nodes**セクションには該当するWallarmノードの数としてこの数字が表示されます。

![Auto Scaling Groupのステータス確認][img-check-asg-in-cloud]

これで、[ロードバランサーの作成と設定][link-doc-lb-guide]へ進むことができます。
```