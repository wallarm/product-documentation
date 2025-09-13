[user-roles-article]:    ../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:   ../images/api-tokens-edit.png

# Wallarm APIの概要

Wallarm APIは、Wallarmシステムのコンポーネント間の連携を可能にします。Wallarm APIのメソッドを使用して、次のエンティティを作成・取得・更新できます:

* 脆弱性
* 攻撃
* インシデント
* ユーザー
* クライアント
* フィルタノード
* など

APIメソッドの説明は、Wallarm Console → 右上 → `?` → Wallarm API Consoleから利用でき、次のリンクから直接アクセスできます:

* https://apiconsole.us1.wallarm.com/ は[USクラウド](../about-wallarm/overview.md#cloud)向けです
* https://apiconsole.eu1.wallarm.com/ は[EUクラウド](../about-wallarm/overview.md#cloud)向けです

![Wallarm API Console](../images/wallarm-api-reference.png)

## APIエンドポイント

APIリクエストは次のURLに送信します:

* `https://us1.api.wallarm.com/` は[USクラウド](../about-wallarm/overview.md#cloud)向けです
* `https://api.wallarm.com/` は[EUクラウド](../about-wallarm/overview.md#cloud)向けです

## APIリクエストの認証

Wallarm APIにリクエストを送信するには、認証済みユーザーである必要があります。APIリクエストの認証方法は、リクエストを送信するクライアントによって異なります:

* [API ReferenceのUI](#wallarm-api-console)
* [独自のAPIクライアント](#your-own-api-client)

### Wallarm API Console

リクエストの認証にはトークンを使用します。トークンは、Wallarmアカウントでの認証に成功すると生成されます。

1. 次のリンクからWallarm Consoleにサインインします:
    * https://us1.my.wallarm.com/（USクラウド）
    * https://my.wallarm.com/（EUクラウド）
2. 次のリンクを使用してWallarm API Consoleのページを更新します:
    * https://apiconsole.us1.wallarm.com/（USクラウド）
    * https://apiconsole.eu1.wallarm.com/（EUクラウド）
3. 必要なAPIメソッド→Try it outセクションに移動し、パラメータ値を入力して、Executeをクリックします。

### 独自のAPIクライアント

独自のAPIクライアントからWallarm APIへのリクエストを認証するには、次の手順を実行します。

1. [USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)のWallarmアカウントにサインインし、Settings → API tokensに移動します。
1. Wallarm APIにアクセスするための[トークンを作成](../user-guides/settings/api-tokens.md)します。
1. トークンを開き、**Token**セクションの値をコピーします。
1. 必要なAPIリクエストを送信する際、ヘッダーパラメータ`X-WallarmApi-Token`に**Token**の値を渡します。

[APIトークンの詳細→](../user-guides/settings/api-tokens.md)

<!-- ## API restrictions

Wallarm limits the rate of API calls to 500 requests per second. -->

## API開発とドキュメントに対するWallarmのアプローチ

Wallarm API Referenceはシングルページアプリケーション（SPA）であり、表示されるすべてのデータはAPIから動的に取得されます。この設計により、Wallarmは[API-first](https://swagger.io/resources/articles/adopting-an-api-first-approach/)アプローチを採用しています。新しいデータや機能は、まずパブリックAPIで利用可能になり、その次の段階としてAPI Referenceに記載されます。通常、新機能はパブリックAPIとAPI Referenceの双方で並行してリリースされますが、場合によってはAPI Referenceの更新に先行してAPIの変更がリリースされ、一部の機能はパブリックAPIからのみ利用可能なことがあります。
    
Wallarm API Referenceは、[Swagger UI](https://swagger.io/tools/swagger-ui/)ツールを使用してSwaggerファイルから生成されています。API Referenceは、利用可能なAPIエンドポイント、メソッド、データ構造を学ぶ簡便な手段を提供します。また、利用可能なすべてのエンドポイントを試す簡単な方法も提供します。