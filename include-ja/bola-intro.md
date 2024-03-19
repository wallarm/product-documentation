## 概要

[Broken Object Level Authorization (BOLA)](../../attacks-vulns-list.md#broken-object-level-authorization-bola)などの行動攻撃は、同名の脆弱性を悪用します。この脆弱性により、攻撃者はAPIリクエストを介してオブジェクトにその識別子でアクセスし、認証メカニズムを迂回してそのデータを読み取ったり、変更したりすることができます。この記事では、BOLA攻撃に対してアプリケーションを保護する方法について説明します。

デフォルトでは、WallarmはBOLAタイプ（IDORとしても知られています）の脆弱性のみを自動的に発見しますが、その悪用の試みを検出しません。

!!! warning "BOLA保護の制限"
    BOLA攻撃の検出はWallarmノード4.2以上でのみサポートされています。

    Wallarmノード4.2以上では、BOLA攻撃の兆候を分析するリクエストは次のとおりです：

    * HTTPプロトコルを介して送信されるリクエスト。
    * 他の攻撃タイプの兆候を含んでいないリクエスト。例えば、リクエストはBOLA攻撃とはみなされません：

        * これらのリクエストが[入力検証攻撃](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)の兆候を含んでいる場合。
        * これらのリクエストが[ルール **正規表現ベースの攻撃指標を作成する**](../../user-guides/rules/regex-rule.md#adding-a-new-detection-rule)で指定された正規表現と一致する場合。

## 要件

BOLA攻撃からリソースを保護するために、環境が次の要件を満たしていることを確認してください：

* フィルタリングノードがプロキシサーバーまたはロードバランサーの背後に配置されている場合、[実際のクライアントのIPアドレスを表示するように設定](../using-proxy-or-balancer-en.md)します。