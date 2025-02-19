## 概要

[Broken Object Level Authorization (BOLA)](../../attacks-vulns-list.md#broken-object-level-authorization-bola)などの挙動型攻撃は、同名の脆弱性を悪用します。この脆弱性により、攻撃者はAPIリクエストで識別子を用いてオブジェクトにアクセスし、認可メカニズムを回避してそのデータを読み取るまたは変更することが可能になります。本記事では、BOLA攻撃からアプリケーションを保護する方法について説明します。

デフォルトでは、WallarmはBOLA型（IDORとも呼ばれる）の脆弱性のみを自動検出しますが、実際の悪用試行は検出しません。

!!! warning "BOLA保護の制限"
    Wallarm node 4.2以上のみがBOLA攻撃検出に対応しています。

    Wallarm node 4.2以上はBOLA攻撃の兆候がある以下のリクエストのみを分析します：

    * HTTPプロトコルを使用して送信されたリクエスト。
    * 他の攻撃タイプの兆候を含まないリクエスト。例えば、以下の場合、これらのリクエストはBOLA攻撃とはみなされません：

        * これらのリクエストに[入力検証攻撃](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)の兆候が含まれる場合。
        * これらのリクエストが[ルール **Create regexp-based attack indicator**](../../user-guides/rules/regex-rule.md#creating-and-applying-rule)で指定された正規表現に一致する場合。

## 要件

BOLA攻撃からリソースを保護するために、環境が以下の要件を満たしているかを確認してください：

* フィルタリングノードがプロキシサーバまたはロードバランサの背後に配置されている場合は、[実際のクライアントのIPアドレスを表示するように設定](../using-proxy-or-balancer-en.md)してください。