```markdown
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# レート制限

[unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md)は[OWASP API Top 10 2023](../../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023)における最も深刻なAPIセキュリティリスクの一つとして含まれています。レート制限が不十分であることが、このリスクの主な原因の一つです。適切なレート制限対策が講じられていない場合、APIはDoS（サービス拒否攻撃）、ブルートフォース攻撃、APIの過剰利用などの攻撃に脆弱になります。この記事では、Wallarmのレート制限規則ルールを使用して、APIおよびユーザーの安全を確保する方法について説明します。

Wallarmは、APIへの過剰なトラフィックを防ぐために**Set rate limit**[ルール](../../user-guides/rules/rules.md)を提供します。このルールでは、特定のスコープに対して確立できる接続の最大数を指定するとともに、受信リクエストが均等に分散されることを保証します。定義された制限を超えるリクエストがあった場合、Wallarmはそのリクエストを拒否し、ルールで選択したコードを返します。

Wallarmは、クッキーやJSONフィールドなどの各種リクエストパラメータを検査するため、接続を接続元IPアドレスだけでなく、セッション識別子、ユーザー名、電子メールアドレスなどに基づいて制限することが可能です。この追加の粒度により、任意の起源データに基づいてプラットフォーム全体のセキュリティを向上させることができます。

なお、この記事で説明するレート制限は、Wallarmが提供する負荷制御手法の一つです。あるいは、[ブルートフォース保護](../../admin-en/configuration-guides/protecting-against-bruteforce.md)を適用することもできます。着信トラフィックの減速にはレート制限を使用し、ブルートフォース保護は攻撃者を完全にブロックするために使用します。

## ルールの作成と適用

レート制限を設定して適用する手順は以下の通りです。

--8<-- "../include/rule-creation-initial-step.md"
1. **Mitigation controls**→**Advanced rate limiting**を選択します。
1. **If request is**で、ルールを適用するスコープを[rules.md#configuring](rules.md#configuring)を参照しながら記述します。
1. 対象スコープへの接続に対して希望する制限値を設定します:

    * 秒または分あたりのリクエストの最大数。
    * **Burst** - 指定されたRPS/RPMを超えた場合にバッファリングされ、レートが正常に戻った際に処理される過剰リクエストの最大数。デフォルトは`0`です。

        値が`0`でない場合、バッファされた過剰リクエストの実行間で定義されたRPS/RPMを維持するかどうかを制御できます。
        
        **No delay**はレート制限の遅延なしで、バッファされた過剰リクエストすべてを同時に処理することを意味します。**Delay**は、指定された数の過剰リクエストを同時に処理し、その他のリクエストはRPS/RPMで設定された遅延で処理されることを意味します。
    
    * **Response code** - 拒否されたリクエストに対して返すコード。デフォルトは`503`です。

        以下は、5 r/sの制限、burstが12、delayが8の場合のレート制限の挙動の例です。
        
        ![レート制限の動作例](../../images/user-guides/rules/rate-limit-schema.png)

        最初の8つのリクエスト（delayの値）はWallarmノードにより遅延なく転送されます。次の4つのリクエスト（burst - delay）は、定義された5 r/sのレートが超えないように遅延がかかります。次の3つのリクエストは、総burstサイズを超えたため拒否されます。以降のリクエストは遅延されます。

1. **In this part of request**で、制限を設定したいリクエストポイントを指定します。Wallarmは、選択されたリクエストパラメータが同一のリクエストに対して制限を適用します。

    利用可能なすべてのポイントは[こちら](request-processing.md)に記載されており、特定のユースケースに合わせて選択可能です。たとえば:
    
    * `remote_addr`を使用して接続元IPによる制限
    * `json`→`json_doc`→`hash`→`api_key`を使用して、`api_key`JSON本文パラメータによる接続制限

    !!! info "値の長さに対する制限"
        制限の測定に使用するパラメータ値の最大許容長は8000シンボルです。
1. [ルールのコンパイルとフィルタリングノードへのアップロードの完了](rules.md#ruleset-lifecycle)を待ちます。

## ルールの例

<!-- ### APIエンドポイントへのDoS攻撃を防ぐためのIP接続数制限

例えば、UIに1ページあたり200ユーザーのリストを返すセクションがあり、ページを取得するためにUIが`https://example-domain.com/api/users?page=1&size=200`というURLを使用してサーバーにリクエストを送信します。

