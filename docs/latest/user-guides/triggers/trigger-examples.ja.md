# トリガーの例

[Wallarmトリガー](triggers.ja.md)の実際の例を学び、この機能を理解し、トリガーを適切に設定するためのリファレンスとしてください。

## 1時間に4つ以上の悪意のあるペイロードが検出された場合、IPをグレーリストに登録

IPアドレスから保護されたリソースに対して4つ以上の異なる悪意のあるペイロードが送信された場合、そのIPアドレスは1時間グレーリストに登録されます。

最近Wallarmのアカウントを作成した場合、この[トリガーは既に作成され、有効化](triggers.ja.md#pre-configured-triggers-default-triggers)されています。このトリガーを編集、無効化、削除、またはコピーしたり、手動で作成したトリガーを編集できます。

![!グレーリスティングトリガー](../../images/user-guides/triggers/trigger-example-graylist.png)

**トリガーのテスト方法:**

1. 以下のリクエストを保護されたリソースに送信します:

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    上記は、[SQLi](../../attacks-vulns-list.ja.md#sql-injection)、[XSS](../../attacks-vulns-list.ja.md#crosssite-scripting-xss)、及び [Path Traversal](../../attacks-vulns-list.ja.md#path-traversal) の4つの悪意のあるペイロードの例です。
1. Wallarm Consoleを開き、**IPリスト** → **グレーリスト**を選択し、リクエストが送信されたIPアドレスが1時間グレーリストに登録されていることを確認します。
1. **イベント**セクションを開き、攻撃がリストに表示されていることを確認します:

    ![!UI内の3つの悪意あるパヨロード](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    攻撃を検索するためにはフィルタを使用できます。例えば、[SQLi](../../attacks-vulns-list.ja.md#sql-injection)攻撃の場合は`sqli`、[XSS](../../attacks-vulns-list.ja.md#crosssite-scripting-xss)攻撃の場合は`xss`、[Path Traversal](../../attacks-vulns-list.ja.md#path-traversal)攻撃の場合は`ptrav`を用います。全てのフィルタについては、[検索使用に関する説明](../../user-guides/search-and-filters/use-search.ja.md)をご覧ください。

トリガーは、ノードのフィルタリングモードに関係なく適用され、IPアドレスをグレーリストに追加します。ただし、ノードは**安全ブロッキング**モード時のみグレーリストを分析します。グレーリスト化されたIPからの悪意のあるリクエストをブロックするには、ノードの[モード](../../admin-en/configure-wallarm-mode.ja.md#available-filtration-modes)を安全ブロッキングに切り替え、その特性を理解してから使用します。

## 1時間に4つ以上の悪意のあるペイロードが検出された場合、IPをブロックリストに登録

IPアドレスから保護されたリソースに対して4つ以上の異なる[悪意のあるペイロード](../../glossary-en.ja.md#malicious-payload)が送信された場合、そのIPアドレスは1時間ブロックリストに登録されます。

![!デフォルトのトリガー](../../images/user-guides/triggers/trigger-example-default.png)

**トリガーのテスト方法：**

1. 以下のリクエストを保護されたリソースに送信:

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    上記は、[SQLi](../../attacks-vulns-list.ja.md#sql-injection)、[XSS](../../attacks-vulns-list.ja.md#crosssite-scripting-xss)、及び [Path Traversal](../../attacks-vulns-list.ja.md#path-traversal) の4つの悪意のあるペイロードの例です。
2. Wallarm Consoleを開き、**IPリスト** → **ブロックリスト**を選択し、リクエストが送信されたIPアドレスが1時間ブロックリストに登録されていることを確認します。
1. **イベント**セクションを開き、攻撃がリストに表示されていることを確認します:

    ![!UI内の3つの悪意あるパヨロード](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    攻撃を検索するためにはフィルタを使用できます。例えば、[SQLi](../../attacks-vulns-list.ja.md#sql-injection)攻撃の場合は`sqli`、[XSS](../../attacks-vulns-list.ja.md#crosssite-scripting-xss)攻撃の場合は`xss`、[Path Traversal](../../attacks-vulns-list.ja.md#path-traversal)攻撃の場合は`ptrav`を用います。全てのフィルタについては、[検索使用に関する説明](../../user-guides/search-and-filters/use-search.ja.md)をご覧ください。

このトリガーによりIPアドレスがブロックリストに登録された場合、フィルタリングノードはそのIPから発信された全ての悪意のあるリクエストと正当なリクエストをブロックします。正当なリクエストを許可するには、[グレーリスティングトリガー](#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)を設定できます。

## 保護されたリソースに対して31回以上のリクエストが送信された場合、リクエストを総力攻撃としてマーク

リクエストを通常の総力攻撃としてマークするためには、**総力攻撃**の条件でトリガーを設定すべきです。

`https://example.com/api/v1/login`に対して30秒間に31回以上のリクエストが送信された場合、これらのリクエストは[総力攻撃](../../attacks-vulns-list.ja.md#bruteforce-attack)としてマークされ、それらのリクエストが始まったIPアドレスがブロックリストに追加されます。

![!カウンター付き総力攻撃トリガー](../../images/user-guides/triggers/trigger-example6.png)

[総力攻撃防御とトリガーテストに関する詳細 →](../../admin-en/configuration-guides/protecting-against-bruteforce.ja.md)

## 404コードが31回以上返されたリクエストを強制ブラウジング攻撃としてマーク

リクエストを強制ブラウジング攻撃としてマークするためには、**強制ブラウジング**の条件でトリガーを設定すべきです。

エンドポイント `https://example.com/**.**` が30秒間に31回以上404応答コードを返した場合、該当するリクエストは[強制ブラウジング攻撃](../../attacks-vulns-list.ja.md#forced-browsing)としてマークされ、これらのリクエストの送信元IPアドレスはブロックされます。

URIの値に適合するエンドポイントの例としては `https://example.com/config.json`、`https://example.com/password.txt`があります。

![!強制ブラウジングトトリガー](../../images/user-guides/triggers/trigger-example5.png)

[総力攻撃防御とトリガーテストに関する詳細 →](../../admin-en/configuration-guides/protecting-against-bruteforce.ja.md)

## リクエストをBOLA攻撃としてマーク

`https://example.com/shops/{shop_id}/financial_info`に対して30秒間に31回以上のリクエストが送信された場合、これらのリクエストは[BOLA攻撃](../../attacks-vulns-list.ja.md#broken-object-level-authorization-bola)としてマークされ、それらのリクエストが始まったIPアドレスがブロックリストに追加されます。

![!BOLAトリガー](../../images/user-guides/triggers/trigger-example7.png)

[BOLAの保護とトリガーテストの設定詳細 →](../../admin-en/configuration-guides/protecting-against-bola.ja.md)

## 弱いJWTの検出

ノード4.4以上によって処理される着信リクエストのかなりの割合が弱いJWTを含む場合、対応する[脆弱性](../vulnerabilities.ja.md)を記録します。

弱いJWTとは、次のようなものです:

* 未暗号化 - 署名アルゴリズムがない（`alg`フィールドが`none`または存在しない）。
* コンプロミスされた秘密キーを使用して署名されている

最近Wallarmのアカウントを作成した場合、この[トリガーは既に作成され、有効化](triggers.ja.md#pre-configured-triggers-default-triggers)されています。このトリガーを編集、無効化、削除、またはコピーしたり、手動で作成したトリガーを編集できます。

![!弱いJWTに対するトリガーの例](../../images/user-guides/triggers/trigger-example-weak-jwt.png)

**トリガーのテスト方法：**

1. [コンプロミスされた秘密キー](https://github.com/wallarm/jwt-secrets)を使用してJWTを生成します。例えば:

    ```
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiQWRtaW5pc3RyYXRvciJ9.p5DrumkF6oTBiUmdtDRT5YHqYL2D7p5YOp6quUrULYg
    ```
1. コンプロミスされたJWTを使用して認証されたリクエストで一定のトラフィックを生成します。
1. ノード4.4以上によって処理される着信リクエストのかなりの割合が弱いJWTを含む場合、Wallarmは脆弱性を登録します。例えば:

    ![!JWT 脆弱性の例](../../images/user-guides/vulnerabilities/weak-auth-vuln.png)## 1分間に2回以上のSQLiヒットが検出された場合のSlack通知

保護されたリソースに2回以上のSQLi[ヒット](../../glossary-en.ja.md#hit)が送信されると、そのイベントについての通知がSlackチャンネルに送信されます。

![!Slackへの通知を送信するトリガーの例](../../images/user-guides/triggers/trigger-example1.png)

**トリガーのテストをするには:**

下記のリクエストを保護されたリソースに送信します:

```bash
curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
curl 'http://localhost/?id=1%27%20select%20version();'
```
その後、Slackチャンネルを開き、ユーザー**wallarm**から以下の通知が届いたことを確認します。

```
[Wallarm] トリガー: 検出されたヒットの数が閾値を超えました

通知タイプ: attacks_exceeded

1分間で検出されたヒット数が1を超えました。
この通知は「SQLiヒットに関する通知」のトリガーにより引き起こされました。

追加のトリガーの条項:
攻撃タイプ: SQLi。

イベントを見る:
https://my.wallarm.com/search?q=attacks&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

クライアント: TestCompany
クラウド: EU
```

* `SQLiヒットに関する通知`はトリガーの名前 
* `TestCompany`はWallarm Console上のあなたの企業アカウントの名前
* `EU`はあなたの企業アカウントが登録されているWallarm Cloud

## 新規ユーザーがアカウントに追加された場合のSlackとメール通知 

Wallarm Console の企業アカウントに**管理者**または**アナリスト** 役割を持つ新規ユーザーが追加されると、このイベントについての通知が統合設定で指定されたメールアドレスとSlackチャンネルに送信されます。

![!Slack およびメールへ通知を送信するトリガーの例](../../images/user-guides/triggers/trigger-example2.png)

**トリガーをテストするには:**

1. Wallarm Consoleを開き、**設定** → **ユーザー**を選択し、新規ユーザーを追加します。例:

    ![!ユーザーの追加](../../images/user-guides/settings/integrations/webhook-examples/adding-user.png)
2. メールの受信トレイを開き、以下のメッセージが届いたことを確認します:

    ![!新規ユーザー追加に関するメール](../../images/user-guides/triggers/test-new-user-email-message.png)
3. Slack チャンネルを開き、ユーザー **wallarm**から以下の通知が届いたことを確認します:

    ```
    [Wallarm] トリガー: 新規ユーザーが企業アカウントに追加されました
    
    通知タイプ: create_user
    
    新規ユーザー John Smith <johnsmith@example.com>がJohn Doe <johndoe@example.com> により、アナリスト 役割で企業アカウントに追加されました。
    この通知は「ユーザー追加」のトリガーにより引き起こされました。

    クライアント: TestCompany
    クラウド: EU
    ```

    * `John Smith`と`johnsmith@example.com`は追加されたユーザーの情報
    * `Analyst`は追加されたユーザーの役割
    * `John Doe`と`johndoe@example.com`は新規ユーザーを追加したユーザーの情報
    * `ユーザー追加`はトリガーの名前
    * `TestCompany`はWallarm Console上のあなたの企業アカウントの名前
    * `EU`はあなたの企業アカウントが登録されているWallarm Cloud

## 1秒以内に2回以上のインシデントが検出された場合のOpsgenie通知

1秒以内にアプリケーションサーバーまたはデータベースで2回以上のインシデントが検出されると、そのイベントについての通知が Opsgenie に送信されます。

![!Splunkへのデータを送信するトリガーの例](../../images/user-guides/triggers/trigger-example3.png)

**トリガーをテストするには**、 保護されるリソースに対してアクティブな脆弱性を利用した攻撃を送信する必要があります。 Wallarm Console → **脆弱性**セクションでは、アプリケーションで検出されたアクティブな脆弱性と、これらの脆弱性を利用した攻撃の例が表示されます。

攻撃の例が保護されたリソースに送信されると、 Wallarmはインシデントを記録します。 記録された2回以上のインシデントが、Opsgenieに次の通知を送信するトリガーを引きます:

```
[Wallarm] トリガー: インシデントの数が閾値を超えました

通知タイプ: incidents_exceeded

検出されたインシデントの数が1秒以内に1を超えました。
この通知は「インシデントに関する通知」のトリガーにより引き起こされました。

追加のトリガーの条項:
対象: サーバー, データベース。

イベントを見る:
https://my.wallarm.com/search?q=incidents&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

クライアント: TestCompany
クラウド: EU
```

* `インシデントに関する通知` はトリガーの名前
* `TestCompany`はWallarm Console上のあなたの企業アカウントの名前
* `EU`はあなたの企業アカウントが登録されているWallarm Cloud

!!! info "アクティブな脆弱性の悪用からのリソースの保護"
    アクティブな脆弱性の悪用からリソースを保護するために、私たちは脆弱性を適時にパッチすることをお勧めします。 アプリケーション側で脆弱性をパッチすることができない場合、この脆弱性を悪用する攻撃をブロックするために、[仮想パッチ](../rules/vpatch-rule.ja.md)を設定してください。

## IPアドレスが拒否リストに追加された場合のWebhook URLへの通知

IPアドレスが拒否リストに追加された場合、そのイベントについてのウェブフックがWebhook URLに送信されます。

![!拒否リストに追加されたIPのトリガーの例](../../images/user-guides/triggers/trigger-example4.png)

**トリガーのテストをするには:**

1. Wallarm Consoleを開き、**IP リスト** → **拒否リスト**を選択し、IP アドレスを拒否リストに追加します。例:

    ![!IPを拒否リストに追加](../../images/user-guides/triggers/test-ip-blocking.png)
2. 以下のウェブフックがWebhook URLに送信されたことを確認します:

    ```
    [
        {
            "summary": "[Wallarm] トリガー: 新しいIPアドレスが拒否リストに追加されました",
            "description": "通知タイプ: ip_blocked\n\nIPアドレス1.1.1.1は 多くの攻撃が発生したため2021-06-10 02:27:15 +0300まで拒否リストに追加されました。 Wallarm Consoleの 「拒否リスト」セクションで拒否されたIPアドレスを確認できます。\nこの通知は「拒否リストに追加されたIPの通知」のトリガーにより引き起こされました。 アプリケーション#8はIPをブロックしました。\n\nクライアント: TestCompany\nクラウド: EU\n",
            "details": {
            "client_name": "TestCompany",
            "cloud": "EU",
            "notification_type": "ip_blocked",
            "trigger_name": "拒否リストに追加されたIPの通知",
            "application": "アプリケーション#8",
            "reason": "多くの攻撃が発生",
            "expire_at": "2021-06-10 02:27:15 +0300",
            "ip": "1.1.1.1"
            }
        }
    ]
    ```

    * `拒否リストに追加されたIPの通知`はトリガーの名前 
    * `TestCompany`はWallarm Console上のあなたの企業アカウントの名前
    * `EU`はあなたの企業アカウントが登録されているWallarm Cloud

## 同じIPからのヒットを1つの攻撃にグループ化する

15分間に同じIPアドレスから50回以上の[ヒット](../../about-wallarm/protecting-against-attacks.ja.md#hit)が検出されると、そのIPからの次のヒットは[イベントリスト](../events/check-attack.ja.md)内で1つの攻撃にグループ化します。

Wallarmアカウントを最近作成した場合は、この[トリガーはすでに作成されており、有効化されています](triggers.ja.md#pre-configured-triggers-default-triggers)。手動で作成したトリガーと同様に、このトリガーを編集、無効化、削除、またはコピーすることができます。

![!ヒットのグルーピングのためのトリガーの例](../../images/user-guides/triggers/trigger-example-group-hits.png)

**トリガーをテストするには**、 以下の方法で51回以上のヒットを送信します:

* 全てのヒットは15分間で送信されます
* ヒット元のIPアドレスはすべて同じ
* ヒットには異なる攻撃タイプや、悪意のあるペイロードを持つパラメータ、またはヒットが送信されるアドレスが含まれています(つまり、基本的な方法によってヒットが[グループ化](../../about-wallarm/protecting-against-attacks.ja.md#attack)されないようにします)
* 攻撃タイプは、ブルートフォース、フォースドブラウジング、リソース上限超過、データボム、仮想パッチとは異なります

例えば:

* 10回のヒットを`example.com`に送る
* 20回のヒットを`test.com`に送る
* 40回のヒットを`example-domain.com`に送る

最初の50回のヒットは個々のヒットとしてイベントリストに表示されます。 次に送信されるすべてのヒットは1つの攻撃にグループ化されます。例えば:

![!同じIPからのヒットが1つの攻撃にグループ化される](../../images/user-guides/events/attack-from-grouped-hits.png)

攻撃に対する [**誤検出としてマーク**(../events/false-attack.ja.md#mark-an-attack-as-a-false-positive) ボタンと、[アクティブ検証](../../about-wallarm/detecting-vulnerabilities.ja.md#active-threat-verification)オプションは利用できません。## APIインベントリの新しいエンドポイント

API内で変更が発生することがあります。これらは[**APIディスカバリ**](../../about-wallarm/api-discovery.ja.md)モジュールによって発見されます。考えられる[変更](../../user-guides/api-discovery.ja.md#tracking-changes-in-api)は以下の通りです：

* 新しいエンドポイントが発見された
* エンドポイントに変更があった（新規または削除されたパラメーター）
* エンドポイントが未使用とマークされた

これらの変更の一部または全部について、メールやメッセンジャーで通知を受け取るためには、**APIの変更**条件を持つトリガーを設定する必要があります。

この例では、`example.com` APIホストの新しいエンドポイントがAPIディスカバリモジュールによって発見された場合、その通知は設定されたSlackチャンネルに送信されます。

![!API triggerの変更](../../images/user-guides/triggers/trigger-example-changes-in-api.png)

**トリガーのテスト方法：**

1. **インテグレーション**で、[Slackとの連携](../../user-guides/settings/integrations/slack.ja.md)を設定します。
1. **トリガー**で、上記のようにトリガーを作成します。
1. `example.com/users` エンドポイントに数回リクエストを送信して、`200` （`OK`）レスポンスを取得します。
1. **APIディスカバリ**セクションで、エンドポイントが**新規**マーク付きで追加されたことを確認します。
1. Slackチャンネルで次のようなメッセージを確認します：
    ```
    [wallarm] APIに新たなエンドポイントが発見されました

    通知タイプ：api_structure_changed

    新しいGET example.com/usersエンドポイントがAPIで発見されました。

        クライアント：Client 001
        クラウド：US

        詳細：

          アプリケーション：Application 1802
          ドメイン：example.com
          エンドポイントのパス：/users
          http_method：GET
          変更タイプ：追加
          リンク：https://my.wallarm.com/api-discovery?instance=1802&method=GET&q=example.com%2Fusers
    ```