# Opsgenie

[Opsgenie](https://www.atlassian.com/software/opsgenie) はAtlassianによるインシデント管理およびアラートツールです。Wallarmを設定してOpsgenieへアラートを送信できます。

## 統合の設定

[Opsgenie UI](https://app.opsgenie.com/teams/list) にて:

1. ご自身のチームに移動し➝ **Integrations**を選択します。
2. **Add integration**ボタンをクリックし、**API**を選択します。
3. 新しい統合の名前を入力し、**Save Integration**をクリックします。
4. 表示されたAPIキーをコピーします。

Wallarm UIで:

1. **Integrations**セクションを開きます。
1. **Opsgenie**ブロックをクリックするか、**Add integration**ボタンをクリックし、**Opsgenie**を選択します。
1. 統合の名前を入力します。
1. コピーしたAPIキーを**API key**フィールドに貼り付けます。
1. Opsgenieの[EU instance](https://docs.opsgenie.com/docs/european-service-region)を利用している場合は、リストから適切なOpsgenie APIエンドポイントを選択します。既定ではUS instanceエンドポイントが設定されています。
1. 通知をトリガーするイベントタイプを選びます。

    ![Opsgenie integration](../../../images/user-guides/settings/integrations/add-opsgenie-integration.png)

    利用可能なイベントの詳細:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. **Test integration**をクリックして、設定の正確性、Wallarm Cloudの利用可能性および通知フォーマットを確認します。

    これにより、プレフィックス`[Test message]`付きのテスト通知が送信されます:

    ![Test Opsgenie message](../../../images/user-guides/settings/integrations/test-opsgenie-new-vuln.png)

1. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## 追加アラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

### 例: 1秒間に2件以上のインシデントが検出された場合のOpsgenie通知

1秒間にアプリケーションサーバまたはデータベースにおいて2件以上のインシデントが検出された場合、このイベントに関する通知がOpsgenieへ送信されます。

![Splunkにデータを送信するトリガーの例](../../../images/user-guides/triggers/trigger-example3.png)

**トリガーをテストするには**、保護対象リソースへ実際の脆弱性を悪用する攻撃を送信する必要があります。Wallarm Consoleの→ **Vulnerabilities**セクションには、アプリケーションで検出された実際の脆弱性と、それらの脆弱性を悪用する攻撃の例が表示されます。

攻撃例が保護対象リソースへ送信されると、Wallarmはインシデントを記録します。2件以上の記録されたインシデントが以下の通知のOpsgenieへの送信をトリガします:

```
[Wallarm] トリガー: インシデントの件数が閾値を超えました

通知タイプ: incidents_exceeded

1秒間に検出されたインシデントの件数が1を超えました.
この通知は「Notification about incidents」トリガーによって起動されました.

追加のトリガー条件:
Target: server, database.

イベントを表示:
https://my.wallarm.com/attacks?q=incidents&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

クライアント: TestCompany
Cloud: EU
```

* `Notification about incidents` はトリガー名です
* `TestCompany` はWallarm Consoleの企業アカウント名です
* `EU` は企業アカウントが登録されているWallarm Cloudです

!!! info "実際の脆弱性悪用からリソースを保護"
    保護対象リソースを実際の脆弱性悪用から守るため、脆弱性を速やかにパッチすることを推奨します。もしアプリケーション側で脆弱性をパッチできない場合は、この脆弱性を悪用する攻撃をブロックするために[virtual patch](../../rules/vpatch-rule.md)を設定してください。

## 統合の無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および不正な統合パラメーター

--8<-- "../include/integrations/integration-not-working.md"