しかし、攻撃者は`size`パラメータを200,000のような非常に大きな数に変更することで、データベースに過度な負荷をかけ、パフォーマンスの問題を引き起こす可能性があります。これがDoS（サービス拒否攻撃）と呼ばれる攻撃で、APIが応答不能となり、他のクライアントからのリクエストを処理できなくなります。

エンドポイントへの接続を制限することで、このような攻撃を防止できます。各IPがエンドポイントに1分間に1000回以上アクセスしないように制限します。これは、平均して200ユーザーが1分間に5回リクエストするという前提です。ルールでは、この制限が各IPに適用されることを指定しています。`remote_address`[point](request-processing.md)は、リクエスト元のIPアドレスを識別するために使用されます。

![例](../../images/user-guides/rules/rate-limit-for-200-users.png)
-->
### IPごとの接続数制限による高いAPI可用性の確保

たとえば、医療企業のREST APIで、医師が患者情報をPOSTリクエストで`https://example-host.com`ホストの`/patients`エンドポイントに送信できるとします。このエンドポイントのアクセス可能性は極めて重要であり、多数のリクエストで過剰負荷がかからないようにする必要があります。

`/patients`エンドポイントに対して、特定期間内のIPごとの接続数を制限することで、この問題を防止できます。これにより、すべての医師に対してエンドポイントの安定性と可用性が確保され、同時にDoS攻撃による患者情報のセキュリティリスクも軽減されます。

たとえば、各IPアドレスに対して1分間に5件のPOSTリクエストに制限するように設定できます:

![例](../../images/user-guides/rules/rate-limit-by-ip-for-patients.png)

### セッションごとの接続数制限による認証パラメータへのブルートフォース攻撃の防止

ユーザーセッションに対してレート制限を適用すると、不正アクセスを狙い、有効なJWTやその他の認証パラメータを見つけ出すブルートフォース攻撃を制限できます。たとえば、セッションごとに1分間に10件のリクエストのみを許可する場合、攻撃者が異なるトークン値を用いて有効なJWTを発見しようとすると、すぐにレート制限に達し、レート制限期間が終了するまでリクエストが拒否されます。

たとえば、アプリケーションが各ユーザーセッションに一意のIDを割り当て、`X-SESSION-ID`ヘッダーに反映している場合、URL`https://example.com/api/login`のAPIエンドポイントは、AuthorizationヘッダーにBearer JWTを含むPOSTリクエストを受け付けます。このシナリオにおいて、セッションごとの接続数を制限するルールは以下のように表示されます:

![例](../../images/user-guides/rules/rate-limit-for-jwt.png)

