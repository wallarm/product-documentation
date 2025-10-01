# Atlassian Jira

[Jira](https://www.atlassian.com/software/jira)はAtlassianが開発した広く利用されているプロジェクト管理および課題追跡ソフトウェアです。[脆弱性](../../../glossary-en.md#vulnerability)が検出された際に、すべてのリスクレベル、または選択したリスクレベル（高・中・低）のみを対象に、WallarmがJiraに課題を作成するように設定できます。

## インテグレーションの設定

Jira UIで：

1. [こちら](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#Create-an-API-token)に記載の手順に従ってAPI tokenを生成します。
1. 生成したAPI tokenをコピーします。

Wallarm UIで：

1. Wallarm Console → Integrations → Jiraを開きます。
1. integration nameを入力します。
1. Jira hostを入力します（例：`https://company-x.atlassian.net/`）。
1. Jiraの認証に必要で、作成される課題のReporterの識別にも使用されるJira user emailを入力します。
1. 生成したAPI tokenを貼り付けます。emailとtokenは、指定したJira hostでWallarmを認証するために検証されます。成功すると、このJiraユーザーで利用可能なspaceが一覧表示されます。
1. 課題を作成するJiraのspaceを選択します。選択すると、そのspaceでサポートされているissue typesの一覧が表示されます。
1. 作成される課題が属するJiraのissue typeを選択します。
1. 通知をトリガーするevent typesを選択します。すべての脆弱性、または特定のリスクレベルのみを選択できます。

    ![Jiraインテグレーション](../../../images/user-guides/settings/integrations/add-jira-integration.png)

1. 構成が正しいか、Wallarm Cloudの到達性、通知のフォーマットを確認するために**Test integration**をクリックします。

    Jira課題作成のテスト：

    ![Jira課題作成のテスト](../../../images/user-guides/settings/integrations/test-jira-issue-creation.png)

1. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## インテグレーションの無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可と不正なインテグレーションパラメータ

--8<-- "../include/integrations/integration-not-working.md"