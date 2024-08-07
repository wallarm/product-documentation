# 特定のURLおよびリクエストに対するボット保護の無効化

[**APIアビューズ防止**](overview.md)モジュールは、保護する特定のアプリケーション、対象とするボットのタイプ、許容レベルなどを設定する[プロファイル](setup.md)に基づき、ボットを識別して対処します。また、この記事で述べられている**APIアビューズ防止モードの設定**ルールを使用すると、特定のURLとリクエストに対するボット保護をオフにすることができます。

ルールの[URIコンストラクタ](../user-guides/rules/rules.md#uri-constructor)にはURLとリクエストの要素（ヘッダーなど）が含まれているため、リクエストが対象とするURLと特定のリクエストタイプ（特定のヘッダーを含むリクエストなど）の両方に対してボット保護を無効にすることができます。

!!! info "異なるノードバージョンでのルールサポート"
    この機能はバージョン4.8以上のノードでのみサポートされます。

## ルールの作成と適用

特定のURLまたはリクエストタイプのボット保護を無効にするには：

1. Wallarmコンソール → **ルール** → **規則を追加**に進みます。
1. **リクエストが**の項目では、ルールを適用するリクエストおよび/またはURLを[記述](../user-guides/rules/rules.md#uri-constructor)します。

    URLを指定する場合、[**APIディスカバリー**](../api-discovery/overview.md)モジュールを使用してエンドポイントが発見されている場合、そのメニューを使用してエンドポイント用のルールを素早く作成することもできます。

1. **次に**で、**APIアビューズ防止モードの設定**を選択し、設定します：

    * **デフォルト** - 説明された範囲（特定のURLまたはリクエスト）に対して、一般的なAPIアビューズ防止[プロファイル](setup.md)によって定義された通常の方法でボットからの保護が機能します。
    * **ボット活動をチェックしない** - 説明されたURLおよび/またはリクエストタイプに対して、ボット活動のチェックが実行されません。

1. オプションで、コメントに、このURL/リクエストタイプのルールを作成する理由を指定します。

URLおよび/またはリクエストタイプの例外を一時的に無効にすることもできますが、ルールを削除せずに**デフォルト**モードを選択するだけです。後でいつでも**ボット活動をチェックしない**に戻ることができます。

## ルールの例

### リクエストヘッダーによる合法的なボットのマーキング

たとえば、複数のIPがリクエストを送信するKlaviyoマーケティングオートメーションツールがアプリケーションと統合されているとします。したがって、特定のURIに対して`Klaviyo/1.0`ユーザーエージェントからのGETリクエストで自動化（ボット）活動をチェックしないように設定します：

![特定のヘッダーを持つリクエストのボット活動をチェックしない](../images/user-guides/rules/api-abuse-url-request.png)

### テストエンドポイントに対するボットからの保護を無効にする

たとえば、アプリケーションに属するエンドポイントがあるとします。そのアプリケーションはボットの活動から保護されるべきですが、テストエンドポイントは例外であるべきです。また、[**APIディスカバリー**](../api-discovery/overview.md)モジュールによってAPIインベントリが発見されています。

この場合、**APIディスカバリー**のエンドポイントリストからルールを作成する方が簡単です。そこに行き、エンドポイントを見つけ、そのページからルール作成を開始します：

![APIディスカバリーエンドポイントにAPIアビューズ防止モードの設定作成](../images/user-guides/rules/api-abuse-url.png)