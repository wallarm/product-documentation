## 概要

[オブジェクトレベル認可の不備（BOLA）](../../attacks-vulns-list.md#broken-object-level-authorization-bola)のような振る舞いに基づく攻撃は、同名の脆弱性を悪用します。この脆弱性により、攻撃者はAPIリクエストで識別子を用いてオブジェクトにアクセスし、認可メカニズムを回避してそのデータを読み取ったり変更したりできます。本記事では、BOLA攻撃からアプリケーションを保護する方法を説明します。

既定では、WallarmはBOLAタイプ（IDORとも呼ばれます）の脆弱性のみを自動検出しますが、その悪用試行は検出しません。

!!! warning "BOLA保護の制限事項"
    BOLA攻撃の検出に対応しているのはWallarm node 4.2以降のみです。

    また、Wallarm node 4.2以降は、BOLA攻撃の兆候について次のリクエストのみを解析します：

    * HTTPプロトコルで送信されたリクエストです。
    * 他の攻撃タイプの兆候を含まないリクエストです。例えば、以下の場合はBOLA攻撃とは見なされません：

        * これらのリクエストに[入力検証攻撃](../../attacks-vulns-list.md#attack-types)の兆候が含まれている場合です。
        * これらのリクエストが[rule **Create regexp-based attack indicator**](../../user-guides/rules/regex-rule.md#creating-and-applying-rule)で指定された正規表現に一致する場合です。

## 要件

BOLA攻撃からリソースを保護するために、環境が次の要件を満たしていることを確認してください。

* フィルタリングノードがプロキシサーバーまたはロードバランサーの背後にデプロイされている場合は、実クライアントのIPアドレスが表示されるように[設定](../using-proxy-or-balancer-en.md)してください。