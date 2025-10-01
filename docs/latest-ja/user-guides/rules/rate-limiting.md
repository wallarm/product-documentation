[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# レート制限

[無制限なリソース消費](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md)は、最も重大なAPIセキュリティリスクの一覧である[OWASP API Top 10 2023](../../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023)に含まれています。レート制限の欠如は、このリスクの主な原因の1つです。適切なレート制限がなければ、APIはサービス拒否(DoS)、ブルートフォース、APIの過剰利用といった攻撃に脆弱になります。本記事では、Wallarmのレート制限ルールによりAPIとユーザーを保護する方法を説明します。

WallarmはAPIへの過剰なトラフィックを防ぐために、Advanced rate limitingの[ルール](../../user-guides/rules/rules.md)を提供します。このルールでは、特定のスコープに対するリクエストの最大数を指定でき、着信リクエストが均等に分散されるようにも制御します。定義した上限を超えるリクエストはWallarmが拒否し、ルールで選択したコードを返します。

WallarmはCookieやJSONフィールドなどさまざまなリクエストパラメータを評価するため、発信元IPアドレスだけでなく、セッション識別子、ユーザー名、メールアドレスに基づいても接続を制限できます。この追加の粒度により、あらゆる発信元データを基準としてプラットフォーム全体のセキュリティを強化できます。

本記事で説明するレート制限は、Wallarmが提供する負荷制御の方法の1つです。代替として、[ブルートフォース対策](../../admin-en/configuration-guides/protecting-against-bruteforce.md)を適用できます。レート制限は受信トラフィックを減速させる目的で、ブルートフォース対策は攻撃者を完全にブロックする目的で使用します。

## ルールの作成と適用

レート制限を設定して適用するには:

--8<-- "../include/rule-creation-initial-step.md"
1. Mitigation controls → Advanced rate limitingを選択します。
1. If request isで、ルールを適用するスコープを[記述](rules.md#configuring)します。
1. 対象スコープへの接続に対する希望の上限を設定します:

    * 1秒または1分あたりのリクエストの最大数。
    * **Burst** - 指定したRPS/RPMを超過した際にバッファリングされる過剰リクエストの最大数で、レートが通常に戻ったときに処理されます。`0`がデフォルトです。

        値が`0`以外の場合、バッファリングされた過剰リクエストの実行間でも、定義したRPS/RPMを維持するかどうかを制御できます。
        
        **No delay**は、レート制限による遅延を設けずに、バッファ済みの過剰リクエストをすべて同時に処理することを意味します。**Delay**は、指定数の過剰リクエストを同時に処理し、残りはRPS/RPMで設定された遅延で処理されることを意味します。
    
    * **Response code** - 拒否されたリクエストに対して返すコードです。デフォルトは`503`です。

        以下は、5 r/s、burst 12、delay 8の設定におけるレート制限の挙動例です。
        
        ![レート制限の動作](../../images/user-guides/rules/rate-limit-schema.png)

        最初の8リクエスト（delayの値）はWallarmノードによって遅延なしで転送されます。次の4リクエスト（burst - delay）は、定義した5 r/sというレートを超えないように遅延されます。さらに次の3リクエストは、バースト総量を超過したため拒否されます。その後のリクエストは遅延されます。

1. In this part of requestで、制限を設定したいリクエストのポイントを指定します。選択したリクエストパラメータの値が同一のリクエストをWallarmが制限します。

    利用可能なポイントは[こちら](request-processing.md)に記載しています。ユースケースに合うものを選択してください。例:
    
    * 発信元IPで接続を制限するには`remote_addr`
    * JSON本文の`api_key`パラメータで接続を制限するには`json` → `json_doc` → `hash` → `api_key`

    !!! info "値の長さに関する制限"
        制限の基準とするパラメータ値の最大長は8000文字です。
1. [ルールのコンパイルとフィルタリングノードへのアップロードが完了するまでお待ちください](rules.md#ruleset-lifecycle)。

## ルール例

<!-- ### Limiting IP connections to prevent DoS attacks on API endpoint

Suppose you have a section in the UI that returns a list of users, with a limit of 200 users per page. To fetch the page, the UI sends a request to the server using the following URL: `https://example-domain.com/api/users?page=1&size=200`.

However, an attacker could exploit this by changing the `size` parameter to an excessively large number (e.g. 200,000), which could overload the database and cause performance issues. This is known as a DoS (Denial of Service) attack, where the API becomes unresponsive and unable to handle further requests from any clients.

Limiting connections to the endpoint helps to prevent such attacks. You can limit the number of connections to the endpoint to 1000 per minute. This assumes that, on average, 200 users are requested 5 times per minute. The rule specifies that this limit applies to each IP trying to access the endpoint within minute. The `remote_address` [point](request-processing.md) is used to identify the IP address of the requester.

![Example](../../images/user-guides/rules/rate-limit-for-200-users.png)
-->
### APIの高可用性を確保するためのIP単位の接続制限

あるヘルスケア企業のREST APIが、医師に対し、`/patients`エンドポイントへPOSTリクエストで患者情報を送信できるようにしているとします（ホストは'https://example-host.com'）。このエンドポイントの可用性は極めて重要であり、多数のリクエストで過負荷にすべきではありません。

この`/patients`エンドポイントに対し、一定期間内のIP単位で接続を制限するとこれを防げます。これにより、DoS攻撃を防止して患者情報のセキュリティを保護しつつ、すべての医師に対するエンドポイントの安定性と可用性を確保できます。

例えば、各IPアドレスごとに1分あたり5件のPOSTリクエストに制限する設定は次のとおりです:

![例](../../images/user-guides/rules/rate-limit-by-ip-for-patients.png)

### 認証パラメータへのブルートフォース攻撃を防ぐためのセッション単位の接続制限

ユーザーセッションにレート制限を適用することで、保護されたリソースへの不正アクセスを得る目的で有効なJWTや他の認証パラメータを見つけようとするブルートフォース試行を抑止できます。例えば、1セッションあたり1分間に10リクエストのみを許可するようレート制限を設定すると、異なるトークン値で多数のリクエストを送って有効なJWTを見つけようとする攻撃者は、すぐにレート上限に達し、期間がリセットされるまでリクエストが拒否されます。

アプリケーションが各ユーザーセッションに一意のIDを割り当て、`X-SESSION-ID`ヘッダーに反映しているとします。URL`https://example.com/api/login`のAPIエンドポイントは、`Authorization`ヘッダーにBearer JWTを含むPOSTリクエストを受け付けます。このシナリオにおけるセッション単位の接続制限ルールは次のようになります:

![例](../../images/user-guides/rules/rate-limit-for-jwt.png)

`Authorization`の値に使用する[正規表現](rules.md#condition-type-regex)は``^Bearer\s+([a-zA-Z0-9-_]+[.][a-zA-Z0-9-_]+[.][a-zA-Z0-9-_]+)$`です。

ユーザーセッションの管理にJWT (JSON Web Tokens)を使用している場合は、次のようにルールを調整してJWTを[復号](request-processing.md#jwt)し、ペイロードからセッションIDを抽出できます:

![例](../../images/user-guides/rules/rate-limit-for-session-in-jwt.png)

<!-- ### User-Agent based rate limiting to prevent attacks on API endpoints

Let's say you have an old version of your application has some known security vulnerabilities allowing attackers to brute force API endpoint `https://example-domain.com/login` using the vulnerable application version. Usually, the `User-Agent` header is used to pass browser/application versions. To prevent the brute force attack via the old application version, you can implement `User-Agent` based rate limiting.

For example, you can set a limit of 10 requests per minute for each `User-Agent`. If a specific `User-Agent` is making more than 10 requests evenly distributed per minute, further requests from that `User-Agent` are rejected till a new period start.

![Example](../../images/user-guides/rules/rate-limit-by-user-agent.png)

### Endpoint-based rate limiting to prevent DoS attacks

Rate limiting can also involve setting a threshold for the number of requests that can be made to a particular endpoint within a specified time frame, such as 60 requests per minute. If a client exceeds this limit, further requests are rejected.

It helps to prevent DoS attacks and ensure that the application remains available to legitimate users. It can also help to reduce the load on the server, improve overall application performance, and prevent other forms of abuse or misuse of the application.

In this specific case, the rate limiting rule is applied to connections by URI, meaning that Wallarm automatically identifies repeated requests targeting a single endpoint. Here's an example of how this rule would work for all endpoints of the `https://example.com` host:

* Limit: 60 requests per minute (1 request per second)
* Burst: allow up to 20 requests per minute (which could be useful if there is a sudden spike in traffic)
* No delay: process 20 excessive requests simultaneously, without the rate limit delay between requests
* Response code: reject requests exceeding the limit and the burst with the 503 code
* Wallarm identifies repeated requests targeted at a single endpoint by the `uri` [point](request-processing.md)

    !!! info "Query parameters are not included into URI"
        This rule limits requests targeted at any path of the specified domain which does not contain any query parameters.

![Example](../../images/user-guides/rules/rate-limit-by-uri.png) -->

### サーバーの過負荷を防ぐための顧客ID単位の接続制限

オンラインショッピングプラットフォームの顧客注文データにアクセスできるWebサービスを考えます。顧客IDごとのレート制限は、短時間に過剰な注文が行われて在庫管理や出荷処理に負荷がかかる事態を防ぐのに役立ちます。

例えば、`https://example-domain.com/orders`へのPOSTリクエストを各顧客あたり1分に10件へ制限するルールは、次のようになります。この例では、顧客IDがJSON本文オブジェクト`data.customer_id`で[渡される](request-processing.md#json_doc)ものとします。

![例](../../images/user-guides/rules/rate-limit-by-customer-id.png)

## 制限事項と特記事項

レート制限機能には次の制限事項と特記事項があります:

* レート制限ルールは、すべての[Security Edge](../../installation/security-edge/overview.md)および[self-hosted](../../installation/supported-deployment-options.md)のデプロイメント形態でサポートされますが、以下は対象外です:

    * OOB Wallarmデプロイメント
    * MuleSoft、Amazon CloudFront、Cloudflare、Broadcom Layer7 API Gateway、Fastlyのコネクタ
* 制限の基準とするパラメータ値の最大長は8000文字です。
* 複数のWallarmノードがあり、各ノードに到着するトラフィックがレート制限ルールに該当する場合、それぞれ独立して制限されます。
* 複数のレート制限ルールが着信リクエストに適用可能な場合、最も小さいレート上限のルールが適用されます。
* 着信リクエストに、ルールのIn this part of requestセクションで指定したポイントが存在しない場合、そのリクエストには本ルールによる制限は適用されません。
* Webサーバー側でも接続制限（例: [ngx_http_limit_req_module](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html)というNGINXモジュールの使用）を構成しており、同時にWallarmのルールも適用している場合、Webサーバーは自側の設定に従ってリクエストを拒否しますが、Wallarmは拒否しません。
* Wallarmはレート制限を超えたリクエストを保存しません。ルールで選択したコードを返して拒否するだけです。例外は[攻撃の兆候](../../about-wallarm/protecting-against-attacks.md)があるリクエストで、レート制限ルールにより拒否された場合でも、Wallarmによって記録されます。

## rate abuse protectionとの違い

大量のリクエストによるリソース消費の抑制と攻撃の防止には、本稿で説明したレート制限に加えて、Wallarmは[レート乱用対策](../../api-protection/dos-protection.md)も提供します。

レート制限は、レートが高すぎる場合に一部のリクエストを遅延させ（バッファに格納し）、バッファが満杯になると残りを拒否します。レートが正常に戻ると、バッファ済みのリクエストが配信され、IPやセッション単位のブロックは行いません。一方、レート乱用対策は攻撃者をIPやセッションで一定時間ブロックします。