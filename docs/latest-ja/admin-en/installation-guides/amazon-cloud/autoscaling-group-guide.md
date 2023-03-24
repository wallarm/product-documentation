[link-doc-ami-creation]:        create-image.md
[link-doc-lb-guide]:            load-balancing-guide.md

[link-ssh-keys-guide]:          ../../installation-ami-en.md#2-create-a-pair-of-ssh-keys
[link-security-group-guide]:    ../../installation-ami-en.md#3-create-a-security-group

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

#   フィルタリングノードのオートスケーリング設定

!!! info "必要な権限"
    オートスケーリングを設定する前に、Amazon AWSアカウントに以下の権限のいずれかが付与されていることを確認してください：
    
    *   `AutoScalingFullAccess`
    *   `AutoScalingConsoleFullAccess`

フィルタリングノードのオートスケーリングを設定するには、以下の手順に従ってください:
1.  [Launch Templateの作成][anchor-lt]
2.  [Auto Scaling Groupの作成][anchor-asg]

##  1.  Launch Templateの作成

Launch Templateは、Amazon Machine Image（AMI）の展開時に使用されるインスタンスタイプを定義し、一般的な仮想マシンパラメータを設定します。

Launch Templateを作成するには、以下の手順を行ってください:

1.  Amazon EC2ダッシュボードの**Launch Templates**タブに移動し、**Create launch template**ボタンをクリックします。

2.  **Launch template name**フィールドにテンプレート名を入力します。

3.  [事前に作成された][link-doc-ami-creation] Amazon Machine Imageを選択します。これを行うには、**Search for AMI**リンクをクリックし、**My AMIs**カタログから必要なイメージを選択します。

4.  **Instance type**リストから、フィルタリングノードの仮想マシンを起動するインスタンスタイプを選択します。

    !!! warning "適切なインスタンスタイプを選択してください"
        フィルタリングノードを初めて設定する際に使用したインスタンスタイプと同じもの、またはそれ以上のものを選択してください。
        
        より低性能なインスタンスタイプを使用すると、フィルタリングノードの動作に問題が発生する可能性があります。

5.  [事前に作成された][link-ssh-keys-guide] SSHキーペアの名前を**Key pair name**リストから選択します。

6.  [事前に作成された][link-security-group-guide]セキュリティグループを**Security Groups**リストから選択します。

7.  **Create launch template**ボタンをクリックします。

    ![!Launch Templateの作成][img-create-lt-wizard]
    
テンプレート作成プロセスが完了するのを待ちます。

Launch Templateを作成したら、Auto Scaling Groupの作成に進むことができます。## 2. オートスケーリンググループの作成

!!! info "オートスケーリング方式の選択"
    このセクションでは、EC2オートスケーリング方式を使用してオートスケーリンググループを作成するプロセスを説明します。

    AWSオートスケーリング方式も使用することができます。

    Amazonのオートスケーリング方式に関する詳細なFAQを参照するには、この[リンク][link-doc-as-faq]に進んでください。

オートスケーリンググループを作成するには、次の手順を実行します。

1. Amazon EC2ダッシュボードの**オートスケーリンググループ**タブに移動し、**オートスケーリンググループの作成**ボタンをクリックします。

2. **起動テンプレート**オプションを選択し、リストから[事前に作成した][anchor-lt]起動テンプレートを選択し、**次のステップ**ボタンをクリックします。

    ![!オートスケーリンググループの作成][img-create-asg-wizard]

3. **グループ名**フィールドに、必要なオートスケーリンググループ名を入力します。

4. **起動テンプレートバージョン**リストから、起動テンプレートの**最新**バージョンを選択します。

5. オートスケーリンググループに必要なインスタンスタイプを、**フリート構成**オプションの中から1つ選択します。

    起動テンプレートの作成時にこのガイドに従い、仮想マシンを起動するインスタンスタイプが指定されている場合、**起動テンプレートに従う**オプションを使用できます。

    !!! info "適切なインスタンスタイプを選択する"
        起動テンプレートでインスタンスタイプが指定されていない場合や、オートスケーリングに複数の異なるインスタンスタイプを選択したい場合は、**購入オプションとインスタンスを組み合わせる**オプションを選択できます。

        最初にフィルタリングノードを設定した時に使用したインスタンスタイプと同じ、もしくはそれ以上の性能のインスタンスタイプを選択してください。性能が低いインスタンスタイプを使用すると、フィルタリングノードの動作に問題が生じることがあります。

6. **グループサイズ**フィールドに、初期オートスケーリンググループサイズを入力します（例: 2つのインスタンス）。

7. **ネットワーク**ドロップダウンリストから、正しいVPCを選択します。

