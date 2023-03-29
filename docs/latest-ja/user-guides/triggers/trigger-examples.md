					# トリガーの例

[Wallarm のトリガー](triggers.md) の実例を学び、この機能を理解し、適切にトリガーを設定してください。

## 1時間で4つ以上の悪意のあるペイロードが検出された場合、IPをグレーリストに登録

1つのIPアドレスから保護されたリソースに4つ以上の異なる悪意のあるペイロードが送信されると、このIPアドレスは1時間のグレーリストに登録されます。

最近 Wallarm のアカウントを作成した場合、この[トリガーは既に作成され、有効化されています](triggers.md#pre-configured-triggers-default-triggers)。手動で作成したトリガーと同様に、このトリガーを編集、無効化、削除、またはコピーできます。

![!グレーリストへのトリガー](../../images/user-guides/triggers/trigger-example-graylist.png)

**トリガーのテスト方法：**

1. 以下のリクエストを保護されたリソースに送信します。

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    [SQLi](../../attacks-vulns-list.md#sql-injection)、[XSS](../../attacks-vulns-list.md#crosssite-scripting-xss)、および[Path Traversal](../../attacks-vulns-list.md#path-traversal)タイプの4つの悪意のあるペイロードがあります。
1. Wallarm Console → **IPリスト** → **グレーリスト**を開いて、リクエストの発信元となるIPアドレスが1時間のグレーリストに登録されていることを確認してください。
1. **イベント**セクションを開いて、リストに表示されている攻撃を確認します。

    ![!UIでの3つの悪意のあるペイロード](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    攻撃を検索するために、フィルタを使用できます。例えば、[SQLi](../../attacks-vulns-list.md#sql-injection)攻撃の場合は `sqli`、[XSS](../../attacks-vulns-list.md#crosssite-scripting-xss)攻撃の場合は `xss`、[Path Traversal](../../attacks-vulns-list.md#path-traversal)攻撃の場合は `ptrav`。すべてのフィルタは、[検索の使用に関する説明書](../../user-guides/search-and-filters/use-search.md)で説明されています。

トリガーは、任意のノードフィルタリングモードでリリースされ、ノードモードに関係なくIPをグレーリストに登録します。ただし、ノードは **安全なブロック** モードでのみグレーリストを解析します。グレーリストに登録されたIPからの悪意のあるリクエストをブロックするには、まずその機能を学んでから、ノード[モード](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)を安全ブロックに切り替えてください。

## 1時間で4つ以上の悪意のあるペイロードが検出された場合、IPをブラックリストに登録

1つのIPアドレスから保護されたリソースに[4つ以上の異なる悪意のあるペイロード](../../glossary-en.md#malicious-payload)が送信されると、このIPアドレスは1時間のブラックリストに登録されます。

![!デフォルトのトリガー](../../images/user-guides/triggers/trigger-example-default.png)

**トリガーのテスト方法：**

1. 以下のリクエストを保護されたリソースに送信します。

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    [SQLi](../../attacks-vulns-list.md#sql-injection)、[XSS](../../attacks-vulns-list.md#crosssite-scripting-xss)、および[Path Traversal](../../attacks-vulns-list.md#path-traversal)タイプの4つの悪意のあるペイロードがあります。
2. Wallarm Console → **IPリスト** → **ブラックリスト**を開いて、リクエストの発信元となるIPアドレスが1時間のブラックリストに登録されていることを確認してください。
1. **イベント**セクションを開いて、リストに表示されている攻撃を確認します。

    ![!UIでの3つの悪意のあるペイロード](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    攻撃を検索するために、フィルタを使用できます。例えば、[SQLi](../../attacks-vulns-list.md#sql-injection)攻撃の場合は `sqli`、[XSS](../../attacks-vulns-list.md#crosssite-scripting-xss)攻撃の場合は `xss`、[Path Traversal](../../attacks-vulns-list.md#path-traversal)攻撃の場合は `ptrav`。すべてのフィルタは、[検索の使用に関する説明書](../../user-guides/search-and-filters/use-search.md)で説明されています。

このトリガーによってIPアドレスがブラックリストに登録された場合、フィルタリングノードはこのIPからのすべての悪意のあるリクエストと正当なリクエストをブロックします。正当なリクエストを許可するには、[グレーリストトリガー](#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)を設定してください。

## 保護対象リソースに対して31回以上リクエストが送信された場合、ブルートフォース攻撃としてリクエストをマーク

リクエストを通常のブルートフォース攻撃としてマークするには、**ブルートフォース**の条件を持つトリガーを設定する必要があります。

`https://example.com/api/v1/login` に30秒間で31回以上リクエストが送信されると、これらのリクエストは[ブルートフォース攻撃](../../attacks-vulns-list.md#bruteforce-attack)としてマークされ、リクエストの発信元となるIPアドレスがブラックリストに登録されます。

![!カウンター付きブルートフォーストリガー](../../images/user-guides/triggers/trigger-example6.png)

[ブルートフォース保護の設定とトリガーテストの詳細→](../../admin-en/configuration-guides/protecting-against-bruteforce.md)

## 404コードが31回以上のリクエストに対して返された場合、強制ブラウジング攻撃としてリクエストをマーク

リクエストを強制ブラウジング攻撃としてマークするには、**強制ブラウジング**の条件を持つトリガーを設定する必要があります。

エンドポイント `https://example.com/**.*` が30秒間で31回以上の404レスポンスコードを返すと、適切なリクエストは[強制ブラウジング攻撃](../../attacks-vulns-list.md#forced-browsing)としてマークされ、これらのリクエストのソースIPアドレスがブロックされます。

URIの値と一致するエンドポイントの例は、`https://example.com/config.json`、`https://example.com/password.txt` などです。

![!強制ブラウジングトリガー](../../images/user-guides/triggers/trigger-example5.png)

[ブルートフォース保護の設定とトリガーテストの詳細→](../../admin-en/configuration-guides/protecting-against-bruteforce.md)

## BOLA攻撃としてリクエストをマーク

`https://example.com/shops/{shop_id}/financial_info` に30秒間で31回以上のリクエストが送信されると、これらのリクエストは [BOLA攻撃](../../attacks-vulns-list.md#broken-object-level-authorization-bola)としてマークされ、リクエストの発信元となるIPアドレスがブラックリストに登録されます。

![!BOLAトリガー](../../images/user-guides/triggers/trigger-example7.png)

[BOLA保護の設定とトリガーテストの詳細→](../../admin-en/configuration-guides/protecting-against-bola.md)

## 弱い JWT を検出

ノード4.4によって処理される大量の受信リクエストに弱い JWT が含まれている場合は、対応する[脆弱性](../vulnerabilities/check-vuln.md)を記録します。

弱い JWT とは、次の条件に該当するものです。

* 暗号化されていない - 署名アルゴリズムがない（`alg` フィールドが `none` または欠落している）。
* 侵害された秘密鍵を使用して署名されている

最近 Wallarm のアカウントを作成した場合、この[トリガーは既に作成され、有効化されています](triggers.md#pre-configured-triggers-default-triggers)。手動で作成したトリガーと同様に、このトリガーを編集、無効化、削除、またはコピーできます。

![!JWTを弱いと判断するトリガーの例](../../images/user-guides/triggers/trigger-example-weak-jwt.png)

**トリガーのテスト方法：**

1. [侵害された秘密鍵](https://github.com/wallarm/jwt-secrets)を使用して署名された JWT を生成します。例：

    ```
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiQWRtaW5pc3RyYXRvciJ9.p5DrumkF6oTBiUmdtDRT5YHqYL2D7p5YOp6quUrULYg
    ```
1. 侵害されたJWTを使用して認証されたリクエストのトラフィックを生成します。
1. ノード4.4によって処理される受信リクエストの大部分に弱いJWTが含まれている場合、Wallarm は脆弱性を登録します。例：

    ![!JWT脆弱性の例](../../images/user-guides/vulnerabilities/weak-auth-vuln.png)## 1分以内に2回以上のSQLiヒットが検出された場合のSlack通知

2回以上のSQLi[ヒット](../../glossary-en.md#hit)が保護されたリソースに送信される場合、このイベントに関する通知がSlackチャンネルに送信されます。

![!Slackに通知を送信するトリガーの例](../../images/user-guides/triggers/trigger-example1.png)

**トリガーをテストするには：**

以下のリクエストを保護されたリソースに送信します。

```bash
curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
curl 'http://localhost/?id=1%27%20select%20version();'
```
Slackチャンネルを開いて、**wallarm**からの次の通知を確認してください：

```
[Wallarm] トリガー：検出されたヒット数が閾値を超えました

通知タイプ：attacks_exceeded

1分間に検出されたヒット数が1を超えました。
この通知は、「SQLiヒットに関する通知」トリガーによって引き起こされました。

追加のトリガーの条件：
攻撃タイプ：SQLi。

イベントの表示：
https://my.wallarm.com/search?q=attacks&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

クライアント：TestCompany
クラウド：EU
```

* `SQLiヒットに関する通知` は、トリガー名です
* `TestCompany` は、Wallarm Consoleのあなたの会社アカウントの名前です
* `EU` は、あなたの会社アカウントが登録されているWallarmクラウドです

## 新しいユーザーがアカウントに追加された場合のSlackとメール通知

Wallarm Consoleで**管理者**または**アナリスト**役割の新しいユーザーが会社のアカウントに追加される場合、このイベントに関する通知が統合のメールアドレスとSlackチャンネルに送信されます。

![!Slackおよび電子メールで通知を送信するトリガーの例](../../images/user-guides/triggers/trigger-example2.png)

**トリガーをテストするには：**

1. Wallarm Consoleを開いて → **設定** → **ユーザー** で新しいユーザーを追加します。例：

    ![!追加されたユーザー](../../images/user-guides/settings/integrations/webhook-examples/adding-user.png)
２．メールの受信箱を開いて、次のメッセージが届いたことを確認します：

    ![!新しいユーザーが追加されたことに関するメール](../../images/user-guides/triggers/test-new-user-email-message.png)
３．Slackチャンネルを開いて、**wallarm**からの次の通知が届いたことを確認してください：

    ```
    [Wallarm] トリガー：新しいユーザーが会社アカウントに追加されました
    
    通知タイプ：create_user

    新しいユーザーJohn Smith <johnsmith@example.com>が、John Doe <johndoe@example.com>によって会社アカウントに追加されました。追加されたユーザーの役割はアナリストです。
    この通知は、「ユーザー追加」トリガーによって引き起こされました。

    クライアント：TestCompany
    クラウド：EU
    ```

    * `John Smith` と `johnsmith@example.com` は、追加されたユーザーに関する情報です
    * `アナリスト` は、追加されたユーザーの役割です
    * `John Doe` と `johndoe@example.com` は、新しいユーザーを追加したユーザーに関する情報です
    * `ユーザー追加` は、トリガー名です
    * `TestCompany` は、Wallarm Consoleのあなたの会社アカウントの名前です
    * `EU` は、あなたの会社アカウントが登録されているWallarmクラウドです

## １秒以内に２回以上のインシデントが検出された場合のOpsgenie通知

1秒以内にアプリケーションサーバーまたはデータベースのインシデントが2回以上検出された場合、このイベントに関する通知がOpsgenieに送信されます。

![!Splunkにデータを送信するトリガーの例](../../images/user-guides/triggers/trigger-example3.png)

**トリガーをテストするには**、保護されたリソースにアクティブな脆弱性を悪用する攻撃を送信する必要があります。Wallarm Console → **脆弱性**セクションでは、アプリケーションで検出されたアクティブな脆弱性と、これらの脆弱性を悪用する攻撃の例が表示されます。

攻撃例が保護対象のリソースに送信されると、Wallarmはインシデントを記録します。 2回以上の記録されたインシデントが、次の通知をOpsgenieに送信するトリガーになります：

```
[Wallarm] トリガー：インシデント数が閾値を超えました

通知タイプ：incidents_exceeded

検出されたインシデント数が1を超えました。
この通知は、「インシデントに関する通知」トリガーによって引き起こされました。

追加のトリガーの条件：
ターゲット：サーバー、データベース。

イベントの表示：
https://my.wallarm.com/search?q=incidents&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

クライアント：TestCompany
クラウド：EU
```

* `インシデントに関する通知` は、トリガー名です
* `TestCompany` は、Wallarm Consoleのあなたの会社アカウントの名前です
* `EU` は、あなたの会社アカウントが登録されているWallarmクラウドです

!!! info "アクティブな脆弱性の悪用からリソースを保護する"
    リソースをアクティブな脆弱性の悪用から保護するために、タイムリーに脆弱性を修正することをお勧めします。アプリケーション側で脆弱性を修正できない場合は、この脆弱性を悪用する攻撃をブロックするために[仮想パッチ](../rules/vpatch-rule.md)を設定してください。

## IPアドレスがdenylistに追加された場合のWebhook URLへの通知

IPアドレスがdenylistに追加された場合、このイベントに関するウェブフックがWebhook URLに送信されます。

![!denylistに登録されたIP用のトリガーの例](../../images/user-guides/triggers/trigger-example4.png)

**トリガーをテストするには：**

1. Wallarm Consoleを開いて → **IPリスト** → **Denylist** でIPアドレスをdenylistに追加します。例：

    ![!IPをdenylistに追加する](../../images/user-guides/triggers/test-ip-blocking.png)
2. 次のウェブフックがWebhook URLに送信されたことを確認します：

    ```
    [
        {
            "summary": "[Wallarm] トリガー：新しいIPアドレスがdenylistに追加されました",
            "description": "通知タイプ：ip_blocked\n\nIPアドレス1.1.1.1が2021-06-10 02:27:15 +0300までdenylistに登録されました。理由は多数の攻撃を発生させるためです。Wallarm Consoleの「Denylist」セクションで、ブロックされたIPアドレスを確認することができます。\nこの通知は、「denylisted IPに関する通知」トリガーによって引き起こされました。アプリケーション8番に対してIPがブロックされました。\n\nクライアント：TestCompany\nクラウド：EU\n",
            "details": {
            "client_name": "TestCompany",
            "cloud": "EU",
            "notification_type": "ip_blocked",
            "trigger_name": "denylisted IPに関する通知",
            "application": "Application #8",
            "reason": "多数の攻撃を発生させる",
            "expire_at": "2021-06-10 02:27:15 +0300",
            "ip": "1.1.1.1"
            }
        }
    ]
    ```

    * `denylisted IPに関する通知` は、トリガー名です
    * `TestCompany` は、Wallarm Consoleのあなたの会社アカウントの名前です
    * `EU` は、あなたの会社アカウントが登録されているWallarmクラウドです同じIPからのグループ化されたヒットを1つの攻撃にまとめる

15分間で同じIPアドレスから50回以上の[ヒット](../../about-wallarm/protecting-against-attacks.md#hit)が検出された場合、同じIPからの次のヒットは[イベントリスト](../events/check-attack.md)で1つの攻撃にグループ化されます。

Wallarmアカウントを最近作成した場合、この[トリガーは既に作成および有効化されています](triggers.md#pre-configured-triggers-default-triggers)。手動で作成されたトリガーと同様に、このトリガーを編集、無効化、削除、またはコピーすることができます。

![!ヒットのグループ化のためのトリガー例](../../images/user-guides/triggers/trigger-example-group-hits.png)

**トリガーをテストするには**、以下のように51回以上のヒットを送信します。

* すべてのヒットが15分間で送信される
* ヒットの送信元のIPアドレスが同じである
* 攻撃タイプや悪意のあるペイロード、ヒットが送信されるアドレスが異なるヒットが含まれる（基本的な方法によってヒットが[グループ化](../../about-wallarm/protecting-against-attacks.md#attack)されないようにするため）
* 攻撃タイプは、Brute force、Forced browsing、Resource overlimit、Data bomb、Virtual patchとは異なる

例：

* `example.com`への10回のヒット
* `test.com`への20回のヒット
* `example-domain.com`への40回のヒット

最初の50回のヒットは、イベントリストに個々のヒットとして表示されます。それ以降のヒットはすべて1つの攻撃にグループ化されます。例えば：

![!IPでグループ化されたヒットを1つの攻撃として表示](../../images/user-guides/events/attack-from-grouped-hits.png)

[**偽陽性としてマークする**](../events/false-attack.md#mark-an-attack-as-a-false-positive)ボタンと[アクティブな検証](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)オプションは、攻撃に対して使用できなくなります。

あなたのAPIインベントリの新しいエンドポイント

APIに変更が発生することがあります。それらは [**API Discovery**](../../about-wallarm/api-discovery.md) モジュールによって検出されます。[変更](../../user-guides/api-discovery.md#tracking-changes-in-api)の例は以下の通りです。

* 新しいエンドポイントが検出される
* エンドポイントに変更がある（新しいパラメータまたは削除されたパラメータ）
* エンドポイントが削除される

これらの変更の一部またはすべてについて、メールやメッセンジャーに通知を受け取りたい場合は、**APIの変更**条件が設定されたトリガーを構成する必要があります。

この例では、`example.com`のAPIホストの新しいエンドポイントがAPI Discoveryモジュールによって検出された場合、通知が設定されたSlackチャンネルに送信されます。

![!APIの変更を伴うトリガー](../../images/user-guides/triggers/trigger-example-changes-in-api.png)

**トリガーをテストする方法：**

1. **インテグレーション**で、[Slackとの連携を設定します](../../user-guides/settings/integrations/slack.md)。
2. **トリガー**で、上記のようにトリガーを作成します。
3. `example.com/users` エンドポイントにいくつかのリクエストを送信して、`200`（`OK`）の応答を取得します。
4. **API Discovery**セクションで、エンドポイントが**新しい**マークで追加されたかを確認します。
5. Slackチャンネルで以下のようなメッセージを確認します。
    ```
    [wallarm] あなたのAPIで新しいエンドポイントが発見されました

    通知タイプ：api_structure_changed

    あなたのAPIで新しいGET example.com/usersエンドポイントが発見されました。

        クライアント：Client 001
        クラウド：US

        詳細：

          アプリケーション：Application 1802
          ドメイン：example.com
          エンドポイントパス：/users
          HTTPメソッド：GET
          変更タイプ：追加
          リンク：https://my.wallarm.com/api-discovery?instance=1802&method=GET&q=example.com%2Fusers
    ```
