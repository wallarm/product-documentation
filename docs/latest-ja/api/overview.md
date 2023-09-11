[user-roles-article]:    ../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:   ../images/api-tokens-edit.png

# Wallarm APIの概要

Wallarm APIは、Wallarmシステムの各コンポーネント間の相互作用を提供します。次のインスタンスを作成、取得、または更新するためのWallarm APIメソッドを使用できます。

* 脆弱性
* 攻撃
* インシデント
* ユーザー
* クライアント
* フィルタノード
* など

APIメソッドの説明は、Wallarm Console →右上→`?`→**Wallarm API Console**から利用可能な**Wallarm API Console**か、以下のリンクから直接取得できます。

* [US cloud](../about-wallarm/overview.md#us-cloud)の場合はhttps://apiconsole.us1.wallarm.com/
* [EU cloud](../about-wallarm/overview.md#eu-cloud)の場合はhttps://apiconsole.eu1.wallarm.com/

![Wallarm API Console](../images/wallarm-api-reference.png)

## APIエンドポイント

APIリクエストは、以下のURLに送信されます：

* [US cloud](../about-wallarm/overview.md#us-cloud)の場合は`https://us1.api.wallarm.com/`
* [EU cloud](../about-wallarm/overview.md#eu-cloud)の場合は`https://api.wallarm.com/`

## APIリクエストの認証

Wallarm APIリクエストを行うには、認証済みのユーザーである必要があります。APIリクエストの認証方法は、リクエストを送信するクライアントによって異なります：

* [API Reference UI](#api-reference-ui)
* [独自のAPIクライアント](#your-own-api-client)

### Wallarm APIコンソール

リクエストの認証にはトークンが使用されます。トークンは、Wallarmアカウントでの成功した認証後に生成されます。

1. 次のリンクを使用してWallarmコンソールにサインインします：
    * US cloudの場合はhttps://us1.my.wallarm.com/
    * EU cloudの場合はhttps://my.wallarm.com/
2. 次のリンクを使ってWallarm APIコンソールのページを更新します：
    * US cloudの場合はhttps://apiconsole.us1.wallarm.com/
    * EU cloudの場合はhttps://apiconsole.eu1.wallarm.com/
3. 必要なAPIメソッドに移動して **Try it out** セクションを開き、パラメーターの値を入力してリクエストを **Execute** します。

### 独自のAPIクライアント

自分のAPIクライアントからWallarm APIへのリクエストを認証するには：

1. [US Cloud](https://us1.my.wallarm.com/) または [EU Cloud](https://my.wallarm.com/) のWallarmアカウントにサインインし、 **Settings** → **API tokens** に進みます。
1. Wallarm APIにアクセスするためのトークンを[作成](../user-guides/settings/api-tokens.md#configuring-tokens)します。
1. トークンを開き、**Token** セクションから値をコピーします。
1. `X-WallarmApi-Token` ヘッダーパラメーターに **Token** の値を持つAPIリクエストを送信します。

[APIトークンの詳細はこちら →](../user-guides/settings/api-tokens.md) 

<!-- ## APIの制限

Wallarmでは、APIの呼び出し回数を毎秒500リクエストに制限しています。 -->

## WallarmのAPI開発とドキュメンテーションのアプローチ

Wallarm API Referenceは、すべての表示データがAPIから動的に取得される単一ページアプリケーション(SPA)であり、この設計はWallarmが[API-first](https://swagger.io/resources/articles/adopting-an-api-first-approach/)アプローチを使用して新たなデータと機能を最初に公開APIで利用可能にし、次のステップではAPI Referenceで説明することを推進します。通常、新機能は公開APIとAPI Referenceの両方で同時にリリースされますが、場合によってはAPI Referenceの変更に先行して新しいAPIの変更がリリースされ、一部の機能が公開APIのみで利用可能になります。

Wallarm API Referenceは、[Swagger UI](https://swagger.io/tools/swagger-ui/)ツールを使用してSwaggerファイルから生成されます。API Referenceは、利用可能なAPIエンドポイント、メソッド、データ構造について学ぶ簡単な方法を提供します。また、利用可能なすべてのエンドポイントを試す簡単な方法も提供します。