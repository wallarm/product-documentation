[api-discovery-enable-link]:        ../api-discovery/setup.md#enable

# GraphQL API保護 <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmは、基本的な[WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプションプランでも、GraphQLに対する一般的な攻撃（SQLi、RCE、[など](../attacks-vulns-list.md)）を[デフォルトで](../user-guides/rules/request-processing.md#gql)検出します。しかし、プロトコルの一部の側面により、過度な情報露出やDoSに関連する[GraphQL特有の](../attacks-vulns-list.md#graphql-attacks)攻撃が可能になります。本書では、GraphQLリクエストに対する制限の集合である**GraphQLポリシー**を設定することで、Wallarmを使用してこれらの攻撃からAPIを保護する方法を説明します。

拡張保護であるGraphQL API保護は、高度な[API Security](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプションプランの一部です。プランを購入したら、**GraphQL API protection**[mitigation control](../about-wallarm/mitigation-controls-overview.md)で組織のGraphQLポリシーを設定して保護を開始します。

## サポートされるGraphQLフォーマット

GraphQLクエリは通常、GraphQLサーバーのエンドポイントに対するHTTP POSTリクエストとして送信されます。リクエストには、サーバーに送信される本文のメディアタイプを指定する`CONTENT-TYPE`ヘッダーが含まれます。`CONTENT-TYPE`として、Wallarmは次をサポートします:

* 一般的に使用されるオプション: `application/json` と `application/graphql`
* 発生し得るオプション: `text/plain` と `multipart/form-data`

GraphQLクエリはHTTP GETリクエストとして送信することもあります。この場合、クエリはURLのクエリパラメータとして含まれます。GETリクエストはGraphQLクエリにも使用可能ですが、特に複雑なクエリではPOSTリクエストほど一般的ではありません。これは、GETリクエストが通常は冪等な操作（結果を変えることなく繰り返し可能な操作）に使用され、さらに長さの制限があるため、長いクエリでは問題になり得るためです。

WallarmはGraphQLリクエストに対してPOSTおよびGETの両HTTPメソッドをサポートします。

## 設定方法

サブスクリプションプランに応じて、GraphQL API保護の設定方法として次のいずれかが利用可能です:

* Mitigation controls（[Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプション）
* Rules（[Cloud Native WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプション）

## Mitigation controlベースの保護 <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

!!! tip ""
    [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.2.0以上が必要で、現時点では[Native Node](../installation/nginx-native-node-internals.md#native-node)ではサポートされていません。
    
### デフォルト保護

Wallarmは[デフォルトの](../about-wallarm/mitigation-controls-overview.md#default-controls)**GraphQL API protection** mitigation controlsを提供します。これらにはGraphQL APIの異常を検出するための一般的な設定が含まれており、`Monitoring`[モード](../about-wallarm/mitigation-controls-overview.md#mitigation-mode)で全トラフィックに対して有効です。

GraphQLのデフォルトコントロールを確認するには、Wallarm Console → **Security Controls** → **Mitigation Controls**で、**GraphQL API protection**セクションの`Default`ラベル付きコントロールを確認します。

デフォルトコントロールは複製や編集、無効化ができます。編集により、アプリケーションの特性、トラフィックパターン、ビジネス文脈に基づいてデフォルトコントロールをカスタマイズできます。例えば、**Scope**を絞ってGraphQL特有のエンドポイントに限定したり、しきい値を調整したりできます。

<!--You can **reset default control to its default configuration** at any time.-->

--8<-- "../include/mc-subject-to-change.md"

### Mitigation controlの作成と適用

GraphQL向けのmitigation controlは、GraphQL特有のエンドポイントに対して作成することを推奨します。システム全体に対するall trafficのmitigation controlとして作成することは推奨しません。

!!! info "mitigation controlに関する一般情報"
    先に進む前に: **Scope**や**Mitigation mode**の設定方法など、あらゆるmitigation controlの基本については[Mitigation Controls](../about-wallarm/mitigation-controls-overview.md#configuration)の記事をご確認ください。

GraphQLポリシーを設定して適用するには:

1. Wallarm Console → **Mitigation Controls**に進みます。
1. **Add control** → **GraphQL API protection**を使用します。
1. mitigation controlを適用する**Scope**を記述します。
1. トラフィックメトリクスに応じてGraphQLリクエストのしきい値を設定します（空欄/未選択のままの場合、その基準による制限は適用されません）:

    * **Maximum total query size in kilobytes** - GraphQLクエリ全体のサイズ上限を設定します。過度に大きなクエリを送信してサーバーリソースを消費させるDoS攻撃を防ぐうえで重要です。
    * **Maximum value size in kilobytes** - GraphQLクエリ内の任意の値（変数またはクエリパラメータ）の最大サイズを設定します。非常に長い文字列の値を変数や引数に入れて送信するExcessive Value Length型の攻撃によるサーバーの過負荷を緩和します。
    * **Maximum query depth** - GraphQLクエリの最大許容ネスト深度を設定します。深いネストを制限することで、悪意ある複雑なクエリによるパフォーマンス低下やリソース枯渇を回避できます。
    * **Maximum number of aliases** - 1つのGraphQLクエリで使用可能なエイリアス数の上限を設定します。エイリアス機能を悪用して過度に複雑なクエリを作るResource ExhaustionやDoS攻撃を防止します。
    * **Maximum batched queries** - 1つのリクエスト内で送信可能なバッチクエリ数の上限を設定します。レート制限などのセキュリティ対策を回避するために複数の操作を1つのリクエストにまとめるバッチング攻撃を阻止するうえで重要です。
    * **Block/register introspection queries** - 有効にすると、スキーマの構造を明らかにし得るイントロスペクションクエリを潜在的な攻撃として扱います。本番でのイントロスペクションの無効化や監視は、スキーマの漏えい防止に有効です。
    * **Block/register debug requests** - 有効にすると、デバッグモードのパラメータを含むリクエストを潜在的な攻撃として扱います。本番でデバッグモードが誤って有効のままになっているケースを検知し、過度なエラーレポートメッセージを通じたバックエンドの機微情報露出を防ぎます。

    既定では、ポリシーはPOSTリクエストのクエリサイズ上限を100 KB、値のサイズ上限を10 KB、クエリ深度とバッチクエリの上限を10、エイリアスの上限を5に設定し、さらにイントロスペクションとデバッグクエリを拒否します。スクリーンショットのとおりです（デフォルト値は、一般的な正当なGraphQLクエリの統計を考慮して任意の値に変更できます）:
        
    ![GraphQLのしきい値](../images/api-protection/mitigation-controls-graphql.png)

1. **Mitigation mode**セクションで実行するアクションを設定します。
1. **Add**をクリックします。

<!--## Exploring GraphQL attacks

You can explore GraphQL policy violations (GraphQL attacks) in Wallarm Console → **Attacks** section. Use the GraphQL specific [search keys](../user-guides/search-and-filters/use-search.md#graphql-tags) or corresponding filters:

![GraphQL attacks](../images/user-guides/rules/graphql-attacks.png)-->

### Mitigation controlの例

#### 攻撃をブロックするためのGraphQLエンドポイント向けポリシー設定 <a id="setting-policy-for-your-graphql-endpoints-to-block-attacks"></a>

`example.com/graphql`配下にあるアプリケーションのGraphQLエンドポイントへのリクエストに対して、潜在的な[GraphQL特有の](../attacks-vulns-list.md#graphql-attacks)攻撃をすべてブロックするための制限を設定したいとします。`example.com`のフィルトレーションモードは`monitoring`です。

これを行うには:

1. スクリーンショットのとおりに**GraphQL API protection** mitigation controlを設定します（これらは例の値です。実運用のルールでは、一般的な正当なGraphQLクエリの統計を考慮して独自の値を定義してください）。

    ![エンドポイント向けGraphQLポリシー](../images/api-protection/mitigation-controls-graphql-1.png)

1. `example.com`のフィルトレーションモードは`monitoring`ですが、GraphQLエンドポイントでは`block`にしたいので、**Override filtration mode**ルールをスクリーンショットのとおりに構成します:

    ![GraphQLポリシーのブロックアクション](../images/user-guides/rules/graphql-rule-1-action.png)

#### 特定のエンドポイント向けにポリシーを変更

[前述の](#setting-policy-for-your-graphql-endpoints-to-block-attacks)例の続きとして、`example.com/graphql/v2`の子エンドポイントに対して、より厳格な制限を設定したいとします。制限が厳しくなるため、何かをブロックする前に`monitoring`モードでテストする必要があります。

これを行うには:

1. スクリーンショットのとおりに**GraphQL API protection** mitigation controlを設定します（これらは例の値です。実運用のルールでは、一般的な正当なGraphQLクエリの統計を考慮して独自の値を定義してください）。

    ![子エンドポイントに対するより厳格なGraphQLポリシー](../images/api-protection/mitigation-controls-graphql-2.png)

1. `example.com/graphql`のフィルトレーションモードは`block`で、`example.com/graphql/v2`では`monitoring`にしたいので、**Override filtration mode**ルールをスクリーンショットのとおりに構成します:

    ![GraphQLポリシーのブロックアクション](../images/user-guides/rules/graphql-rule-2-action.png)

## ルールベースの保護

**GraphQL API protection** mitigation controlで説明したものと同じ設定を使用します。相違点は、Wallarm Console → **Security Controls** → **Rules**で操作することだけです。