# Opsgenie

[Opsgenie](https://www.atlassian.com/software/opsgenie)はAtlassianによるインシデント管理およびアラートツールです。Wallarmを設定してOpsgenieにアラートを送信できます。

## インテグレーションの設定

[Opsgenie UI](https://app.opsgenie.com/teams/list):

1. 自分のチーム ➝ **Integrations**に移動します。
2. **Add integration**ボタンをクリックし、**API**を選択します。
3. 新しいインテグレーションの名前を入力し、**Save Integration**をクリックします。
4. 提供されたAPI keyをコピーします。

Wallarm UI:

1. **Integrations**セクションを開きます。
1. **Opsgenie**ブロックをクリックするか、**Add integration**ボタンをクリックして**Opsgenie**を選択します。
1. インテグレーション名を入力します。
1. コピーしたAPI keyを**API key**フィールドに貼り付けます。
1. Opsgenieの[EUインスタンス](https://docs.opsgenie.com/docs/european-service-region)を使用している場合は、リストから適切なOpsgenieのAPIエンドポイントを選択します。既定ではUSインスタンスのエンドポイントが設定されています。
1. 通知をトリガーするイベントタイプを選択します。

    ![Opsgenieインテグレーション](../../../images/user-guides/settings/integrations/add-opsgenie-integration.png)

    利用可能なイベントの詳細:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. **Test integration**をクリックして、設定の正しさ、Wallarm Cloudの到達性、および通知フォーマットを確認します。

    これにより、接頭辞`[Test message]`付きのテスト通知が送信されます:

    ![Opsgenieのテストメッセージ](../../../images/user-guides/settings/integrations/test-opsgenie-new-vuln.png)

1. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## 追加のアラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

### 例: 1秒間に2件以上のインシデントが検出された場合のOpsgenie通知

アプリケーションサーバーまたはデータベースに関するインシデントが1秒間に2件以上検出された場合、このイベントについての通知がOpsgenieに送信されます。

![Splunkにデータを送信するトリガーの例](../../../images/user-guides/triggers/trigger-example3.png)

**トリガーをテストするには**、アクティブな脆弱性を悪用する攻撃を保護対象のリソースに送信する必要があります。Wallarm Console → **Vulnerabilities**セクションには、アプリケーションで検出されたアクティブな脆弱性と、それらの脆弱性を悪用する攻撃の例が表示されます。

攻撃例を保護対象のリソースに送信すると、Wallarmがインシデントを記録します。記録されたインシデントが2件以上になると、次の通知がOpsgenieに送信されます:

```
[Wallarm] トリガー: インシデント数がしきい値を超えました

通知タイプ: incidents_exceeded

1秒間に検出されたインシデント数が1を超えました。
この通知は「Notification about incidents」トリガーによって起動されました。

追加のトリガー条件:
対象: server, database.

イベントを表示:
https://my.wallarm.com/attacks?q=incidents&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

クライアント: TestCompany
クラウド: EU
```

* `Notification about incidents`はトリガー名です
* `TestCompany`はWallarm Console内の貴社アカウント名です
* `EU`は貴社アカウントが登録されているWallarm Cloudです

!!! info "アクティブな脆弱性の悪用からリソースを保護する"
    リソースをアクティブな脆弱性の悪用から保護するには、脆弱性を適時にパッチ適用することを推奨します。アプリケーション側でパッチ適用できない場合は、この脆弱性を悪用する攻撃をブロックするために[仮想パッチ](../../rules/vpatch-rule.md)を設定してください。

## インテグレーションの無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および誤ったインテグレーションパラメータ

--8<-- "../include/integrations/integration-not-working.md"