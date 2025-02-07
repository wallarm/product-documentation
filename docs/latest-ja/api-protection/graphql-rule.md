```markdown
[api-discovery-enable-link]:        ../api-discovery/setup.md#enable

# GraphQL API Protection <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmでは、基本な[WAAP](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security)サブスクリプションプランでも、GraphQLに対する通常の攻撃(SQLi、RCE、[等](../attacks-vulns-list.md))を[デフォルト](../user-guides/rules/request-processing.md#gql)で検出します。ただし、プロトコルの一部の側面により、過度な情報露出やDoSに関連した[GraphQL固有の](../attacks-vulns-list.md#graphql-attacks)攻撃が実装される可能性があります。本書では、**GraphQLポリシー**、すなわちGraphQLリクエストに対する各種制限を設定することにより、APIをこれらの攻撃から保護する方法について説明します。

拡張保護機能として、GraphQL API Protectionは高度な[API Security](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security)サブスクリプションプランの一部です。プラン購入後は、**Detect GraphQL attacks**[ルール](../user-guides/rules/rules.md)内でお客様の組織のGraphQLポリシーを設定し、保護を開始してください（ノード4.10.4以上が必要です）。

## Supported GraphQL formats

GraphQLクエリは通常、GraphQLサーバーエンドポイントへのHTTP POSTリクエストとして送信されます。リクエストには、サーバーに送信される本文のメディアタイプを指定するための`CONTENT-TYPE`ヘッダーが含まれます。Wallarmでは、`CONTENT-TYPE`として以下をサポートします：

* よく使用されるオプション：`application/json`および`application/graphql`
* その他発生し得るオプション：`text/plain`および`multipart/form-data`

GraphQLクエリはHTTP GETリクエストとして送信することも可能です。この場合、クエリはURL内のクエリパラメータとして含まれます。GETリクエストはGraphQLクエリに使用できますが、特により複雑なクエリの場合、POSTリクエストほど一般的ではありません。その理由は、GETリクエストが通常、結果が変わらず繰り返し実行可能な冪等な操作に使用され、また長いクエリには長さ制限が問題となる可能性があるためです。

Wallarmは、GraphQLリクエストに対してPOSTおよびGETの両方のHTTPメソッドをサポートします。

## Creating and applying the rule

GraphQLポリシーを設定し適用するには：

--8<-- "../include/rule-creation-initial-step.md"
1. **Mitigation controls** → **GraphQL API protection**を選択してください。
1. **If request is**において、[describe](../user-guides/rules/rules.md#rule-branches)エンドポイントURIやその他の条件を設定してください：

    * GraphQLエンドポイントのURI（ルート内にあり、通常`/graphql`を含みます）
    * POSTまたはGETメソッド - 詳細は[Supported GraphQL formats](#supported-graphql-formats)を参照してください。POSTおよびGETリクエストの双方に同じ制限を設定したい場合は、メソッドを未指定のままにします
    * `CONTENT-TYPE`ヘッダーの値を設定してください - 詳細は[Supported GraphQL formats](#supported-graphql-formats)を参照してください

        なお、ルール適用のタイミングは、条件の組み合わせを変えることで設定できます。例えば、URIのみを指定し他の条件は未指定にする、またはエンドポイントを指定せずに`CONTENT-TYPE`ヘッダーを`application/graphql`に設定するなどです。さらに、条件を異にする複数のルールを作成し、それぞれに異なる制限や対応策を設定することも可能です。

1. トラフィックのメトリクスに従って、GraphQLリクエストに対する閾値を設定してください（未入力または未選択の場合、この基準による制限は適用されません）：

    * **Maximum total query size in kilobytes** - GraphQLクエリ全体のサイズの上限を設定します。過大なクエリを送信することによりサーバーリソースを悪用するDoS攻撃を防ぐために重要です。
    * **Maximum value size in kilobytes** - GraphQLクエリ内の各値（変数またはクエリパラメータ）の最大サイズを設定します。この制限は、攻撃者が極端に長い文字列値を変数や引数として送信しサーバーを圧倒しようとするExcessive Value Length攻撃を軽減するのに役立ちます。
    * **Maximum query depth** - GraphQLクエリの許容される最大深度を決定します。クエリ深度を制限することで、悪意のある深くネストされたクエリによるパフォーマンス低下やリソースの枯渇を回避できます。
    * **Maximum number of aliases** - 単一のGraphQLクエリで使用可能なエイリアスの数の上限を設定します。エイリアスの数を制限することで、エイリアス機能を悪用したリソース枯渇およびDoS攻撃を防止できます。
    * **Maximum batched queries** - 単一リクエストで送信可能なバッチ化クエリの数を制限します。このパラメータは、攻撃者が複数の操作を一つのリクエストにまとめることでレート制限などのセキュリティ対策を回避するバッチ攻撃を阻止するために不可欠です。
    * **Block/register introspection queries** - 有効にすると、サーバーはGraphQLスキーマの構造が明らかになる可能性のあるイントロスペクションリクエストを潜在的な攻撃として扱います。イントロスペクションクエリを無効化または監視することは、スキーマが攻撃者に露呈するのを防ぐための重要な対策です。
    * **Block/register debug requests** - このオプションを有効にすると、debugモードパラメータを含むリクエストは潜在的な攻撃として見なされます。この設定は、本番環境で誤ってdebugモードが有効となっている場合に、攻撃者がバックエンドの機密情報を含む過度なエラーレポートにアクセスするのを防ぐのに有効です。

    デフォルトでは、ポリシーは最大POSTリクエストクエリサイズを100 KB、値サイズを10 KB、クエリ深度およびバッチ化クエリの上限を10、エイリアス数を5に設定し、またスクリーンショットに示されるようにイントロスペクションおよびdebugクエリを拒否します（一般的な正当なGraphQLクエリの統計に基づいて、これらのデフォルト値は変更可能です）：
        
    ![GraphQL thresholds](../images/user-guides/rules/graphql-rule.png)

<!-- temporary unavailable, bug: https://wallarm.atlassian.net/browse/PLUTO-6979?focusedCommentId=208654
## Reaction to policy violation

Reaction to the policy violation is defined by the [filtration mode](../admin-en/configure-wallarm-mode.md) applied to the endpoints targeted by the rule.

If you are using Wallarm in blocking mode and want to safely test GraphQL rules, you can easily enable monitoring mode for `/graphql` routes by creating a **Set filtration mode** rule [specifically](../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console) for your GraphQL route. Note that this rule will apply to all attacks, including SQLi, XSS, etc., so it is not recommended to leave it for a long time.

![GraphQL policy blocking action](../images/user-guides/rules/graphql-rule-2-action.png)

Consider that you node configuration via the [`wallarm_mode_allow_override` directive](../admin-en/configure-wallarm-mode.md#prioritization-of-methods) may be set to ignore rules created in Wallarm Console. If this is a case, [explore](../admin-en/configure-wallarm-mode.md#configuration-methods) and use other ways to change the filtration mode.-->

## Exploring GraphQL attacks

Wallarm Console→**Attacks**セクションで、GraphQLポリシー違反（GraphQL攻撃）を調査できます。GraphQL専用の[検索キー](../user-guides/search-and-filters/use-search.md#graphql-tags)または対応するフィルターを使用してください：

![GraphQL attacks](../images/user-guides/rules/graphql-attacks.png)

<!--## Rule examples

### Setting policy for your GraphQL endpoints to block attacks

Let us say you want to set limits for the requests to your application GraphQL endpoints located under `example.com/graphql` to block all potential [GraphQL specific](../attacks-vulns-list.md#graphql-attacks) attacks to them. Filtration mode for `example.com` is `monitoring`.

To do so:

1. Set the **Detect GraphQL attacks** rule as displayed on the screenshot (note that these are the example values - for the real-life rules you should define your own values considering statistics of your common legitimate GraphQL queries):

    ![GraphQL Policy for your endpoints](../images/user-guides/rules/graphql-rule-1.png)

1. As filtration mode for `example.com` is `monitoring` and you want `block` for its GraphQL endpoints, configure the **Set filtration mode** rule as displayed on the screenshot:

    ![GraphQL policy blocking action](../images/user-guides/rules/graphql-rule-1-action.png)

### Altering policy for specific endpoints

Continuing the [previous](#setting-policy-for-your-graphql-endpoints-to-block-attacks) example, let us say you want to set stricter limits for `example.com/graphql/v2` child endpoint. As limits are stricter, before blocking anything, they should be tested in the `monitoring` mode.

To do so:

1. Set the **Detect GraphQL attacks** rule as displayed on the screenshot (note that these are the example values - for the real-life rules you should define your own values considering statistics of your common legitimate GraphQL queries):

    ![GraphQL stricter policy for child endpoint](/../images/user-guides/rules/graphql-rule-2.png)

1. As filtration mode for `example.com/graphql` is `block` and you want `monitoring` for `example.com/graphql/v2`, configure the **Set filtration mode** rule as displayed on the screenshot:

    ![GraphQL policy blocking action](../images/user-guides/rules/graphql-rule-2-action.png)
-->
```