`Authorization`値に使用される[regexp](rules.md#condition-type-regex)は``^Bearer\s+([a-zA-Z0-9-_]+[.][a-zA-Z0-9-_]+[.][a-zA-Z0-9-_]+)$`です。

JWT（JSON Web Tokens）を使用してユーザーセッションを管理する場合、ルールを調整してJWTを[decrypt](request-processing.md#jwt)し、そのペイロードからセッションIDを抽出することも可能です:

![例](../../images/user-guides/rules/rate-limit-for-session-in-jwt.png)

<!-- ### User-Agentに基づくレート制限によるAPIエンドポイントへの攻撃の防止

たとえば、旧バージョンのアプリケーションに既知のセキュリティ脆弱性があり、攻撃者がその脆弱なバージョンを用いてAPIエンドポイント`https://example-domain.com/login`に対してブルートフォース攻撃を仕掛ける場合を考えます。通常、`User-Agent`ヘッダーはブラウザやアプリケーションのバージョン情報を渡すために使用されます。旧バージョンのアプリケーションからのブルートフォース攻撃を防止するために、`User-Agent`に基づくレート制限を実装できます。

たとえば、各`User-Agent`に対して1分間に10件のリクエストに制限します。特定の`User-Agent`が均等に1分間で10件を超えるリクエストを送信する場合、その`User-Agent`からの追加リクエストは、新しい期間が始まるまで拒否されます。

![例](../../images/user-guides/rules/rate-limit-by-user-agent.png)

### エンドポイントごとのレート制限によるDoS攻撃の防止

レート制限は、特定のエンドポイントに対して、指定された時間枠内で許容されるリクエスト数に閾値を設定することも可能です。たとえば、1分間に60件のリクエストに制限し、クライアントがこの閾値を超えた場合、追加のリクエストが拒否されます。

これにより、DoS攻撃を防止し、アプリケーションが正当なユーザーに対して常に利用可能な状態を維持できるようにします。また、サーバーの負荷軽減、全体的なパフォーマンスの向上、不正使用や濫用の防止にも役立ちます。

この場合、レート制限ルールはURIごとの接続に適用されます。つまり、Wallarmは自動的に単一エンドポイントをターゲットとする繰り返しのリクエストを識別します。たとえば、`https://example.com`ホストの全エンドポイントに対して、このルールを以下のように適用できます:

* 制限：1分間に60件のリクエスト（1秒あたり1件）
* Burst：突発的なトラフィック急増時に最大20件を許容
* No delay：レート制限遅延なしで20件の過剰リクエストを同時に処理
* Response code：制限およびburstを超えたリクエストを503コードで拒否
* Wallarmは、`uri`[point](request-processing.md)により単一エンドポイントをターゲットとする繰り返しのリクエストを識別します。

    !!! info "クエリパラメータはURIに含まれません"
        このルールは、指定されたドメインの任意のパスに対して、クエリパラメータが含まれない場合のみ適用されます。

![例](../../images/user-guides/rules/rate-limit-by-uri.png)
-->
### 顧客IDごとの接続数制限によるサーバーの過負荷防止

たとえば、オンラインショッピングプラットフォーム向けに顧客注文データへのアクセスを提供するウェブサービスを考えます。顧客IDによるレート制限は、短時間に顧客が過剰な注文を行うことによって、在庫管理や注文処理に過負荷がかかることを防ぐために役立ちます。

たとえば、`https://example-domain.com/orders`に対して、各顧客に1分間に10件のPOSTリクエストの制限を設定するルールは、顧客IDが`data.customer_id`のJSON本文オブジェクトとして[渡される](request-processing.md#json_doc)ことを前提とすると、以下のようになります:

![例](../../images/user-guides/rules/rate-limit-by-customer-id.png)

## 制限事項および特殊な点

レート制限機能には、以下の制限事項および特殊な点があります:

* レート制限ルールは、[Wallarmのすべてのデプロイメント形式](../../installation/supported-deployment-options.md)でサポートされます。ただし、以下は除外されます:

    * EnvoyベースのDockerイメージ
    * OOB Wallarmデプロイメント
    * MuleSoft、Amazon CloudFront、Cloudflare、Broadcom Layer7 API Gateway、Fastlyコネクタ
* 制限の測定に使用するパラメータ値の最大許容長は8000シンボルです。
* 複数のWallarmノードが存在し、各ノードで着信トラフィックがレート制限ルールに達した場合、各ノードは独立して制限されます。
* 複数のレート制限ルールが着信リクエストに適用される場合、最も低いレート制限値を持つルールがリクエストを制限します。
* **In this part of request**ルールセクションに指定されたポイントが着信リクエストに存在しない場合、そのリクエストについてはこのルールは適用されません。
* ウェブサーバーが（たとえば[`ngx_http_limit_req_module`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html)NGINXモジュールを使用して）接続を制限するように構成され、かつWallarmルールも適用されている場合、ウェブサーバーは構成されたルールによりリクエストを拒否しますが、Wallarmは拒否しません。
* Wallarmは、レート制限を超えたリクエストを保存せず、ルールで選択されたコードを返すことでのみ拒否します。ただし、[attack signs](../../about-wallarm/protecting-against-attacks.md)があるリクエストは例外で、拒否されてもWallarmにより記録されます。
```