# 付録：VPCミラーの例のためのENI取得

**情報** これはTerraformモジュールやモジュール設定の例ではありません。この文書は[AWS ENI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html)の取得方法と、[AWS VPCによるミラーリングトラフィックを解析するWallarmの例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/vpc-mirror)について詳細を提供します。

このフォルダには、ENI IDを取得するための以下の設定例が含まれています：

* `by_asg.tf`：オートスケーリンググループ内の全インスタンスから全ENIを取得します。
* `by_eks.tf`：EKSノードグループ内の全インスタンスから全ENIを取得します。
* `by_elb.tf`：クラシックELB向けに全ENIを取得します。ALBやNLBはトラフィックミラーリングをサポートしていません。
* `by_tags.tf`：AWSタグを使用して全ENIを取得します。AWSはENIに自動的にタグを設定しませんが、手動で設定可能です。

**注記** リソースの手動および自動作成や破棄は、ENI IDが変わる可能性があり、その結果、ミラーリングセッションが前のIDから切り離される可能性があります。例えば、ASGをスケーリングアップまたはダウンすると、EC2インスタンスが破棄され、その後にEC2のENIが作成または破棄されます。このTerraformの例は、AWS APIからENIを集める方法を示していますが、述べた場合にトラフィックミラーリングが続くことを保証しません。

`../interfaces.tf`ファイルで必要なENI設定を指定することができます。