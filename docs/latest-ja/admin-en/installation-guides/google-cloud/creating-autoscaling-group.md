[img-creating-instance-group]:          ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-group.png
[img-create-instance-group-example]:    ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-scalable-instance-group.png
[img-checking-nodes-operation]:         ../../../images/cloud-node-status.png

[link-cpu-usage-policy]:                            https://cloud.google.com/compute/docs/autoscaler/scaling-cpu-load-balancing
[link-http-load-balancing-policy]:                  https://cloud.google.com/compute/docs/autoscaler/scaling-cpu-load-balancing#scaling_based_on_https_load_balancing_serving_capacity
[link-stackdriver-monitoring-metric-policy]:        https://cloud.google.com/compute/docs/autoscaler/scaling-stackdriver-monitoring-metrics
[link-multiple-metrics-policy]:                     https://cloud.google.com/compute/docs/autoscaler/multiple-policies
[link-creating-load-balancer]:                      load-balancing-guide.md

#  オートスケーリングが有効な管理インスタンスグループを作成する

管理インスタンスグループを作成し、そのオートスケーリングを設定するには、次の手順を実行します：

1.  メニューの**Compute Engine**セクションにある**Instance groups**ページに移動し、**Create instance group**ボタンをクリックします。

    ![インスタンスグループを作成する][img-creating-instance-group]

2.  **名前**フィールドにインスタンスグループ名を記入します。

3.  **グループタイプ**設定で**管理インスタンスグループ**を選択します。

4.  **Autoscaling**ドロップダウンリストから**On**オプションを選び、インスタンスグループのオートスケーリングを有効にします。

5.  **Autoscaling ポリシー**ドロップダウンリストから必要なスケーリングポリシーを選択します。

    スケーリングポリシーには、インスタンスグループのサイズを増減するためのルールが含まれています。システムは、ポリシーに基づくメトリックをユーザーが定義したターゲットレベルに保つために、グループからインスタンスを追加または削除するタイミングを決定します。

    次のポリシーのいずれかを選択できます：

    1.  CPU使用率：グループ内の仮想マシンの平均プロセッサ負荷を必要なレベルに保つために、グループのサイズを制御します（[CPU使用率ポリシーのドキュメンテーション][link-cpu-usage-policy]）。
    2.  HTTPロードバランシングの使用率：HTTPトラフィックバランサの負荷を必要なレベルに保つために、グループのサイズを制御します（[HTTPロードバランシング使用率ポリシーのドキュメンテーション][link-http-load-balancing-policy]）。
    3.  Stackdriver Monitoring Metric：Stackdriver Monitoringツールから選択したメトリックを必要なレベルに保つために、グループのサイズを制御します（[Stackdriver Monitoring Metricポリシーのドキュメンテーション][link-stackdriver-monitoring-metric-policy]）。
    4.  複数のメトリクス：グループのサイズを変更する決定は、複数のメトリクスに基づいて行われます（[複数のメトリクスポリシーのドキュメンテーション][link-multiple-metrics-policy]）。

    このガイドでは、オートスケーリングメカニズムの操作原理を説明するために、**CPU使用率**ポリシーを使用します。

    このポリシーを適用するには、**Target CPU usage**フィールドに必要な平均プロセッサの負荷レベルを指定します（パーセンテージで）。

    !!! info "例"
        以下の設定は、仮想マシンのプロセッサの平均負荷を60パーセントのレベルに保つためのインスタンスグループのサイズ制御を記述しています。
        ![例：インスタンスグループを作成する][img-create-instance-group-example]

6.  **Minimum number of instances**フィールドに最小インスタンスグループのサイズを指定します（例：2インスタンス）。

7.  **Maximum number of instances**フィールドに最大インスタンスグループサイズを指定します（例：10インスタンス）。

8.  **Cool down period**フィールドに、新しく追加されたインスタンスからメトリック値を記録しない期間を指定します（例：60秒）。新しいインスタンスの追加後にリソース消費が急増する場合は、この設定が必要になるかもしれません。

    !!! info "Cooldown periodの要件"
        Cooldown期間は、インスタンス初期化に必要な時間よりも長くなければなりません。

9.  インスタンスグループのすべてのパラメータが正しく設定されていることを確認し、その後**Create**ボタンをクリックします。

オートスケーリンググループの作成が成功すると、指定した数のインスタンスが自動的に起動します。

オートスケーリンググループが正しく作成されたことは、グループ内で起動したインスタンスの数と、Wallarm Cloudに接続されたフィルタリングノードの数を比較することで確認できます。

Wallarmコンソールを使用してこれを行うことができます。例えば、2つのインスタンスでフィルタリングノードが同時に稼働している場合、Wallarmコンソールは対応するWallarmノードの**Nodes**セクションでこの数を表示します。

![Wallarmウェブインターフェース上の**Nodes**ノードタブ][img-checking-nodes-operation]

これで、[ロードバランサーの作成と設定][link-creating-load-balancer]に進むことができます。