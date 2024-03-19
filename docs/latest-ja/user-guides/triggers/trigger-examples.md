# トリガーの例

[Wallarmのトリガー](triggers.md)の実際の例を理解し、トリガーを適切に設定するための情報を学びましょう。

## 1時間に悪意のあるペイロードが4つ以上検出されたらIPをグレーリストに登録

保護対象のリソースに1つのIPアドレスから4つ以上の異なる悪意のあるペイロードが送信された場合、そのIPアドレスは1時間グレーリストに登録されます。

もし最近Wallarmのアカウントを作成したならば、この[トリガーはすでに作成されており有効化されています](triggers.md#pre-configured-triggers-default-triggers)。このトリガーは編集、無効化、削除、コピー、手動作成されたトリガーを含めて編集可能です。

![Graylisting trigger](../../images/user-guides/triggers/trigger-example-graylist.png)

**トリガーのテスト:**

1. 以下のリクエストを保護対象リソースに送信します：

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    これらは[SQLi](../../attacks-vulns-list.md#sql-injection)型、[XSS](../../attacks-vulns-list.md#crosssite-scripting-xss)型、および[Path Traversal](../../attacks-vulns-list.md#path-traversal)型という4つの悪意のあるペイロードです。
1. Wallarm Console → **IP list** → **Graylist**を開き、リクエスト元のIPアドレスが1時間グレーリストに登録されていることを確認します。
1. **Events** セクションを開き、攻撃がリストに表示されていることを確認します：

    ![Three malicious payloads in UI](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    攻撃を検索するために、例えば: [SQLi](../../attacks-vulns-list.md#sql-injection)に対して`sqli`、[XSS](../../attacks-vulns-list.md#crosssite-scripting-xss)に対して`xss`、[Path Traversal](../../attacks-vulns-list.md#path-traversal)に対して`ptrav`といったフィルターを使用することができます。すべてのフィルターは[検索の使用に関する指示書](../../user-guides/search-and-filters/use-search.md)で詳しく説明されています。

トリガーは任意のノードフィルタモードでリリースされるため、ノードモードに関係なくIPをグレーリストに登録します。だけど、ノードは**安全ブロック**モードでのみグレーリストを分析します。グレーリストのIPからの悪意のあるリクエストをブロックするためには、ノード[モード](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)を安全ブロッキングに切り替え、その特徴を理解しておかなければなりません。

## 1時間に4つ以上の悪意のあるペイロードが検出された場合は、IPをブロックリストに追加

1つのIPアドレスから保護対象のリソースに対して4つ以上の異なる[悪意のあるペイロード](../../glossary-en.md#malicious-payload)が送信された場合、そのIPアドレスは1時間ブロックリストに登録されます。

![Default trigger](../../images/user-guides/triggers/trigger-example-default.png)

**トリガーのテスト:**

1. 以下のリクエストを保護対象リソースに送信します：

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    これらは[SQLi](../../attacks-vulns-list.md#sql-injection)型、[XSS](../../attacks-vulns-list.md#crosssite-scripting-xss)型、および[Path Traversal](../../attacks-vulns-list.md#path-traversal)型という4つの悪意のあるペイロードです。
2. Wallarm Console → **IP lists** → **Denylist**を開き、リクエスト元のIPアドレスが1時間ブロックリストに登録されていることを確認します。
3. **Events** セクションを開き、攻撃がリストに表示されていることを確認します：

    ![Three malicious payloads in UI](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    攻撃を検索するために、例えば: [SQLi](../../attacks-vulns-list.md#sql-injection)に対して`sqli`、[XSS](../../attacks-vulns-list.md#crosssite-scripting-xss)に対して`xss`、[Path Traversal](../../attacks-vulns-list.md#path-traversal)に対して`ptrav`といったフィルターを使用します。すべてのフィルターは[検索の使用に関する指示書](../../user-guides/search-and-filters/use-search.md)で詳しく説明されています。

このトリガーによってIPアドレスがブロックリストに登録されると、フィルタリングノードはこのIPからのすべての悪質、および正当なリクエストをブロックします。正当なリクエストを許可するためには、[グレーリストトリガー](#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)を設定できます。

## 31回以上のリクエストが保護対象のリソースに送られた場合、リクエストをブルートフォース攻撃とマーキング

リクエストを通常のブルートフォース攻撃としてマークするためには、**Brute force**の条件を持ったトリガーを設定する必要があります。

`https://example.com/api/v1/login`に31回以上のリクエストが30秒で送信されると、これらのリクエストは[ブルートフォース攻撃](../../attacks-vulns-list.md#bruteforce-attack)としてマークされ、リクエスト元のIPアドレスはブロックリストに追加されます。

![Brute force trigger with counter](../../images/user-guides/triggers/trigger-example6.png)

[ブルートフォース防御とトリガーテストの設定詳細 →](../../admin-en/configuration-guides/protecting-against-bruteforce.md)

## 404コードが31回以上のリクエストに返された場合、リクエストを強制ブラウジング攻撃とマーキング

リクエストを強制ブラウジング攻撃とマークするためには、**Forced browsing**の条件を持ったトリガーを設定する必要があります。

エンドポイント`https://example.com/**.**`が30秒で31回以上404応答コードを返すと、該当のリクエストは[強制ブラウジング攻撃](../../attacks-vulns-list.md#forced-browsing)とマーキングされ、これらのリクエストのソースIPアドレスはブロックされます。

URIの値に一致するエンドポイント例：`https://example.com/config.json`、 `https://example.com/password.txt`。

![Forced browsing trigger](../../images/user-guides/triggers/trigger-example5.png)

[ブルートフォース防御とトリガーテストの設定詳細 →](../../admin-en/configuration-guides/protecting-against-bruteforce.md)

## リクエストをBOLA攻撃としてマーク

もし`https://example.com/shops/{shop_id}/financial_info`に対して31回以上のリクエストが30秒で送信されると、これらのリクエストは[BOLA攻撃](../../attacks-vulns-list.md#broken-object-level-authorization-bola)としてマークされ、リクエスト元のIPアドレスはブロックリストに追加されます。

![BOLA trigger](../../images/user-guides/triggers/trigger-example7.png)

[BOLA保護とトリガーテストの設定詳細 →](../../admin-en/configuration-guides/protecting-against-bola.md)

## 弱いJWTの検出

ノード4.4以上によって処理される大量の入力リクエストに弱いJWTが含まれている場合、対応する[脆弱性](../vulnerabilities.md)を記録します。

弱いJWTとは以下のようなものです：

* 暗号化されていない – 署名アルゴリズムがありません（`alg`フィールドが`none`または欠落しています）。
* 破られた秘密鍵を使用して署名されている

もし最近Wallarmのアカウントを作成したならば、この[トリガーはすでに作成されており有効化されています](triggers.md#pre-configured-triggers-default-triggers)。このトリガーは編集、無効化、削除、コピー、手動作成されたトリガーを含めて編集可能です。

![Example for trigger on weak JWTs](../../images/user-guides/triggers/trigger-example-weak-jwt.png)

**トリガーをテストするには：**

1. [彼らが破られた秘密鍵](https://github.com/wallarm/jwt-secrets)を使用して署名したJWTを生成します。例えば：

    ```bash
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiQWRtaW5pc3RyYXRvciJ9.p5DrumkF6oTBiUmdtDRT5YHqYL2D7p5YOp6quUrULYg
    ```
2. 危険なJWTを使用して認証されるリクエストによるいくらかのトラフィックの生成。
3. ノード4.4以上に送信される大量のリクエストに弱いJWTが含まれている場合、Wallarmは脆弱性を登録します。例：

    ![JWT vuln example](../../images/user-guides/vulnerabilities/weak-auth-vuln.png)

## 1分間で2回以上のSQLiヒットが検出された場合、Slackへの通知

保護対象のリソースに対して2回以上のSQLi[ヒット](../../glossary-en.md#hit)が送信された場合、そのイベントについての通知はSlackチャンネルに送信されます。

![Example of a trigger sending the notification to Slack](../../images/user-guides/triggers/trigger-example1.png)

**トリガーのテスト：**

保護対象のリソースに以下のリクエストを送信します：

```bash
curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
curl 'http://localhost/?id=1%27%20select%20version();'
```
Slackチャンネルを開き、ユーザー**wallarm**から次の通知が受信されたことを確認します：

```
[Wallarm] Trigger: The number of detected hits exceeded the threshold

Notification type: attacks_exceeded

The number of detected hits exceeded 1 in 1 minute.
This notification was triggered by the "Notification about SQLi hits" trigger.

Additional trigger’s clauses:
Attack type: SQLi.

View events:
https://my.wallarm.com/search?q=attacks&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

Client: TestCompany
Cloud: EU
```

* `Notification about SQLi hits`はトリガーの名前です
* `TestCompany`はWallarm Console内のあなたの会社アカウントの名前です
* `EU`はあなたの会社アカウントが登録されているWallarm Cloudです

## 新しいユーザーがアカウントに追加された場合のSlackとメール通知

新しい**管理者**もしくは**アナリスト**の役割を持つユーザーがWallarm Consoleの会社アカウントに追加されると、このイベントについての通知は統合に指定されたメールアドレスとSlackチャンネルに送信されます。

![Example of a trigger sending the notification to Slack and by email](../../images/user-guides/triggers/trigger-example2.png)

**トリガーのテスト：**
 
1. Wallarm Console → **Settings** → **Users**を開き、新しいユーザーを追加します。例：

    ![Added user](../../images/user-guides/settings/integrations/webhook-examples/adding-user.png)
2. 受信したメールを開き、次のメッセージが届いたことを確認します：

    ![Email about new user added](../../images/user-guides/triggers/test-new-user-email-message.png)
3. Slackチャンネルを開き、ユーザー**wallarm**から次の通知が受信されたことを確認します：

    ```
    [Wallarm] Trigger: New user was added to the company account
    
    Notification type: create_user
    
    A new user John Smith <johnsmith@example.com> with the role Analyst was added to the company account by John Doe <johndoe@example.com>.
    This notification was triggered by the "Added user" trigger.

    Client: TestCompany
    Cloud: EU
    ```

    * `John Smith`と`johnsmith@example.com`は追加されたユーザーに関する情報です
    * `Analyst`は追加されたユーザーの役割です
    * `John Doe`と`johndoe@example.com`は新しいユーザーを追加したユーザーに関する情報です
    * `Added user`はトリガーの名前です
    * `TestCompany`はWallarm Console内のあなたの会社アカウントの名前です
    * `EU`はあなたの会社アカウントが登録されているWallarm Cloudです

## 1秒以内に2回以上のインシデントが検出された場合は、Opsgenieへの通知

1つの秒内にアプリケーションサーバやデータベースに2回以上のインシデントが検出されると、このイベントについての通知はOpsgenieに送信されます。

![Example of a trigger sending the data to Splunk](../../images/user-guides/triggers/trigger-example3.png)

**トリガーのテスト**には、保護対象のリソースへアクティブな脆弱性を悪用する攻撃を送信する必要があります。Wallarm Console → **Vulnerabilities**セクションでは、アプリケーションで検出された活動的な脆弱性とそれらの脆弱性を悪用する攻撃の例が表示されます。

攻撃の例が保護対象のリソースに送信された場合、Wallarmはインシデントを記録します。2回またはそれ以上の記録されたインシデントは、Opsgenieに次の通知の送信をトリガーします：

```
[Wallarm] Trigger: The number of incidents exceeded the threshold

Notification type: incidents_exceeded

The number of detected incidents exceeded 1 in 1 second.
This notification was triggered by the "Notification about incidents" trigger.

Additional trigger’s clauses:
Target: server, database.

View events:
https://my.wallarm.com/search?q=incidents&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

Client: TestCompany
Cloud: EU
```
* `Notification about incidents`はトリガーの名前です
* `TestCompany`はWallarm Console内のあなたの会社アカウントの名前です
* `EU`はあなたの会社アカウントが登録されているWallarm Cloudです

!!! info "アクティブな脆弱性の悪用からリソースを保護する"
    リソースをアクティブな脆弱性の悪用から保護するために、タイムリーに脆弱性をパッチすることをお勧めします。脆弱性をアプリケーション側でパッチすることができない場合は、この脆弱性を悪用する攻撃をブロックするために[仮想パッチ](../rules/vpatch-rule.md)を設定してください。

## IPアドレスがブロックリストに追加された場合は、Webhook URLへの通知

IPアドレスがブロックリストに追加された場合、そのイベントについてのwebhookはWebhook URLに送信されます。

![Example of trigger for denylisted IP](../../images/user-guides/triggers/trigger-example4.png)

**トリガーのテスト：**

1. Wallarm Console → **IP lists** → **Denylist**を開いて、IPアドレスをブロックリストに追加します。例：

    ![Adding IP to the denylist](../../images/user-guides/triggers/test-ip-blocking.png)
2. 以下のwebhookがWebhook URLに送信されたことを確認します：

    ```
    [
        {
            "summary": "[Wallarm] Trigger: New IP address was denylisted",
            "description": "Notification type: ip_blocked\n\nIP address 1.1.1.1 was denylisted until 2021-06-10 02:27:15 +0300 for the reason Produces many attacks. You can review blocked IP addresses in the \"Denylist\" section of Wallarm Console.\nThis notification was triggered by the \"Notification about denylisted IP\" trigger. The IP is blocked for the application Application #8.\n\nClient: TestCompany\nCloud: EU\n",
            "details": {
            "client_name": "TestCompany",
            "cloud": "EU",
            "notification_type": "ip_blocked",
            "trigger_name": "Notification about denylisted IP",
            "application": "Application #8",
            "reason": "Produces many attacks",
            "expire_at": "2021-06-10 02:27:15 +0300",
            "ip": "1.1.1.1"
            }
        }
    ]
    ```

    * `Notification about denylisted IP`はトリガーの名前です
    * `TestCompany`はWallarm Console内のあなたの会社アカウントの名前です
    * `EU`はあなたの会社アカウントが登録されているWallarm Cloudです

## 同じIPからのヒットを1つの攻撃にする

同じIPアドレスから15分以内に50以上の[ヒット](../../about-wallarm/protecting-against-attacks.md#hit)が検出された場合、そのIPからの次のヒットは[event list](../events/check-attack.md)の中で1つの攻撃にグループ化されます。

もし最近Wallarmのアカウントを作成したならば、この[トリガーはすでに作成されており有効化されています](triggers.md#pre-configured-triggers-default-triggers)。このトリガーは編集、無効化、削除、コピー、手動作成されたトリガーを含めて編集可能です。

![Example of a trigger for hit grouping](../../images/user-guides/triggers/trigger-example-group-hits.png)

**トリガーのテスト**には、例えば以下のように51以上のヒットを送信します：

* すべてのヒットが15分で送信されます
* ヒット元のIPアドレスがすべて同じです
* ヒットが異なる攻撃型、または悪質なペイロードを持つパラメータ、またはリソースへ送信されたアドレスを持っている（すなわち、ヒットが基本的な方法で攻撃に[グループ化](../../about-wallarm/protecting-against-attacks.md#attack)されない）ので、
* 攻撃型は「Brute force」、「Forced browsing」、「Resource overlimit」、「Data bomb」、「Virtual patch」とは異なります

例：

* `example.com`に対する10回のヒット
* `test.com`に対する20回のヒット
* `example-domain.com`に対する40回のヒット

最初の50回のヒットはイベントリストに個別のヒットとして表示されます。その後のすべてのヒットは1つの攻撃にグループ化されます。例：

![Hits grouped by IP into one attack](../../images/user-guides/events/attack-from-grouped-hits.png)

攻撃に対しては[**False positiveとしてマーク**](../events/false-attack.md#mark-an-attack-as-a-false-positive)ボタンと[active verification](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)オプションは利用できません。

## APIのインベントリーに新しいエンドポイント

あなたのAPIでは変更が発生するかもしれません。それらは[**API Discovery**](../../api-discovery/overview.md)モジュールによって発見されます。可能な[変更](../../api-discovery/exploring.md#tracking-changes-in-api)は以下の通りです：

* 新しいエンドポイントが発見される
* エンドポイントに変更がある（新しいもしくは削除されたパラメータ）
* エンドポイントが未使用とマーキングされる

これらの変更の一部またはすべてについてメールやメッセンジャーに通知を受け取るためには、**APIの変更**条件を持つトリガーを設定する必要があります。

この例では、API Discoveryモジュールによって`example.com`APIホストの新しいエンドポイントが発見された場合、その通知が設定したSlackチャンネルに送信されます。

![Changes in API trigger](../../images/user-guides/triggers/trigger-example-changes-in-api.png)

**トリガーをテストするには：**

1. **Integrations**で、[Slackとの統合](../../user-guides/settings/integrations/slack.md)を設定します。
2. **Triggers**で、上記のようなトリガーを作成します。
3. `200` (`OK`)レスポンスを得るために`example.com/users`エンドポイントに対していくつかのリクエストを送信します。
4. **API Discovery** セクションで、新しいエンドポイントが **New** マークで追加されていることを確認します。
5. Slackチャンネルで、以下のようなメッセージが表示されていることを確認します：
    ```
    [wallarm] A new endpoint has been discovered in your API

    Notification type: api_structure_changed

    The new GET example.com/users endpoint has been discovered in your API.

        Client: Client 001
        Cloud: US

        Details:

          application: Application 1802
          domain: example.com
          endpoint_path: /users
          http_method: GET
          change_type: added
          link: https://my.wallarm.com/api-discovery?instance=1802&method=GET&q=example.com%2Fusers
    ```