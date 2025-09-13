# DoS保護 <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

[無制限なリソース消費](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md)は、最も重大なAPIセキュリティリスクの一覧である[OWASP API Top 10 2023](../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023)に含まれています。これは単独でも脅威（過負荷によるサービスの低速化や完全停止）であるうえ、列挙攻撃などさまざまな攻撃タイプの基盤にもなります。単位時間あたりに過剰な数のリクエストを許可することは、これらのリスクの主な原因の1つです。

Wallarmは、APIへの過剰なトラフィックを防止するための**DoS protection**[緩和コントロール](../about-wallarm/mitigation-controls-overview.md)を提供します。

使用には[NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.0.1または[Native Node](../installation/nginx-native-node-internals.md#native-node) 0.14.1以降が必要です。

## 緩和コントロールの作成と適用

作業を始める前に: [Mitigation Controls](../about-wallarm/mitigation-controls-overview.md#configuration)の記事で、**Scope**、**Scope filters**、**Mitigation mode**の設定方法を把握してください。

レート濫用保護を構成するには:

1. Wallarm Console → Mitigation Controlsに進みます。
1. Add control → DoS protectionを選択します。
1. この緩和コントロールを適用する対象のScopeを指定します。
1. 必要に応じて、Scope filtersで詳細条件を定義します。
1. 時間間隔あたりのリクエスト数をカウントするためのしきい値を設定します。
1. Mitigation modeセクションで、しきい値を超えたときに実行するアクションを設定します。
1. Createをクリックします。

## 緩和コントロールの例

### セッション単位でリクエストを制限して認証パラメータへのブルートフォース攻撃を防止する

ユーザーセッションごとに単位時間あたりのリクエスト数を制限することで、保護されたリソースに不正にアクセスする目的で実在のJWTやその他の認証パラメータを探り当てようとするブルートフォース試行を抑止できます。例えば、1つのセッションで60秒あたり10件のリクエストのみを許可するように制限を設定すると、異なるトークン値で多数のリクエストを送って有効なJWTを見つけようとする攻撃者はすぐに上限に達し、そのリクエストはIPアドレスまたはセッションで拒否されます。

アプリケーションがhttps://example.com/api/loginエンドポイントでBearer JWTを含むPOSTリクエストを受け付けるとします。このエンドポイントに対して、1つのセッションで60秒あたり10件を超えるリクエストが送信された場合、そのセッションを1時間ブロックしたいとします。このシナリオでは、時間あたりのリクエストを制限する緩和コントロールは次のようになります:

![DoS protection - JWTの例](../images/api-protection/mitigation-controls-dos-protection-jwt.png)

## レート制限との違い

リソース消費を抑え、大量のリクエストを用いた攻撃を防ぐために、本稿で説明したレート濫用保護に加えて、Wallarmは[高度なレート制限](../user-guides/rules/rate-limiting.md)も提供します。

レート濫用保護は、IPアドレスまたはセッション単位で攻撃者をブロックします。一方、高度なレート制限は、レートが高すぎる場合に一部のリクエストを遅延（バッファに投入）し、バッファが満杯になると残りを拒否します。レートが通常に戻ると、バッファされたリクエストが配信され、IPアドレスやセッションによるブロックは適用されません。