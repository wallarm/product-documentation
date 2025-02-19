[img-creating-instance-group]:          ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-group.png
[img-create-instance-group-example]:    ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-scalable-instance-group.png
[img-checking-nodes-operation]:         ../../../images/cloud-node-status.png

[link-cpu-usage-policy]:                            https://cloud.google.com/compute/docs/autoscaler/scaling-cpu-load-balancing
[link-http-load-balancing-policy]:                  https://cloud.google.com/compute/docs/autoscaler/scaling-cpu-load-balancing#scaling_based_on_https_load_balancing_serving_capacity
[link-stackdriver-monitoring-metric-policy]:        https://cloud.google.com/compute/docs/autoscaler/scaling-stackdriver-monitoring-metrics
[link-multiple-metrics-policy]:                     https://cloud.google.com/compute/docs/autoscaler/multiple-policies
[link-creating-load-balancer]:                      load-balancing-guide.md

# 管理対象インスタンスグループの作成と自動スケーリングの有効化

管理対象インスタンスグループを作成し、自動スケーリングを設定するには、次の手順に従ってください:

1.  メニューの **Compute Engine** セクションにある **Instance groups** ページに移動し、**Create instance group** ボタンをクリックします。

    ![Creating an instance group][img-creating-instance-group]

2.  **Name** フィールドにインスタンスグループの名前を入力します。

3.  **Group type** 設定で **Managed instance group** を選択します。

4.  ドロップダウンリストの **Autoscaling** から **On** オプションを選択して、インスタンスグループの自動スケーリングを有効にします。

5.  次に、**Autoscaling policy** ドロップダウンリストから必要なスケーリングポリシーを選択します。 

    スケーリングポリシーには、インスタンスグループのサイズを増減させるためのルールが含まれています。システムは、ユーザーが定義したターゲットレベルを維持するために、どのタイミングでインスタンスを追加または削除するかを判断します。
    
    以下のポリシーのいずれかを選択できます:
    
    1.  CPU Usage: グループ内の仮想マシンの平均プロセッサ負荷を所定のレベルに維持するためにグループのサイズが制御されます（[CPU使用率ポリシーのドキュメント][link-cpu-usage-policy]）。
    2.  HTTP Load Balancing Usage: グループのサイズは、HTTPトラフィックバランサーの負荷を所定のレベルに保つために制御されます（[HTTPロードバランシング使用ポリシーのドキュメント][link-http-load-balancing-policy]）。
    3.  Stackdriver Monitoring Metric: グループのサイズは、Stackdriver Monitoringの計測器から選択されたメトリックを所定のレベルに維持するために制御されます（[Stackdriver Monitoring Metricポリシーのドキュメント][link-stackdriver-monitoring-metric-policy]）。
    4.  Multiple Metrics: グループのサイズ変更の判断は複数のメトリックに基づいて行われます（[複数メトリックポリシーのドキュメント][link-multiple-metrics-policy]）。
    
    本ガイドでは、自動スケーリング機構の動作原理を示すために、**CPU Usage** ポリシーを使用します。
    
    このポリシーを適用するには、**Target CPU usage** フィールドに必要な平均プロセッサ負荷レベル（パーセンテージ）を指定します。
    
    !!! info "例"
        次の構成例は、仮想マシンの平均プロセッサ負荷が60パーセントのレベルに維持されるようにインスタンスグループのサイズを制御する方法を示しています。
        ![Example: creating an instance group][img-create-instance-group-example]

6.  **Minimum number of instances** フィールドにインスタンスグループの最小サイズを指定します（例：2インスタンス）。

7.  **Maximum number of instances** フィールドにインスタンスグループの最大サイズを指定します（例：10インスタンス）。

8.  **Cool down period** フィールドに、新しく追加されたインスタンスからメトリック値を記録しない期間（例：60秒）を指定します。新しいインスタンス追加後にリソース消費が急増する場合に必要になることがあります。 

    !!! info "クールダウン期間の要件"
        クールダウン期間は、インスタンス初期化に必要な時間より長くなければなりません。

9.  インスタンスグループのすべてのパラメーターが正しく設定されていることを確認し、**Create** ボタンをクリックします。

自動スケーリンググループが正常に作成されると、指定された数のインスタンスが自動的に起動します。

自動スケーリンググループが正しく作成されたことは、グループ内の起動済みインスタンスの数とWallarm Cloudに接続されているフィルタリングノードの数を比較することで確認できます。

Wallarm Consoleを使用して確認できます。たとえば、2つのインスタンスにフィルタリングノードが同時に動作している場合、Wallarm Consoleは**Nodes** セクションに対応するWallarmノードの数としてこの数値を表示します。

![The **Nodes** nodes tab on the Wallarm web interface][img-checking-nodes-operation]

次に、[ロードバランサーの作成と設定][link-creating-load-balancer]を進めることができます。