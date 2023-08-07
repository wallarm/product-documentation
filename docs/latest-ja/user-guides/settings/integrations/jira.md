# Atlassian Jira

Wallarmを設定して、[脆弱性](../../../glossary-en.md#vulnerability)が検出された時にJiraで問題を作成することができます。全てまたは選択したリスクレベルのみに対して設定可能です：

* 高リスク
* 中リスク
* 低リスク

## 統合の設定方法

Jira UIにて：

1. [こちら](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#Create-an-API-token)の説明に従いAPIトークンを生成します。
1. 生成したAPIトークンをコピーします。

Wallarm UIにて：

1. Wallarmコンソールにて**統合** → **Jira**を選択します。
1. 統合名を入력します。
1. JiraホストのURLを入力（例 ：`https://company-x.atlassian.net/`）します。
1. 作成する問題の報告者を特定するためにも使用される、認証のためのJiraユーザーのメールアドレスを入力します。
1. 生成したAPIトークンを貼り付けます。メールアドレスとトークンは、指定のJiraホストでWallarmを認証するために確認されます。成功すると、このJiraユーザーが利用可能なスペースがリストされます。
1. 作成する問題のJiraスペースを選択します。選択すると、そのスペースでサポートされている問題タイプがリスト表示されます。
1. 作成する問題のタイプを選択します。
1. 通知をトリガーするイベントタイプを選択します。すべての脆弱性または特定のリスクレベルのみ選択可能です。何も選択しない場合、Jiraの問題は作成されません。
1. [統合テスト](#testing-integration)を行い設定が正しいことを確認します。
1. **統合を追加**をクリックします。

    ![!Jira統合](../../../images/user-guides/settings/integrations/add-jira-integration.png)

## 統合テスト

--8<-- "../include/integrations/test-integration-basic-data.md"

Jiraの問題作成をテストします：

![!Jiraの問題作成のテスト](../../../images/user-guides/settings/integrations/test-jira-issue-creation.png)

## 統合更新

--8<-- "../include/integrations/update-integration.md"

## 統合無効化

--8<-- "../include/integrations/disable-integration.md"

## 統合削除

--8<-- "../include/integrations/remove-integration.md"