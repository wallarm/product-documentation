# Wallarm API概要

Wallarm APIは、Wallarmシステムのコンポーネント間の相互作用を提供します。Wallarm APIメソッドを使用して、以下のインスタンスを作成、取得、または更新できます。

* 脆弱性
* 攻撃
* 事件
* ユーザー
* クライアント
* フィルターノード
* その他

APIメソッドの説明は、リンクのAPIリファレンスで提供されています。

* https://apiconsole.us1.wallarm.com/ は[USクラウド](../about-wallarm/overview.md#us-cloud)向け
* https://apiconsole.eu1.wallarm.com/ は[EUクラウド](../about-wallarm/overview.md#eu-cloud)向け

![!Wallarm API Reference](../images/wallarm-api-reference.png)

## APIエンドポイント

APIリクエストは以下のURLに送信されます。

* [USクラウド](../about-wallarm/overview.md#us-cloud)向け：`https://us1.api.wallarm.com/`
* [EUクラウド](../about-wallarm/overview.md#eu-cloud)向け：`https://api.wallarm.com/`

## APIリクエストの認証

Wallarm APIリクエストを行うには、確認済みユーザーである必要があります。APIリクエストの認証方法は、リクエストを送信するクライアントによって異なります。

* [API Reference UI](#api-reference-ui)
* [独自のクライアント](#your-own-client)

### API Reference UI

リクエストの認証にはトークンが使用されます。トークンは、Wallarmアカウントでの認証が成功した後に生成されます。

1. 以下のリンクを使用してWallarmアカウントにサインインします。
    * USクラウド向け：https://us1.my.wallarm.com/
    * EUクラウド向け：https://my.wallarm.com/
2. 以下のリンクを使用してAPIリファレンスページを更新します。
    * USクラウド向け：https://apiconsole.us1.wallarm.com/
    * EUクラウド向け：https://apiconsole.eu1.wallarm.com/
3. 必要なAPIメソッドに移動して、**Try it out** セクションにパラメーター値を入力し、リクエストを **Execute** します。

### 独自のクライアント

!!! info "API資格情報とSSO"
    ユーザーにSSOが有効になっている場合、UUIDとシークレットキーを介したWallarm APIへのリクエストの認証は、このユーザーには利用できません。詳細情報は[SSO設定](../admin-en/configuration-guides/sso/employ-user-auth.md#sso-and-api-authentication)記事を参照してください。

リクエストの認証には、UUIDとシークレットキーが使用されます。

1. [USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)のWallarmアカウントにサインイン → **Settings** → **API credentials**。
2. **UUID**の値をコピーします。
3. **Secret key**の値を取得します。

    * シークレットキーの値を知っている場合は、その値を引き続き使用できます。Wallarmコンソールは、アクティブなシークレットキーの暗号化された値を表示します。
    * シークレットキーの値がわからないか失われた場合、新しいシークレットキーを生成するには：
        1. **Renew secret key** をクリックします。
        1. パスワードを入力して確認します。
        1. 新しいキーが生成されたら、その値をコピーします。シークレットキーの値は再表示されません。

        !!! warning "シークレットキー値の再利用"
            **Renew secret key** ボタンは、シークレットキーの新しい値を生成し、以前の値を無効にします。シークレットキーを安全に使用するには：

            * キー値を安全な場所に書き留めます。シークレットキーの値は再表示されません。
            * 保存されたキー値をすべてのWallarm APIリクエストで再利用します。
            * 新しいキー値を生成した場合、以前の値が他のAPIクライアントで使用されていないことを確認してください。以前の値が使用中の場合、新しく生成されたシークレット値に置き換えます。
4. 次の値を渡して必要なAPIリクエストを送信します。
    * `X-WallarmAPI-UUID` ヘッダーパラメーターに **UUID**
    * `X-WallarmAPI-Secret` ヘッダーパラメーターに **Secret key**

## Wallarm API開発とドキュメントのアプローチ

Wallarm APIリファレンスは、シングルページアプリケーション（SPA）であり、表示されるすべてのデータはAPIから動的に取得されます。この設計は、Wallarmが最初に公開APIで新しいデータと機能を利用可能にし、次のステップでAPIリファレンスで説明する[APIファースト](https://swagger.io/resources/articles/adopting-an-api-first-approach/)アプローチを採用するよう促します。通常、すべての新機能は公開APIとAPIリファレンスの両方で並行してリリースされますが、APIリファレンスの変更を先行する形で新しいAPI変更がリリースされることがあり、一部の機能は公開APIのみで利用可能です。

Wallarm APIリファレンスは、Swaggerファイルから[Swagger UI](https://swagger.io/tools/swagger-ui/)ツールを使用して生成されます。APIリファレンスは、利用可能なAPIエンドポイント、メソッド、データ構造について簡単に学ぶ方法を提供します。また、利用可能なすべてのエンドポイントを試す簡単な方法も提供します。