[user-roles-article]:    ../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:   ../images/api-tokens-edit.png

# Wallarm API概要

Wallarm APIはWallarmシステムのコンポーネント間での連携を提供します。Wallarm APIメソッドを使用して、以下のインスタンスを作成、取得、または更新できます:

* vulnerabilities
* attacks
* incidents
* users
* clients
* filter nodes
* etc.

APIメソッドの説明は、Wallarm Console → top right → `?` → **Wallarm API Console**から、または直接以下のリンクから確認できます:

* https://apiconsole.us1.wallarm.com/ for the [US cloud](../about-wallarm/overview.md#cloud)
* https://apiconsole.eu1.wallarm.com/ for the [EU cloud](../about-wallarm/overview.md#cloud)

![Wallarm API Console](../images/wallarm-api-reference.png)

## APIエンドポイント

APIリクエストは次のURLに送信されます:

* `https://us1.api.wallarm.com/` for the [US cloud](../about-wallarm/overview.md#cloud)
* `https://api.wallarm.com/` for the [EU cloud](../about-wallarm/overview.md#cloud)

## APIリクエストの認証

Wallarm APIリクエストを行うには、認証済みユーザーである必要があります。APIリクエストの認証方法は、リクエストを送信するクライアントによって異なります:

* [API Reference UI](#wallarm-api-console)
* [Your own API client](#your-own-api-client)

### Wallarm API Console

リクエスト認証にはトークンが使用されます。トークンはWallarmアカウントへの認証に成功後に生成されます。

1. 次のリンクを使用してWallarm Consoleにサインインしてください:
    * https://us1.my.wallarm.com/ for the US cloud
    * https://my.wallarm.com/ for the EU cloud
2. 次のリンクを使用してWallarm API Consoleページを更新してください:
    * https://apiconsole.us1.wallarm.com/ for the US cloud
    * https://apiconsole.eu1.wallarm.com/ for the EU cloud
3. 必要なAPIメソッドに移動し、**Try it out**セクションでパラメータ値を入力して**Execute**してください。

### Your own API client

ご自身のAPIクライアントからWallarm APIにリクエストを認証するには:

1. [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarmアカウントにサインインし、**Settings** → **API tokens**に移動してください。
2. [Create token](../user-guides/settings/api-tokens.md)してWallarm APIへアクセスしてください。
3. トークンを開いて、**Token**セクションから値をコピーしてください。
4. 必要なAPIリクエストを送信する際、`X-WallarmApi-Token`ヘッダーに**Token**の値を渡してください。

[API tokensの詳細 →](../user-guides/settings/api-tokens.md)

<!-- ## API restrictions

Wallarm limits the rate of API calls to 500 requests per second. -->

## WallarmのAPI開発およびドキュメントへのアプローチ

Wallarm API Referenceは、すべての表示データがAPIから動的に取得されるシングルページアプリケーション(SPA)です。この設計により、Wallarmは新たなデータと機能が最初に公開APIで利用可能になり、その後API Referenceに記載される[API-first](https://swagger.io/resources/articles/adopting-an-api-first-approach/)アプローチを推奨します。通常、新機能は公開APIとAPI Referenceの両方で並行してリリースされますが、場合によってはAPI Referenceの変更に先行して新たなAPI変更がリリースされ、一部の機能は公開API経由でのみ利用可能になることもあります。

Wallarm API Referenceは、Swaggerファイルから生成され、[Swagger UI](https://swagger.io/tools/swagger-ui/)ツールを使用しています。API Referenceは、利用可能なAPIエンドポイント、メソッド、及びデータ構造を理解する簡単な方法を提供し、すべての利用可能なエンドポイントを試すシンプルな方法も提供します。