# Atlassian Jira

Wallarmを設定して、[脆弱性](../../../glossary-en.md#vulnerability)が検出されたとき、または選択したリスクレベルのものだけでJiraに問題を作成するようにすることができます。

* 高リスク
* 中リスク
* 低リスク

## インテグレーション設定

Jira UIで：

1. [ここ](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#Create-an-API-token)に記述されたようにAPIトークンを生成します。
1. 生成したAPIトークンをコピーします。

Wallarm UIで：

1. Wallarm Console → **インテグレーション** → **Jira**を開きます。
1. インテグレーション名を入力します。
1. Jiraホスト (例:  `https://company-x.atlassian.net/`) を入力します。
1. 認証に必要なJiraユーザーのメールアドレスを入力します。問題が生成されたときの報告者を識別するためにも使用されます。
1. 生成したAPIトークンを貼り付けます。指定されたJiraホストでWallarmを認証するために、メールとトークンがチェックされます。成功すると、このJiraユーザーに利用可能なスペースが一覧で表示されます。
1. 問題を作成するためのJiraスペースを選択します。選択すると、このスペースでサポートされている問題タイプが一覧で表示されます。
1. 作成された問題が所属するJira問題タイプを選択します。
1. 通知をトリガするイベントタイプを選択します。すべての脆弱性または特定のリスクレベルのものだけを選択することもできます。何も選択されていない場合、Jiraの問題は作成されません。
1. [インテグレーションをテスト](#testing-integration)して設定が正しいことを確認します。
1. **インテグレーション追加**をクリックします。

    ![!Jira integration](../../../images/user-guides/settings/integrations/add-jira-integration.png)

## インテグレーションのテスト

--8<-- "../include/integrations/test-integration-basic-data.md"

Jira問題作成のテスト:

![!Test Jira issue creation](../../../images/user-guides/settings/integrations/test-jira-issue-creation.png)

## インテグレーションの更新

--8<-- "../include/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include/integrations/remove-integration.md"