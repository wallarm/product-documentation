# vpc-mirrorサンプルの付録：ENIの取得

**情報** これはTerraformモジュールやモジュール例の設定ではありません。この文書は、[AWS ENI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html)を取得し、[AWS VPCによってミラーリングされたトラフィックを分析するexample Wallarmソリューション](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/vpc-mirror)を実行する詳細を提供します。

このフォルダには、以下のようなENI IDをさまざまな方法で取得する設定例が含まれています：

* `by_asg.tf`：Auto Scaling Group内のすべてのインスタンスからすべてのENIを取得するため。
* `by_eks.tf`：EKSノードグループ内のすべてのインスタンスからすべてのENIを取得するため。
* `by_elb.tf`：クラシックELBのすべてのENIを取得するため。 ALBとNLBはトラフィックミラーリングをサポートしていません。
* `by_tags.tf`：AWSタグによるすべてのENIを取得するため。 AWSはENIに自動的にタグを設定しませんが、手動で設定することができます。

**注** 手動および自動リソースの作成または破棄は、ENI IDが変更され、その結果、ミラーリングセッションが前のIDから切り離される可能性があります。たとえば、ASGのスケーリングアップまたはダウンはEC2インスタンスを破棄し、その後でEC2のENIを作成または破棄します。このTerraform例はAWS APIからENIを収集する方法を示していますが、記述されたケースでトラフィックミラーリングが続くことを保証していません。

必要なENI設定は`../interfaces.tf`ファイルで指定することができます。