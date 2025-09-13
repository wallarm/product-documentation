[img-creating-instance-group]:          ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-group.png
[img-create-instance-group-example]:    ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-scalable-instance-group.png
[img-checking-nodes-operation]:         ../../../images/cloud-node-status.png

[link-cpu-usage-policy]:                            https://cloud.google.com/compute/docs/autoscaler/scaling-cpu-load-balancing
[link-http-load-balancing-policy]:                  https://cloud.google.com/compute/docs/autoscaler/scaling-cpu-load-balancing#scaling_based_on_https_load_balancing_serving_capacity
[link-stackdriver-monitoring-metric-policy]:        https://cloud.google.com/compute/docs/autoscaler/scaling-stackdriver-monitoring-metrics
[link-multiple-metrics-policy]:                     https://cloud.google.com/compute/docs/autoscaler/multiple-policies
[link-creating-load-balancer]:                      load-balancing-guide.md

# オートスケーリングを有効にしたマネージドインスタンスグループの作成

マネージドインスタンスグループを作成し、そのオートスケーリングを構成するには、次の手順を実行します。

1.  メニューの**Compute Engine**セクションにある**Instance groups**ページに移動し、**Create instance group**ボタンをクリックします。

    ![インスタンスグループの作成][img-creating-instance-group]

2.  **Name**フィールドにインスタンスグループ名を入力します。

3.  **Group type**設定で**Managed instance group**を選択します。

4.  **Autoscaling**ドロップダウンリストから**On**オプションを選択して、インスタンスグループのオートスケーリングを有効にします。

5.  **Autoscaling policy**ドロップダウンリストから必要なスケーリングポリシーを選択します。 
    
    スケーリングポリシーには、インスタンスグループの規模を拡大・縮小するためのルールが含まれます。ポリシーの基礎となるメトリックをユーザーが定義した目標値に維持するために、いつグループにインスタンスを追加または削除すべきかをシステムが判断します。
    
    次のいずれかのポリシーを選択できます:
    
    1.  CPU Usage: グループ内の仮想マシンの平均CPU使用率が所定のレベルになるように、グループの規模を制御します（[CPU Usageポリシーのドキュメント][link-cpu-usage-policy]）。
    2.  HTTP Load Balancing Usage: HTTPロードバランサの負荷が所定のレベルになるように、グループの規模を制御します（[HTTP Load Balancing Usageポリシーのドキュメント][link-http-load-balancing-policy]）。
    3.  Stackdriver Monitoring Metric: Stackdriver Monitoringで選択したメトリクスが所定のレベルになるように、グループの規模を制御します（[Stackdriver Monitoring Metricポリシーのドキュメント][link-stackdriver-monitoring-metric-policy]）。
    4.  Multiple Metrics: 複数のメトリクスに基づいて、グループの規模を変更するかどうかを判断します（[Multiple Metricsポリシーのドキュメント][link-multiple-metrics-policy]）。 
    
    このガイドでは、オートスケーリングの仕組みを説明するために**CPU usage**ポリシーを使用します。
    
    このポリシーを適用するには、**Target CPU usage**フィールドに必要な平均CPU使用率（パーセンテージ）を指定します。
    
    !!! info "例"
        次の設定は、仮想マシンの平均CPU使用率を60%に維持するようインスタンスグループの規模を制御する例です。
        ![例: インスタンスグループの作成][img-create-instance-group-example]

6.  **Minimum number of instances**フィールドに最小のインスタンスグループ規模を指定します（例: 2台）。

7.  **Maximum number of instances**フィールドに最大のインスタンスグループ規模を指定します（例: 10台）。

8.  **Cool down period**フィールドに、新しく追加されたインスタンスからのメトリクス値を記録しない期間を指定します（例: 60秒）。新しいインスタンスを追加した直後にリソース消費が急増する場合に必要になることがあります。 

    !!! info "クールダウン期間の要件"
        クールダウン期間は、インスタンスの初期化に必要な時間より長くする必要があります。

9.  インスタンスグループのすべてのパラメータが正しく構成されていることを確認し、**Create**ボタンをクリックします。

オートスケーリンググループが正常に作成されると、指定した数のインスタンスが自動的に起動します。

グループで起動中のインスタンス数を確認し、それをWallarm Cloudに接続されたフィルタリングノードの数と比較することで、オートスケーリンググループが正しく作成されたことを確認できます。

これはWallarm Consoleで確認できます。例えば、フィルタリングノードを搭載したインスタンスが2台同時に稼働している場合、Wallarm Consoleの**Nodes**セクションで、該当するWallarm nodeに対してこの数が表示されます。

![WallarmのWebインターフェイスの**Nodes**タブ][img-checking-nodes-operation]

次に、[ロードバランサの作成と構成][link-creating-load-balancer]に進むことができます。