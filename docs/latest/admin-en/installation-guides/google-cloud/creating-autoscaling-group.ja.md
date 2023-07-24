[img-creating-instance-group]: ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-instance-group.png
[img-create-instance-group-example]: ../../../images/installation-gcp/auto-scaling/common/autoscaling-group-guide/create-scalable-instance-group.png
[img-checking-nodes-operation]: ../../../images/cloud-node-status.png

[link-cpu-usage-policy]: https://cloud.google.com/compute/docs/autoscaler/scaling-cpu-load-balancing
[link-http-load-balancing-policy]: https://cloud.google.com/compute/docs/autoscaler/scaling-cpu-load-balancing#scaling_based_on_https_load_balancing_serving_capacity
[link-stackdriver-monitoring-metric-policy]: https://cloud.google.com/compute/docs/autoscaler/scaling-stackdriver-monitoring-metrics
[link-multiple-metrics-policy]: https://cloud.google.com/compute/docs/autoscaler/multiple-policies
[link-creating-load-balancer]: load-balancing-guide.md

# オートスケーリングが有効な管理インスタンスグループの作成

管理インスタンスグループを作成し、オートスケーリングを設定するには、次の手順を実行します。

1. メニューの**Compute Engine**セクションにある**インスタンスグループ**ページに移動し、**インスタンスグループの作成**ボタンをクリックします。

   ![!インスタンスグループの作成][img-creating-instance-group]

2. **名前**フィールドにインスタンスグループの名前を入力します。

3. **グループタイプ**設定で**管理インスタンスグループ**を選択します。

4. **オートスケーリング**ドロップダウンリストから**オン**オプションを選択して、インスタンスグループのオートスケーリングを有効にします。

5. **オートスケーリングポリシー**ドロップダウンリストから必要なスケーリングポリシーを選択します。

   スケーリングポリシーには、インスタンスグループのサイズを増やすためのルールと減らすためのルールが含まれます。システムは、ポリシーに基づいてメトリックをユーザーが定義したターゲットレベルに保つために、グループにインスタンスを追加または削除するタイミングを判断します。

   次のポリシーのいずれかを選択できます。

   1. CPU使用率：グループのサイズは、グループ内の仮想マシンの平均プロセッサ負荷を必要なレベルに保つように制御されます（[CPU使用率ポリシードキュメント][link-cpu-usage-policy]）。
   2. HTTPロードバランシング使用率  ：グループのサイズは、HTTPトラフィックバランサの負荷を必要なレベルに保つように制御されます（[HTTPロードバランシング使用率ポリシードキュメント][link-http-load-balancing-policy]）。
   3. Stackdriverモニタリングメトリック ：グループのサイズは、Stackdriverモニタリングの選択したメトリックを必要なレベルに保つように制御されます（[Stackdriverモニタリングメトリックポリシードキュメント][link-stackdriver-monitoring-metric-policy]）。
   4. 複数のメトリック：複数のメトリックに基づいてグループのサイズを変更する決定が行われます（[複数のメトリックポリシードキュメント][link-multiple-metrics-policy]）。

   このガイドでは、オートスケーリングメカニズムでの動作原則を示すために、**CPU使用率**ポリシーを使用しています。

   このポリシーを適用するには、**目標CPU使用率**フィールドに必要な平均プロセッサ負荷レベルを指定します（パーセンテージ）。

   !!! info "例"
       次の構成は、仮想マシンのプロセッサの平均負荷レベルを60パーセントに保つインスタンスグループサイズの制御を説明しています。
       ![!例：インスタンスグループの作成][img-create-instance-group-example]

6. **最小インスタンス数**フィールドに最小インスタンスグループサイズを指定します（例：2つのインスタンス）。

7. **最大インスタンス数**フィールドに最大インスタンスグループサイズを指定します（例：10個のインスタンス）。

8. **クールダウン期間**フィールドに、新しく追加されたインスタンスからのメトリック値が記録されない期間を指定します（例：60秒）。新しいインスタンスが追加された後にリソース消費量の大幅な増加が見られる場合があります。

   !!! info "クールダウン期間の要件"
       クールダウン期間は、インスタンスの初期化に必要な時間よりも長くなければなりません。

9. インスタンスグループのすべてのパラメータが正しく設定されていることを確認し、**作成**ボタンをクリックします。

オートスケーリンググループの作成が成功すると、指定された数のインスタンスが自動的に起動します。

オートスケーリンググループが正しく作成されたかどうかは、グループ内の起動したインスタンスの数と、Wallarm Cloudに接続されたフィルタリングノードの数を比較して確認できます。

これはWallarmコンソールを使用して行います。たとえば、2つのインスタンスのフィルタリングノードが同時に動作している場合、Wallarmコンソールでは対応するWallarmノードの**ノード**セクションにこの数が表示されます。

![!Wallarmウェブインターフェースの**ノード *ノードタブ][img-checking-nodes-operation]

次に、[ロードバランサーの作成と構成][link-creating-load-balancer]に進んでください。