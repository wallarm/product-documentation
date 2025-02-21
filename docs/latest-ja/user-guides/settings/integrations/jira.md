# Atlassian Jira

[Jira](https://www.atlassian.com/software/jira) はAtlassianによって開発された広く利用されているプロジェクト管理および課題追跡ソフトウェアです．脆弱性が検出された際に，すべてまたは選択されたリスクレベル（高，中，低）の場合にのみ，Jiraで課題を作成するようにWallarmを設定できます．

## 統合の設定

Jira UI:

1. APIトークンを[こちら](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#Create-an-API-token)の説明に従って生成してください．
1. 生成されたAPIトークンをコピーしてください．

Wallarm UI:

1. Wallarm Console → **Integrations** → **Jira**を開いてください．
1. 統合名を入力してください．
1. Jiraホストを入力してください（例:`https://company-x.atlassian.net/`）．
1. Jira認証に必要なJiraユーザーのメールアドレスを入力してください．また，作成される課題のレポーターを識別するために使用されます．
1. 生成されたAPIトークンを貼り付けてください．メールアドレスとトークンは，指定されたJiraホストにおけるWallarmの認証に使用されます．認証に成功すると，此Jiraユーザーが利用可能なスペースが一覧表示されます．
1. 課題を作成するJiraスペースを選択してください．選択後，其スペースでサポートされる課題タイプの一覧が表示されます．
1. 作成される課題が属するJiraの課題タイプを選択してください．
1. 通知をトリガーするイベントタイプを選択してください．すべての脆弱性または特定のリスクレベルのみを選択できます．

    ![Jira統合](../../../images/user-guides/settings/integrations/add-jira-integration.png)

1. 構成の正確性，Wallarm Cloudの利用可能性および通知フォーマットを確認するために，**Test integration**をクリックしてください．

    Jira課題作成のテスト:

    ![Jira課題作成のテスト](../../../images/user-guides/settings/integrations/test-jira-issue-creation.png)

1. **Add integration**をクリックしてください．

--8<-- "../include/cloud-ip-by-request.md"

## 統合の無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および誤った統合パラメータ

--8<-- "../include/integrations/integration-not-working.md"