8. **サブネット**ドロップダウンリストから、正しいサブネットを選択します。

    !!! warning "フィルタリングノードにインターネット接続を提供する"
        フィルタリングノードは、正常な動作のためにWallarm APIサーバーへのアクセスが必要です。WallarmのAPIサーバーの選択は、使用しているWallarmクラウドによって異なります:
        
        * USクラウドを使用している場合、ノードには`https://us1.api.wallarm.com`へのアクセスが許可されている必要があります。
        * EUクラウドを使用している場合、ノードには`https://api.wallarm.com`へのアクセスが許可されている必要があります。

        正しいVPCとサブネットを選択し、フィルタリングノードがWallarm APIサーバーにアクセスできないようにならないように、[セキュリティグループを設定][link-security-group-guide]してください。

    ![!一般的なオートスケーリンググループの設定][img-asg-wizard-1]

9. **次のステップ: スケーリングポリシーの設定**ボタンをクリックして、**スケーリングポリシーの設定**ページに移動します。

10. **このグループの容量を調整するためにスケーリングポリシーを使用する**オプションを選択して、オートスケーリングを有効にします。

11. オートスケーリンググループの最小サイズと最大サイズを入力します。

    !!! info "オートスケーリンググループのサイズ"
        最小のオートスケーリンググループサイズは、第6ステップで指定した初期グループサイズより小さくしても構いません。

12. ステップバイステップのポリシー設定モードを有効にするには、**ステップまたはシンプルなスケーリングポリシーを使用してオートスケーリンググループをスケールする**オプションを選択します。

13. **グループサイズの増加**パラメータグループを使用して、グループサイズの増加ポリシーを設定します。

    ![!オートスケーリンググループサイズ増加ポリシー][img-asg-increase-policy]

    1.  必要に応じて、**名前**パラメータを使用して、グループサイズの増加ポリシー名を指定します。

    2.  **実行ポリシー**からイベントを選択し、グループサイズの増加をトリガするイベントを指定します。以前にイベントを作成していない場合は、**アラームの追加**ボタンをクリックしてイベントを作成します。

    3.  イベント名、監視するメトリック、イベント発生に関する通知を設定できます。

        !!! info "通知の設定に必要なロール"
            Amazon AWSアカウントには、通知設定のために**AutoScalingNotificationAccessRole**が必要です。
        
        !!! info "例"
            例えば、5分間で平均プロセッサ負荷が60%に達した場合に**CPU使用率が高い**という名前のイベントをトリガするように設定できます。
            
            ![!アラーム例][img-alarm-example]

        !!! info "Amazonのクラウドの利用可能な標準メトリクス"
            *   CPU利用率（パーセント）
            *   ディスク読み込み量（バイト）
            *   ディスク書き込み量（バイト）
            *   ディスク読み込み操作数
            *   ディスク書き込み操作数
            *   ネットワークイン（バイト）
            *   ネットワークアウト（バイト）

    4.  **アラームの作成**ボタンをクリックして、イベントを作成します。

    5.  **高CPU使用率**イベントがトリガされた場合に実行されるアクションを選択します。例えば、イベントがトリガされた場合にオートスケーリングポリシーでインスタンスを1つ追加する（**追加**アクションを使用）ように設定できます。

    6.  新しいインスタンスを追加した後にリソース消費が急激に増加した場合、早期にイベントがトリガされる可能性があります。これを回避するためには、**インスタンスのウォームアップに`X`秒が必要**パラメータを使用して、ウォームアップ期間を秒単位で設定できます。この期間中にはイベントはトリガされません。

14. 同様に、**グループサイズの減少**パラメータグループを使用して、グループサイズ減少ポリシーを設定します。

    ![!グループサイズの減少ポリシー][img-asg-decrease-policy]

15. 必要に応じて、オートスケーリンググループの通知とタグを設定するか、**確認**ボタンをクリックして変更内容をレビューします。

16. すべてのパラメータが正しく指定されていることを確認したら、**オートスケーリンググループの作成**ボタンをクリックしてオートスケーリンググループの作成プロセスを開始します。

オートスケーリンググループ作成が正常に完了すると、指定された数のインスタンスが自動的に起動されます。

オートスケーリンググループが正しく作成されたことを確認するには、グループ内で起動したインスタンス数と、Wallarm Cloudに接続されたフィルタリングノード数を比較します。

これはWallarmコンソールを使用して行うことができます。例えば、2つのインスタンスにフィルタリングノードが同時に動作している場合、Wallarmコンソールでは対応するWallarmノードの**ノード**セクションにこの数が表示されます。

![!オートスケーリンググループの状態を確認する][img-check-asg-in-cloud]

これで、[ロードバランサーの作成と設定][link-doc-lb-guide]を進めることができます。